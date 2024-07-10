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
  } from "../../store";
  import Button from "../Button.svelte";
  import ChatBox from "../ChatBox.svelte";
  import ChatHistory from "../ChatHistory.svelte";
  import InstallToastNotification from './InstallToastNotification.svelte';
  import {
    getSearchVectorDbTool,
    //storeEmbeddings,
    //loadExistingVectorStore,
    //checkUserHasKnowledgeBase
  } from "../../helpers/vector_database";
  //import spinner from "../../assets/loading.gif";
  import SelectModel from "./SelectModel.svelte";
  import ChatBubbleDeVinci from "./ChatBubbleDeVinci.svelte";
  import ChatBubbleUser from "./ChatBubbleUser.svelte";
  import ChatInput from "./ChatInput.svelte";
  import ChatBubbleDeVinciPDF from "./ChatBubbleDeVinciPDF.svelte";

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
    //debugOutput += "###in loadChatModel###";
    //setLabel("debug-label", debugOutput);
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
      }      
    } else {
      //console.log("Using webllm");
      $chatModelGlobal = new webllm.MLCEngine();
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

<div class="flex flex-col p-4 pb-24 max-w-3xl mx-auto w-full">
  <SelectModel />
  <!-- <ChatMessages /> -->
  <!-- <ChatBubbleUser />
  <ChatBubbleDeVinci />
  <ChatBubbleDeVinciPDF /> -->
</div>
<footer class="footer fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full md:ml-36 md:w-[calc(100%-18rem)]">
  <ChatInput />
</footer>

{#if showToast}
  <InstallToastNotification />
{/if}
