<script lang="ts">
  import * as webllm from "@mlc-ai/web-llm";
  import { onMount } from 'svelte';
  import {
    store,
    chatModelGlobal,
    chatModelDownloadedGlobal,
    activeChatGlobal,
    selectedAiModelId,
    deviceType
  } from "../store";
  import Button from "./Button.svelte";
  import ChatBox from "./ChatBox.svelte";
  import ChatHistory from "./ChatHistory.svelte";
  import InstallToastNotification from './InstallToastNotification.svelte';
  import {
    getSearchVectorDbTool,
    //storeEmbeddings,
    //loadExistingVectorStore,
    //checkUserHasKnowledgeBase
  } from "../helpers/vector_database";
  import spinner from "../assets/loading.gif";

  const workerPath = './worker.ts';

  let showToast = false;

  onMount(() => {
    showToast = true; // Show toast on load

    // Automatically hide the toast
    setTimeout(() => {
      showToast = false;
    }, 8000);
  });


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
   /*  debugOutput += "###in loadChatModel###";
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
        $chatModelGlobal = new webllm.MLCEngine();
      } catch (error) {
        console.error("Error loading web worker: ", error);
        $chatModelGlobal = new webllm.MLCEngine();
      };
    } else {
      //console.log("Using webllm");
      $chatModelGlobal = new webllm.MLCEngine();
    };

    const initProgressCallback = (report) => {
      setLabel("init-label", report.text);
    };
    try {
      $chatModelGlobal.setInitProgressCallback(initProgressCallback);
      await $chatModelGlobal.reload($selectedAiModelId);
    } catch (error) {
      console.error("Error loading model: ", error);
      /* debugOutput += "###error in loadChatModel###";
      debugOutput += error;
      setLabel("debug-label", debugOutput); */
      throw error;
    };
    $chatModelDownloadedGlobal = true;
    chatModelDownloadInProgress = false;
  };

  const generateProgressCallback = (_step: number, message: string) => {
    setLabel("generate-label", message);
  };

  async function getChatModelResponse(prompt, progressCallback = generateProgressCallback) {
    try {
      /* debugOutput = "###in getChatModelResponse###";
      debugOutput += JSON.stringify(prompt);
      setLabel("debug-label", debugOutput); */
      if (vectorDbSearchTool && useKnowledgeBase) {
        /* debugOutput += " useKnowledgeBase ";
        setLabel("debug-label", debugOutput); */
        // Add content from local knowledge base if activated
        let additionalContentToProvide = "";
        additionalContentToProvide = " Additional content (use this if relevant to the User Prompt): ";
        try {
          const promptContent = prompt[0].content;
          let vectorDbSearchToolResponse = await vectorDbSearchTool.func(promptContent);
          vectorDbSearchToolResponse = JSON.parse(vectorDbSearchToolResponse);
          try {
            for (let index = 0; index < vectorDbSearchToolResponse.existingChatsFoundInLocalDatabase.length; index++) {
              const additionalEntry = vectorDbSearchToolResponse.existingChatsFoundInLocalDatabase[index];
              additionalContentToProvide += "  ";
              additionalContentToProvide += additionalEntry.content;
            };
            // Compose the final prompt
            const additionalContentEntry = { role: 'user', content: additionalContentToProvide, name: 'UserKnowledgeBase' };
            prompt = [...prompt, additionalContentEntry];
            //console.log("DEBUG additionalContentEntry ", additionalContentEntry);
          } catch (error) {
            console.error("Error in getChatModelResponse final prompt and additionalContentEntry");
            console.error(error.toString());
            /* debugOutput += " final prompt and additionalContentEntry error ";
            debugOutput += error.toString();
              debugOutput += error.name;
              debugOutput += error.message;
            setLabel("debug-label", debugOutput);  */
          };
        } catch (error) {
          console.error("Error in getChatModelResponse getting vectorDbSearchToolResponse");
          console.error(error.toString());
          /* debugOutput += " vectorDbSearchToolResponse error ";
          debugOutput += error.toString();
              debugOutput += error.name;
              debugOutput += error.message;
          setLabel("debug-label", debugOutput);   */
        };
      };

      try {
        /* debugOutput += " final prompt ";
        debugOutput += JSON.stringify(prompt);
        setLabel("debug-label", debugOutput); */
        let curMessage = "";
        let stepCount = 0;
        const completion = await $chatModelGlobal.chat.completions.create({ stream: true, messages: prompt });
        /* debugOutput += " completion ";
        debugOutput += JSON.stringify(completion);
        setLabel("debug-label", debugOutput); */
        try {
          for await (const chunk of completion) {
            /* debugOutput += " chunk ";
            debugOutput += JSON.stringify(chunk);
            setLabel("debug-label", debugOutput); */
            try {
              const curDelta = chunk.choices[0].delta.content;
              if (curDelta) {
                curMessage += curDelta;
              };
              progressCallback(stepCount, curMessage);
              stepCount ++;
            } catch (error) {
              console.error("Error in getChatModelResponse progressCallback");
              console.error(error.toString());
              /* debugOutput += " progressCallback error ";
              debugOutput += error.toString();
              debugOutput += error.name;
              debugOutput += error.message;
              setLabel("debug-label", debugOutput);  */
            };
          };
        } catch (error) {
          console.error("Error in getChatModelResponse completion loop");
          console.error(error.toString());
          /* debugOutput += " completion loop error ";
          debugOutput += error.toString();
          debugOutput += error.name;
          debugOutput += error.message;
          setLabel("debug-label", debugOutput);  */
        };
      } catch (error) {
        console.error("Error in getChatModelResponse completion");
        console.error(error.toString());
        /* debugOutput += " completion error ";
        debugOutput += error.toString();
              debugOutput += error.name;
              debugOutput += error.message;
        setLabel("debug-label", debugOutput);  */
      };

      try {
        /* debugOutput += " before getMessage ";
        setLabel("debug-label", debugOutput); */
        const reply = await $chatModelGlobal.getMessage();
        /* debugOutput += " reply ";
        debugOutput += reply;
        setLabel("debug-label", debugOutput); */
        return reply;
      } catch (error) {
        console.error("Error in getChatModelResponse reply");
        console.error(error.toString());
        /* debugOutput += " reply error ";
        debugOutput += error.toString();
              debugOutput += error.name;
              debugOutput += error.message;
        setLabel("debug-label", debugOutput);    */
      };
    } catch (error) {
      console.error("Error in getChatModelResponse");
      console.error(error.toString());
      /* debugOutput += " outer error ";
      debugOutput += error.toString();
              debugOutput += error.name;
              debugOutput += error.message;
      setLabel("debug-label", debugOutput);   */
    };
    // if no reply was returned, an error occurred
    throw new Error('An error occurred');
  };

  // User can upload a pdf and a vector database is set up including the pdf's content
  let pathToUploadedPdf = '';
  let initiatedKnowledgeDatabase = false;
  let loadingKnowledgeDatabase = false;
  let useKnowledgeBase = false;
  //let persistingCurrentEmbeddings = false;
  //let userHasExistingKnowledgeBase = false;

  function handleUseKnowledgeBaseToggle() {
    useKnowledgeBase = !useKnowledgeBase;
  };

  async function uploadPdfToVectorDatabase() {
    const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      pathToUploadedPdf = URL.createObjectURL(file);
      loadingKnowledgeDatabase = true;
      vectorDbSearchTool = await getSearchVectorDbTool(pathToUploadedPdf);
      initiatedKnowledgeDatabase = true;
      loadingKnowledgeDatabase = false;
      useKnowledgeBase = true;
      alert("PDF uploaded and processed.");
    } else {
      alert("Please select a PDF file.");
    };
  };

  // functionality to retrieve and store user's knowledge base
  /* async function checkUserKnowledgeBase() {
    console.log("DEBUG checkUserKnowledgeBase");
    if(!$store.isAuthed){
      userHasExistingKnowledgeBase = false;
    };
    let knowledgeBaseExists = await checkUserHasKnowledgeBase();
    console.log("DEBUG checkUserKnowledgeBase knowledgeBaseExists ", knowledgeBaseExists);
    userHasExistingKnowledgeBase = knowledgeBaseExists;
  };

  async function getPreviousEmbeddings() {
    if(!$store.isAuthed){
      return;
    };
    loadingKnowledgeDatabase = true;
    await loadExistingVectorStore();
    initiatedKnowledgeDatabase = true;
    loadingKnowledgeDatabase = false;
    useKnowledgeBase = true;
    alert("Your Knowledge Base Was Loaded!");
  };

  async function persistCurrentEmbeddings() {
    if(!$store.isAuthed){
      return;
    };
    persistingCurrentEmbeddings = true;
    await storeEmbeddings();
    persistingCurrentEmbeddings = false;
    alert("Your Knowledge Base Was Stored!");
  }; */

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
    <!-- TODO: refactor into own RAG component -->
    <!-- TODO: does not work properly on mobile -->
    {#if deviceType === 'desktop'}
      <div class="space-y-2">
        <h3 class="font-semibold text-gray-900 dark:text-gray-600">Chat with a PDF</h3>
        <div>
          <p>Should your PDF's content be used by the AI to respond?</p>
          <input type="checkbox" bind:checked={useKnowledgeBase} on:click={handleUseKnowledgeBaseToggle} />
          <span>{useKnowledgeBase ? 'YES' : 'NO'}</span>
        </div>
        <input type="file" id="pdf-upload" accept=".pdf" style="display: none;" on:change={uploadPdfToVectorDatabase}>
        <Button class="bg-slate-100 text-slate-900 hover:bg-slate-200 hover:text-slate-900" on:click={() => document.getElementById('pdf-upload').click()}>
          Upload PDF
        </Button>
        {#if loadingKnowledgeDatabase}
          <p class="font-semibold text-gray-900 dark:text-gray-600">Loading your content into the local Knowledge Base for you...</p>
          <img class="h-12 mx-auto p-1 block" src={spinner} alt="loading animation" />
        {:else if initiatedKnowledgeDatabase}
          <p class="font-semibold text-gray-900 dark:text-gray-600">Success, the local Knowledge Base is ready! Your PDF's content will now be used by the AI in its responses.</p>
          <p class="text-gray-900 dark:text-gray-600">You can also load a different PDF into the local Knowledge Base on your device. The AI will include that PDF's content in its answers to your prompts then.</p>
          <!-- {#if $store.isAuthed}
            <Button id="storeEmbeddingsButton"
              class="bg-slate-100 text-slate-900 hover:bg-slate-200 hover:text-slate-900"
              on:click={persistCurrentEmbeddings}>Store Knowledge Base</Button>
            {#if persistingCurrentEmbeddings}
              <p class="text-gray-900 dark:text-gray-600">Storing the local Knowledge Base for you...</p>
              <img class="h-12 mx-auto p-1 block" src={spinner} alt="loading animation" />
            {:else}
              <p class="text-gray-900 dark:text-gray-600">You may store the local Knowledge Base created from your PDF's content. You can then also use it when you return next time.</p>
            {/if}
          {/if} -->
        {:else}
          <p class="text-gray-900 dark:text-gray-600">This loads your PDF into a local Knowledge Base on your device such that the AI can include the PDF's content in its answers to your prompts in real-time.</p>
        {/if}
        <!-- {#if $store.isAuthed}
          <p hidden>{checkUserKnowledgeBase()}</p>
          {#if userHasExistingKnowledgeBase}
            <Button id="retrieveEmbeddingsButton"
              class="bg-slate-100 text-slate-900 hover:bg-slate-200 hover:text-slate-900"
              on:click={getPreviousEmbeddings}>Load Previous Knowledge Base</Button>
            <p class="text-gray-900 dark:text-gray-600">Instead, you may also load the Knowledge Base you stored last time. The AI can then use it like before (with the contents of the PDF you uploaded back then).</p>
          {/if}
        {/if} -->
      </div>
    {/if}
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
    <p>Did you know? You can also install the DeVinci app on your device. And once you've downloaded the AI Assistant, you can even chat with it in the installed app offline!</p>
    <p>Please note: AI assistants are pretty huge and require quite some computational resources.
      As DeVinci runs on your device (via the browser), whether and how fast it may run depend on the device's hardware. If a given model doesn't work, you can try a smaller one from the selection under Settings and see if the device can support it.</p>
    <p>For the best possible experience, we recommend running as few other programs and browser tabs as possible besides DeVinci as those can limit the computational resources available for DeVinci.</p>
  {/if}
  <!-- <p id="debug-label">Debug1</p> -->
</section>

{#if showToast}
  <InstallToastNotification />
{/if}
