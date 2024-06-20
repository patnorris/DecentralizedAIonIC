<script lang="ts">
    import { onMount } from 'svelte';
    import * as ort from 'onnxruntime-web/training';
    
    export class MnistData {
        static readonly BATCH_SIZE = 64;
        static readonly MAX_NUM_TRAIN_SAMPLES = 60000;
        static readonly MAX_NUM_TEST_SAMPLES = 10000;
        static readonly pixelMax = 255;
        static readonly pixelMean = 0.1307;
        static readonly pixelStd = 0.3081;

        constructor(
            public batchSize = MnistData.BATCH_SIZE,
            public maxNumTrainSamples = MnistData.MAX_NUM_TRAIN_SAMPLES,
            public maxNumTestSamples = MnistData.MAX_NUM_TEST_SAMPLES,
        ) {
            if (batchSize <= 0) {
                throw new Error("batchSize must be > 0");
            }
        }

        public getNumTrainingBatches(): number {
            return Math.floor(this.maxNumTrainSamples / this.batchSize);
        }

        public getNumTestBatches(): number {
            return Math.floor(this.maxNumTestSamples / this.batchSize);
        }

        private *batches(data: ort.Tensor[], labels: ort.Tensor[]) {
            for (let batchIndex = 0; batchIndex < data.length; ++batchIndex) {
                yield {
                    data: data[batchIndex],
                    labels: labels[batchIndex],
                };
            }
        }

        public async *trainingBatches() {
            const trainingData = await this.getData('data/train-images-idx3-ubyte', 2051, 'data', this.maxNumTrainSamples);
            const trainingLabels = await this.getData('data/train-labels-idx1-ubyte', 2049, 'labels', this.maxNumTrainSamples);
            yield* this.batches(trainingData, trainingLabels);
        }

        public async *testBatches(normalize = true) {
            const testData = await this.getData('data/t10k-images-idx3-ubyte', 2051, 'data', this.maxNumTestSamples, normalize);
            const testLabels = await this.getData('data/t10k-labels-idx1-ubyte', 2049, 'labels', this.maxNumTestSamples);
            yield* this.batches(testData, testLabels);
        }

        private async getData(url: string, expectedMagicNumber: number, dataType: 'data' | 'labels', maxNumSamples: number, normalize = true): Promise<ort.Tensor[]> {
            console.debug(`Loading ${dataType} from "${url}".`);
            const result = [];
            const response = await fetch(url);
            const buffer = await response.arrayBuffer();
            if (buffer.byteLength < 16) {
                throw new Error("Invalid MNIST images file. There aren't enough bytes");
            }
            const magicNumber = new DataView(buffer.slice(0, 4)).getInt32(0, false);
            if (magicNumber !== expectedMagicNumber) {
                throw new Error(`Invalid MNIST images file. The magic number is not ${expectedMagicNumber}. Got ${magicNumber}.`);
            }
            const numDimensions = new DataView(buffer.slice(3, 4)).getUint8(0);
            const shape = [];
            for (let i = 0; i < numDimensions; ++i) {
                shape.push(new DataView(buffer.slice(4 + i * 4, 8 + i * 4)).getUint32(0, false));
            }
            const numItems = shape[0];
            const dimensions = shape.slice(1);
            const dataSize = dimensions.reduce((a, b) => a * b, 1);
            const batchShape: number[] = dataType === 'data' ? [this.batchSize, dataSize] : [this.batchSize];

            let offset = 4 + 4 * shape.length;
            for (let i = 0; i < numItems; i += this.batchSize) {
                if (i + this.batchSize > maxNumSamples) {
                    break;
                }

                if (buffer.byteLength < offset + this.batchSize * dataSize) {
                    break;
                }
                let batch;
                switch (dataType) {
                    case 'data':
                        const images = new Uint8Array(buffer.slice(offset, offset + this.batchSize * dataSize));
                        batch = (new Float32Array(images));
                        if (normalize) {
                            batch = batch.map(v => MnistData.normalize(v));
                        }
                        batch = new ort.Tensor('float32', batch, batchShape);
                        break;
                    case 'labels':
                        const labels = new Uint8Array(buffer.slice(offset, offset + this.batchSize * dataSize));
                        batch = Array.from(labels).map(BigInt);
                        batch = new ort.Tensor('int64', new BigInt64Array(batch), batchShape);
                        break;
                }

                result.push(batch);
                offset += this.batchSize * dataSize;
            }

            return result;
        }

        public static normalize(pixelValue: number): number {
            return ((pixelValue / this.pixelMax) - this.pixelMean) / this.pixelStd;
        }
    };

    let maxNumTrainSamples = 6400;
    let maxNumTestSamples = 1280;
    let batchSize = MnistData.BATCH_SIZE;
    let numEpochs = 5;

    let trainingLosses: number[] = [];
    let testAccuracies: number[] = [];
    let digits: { pixels: Float32Array, label: number }[] = [];
    let digitPredictions: number[] = [];
    let enableLiveLogging = false;

    let statusMessage = "";
    let errorMessage = "";
    let messages: string[] = [];

    const numRows = 28;
    const numCols = 28;
    const lossNodeName = "onnx::loss::2"; //"onnx::loss::8";
    const logIntervalMs = 1000;
    const waitAfterLoggingMs = 500;
    let lastLogTime = 0;
    let messagesQueue: string[] = [];

    function showStatusMessage(message: string) {
        console.log(message);
        statusMessage = message;
    }

    function showErrorMessage(message: string) {
        console.log(message);
        errorMessage = message;
    }

    function addMessages(messagesToAdd: string[]) {
        messages = [...messages, ...messagesToAdd];
    }

    function addMessageToQueue(message: string) {
        messagesQueue.push(message);
    }

    function clearOutputs() {
        trainingLosses = [];
        testAccuracies = [];
        messages = [];
        statusMessage = "";
        errorMessage = "";
        messagesQueue = [];
    }

    async function logMessage(message: string) {
        addMessageToQueue(message);
        if (Date.now() - lastLogTime > logIntervalMs) {
            showStatusMessage(message);
            if (enableLiveLogging) {
                addMessages(messagesQueue);
                messagesQueue = [];
            }
            await new Promise(r => setTimeout(r, waitAfterLoggingMs));
            lastLogTime = Date.now();
        }
    }

    function indexOfMax(arr: Float32Array): number {
        if (arr.length === 0) {
            throw new Error('index of max expects a non-empty array. Something went wrong.');
        }

        let maxIndex = 0;
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] > arr[maxIndex]) {
                maxIndex = i;
            }
        }
        return maxIndex;
    }

    function getPredictions(results: ort.Tensor): number[] {
        const predictions = [];
        const [batchSize, numClasses] = results.dims;
        for (let i = 0; i < batchSize; ++i) {  
            const probabilities = results.data.slice(i * numClasses, (i + 1) * numClasses) as Float32Array;
            const resultsLabel = indexOfMax(probabilities);
            predictions.push(resultsLabel);
        }
        return predictions;
    }

    function countCorrectPredictions(output: ort.Tensor, labels: ort.Tensor): number {
        let result = 0;
        const predictions = getPredictions(output);
        for (let i = 0; i < predictions.length; ++i) {
            if (BigInt(predictions[i]) === labels.data[i]) {
                ++result;
            }
        }
        return result;
    }

    function getPixels(data: Float32Array, numRows: number, numCols: number) {
        const result: number[][] = []
        for (let row = 0; row < numRows; ++row) {
            const rowPixels: number[] = []
            for (let col = 0; col < numCols; ++col) {
                rowPixels.push(data[row * numCols + col])
            }
            result.push(rowPixels)
        }
        return result
    }

    async function loadTrainingSession(): Promise<ort.TrainingSession> {
        showStatusMessage('Attempting to load training session...');

        try {
            console.log("ort.env.wasm.numThreads ", ort.env.wasm.numThreads);
            ort.env.wasm.numThreads = 1;
            console.log("ort.env.wasm.numThreads ", ort.env.wasm.numThreads);
        } catch (error) {
            showErrorMessage('Error setting numThreads: ' + error);
            console.log("Error setting numThreads: " + error);
            throw error;            
        };

        const chkptPath = 'training/checkpoint';
        const trainingPath = 'training/training_model.onnx';
        const optimizerPath = 'training/optimizer_model.onnx';
        const evalPath = 'training/eval_model.onnx';

        const createOptions: ort.TrainingSessionCreateOptions = {
            checkpointState: chkptPath, 
            trainModel: trainingPath, 
            evalModel: evalPath, 
            optimizerModel: optimizerPath
        };

        try {
            console.log("ort ", ort);
            console.log("ort.TrainingSession ", ort.TrainingSession);
            console.log("ort.TrainingSession.create ", ort.TrainingSession.create);
            const session = await ort.TrainingSession.create(createOptions);
            showStatusMessage('Training session loaded');
            return session;
        } catch (err) {
            showErrorMessage('Error loading the training session: ' + err);
            console.log("Error loading the training session: " + err);
            throw err;
        }
    }

    async function updateDigitPredictions(session: ort.TrainingSession) {
        console.log("DEBUG in updateDigitPredictions session ", session);
        console.log("DEBUG in updateDigitPredictions digits ", digits);
        const input = new Float32Array(digits.length * numRows * numCols);
        console.log("DEBUG in updateDigitPredictions input ", input);
        const batchShape = [digits.length, numRows * numCols];
        console.log("DEBUG in updateDigitPredictions batchShape ", batchShape);
        const labels = [];
        for (let i = 0; i < digits.length; ++i) {
            console.log("DEBUG in updateDigitPredictions loop i ", i);
            const pixels = digits[i].pixels;
            console.log("DEBUG in updateDigitPredictions loop pixels ", pixels);
            for (let j = 0; j < pixels.length; ++j) {
                input[i * pixels.length + j] = MnistData.normalize(pixels[j]);
            };
            console.log("DEBUG in updateDigitPredictions loop pixels after ");
            labels.push(BigInt(digits[i].label)); 
            console.log("DEBUG in updateDigitPredictions loop digits[i].label ", digits[i].label);
        };
        console.log("DEBUG in updateDigitPredictions after loop##########");

        const feeds = {
            input: new ort.Tensor('float32', input, batchShape),
            labels: new ort.Tensor('int64', new BigInt64Array(labels), [digits.length])
        };
        console.log("DEBUG in updateDigitPredictions feeds ", feeds);

        const results = await session.runEvalStep(feeds);
        console.log("DEBUG in updateDigitPredictions results ", results);
        const predictions = getPredictions(results['output']);
        console.log("DEBUG in updateDigitPredictions predictions ", predictions);
        digitPredictions = predictions.slice(0, digits.length);
        console.log("DEBUG in updateDigitPredictions digitPredictions ", digitPredictions);
    };

    async function runTrainingEpoch(session: ort.TrainingSession, dataSet: MnistData, epoch: number) {
        console.log("DEBUG in runTrainingEpoch epoch ", epoch);
        console.log("DEBUG in runTrainingEpoch session ", session);
        console.log("DEBUG in runTrainingEpoch dataSet ", dataSet);
        let batchNum =  0;
        let totalNumBatches = dataSet.getNumTrainingBatches();
        console.log("DEBUG in runTrainingEpoch totalNumBatches ", totalNumBatches);
        //console.log("DEBUG in runTrainingEpoch dataSet.trainingBatches() ", dataSet.trainingBatches());
        for await (const batch of dataSet.trainingBatches()) {
            ++batchNum;
            console.log("DEBUG in runTrainingEpoch loop batchNum ", batchNum);
            console.log("DEBUG in runTrainingEpoch loop batch ", batch);
            const feeds = {
                input: batch.data,
                labels: batch.labels
            };
            console.log("DEBUG in runTrainingEpoch loop feeds ", feeds);

            const results = await session.runTrainStep(feeds);
            console.log("DEBUG in runTrainingEpoch loop results ", results);

            const loss = parseFloat(results[lossNodeName].data);
            console.log("DEBUG in runTrainingEpoch loop loss ", loss);
            trainingLosses = [...trainingLosses, loss];
            const message = `TRAINING | Epoch: ${String(epoch + 1).padStart(2)} / ${numEpochs} | Batch ${String(batchNum).padStart(3)} / ${totalNumBatches} | Loss: ${loss.toFixed(4)}`;
            console.log("DEBUG in runTrainingEpoch loop message ", message);
            await logMessage(message);

            await session.runOptimizerStep();
            await session.lazyResetGrad();
            await updateDigitPredictions(session);
            console.log("DEBUG in runTrainingEpoch loop end ");
        };
    };

    async function runTestingEpoch(session: ort.TrainingSession, dataSet: MnistData, epoch: number): Promise<number> {
        let batchNum = 0;
        let totalNumBatches = dataSet.getNumTestBatches();
        let numCorrect = 0;
        let testPicsSoFar = 0;
        let accumulatedLoss = 0;
        for await (const batch of dataSet.testBatches()) {
            ++batchNum;
            const feeds = {
                input: batch.data,
                labels: batch.labels
            }

            const results = await session.runEvalStep(feeds);

            const loss = parseFloat(results[lossNodeName].data);
            accumulatedLoss += loss;
            testPicsSoFar += batch.data.dims[0];
            numCorrect += countCorrectPredictions(results['output'], batch.labels);
            const message = `TESTING | Epoch: ${String(epoch + 1).padStart(2)} / ${numEpochs} | Batch ${String(batchNum).padStart(3)} / ${totalNumBatches} | Average test loss: ${(accumulatedLoss / batchNum).toFixed(4)} | Accuracy: ${numCorrect}/${testPicsSoFar} (${(100 * numCorrect / testPicsSoFar).toFixed(2)}%)`;
            await logMessage(message);
        }
        const avgAcc = numCorrect / testPicsSoFar;
        testAccuracies = [...testAccuracies, avgAcc];
        return avgAcc;
    }

    async function train() {
        console.log("DEBUG in train");
        clearOutputs();

        if (maxNumTrainSamples > MnistData.MAX_NUM_TRAIN_SAMPLES || maxNumTestSamples > MnistData.MAX_NUM_TEST_SAMPLES) {
            showErrorMessage(`Max number of training samples (${maxNumTrainSamples}) or test samples (${maxNumTestSamples}) exceeds the maximum allowed (${MnistData.MAX_NUM_TRAIN_SAMPLES} and ${MnistData.MAX_NUM_TEST_SAMPLES}, respectively). Please try again.`);
            return;
        };
        console.log("DEBUG in train before loadTrainingSession");
        const trainingSession = await loadTrainingSession();
        console.log("DEBUG in train trainingSession ", trainingSession);
        const dataSet = new MnistData(batchSize, maxNumTrainSamples, maxNumTestSamples);
        console.log("DEBUG in train dataSet ", dataSet);

        lastLogTime = Date.now();
        await updateDigitPredictions(trainingSession);
        console.log("DEBUG in train after updateDigitPredictions ");
        showStatusMessage('Training started');
        let testAcc = 0;
        for (let epoch = 0; epoch < numEpochs; epoch++) {
            console.log("DEBUG in train loop epoch ", epoch);
            await runTrainingEpoch(trainingSession, dataSet, epoch);
            console.log("DEBUG in train loop after training epoch ");
            testAcc = await runTestingEpoch(trainingSession, dataSet, epoch);
        };
        console.log("DEBUG in train after loop");
        showStatusMessage(`Training completed. Final test set accuracy: ${(100 * testAcc).toFixed(2)}%`);
    };

    async function loadDigits() {
        console.log("DEBUG in loadDigits");
        const maxNumDigits = 18;
        const seenLabels = new Set();
        const dataSet = new MnistData();
        console.log("DEBUG in loadDigits dataSet ", dataSet);
        dataSet.maxNumTestSamples = 2 * dataSet.batchSize;
        let digitsInit = [];
        const normalize = false;
        for await (const testBatch of dataSet.testBatches(normalize)) {
            const { data, labels } = testBatch;
            const batchSize = labels.dims[0];
            const size = data.dims[1];
            for (let i = 0; digitsInit.length < maxNumDigits && i < batchSize; ++i) {
                const label = Number(labels.data[i]);
                if (seenLabels.size < 10 && seenLabels.has(label)) {
                    continue;
                }
                seenLabels.add(label);
                const pixels = data.data.slice(i * size, (i + 1) * size) as Float32Array;
                digitsInit.push({ pixels, label });
            };

            if (digitsInit.length >= maxNumDigits) {
                break;
            };
        };
        console.log("DEBUG in loadDigits digitsInit ", digitsInit);
        digits = digitsInit;
    };

    onMount(loadDigits);
</script>

<style>
    .App {
        font-family: sans-serif;
        text-align: center;
    }
    .section {
        margin: 20px 0;
    }
    .error {
        color: red;
    }
    .form-control {
        margin: 10px 0;
    }
</style>

<section>
    <div>
        <h2>ONNX Runtime Web Training Demo</h2>
        <p>
            This demo trains a simple neural network on the <a href='http://yann.lecun.com/exdb/mnist/'>MNIST dataset</a> using ONNX Runtime Web.
            For more information on how to use ONNX Runtime Web for training, please refer to <a href="onnxruntime.ai">ONNX Runtime documentation</a> or
            the <a href="https://github.com/microsoft/onnxruntime-training-examples">ONNX Runtime Training Examples code</a>.
        </p>
    </div>
    <div>
        <h3>Training</h3>
        <p>Total number of training samples: {MnistData.MAX_NUM_TRAIN_SAMPLES}</p>
        <p>Total number of testing samples: {MnistData.MAX_NUM_TEST_SAMPLES}</p>
    </div>
    <div>
        <div class="form-control">
            <label for="numEpochs">Number of epochs</label>
            <input id="numEpochs" type="number" bind:value={numEpochs} />
        </div>
        <div class="form-control">
            <label for="batchSize">Batch size</label>
            <input id="batchSize" type="number" bind:value={batchSize} />
        </div>
    </div>
    <div>
        <div class="form-control">
            <label for="maxNumTrainSamples">Max number of training samples</label>
            <input id="maxNumTrainSamples" type="number" bind:value={maxNumTrainSamples} />
        </div>
        <div class="form-control">
            <label for="maxNumTestSamples">Max number of test samples</label>
            <input id="maxNumTestSamples" type="number" bind:value={maxNumTestSamples} />
        </div>
    </div>
    <div>
        <button on:click={train}>Train</button>
    </div>
    <pre>{statusMessage}</pre>
    {#if errorMessage}
        <p class='error'>{errorMessage}</p>
    {/if}
    <!-- {renderPlots()}
    {renderDigits()} -->
    {#if messages.length > 0}
        <div>
            <h3>Logs:</h3>
            <pre>{#each messages as m, i}
                {m}
                <br>
            {/each}</pre>
        </div>
    {/if}
</section>
