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
  import InstallToastNotification from './InstallToastNotification.svelte'; //TODO: move
  import {
    getSearchVectorDbTool,
    //storeEmbeddings,
    //loadExistingVectorStore,
    //checkUserHasKnowledgeBase
  } from "../../helpers/vector_database";
  //import spinner from "../../assets/loading.gif";
  import SelectModel from "./SelectModel.svelte";
  import ChatBox from "./ChatBox.svelte";
  import { userHasDownloadedModel } from "../../helpers/localStorage";

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
  let useKnowledgeBase = false;

  async function setVectorDbSearchTool(pathToInput) {
    vectorDbSearchTool = await getSearchVectorDbTool(pathToInput);
    useKnowledgeBase = true;
  };

  // Debug Android
  //let debugOutput = "";

  function setLabel(id: string, text: string) {
    const label = document.getElementById(id);
    if (label == null) {
      throw Error("Cannot find label " + id);
    }
    label.innerText = text;
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

// User can select between chats (global variable is kept)
  async function showNewChat() {
    $activeChatGlobal = null;
    return;
  };
</script>



<div class="flex flex-col p-4 pb-24 max-w-3xl mx-auto w-full">
  {#if !userHasDownloadedModel()}
    <SelectModel />    
  {/if}
  <ChatBox modelCallbackFunction={getChatModelResponse} chatDisplayed={$activeChatGlobal} callbackSearchVectorDbTool={setVectorDbSearchTool}/>
</div>

{#if showToast}
  <InstallToastNotification />
{/if}
