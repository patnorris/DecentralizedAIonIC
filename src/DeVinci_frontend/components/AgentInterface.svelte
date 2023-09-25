<script lang="ts">
  import { chatModelGlobal, chatModelDownloadedGlobal, activeChatGlobal, selectedAiModelId } from "../store";
  import Button from "./Button.svelte";
  import ChatBox from "./ChatBox.svelte";
  import ChatHistory from "./ChatHistory.svelte";
  //import { modelConfig } from "../helpers/gh-config";
  import {
    canisterId as proxyCanisterId,
  } from "../../declarations/proxy_backend";

  //Import the OpenAPI Large Language Model (you can import other models here eg. Cohere)
  import { initializeAgentExecutorWithOptions } from "langchain/agents";
  import { ChatOpenAI } from "langchain/chat_models/openai";
  import { OpenAI } from "langchain/llms/openai";
  import { GoogleCustomSearch, ChainTool } from "langchain/tools";
  import { Calculator } from "langchain/tools/calculator";
  import { WebBrowser } from "langchain/tools/webbrowser";
  import { OpenAIEmbeddings } from "langchain/embeddings/openai";
  // Vector store
  import { VectorDBQAChain } from "langchain/chains";
  import { MemoryVectorStore } from "langchain/vectorstores/memory";
  import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
  import { getUserKnowledgeBaseContent } from "../helpers/langchain/knowledge_base";
  import { XenovaTransformersEmbeddings } from '../helpers/langchain/embeddings';


  import { WebLLM } from "../helpers/langchain/web_llm"; 
  import type * as webllm from "@mlc-ai/web-llm";

  let chatModelDownloadInProgress = false;
  let chatModelDownloaded = false;
  chatModelDownloadedGlobal.subscribe((value) => chatModelDownloaded = value);

  function setLabel(id: string, text: string) {
    const label = document.getElementById(id);
    if (label == null) {
      throw Error("Cannot find label " + id);
    }
    label.innerText = text;
  };

  async function loadChatModel() {
    if (chatModelDownloadInProgress) {
      return;
    };
    if (chatModelDownloaded === true && $chatModelGlobal) {
      return;
    };
    //console.log("Loading chat model...");
    chatModelDownloadInProgress = true;
    /* if (process.env.NODE_ENV !== "development") {
      //console.log("Using web worker");
      try {
        $chatModelGlobal = new webllm.ChatModule();
      } catch (error) {
        console.error("Error loading web worker: ", error);
        $chatModelGlobal = new webllm.ChatModule();
      }      
    } else {
      //console.log("Using webllm");
      $chatModelGlobal = new webllm.ChatModule();
    }

    $chatModelGlobal.setInitProgressCallback((report: webllm.InitProgressReport) => {
      setLabel("init-label", report.text);
    });

    await $chatModelGlobal.reload($selectedAiModelId, undefined, modelConfig); */
    const initProgressFunc = (report: webllm.InitProgressReport) => {
      setLabel("init-label", report.text);
    };
    /* $chatModelGlobal = await WebLLM.createInstance({
      model: $selectedAiModelId,
      initCallback: initProgressFunc,
    }); */
    /* const chat = await WebLLM.createInstance({
      model: $selectedAiModelId,
      initCallback: initProgressFunc,
    }); */
    //const tools = [new Calculator(), new WolframAlphaTool({ appid: "ET9V8J-AT64RVXWQY" })];
    const chat = new ChatOpenAI({ openAIApiKey: "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" });
    // Web browser
    const model = new OpenAI({ openAIApiKey: "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" });
    const embeddings = new OpenAIEmbeddings({ openAIApiKey: "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" });
    const headers = {
      //"Accept": "application/json",
      "Accept-Language": "en-US",
      //"User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0"
    };
    const proxyConfig = {
      protocol: 'http',
      host: `https://${proxyCanisterId}.icp0.io`,
      port: 443,
    };
    const axiosConfig = {
      //withCredentials: false,
      proxy: proxyConfig,
    };
    // Vector store
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
    const fileText = await getUserKnowledgeBaseContent();
    console.log("Debug fileText ", fileText);
    const docs = await textSplitter.createDocuments([fileText]);
    console.log("Debug docs ", docs);
    const vectorStore = await MemoryVectorStore.fromTexts(
      [...docs.map(doc => doc.pageContent)],
      [...docs.map((v, k) => k)],
      //new XenovaTransformersEmbeddings({ modelInstance: model }),
      embeddings,
    );
    console.log("Debug vectorStore ", vectorStore);
    const chain = VectorDBQAChain.fromLLM(model, vectorStore);
    const userKnowledgeBaseTool = new ChainTool({
      name: "user-knowledge-base",
      description:
        "User's Knowledge Base - useful for when you need to retrieve information about the user as it contains user-specific data.",
      chain: chain,
    });
    // Google search
    const google_api = "AIzaSyAYTuTfeSYnqSs6ZE1kFRhVYVwduKeXHsc";
    const google_cse = "12cbfb4eaced74690";

    const tools = [
      new Calculator(),
      new GoogleCustomSearch({apiKey: google_api, googleCSEId: google_cse}),
      new WebBrowser({ model, embeddings, headers, axiosConfig }),
      userKnowledgeBaseTool,
    ];

    $chatModelGlobal = await initializeAgentExecutorWithOptions(tools, chat, {
      //agentType: "chat-conversational-react-description",
      //agentType: "openai-functions",
      agentType: "zero-shot-react-description",
      verbose: true,
      handleParsingErrors: true,
        //"Please try again, paying close attention to the allowed enum values",
    });
    $chatModelDownloadedGlobal = true;
    chatModelDownloadInProgress = false;
  };

  const generateProgressCallback = (_step: number, message: string) => {
    setLabel("generate-label", message);
  };

  async function getChatModelResponse(prompt, progressCallback = generateProgressCallback) {
    //const reply = await $chatModelGlobal.generate(prompt, progressCallback);
    //const reply = await $chatModelGlobal.call(prompt, { progressCallback });
    const reply = await $chatModelGlobal.run(prompt, { progressCallback });
    return reply;
  };

// User can select between chats (global variable is kept)
  async function showNewChat() {
    $activeChatGlobal = null;
    return;
  };

  /* const run = async () => {
    //Instantiante the OpenAI model 
    //Pass the "temperature" parameter which controls the RANDOMNESS of the model's output. A lower temperature will result in more predictable output, while a higher temperature will result in more random output. The temperature parameter is set between 0 and 1, with 0 being the most predictable and 1 being the most random
    //const model = new OpenAI({ temperature: 0.9 });
    const model = new OpenAI({
      openAIApiKey: "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",
    });
    const initProgressFunc = (report: webllm.InitProgressReport) => {
      setLabel("init-label", report.text);
    };
    const model = await WebLLM.createInstance({
      model: 'RedPajama-INCITE-Chat-3B-v1-q4f32_0',
      initCallback: initProgressFunc,
    });

    //Calls out to the model's (OpenAI's) endpoint passing the prompt. This call returns a string
    const res = await model.call(
        "What would be a good company name for a company that makes colorful socks?"
    );
    console.log({ res });
  };

  onMount(run); */
</script>

<section id="chat-model-section" class="py-7 space-y-6 items-center text-center bg-slate-100">
  {#if chatModelDownloaded}
    <h3 id='chatModelStatusSubtext'>Success! You can chat with your AI Assistant now.</h3>
    <Button id="newChatButton"
        class="bg-slate-100 text-slate-900 hover:bg-slate-200 hover:text-slate-900"
        on:click={showNewChat}>New Chat</Button>
    <ChatHistory bind:selectedChat={$activeChatGlobal} />
    <p id="generate-label"> </p>
    {#key $activeChatGlobal}  <!-- Element to rerender everything inside when activeChat changes (https://www.webtips.dev/force-rerender-components-in-svelte) -->
      <ChatBox modelCallbackFunction={getChatModelResponse} chatDisplayed={$activeChatGlobal} />
    {/key}
  {:else}
    {#if chatModelDownloadInProgress}
      <h3 id='chatModelStatusSubtext'>Downloading AI Assistant. This may take a moment...</h3>
      <p id="init-label"> </p>
    {:else}
      <h3 id='chatModelStatusSubtext'>Let's first download the AI Assistant for you. Please click on the button:</h3>
      <Button id="downloadChatModelButton"
        class="bg-slate-100 text-slate-900 hover:bg-slate-200 hover:text-slate-900"
        on:click={loadChatModel}>Initialize</Button>
    {/if}
    <p>Note: AI assistants are pretty huge and require quite some computational resources. 
      As DeVinci runs on your device (via the browser), whether and how fast it may run depend on the device's hardware. If a given model doesn't work, you can try a smaller one from the selection under Settings and see if the device can support it.</p>
    <p>For the best possible experience, we recommend running as few other programs and browser tabs as possible besides DeVinci as those can limit the computational resources available for DeVinci.</p>
  {/if}
</section>
