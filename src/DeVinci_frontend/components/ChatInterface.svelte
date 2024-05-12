<script lang="ts">
  import * as webllm from "@mlc-ai/web-llm";
  import { chatModelGlobal, chatModelDownloadedGlobal, activeChatGlobal, selectedAiModelId } from "../store";
  import Button from "./Button.svelte";
  import ChatBox from "./ChatBox.svelte";
  import ChatHistory from "./ChatHistory.svelte";
  import { store } from "../store";
  import { getSearchVectorDbTool } from "../helpers/vector_database";
  import spinner from "../assets/loading.gif";

  const workerPath = './worker.ts';
  

  let chatModelDownloadInProgress = false;
  let chatModelDownloaded = false;
  chatModelDownloadedGlobal.subscribe((value) => chatModelDownloaded = value);

  let vectorDbSearchTool;

  // Debug Android
  //let debugOutput = "";

  function setLabel(id: string, text: string) {
    const label = document.getElementById(id);
    if (label == null) {
      throw Error("Cannot find label " + id);
    }
    label.innerText = text;
  }

  async function loadChatModel() {
    /* debugOutput += "###in loadChatModel###";
    setLabel("debug-label", debugOutput); */
    if (chatModelDownloadInProgress) {
      return;
    };
    if (chatModelDownloaded === true && $chatModelGlobal) {
      return;
    };
    //console.log("Loading chat model...");
    chatModelDownloadInProgress = true;
    if (process.env.NODE_ENV !== "development") {
      //console.log("Using web worker");
      try {
        /* TODO: fix
        chatModel = new webllm.ChatWorkerClient(new Worker(
          new URL(workerPath, import.meta.url),
          {type: 'module'}
        )); */
        //console.log("Using webllm");
        $chatModelGlobal = new webllm.Engine();
      } catch (error) {
        console.error("Error loading web worker: ", error);
        $chatModelGlobal = new webllm.Engine();
      }      
    } else {
      //console.log("Using webllm");
      $chatModelGlobal = new webllm.Engine();
    };

    const initProgressCallback = (report) => {
      setLabel("init-label", report.text);
    };
    $chatModelGlobal.setInitProgressCallback(initProgressCallback);
    await $chatModelGlobal.reload($selectedAiModelId);
    $chatModelDownloadedGlobal = true;
    chatModelDownloadInProgress = false;
  };

  const generateProgressCallback = (_step: number, message: string) => {
    setLabel("generate-label", message);
  };

  async function getChatModelResponse(prompt, progressCallback = generateProgressCallback) {
    // Add content from local knowledge base if activated
    let additionalContentToProvide = "";
    if (vectorDbSearchTool) {
      additionalContentToProvide = " Additional content (use this if relevant to the User Prompt): ";
      const promptContent = prompt[0].content;
      let vectorDbSearchToolResponse = await vectorDbSearchTool.func(promptContent);
      vectorDbSearchToolResponse = JSON.parse(vectorDbSearchToolResponse);

      for (let index = 0; index < vectorDbSearchToolResponse.existingChatsFoundInLocalDatabase.length; index++) {
        const additionalEntry = vectorDbSearchToolResponse.existingChatsFoundInLocalDatabase[index];
        additionalContentToProvide += "  ";
        additionalContentToProvide += additionalEntry.content;  
      };
    };

    // Compose the final prompt
    const additionalContentEntry = { role: 'user', content: additionalContentToProvide, name: 'UserKnowledgeBase' };
    prompt = [...prompt, additionalContentEntry];

    let curMessage = "";
    let stepCount = 0;
    const completion = await $chatModelGlobal.chat.completions.create({ stream: true, messages: prompt });
    for await (const chunk of completion) {
      const curDelta = chunk.choices[0].delta.content;
      if (curDelta) {
          curMessage += curDelta;
      };
      progressCallback(stepCount, curMessage);
      stepCount ++;
    };
    const reply = await $chatModelGlobal.getMessage();
    return reply;
  };

  // User can upload a pdf and a vector database is set up including the pdf's content
  let pathToUploadedPdf = '';
  let loadingKnowledgeDatabase = false;

  async function uploadPdfToVectorDatabase() {
    const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      pathToUploadedPdf = URL.createObjectURL(file);
      loadingKnowledgeDatabase = true;
      vectorDbSearchTool = await getSearchVectorDbTool(pathToUploadedPdf);
      loadingKnowledgeDatabase = false;
      alert("PDF uploaded and processed.");
    } else {
      alert("Please select a PDF file.");
    }
  };

// User can select between chats (global variable is kept)
  async function showNewChat() {
    $activeChatGlobal = null;
    return;
  };
</script>

<section id="chat-model-section" class="py-7 space-y-6 items-center text-center bg-slate-100">
  {#if chatModelDownloaded}
    <h3 id='chatModelStatusSubtext'>Success! You can chat with your AI Assistant now.</h3>
    {#if $store.isAuthed}
      <Button id="newChatButton"
        class="bg-slate-100 text-slate-900 hover:bg-slate-200 hover:text-slate-900"
        on:click={showNewChat}>New Chat</Button>
      <ChatHistory bind:selectedChat={$activeChatGlobal} />
    {/if}
    <p id="generate-label"> </p>
    {#key $activeChatGlobal}  <!-- Element to rerender everything inside when activeChat changes (https://www.webtips.dev/force-rerender-components-in-svelte) -->
      <ChatBox modelCallbackFunction={getChatModelResponse} chatDisplayed={$activeChatGlobal} />
    {/key}
    <div class="space-y-2">
      <h3 class="font-semibold text-gray-900 dark:text-gray-600">Chat with a PDF</h3>
      <input type="file" id="pdf-upload" accept=".pdf" style="display: none;" on:change={uploadPdfToVectorDatabase}>
      <Button class="bg-slate-100 text-slate-900 hover:bg-slate-200 hover:text-slate-900" on:click={() => document.getElementById('pdf-upload').click()}>
        Upload PDF
      </Button>
      <p class="text-gray-900 dark:text-gray-600">This loads your PDF into a local Knowledge Base on your device such that the AI can include the PDF's content in its answers to your prompts in real-time.</p>
      {#if loadingKnowledgeDatabase}
        <p class="text-gray-900 dark:text-gray-600">Loading your PDF into the Knowledge Base for you...</p>
        <img class="h-12 mx-auto p-1 block" src={spinner} alt="loading animation" />
      {/if}
    </div>
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
  <!-- <p id="debug-label"> </p>  Debug -->
</section>
