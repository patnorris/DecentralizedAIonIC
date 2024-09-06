<script>
  import * as webllm from "@mlc-ai/web-llm";
  import { onMount } from "svelte";
  import { location, push } from 'svelte-spa-router';

  import {
    store,
    chatModelGlobal,
    selectedAiModelId,
    chatModelIdInitiatedGlobal,
    deviceType
  } from "../store";
  import {
    setLocalFlag,
    syncLocalChanges,
    setUserSettingsSyncFlag,
    getLocalFlag
  } from "../helpers/localStorage";
  import { currentExperienceId } from "../store";

  import { getAvailableAiModels } from "../helpers/ai_model_helpers";

  export let id;
  export let title;
  export let creator;
  export let shortDescription;
  export let longDescription;
  export let note;
  export let isStandaloneApp;
  export let standaloneAppUrl;
  export let experienceType;
  export let aiModelIdentifier;
  export let databaseToInclude;
  export let databaseIdentifier;

  // Reactive statement to check if the ID is included in the already downloaded model IDs
  $: isDownloaded = getLocalFlag("downloadedAiModels").includes(id);

  $: downloadProgress = getLocalFlag("aiModelDownloadingProgress", {modelId: id});

  let initiateText;
  let downloadText;

  function toPercentage(floatValue, decimals = 2) {
    return (floatValue * 100).toFixed(decimals);
  };

  document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
      const spans = document.querySelectorAll(".performance-span");

      // Define a mapping of performance to background colors
      const backgroundColors = {
        "Good": "#f9c490",
        "Super Good": "#a1c490",
        "Alright": "#f0e68c",
        "Good for Chinese": "#76c7be",
        "Great for Math": "rgb(237, 98, 98)",
        "Insane": "rgb(203, 139, 208)",
      };

      // Function to set background color and save to localStorage
      function setBackgroundColor(span) {
        const performance = span.textContent.trim(); // Get the text content of the span and trim any whitespace
        if (backgroundColors[performance]) {
          const color = backgroundColors[performance];
          span.style.backgroundColor = color;
          // Save the color to localStorage
          localStorage.setItem(`span-${performance}`, color);
        };
      };

      // Function to load background color from localStorage
      function loadBackgroundColor(span) {
        const performance = span.textContent.trim();
        const savedColor = localStorage.getItem(`span-${performance}`);
        if (savedColor) {
          span.style.backgroundColor = savedColor;
        } else {
          // If no saved color, set it
          setBackgroundColor(span);
        };
      };

      // Apply background color change to each span element
      spans.forEach(span => loadBackgroundColor(span));

      // Observer to apply background colors on subsequent navigations
      const observer = new MutationObserver(function(mutationsList, observer) {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList' && mutation.addedNodes.length) {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const newSpans = node.querySelectorAll(".performance-span");
                newSpans.forEach(span => loadBackgroundColor(span));
              };
            });
          };
        };
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }, 100); // 100ms delay
  });

  const updateUserSettings = async (modelId) => {
    if (!$store.isAuthed) {
      return;
    };
    // Persist to backend
    const updatedSettingsObject = {
      selectedAiModelId: modelId,
    };
    try {
      const settingsUpdatedResponse = await $store.backendActor.update_caller_settings(updatedSettingsObject);
      // @ts-ignore
      if (settingsUpdatedResponse.Ok) {
        syncLocalChanges(); // Sync any local changes (from offline usage), only works if back online
      } else {
        // @ts-ignore
        console.error("Error updating user settings: ", settingsUpdatedResponse.Err);
        // @ts-ignore
        throw new Error("Error updating user settings: ", settingsUpdatedResponse.Err);
      };
      syncLocalChanges(); // Sync any local changes (from offline usage), only works if back online
    } catch (error) {
      // @ts-ignore
      console.error("Error updating settings: ", error);
      // Likely offline, so set flag to sync change later
      setUserSettingsSyncFlag("selectedAiModelId");
    };
  };

  const changeModel = (id) => {
    if ($selectedAiModelId === id) {
      return;
    };
    // Change the model in the store
    selectedAiModelId.set(id); // this also updates the locally stored model id
    chatModelIdInitiatedGlobal.set(null);
    updateUserSettings(id);
  };

  let visibleExperienceInfo = false;

  // Subscribe to changes in currentExperienceId
  $: visibleExperienceInfo = $currentExperienceId === id;

  async function showExperienceInfo() {
    currentExperienceId.set(id);
  };

  async function loadOnDeviceExperience() {
    console.log("in loadOnDeviceExperience");
    console.log("Loading chat model...");
    //chatModelDownloadInProgress = true;
    downloadText = "Downloading... please wait.";
    initiateText = "Initiating... please wait.";

    if (process.env.NODE_ENV !== "development") {
      console.log("Using web worker");
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
      console.log("Using webllm");
      $chatModelGlobal = new webllm.MLCEngine();
    };

    const initProgressCallback = (report) => {
      if (isDownloaded) {
        // Avoid setting the download progress for already downloaded models (which have progress as 0)
        initiateText = "Initiating... please wait.";
      } else {
        if (report.progress) {
          if (report.progress !== 0) {
            downloadProgress = toPercentage(report.progress);
            setLocalFlag("aiModelDownloadingProgress", {modelId: id, downloadProgress: toPercentage(report.progress)});
            if (report.progress === 1) {
              isDownloaded = true;
            };
          } else {
            downloadText = report.text;
          };
        } else {
          downloadText = "Downloading... please wait.";
        };
      };
    };
    try {
      $chatModelGlobal.setInitProgressCallback(initProgressCallback);
      await $chatModelGlobal.reload(aiModelIdentifier);
      // Set flag that this model has been downloaded
      const flagObject = {
        modelId: aiModelIdentifier,
      };
      setLocalFlag("downloadedAiModels", flagObject);
    } catch (error) {
      console.error("Error loading model: ", error);
      throw error;
    };
    $chatModelIdInitiatedGlobal = aiModelIdentifier;
    //chatModelDownloadInProgress = false;
    if ($location !== "/") {
      push('/');
    };
  };

  async function loadOnChainExperience() {
    console.log("in loadOnChainExperience");

  };

  async function loadOffChainExperience() {
    console.log("in loadOffChainExperience");
    
  };

  async function loadExperienceInPlace() {
    console.log("in loadExperienceInPlace");
    switch (experienceType) {
      case 'ondevice':
        // Check if the aiModelIdentifier is included in availableAiModels
        let availableAiModels = getAvailableAiModels(deviceType === 'Android');
        const modelExists = availableAiModels.some(model => model.id === aiModelIdentifier);
        if (modelExists) {
          loadOnDeviceExperience();
        } else {
          console.log("Model identifier not found in available models.");
        };
        break;

      case 'onchain':
        console.log("Handling on-chain experience.");
        // Additional logic for on-chain experience
        loadOnChainExperience();
        break;

      case 'offchain':
        console.log("Handling off-chain experience.");
        // Additional logic for off-chain experience
        loadOffChainExperience();
        break;

      default:
        console.log("Experience type not recognized.");
    };    
  };

  // Add this reactive statement
  $: isChecked = $currentExperienceId === id;

</script>

<div>
  <input 
    type="radio" 
    id={id} 
    name="selectExperience" 
    class="hidden peer" 
    checked={isChecked} 
    on:click={showExperienceInfo} 
  />
  <li class="text-[#151b1e] bg-[#f1f5f9] p-3 border-2 border-dotted border-[#151b1e] rounded-lg hover:bg-[lightsteelblue] peer-checked:bg-white peer-checked:hover:bg-white">
    <div>
      <label for={id} class="inline-flex items-center justify-between w-full h-full p-3 cursor-pointer peer-checked:border-solid peer-checked:cursor-default peer-checked:border-[#151b1e] peer-checked:text-[#151b1e] hover:text-gray-600 peer-checked:hover:text-[#151b1e]">
        <div class="flex flex-col">
          <h1 class="flex items-center mb-3 text-3xl text-gray-600 font-extrabold">{title}
            <span class="bg-blue-100 text-blue-800 text-lg font-semibold me-2 px-2.5 py-0.5 rounded ms-2">{creator}</span>
          </h1>
          <span class="performance-span text-[#151b1e] text-sm font-medium me-1.5 px-2.5 py-1 bg-white rounded border border-dashed border-gray-400">{shortDescription}</span>
        </div>
        {#if !isChecked}
          <svg class="w-5 h-5 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
          </svg>
        {/if}
      </label>
    </div>
    <div class="p-3 pt-1 pb-2">
      {#if visibleExperienceInfo}
        <div class="block mb-2">
          <div class="p-4 text-md text-gray-600 rounded-lg bg-gray-100" role="alert">
            <span class="font-medium block mb-4">{longDescription}</span>
            <span class="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border-2 border-yellow-400">{note}</span>
          </div>
        </div>
        {#if isStandaloneApp}
            <button on:click={()=>{window.open(standaloneAppUrl, "_blank");}} type="button" class="mt-2 bg-blue-50 w-full rounded-full focus:ring-2 focus:ring-blue-400 py-1.5 px-4 hover:bg-[lightsteelblue] hover:text-gray-900 border-2 border-solid border-[#151b1e] text-sm font-bold text-[#151b1e] inline-flex items-center justify-center">
              Open
            </button>
            <div class="w-full flex items-center justify-center p-2 text-sm text-gray-600" role="alert">
              <svg class="flex-shrink-0 inline w-3.5 h-3.5 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
              </svg>
              <span class="sr-only">Info</span>
              <div>
                <span>This experience will open in a new browser tab and run there as a standalone application.</span>
              </div>
            </div>
          {:else}
            <button on:click={loadExperienceInPlace} type="button" class="mt-2 bg-blue-50 w-full rounded-full focus:ring-2 focus:ring-blue-400 py-1.5 px-4 hover:bg-[lightsteelblue] hover:text-gray-900 border-2 border-solid border-[#151b1e] text-sm font-bold text-[#151b1e] inline-flex items-center justify-center">
              Load
            </button>
            <div class="w-full flex items-center justify-center p-2 text-sm text-gray-600" role="alert">
              <svg class="flex-shrink-0 inline w-3.5 h-3.5 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
              </svg>
              <span class="sr-only">Info</span>
              <div>
                <span>This experience will load directly in this app.</span>
              </div>
            </div>
        {/if}
      {/if}
    </div>
  </li>
</div>

<style>
  .performance-span {
	  transition: background-color 3.3s ease-in-out; /* Adjust the duration and easing as needed */
  }

  @keyframes bgMove {
    0% { background-position: 0 0; }
    100% { background-position: 200% 0; }
  }

  /* Applying the animation */
  .animate-bgMove {
    background-size: 200% 100%;
    animation: bgMove 2s linear infinite;
  }
</style>
