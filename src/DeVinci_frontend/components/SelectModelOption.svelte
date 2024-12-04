<script lang="ts">
  import * as webllm from "@mlc-ai/web-llm";
  import { onMount } from "svelte";
  import { location, push } from 'svelte-spa-router';
  import { addDownloadedModel } from '../helpers/local_storage';
  import {
    store,
    chatModelGlobal,
    selectedAiModelId,
    chatModelIdInitiatedGlobal,
    currentModelName,
    downloadedModels
  } from "../store";
  import {
    setLocalFlag,
    getLocalFlag
  } from "../helpers/local_storage";
  import {
    updateUserSettingsProperty
  } from "../helpers/user_settings";

  export let id;
  export let name;
  export let value;
  export let title;
  export let parameters;
  export let performance;
  export let size;
  export let goodFor;
  export let chatModelDownloadInProgress;
  export let onlyShowIfDownloaded = false;
  export let autoInitiateIfModelSelected = false;
  
  let vramRequired;

  // Reactive statement to check if the ID is included in the already downloaded model IDs
  $: isDownloaded = getLocalFlag("downloadedAiModels").includes(id);

  $: downloadProgress = getLocalFlag("aiModelDownloadingProgress", {modelId: id});

  let initiateText;
  let downloadText;

  // Reactive variables to control tooltip visibility
  let showLanguagesTooltip = false;
  let showVramTooltip = false;
  let showPerformanceTooltip = false;

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
                const newSpans = (node as Element).querySelectorAll(".performance-span");
                newSpans.forEach(span => loadBackgroundColor(span));
              };
            });
          };
        };
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }, 100); // 100ms delay
  });

  const changeModel = async (modelOptionId: string) => {
    try {
      // Update the selected model ID and name in the store
      selectedAiModelId.set(modelOptionId);
      currentModelName.set(name);
      chatModelIdInitiatedGlobal.set(null);
      await updateUserSettingsProperty("selectedAiModelId", modelOptionId);
    } catch (error) {
      console.error('Error changing model:', error);
    };
  };

  async function loadChatModel(modelOptionId) {
    if (chatModelDownloadInProgress) {
      return;
    };
    changeModel(modelOptionId);
    if ($chatModelIdInitiatedGlobal && $chatModelGlobal) {
      return;
    };
    console.info("Loading chat model...");
    chatModelDownloadInProgress = true;
    downloadText = "Downloading... please wait.";
    initiateText = "Initiating... please wait.";

    if (!modelOptionId) {
      modelOptionId = $selectedAiModelId;
    };
    if (process.env.NODE_ENV !== "development") {
      console.info("Using web worker");
      try {
        /* TODO: fix
        chatModel = new webllm.ChatWorkerClient(new Worker(
          new URL(workerPath, import.meta.url),
          {type: 'module'}
        )); */
        //console.info("Using webllm");
        $chatModelGlobal = new webllm.MLCEngine();
      } catch (error) {
        console.error("Error loading web worker: ", error);
        $chatModelGlobal = new webllm.MLCEngine();
      };
    } else {
      console.info("Using webllm");
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
      await $chatModelGlobal.reload(modelOptionId);
      // Set flag that this model has been downloaded
      addDownloadedModel(modelOptionId);
    } catch (error) {
      console.error("Error loading model: ", error);
      throw error;
    };
    $chatModelIdInitiatedGlobal = modelOptionId;
    chatModelDownloadInProgress = false;
    if ($location !== "/") {
      push('/');
    };
  };

  onMount(async () => {
    // Find the model in the list by the id and retrieve its vram_required_MB
    const modelInfo = webllm.prebuiltAppConfig.model_list.find(model => model.model_id === id);
    if (modelInfo) {
      vramRequired = modelInfo.vram_required_MB;
    } else {
      console.error('Model not found:', id);
    };

    if (autoInitiateIfModelSelected) {
      // Initiate the model without the user having to click
      // if this model is the currently selected one
      if ($selectedAiModelId === id) {
        loadChatModel(id);
      };
    };
  });

  // Add this reactive statement
  $: isChecked = $selectedAiModelId !== null && $selectedAiModelId === id;


  // Function to convert VRAM MB to GB
  function vramMBtoGB(vramMB: number): string {
    if (!vramMB || isNaN(vramMB)) return "N/A";
    return (vramMB / 1024).toFixed(1);
  }

  async function deleteModel(modelId: string) {
    try {
      // Delete from WebLLM cache
      await webllm.deleteModelAllInfoInCache(modelId);
      
      // Update downloadedModels array
      const currentDownloaded = JSON.parse(localStorage.getItem("downloadedAiModels") || "[]");
      const updatedDownloaded = currentDownloaded.filter(id => id !== modelId);
      localStorage.setItem("downloadedAiModels", JSON.stringify(updatedDownloaded));
      downloadedModels.set(updatedDownloaded);
      
      // Clear only this model's download progress
      const currentProgress = JSON.parse(localStorage.getItem("aiModelDownloadingProgress") || "{}");
      delete currentProgress[modelId];
      localStorage.setItem("aiModelDownloadingProgress", JSON.stringify(currentProgress));
      
      // Reset selected model only if it was the deleted one
      if ($selectedAiModelId === modelId) {
        selectedAiModelId.set(null);
        chatModelIdInitiatedGlobal.set(null);
        currentModelName.set(null);
      }
      
      // Reset component state for this specific model
      downloadProgress = null;
      downloadText = null;
      initiateText = null;
      isDownloaded = false;
      
    } catch (error) {
      console.error("Error deleting model:", error);
    }
  }

</script>

{#if !onlyShowIfDownloaded || isDownloaded}
  <li class="text-[#151b1e] bg-gray-200 border-2 border-dotted border-[#151b1e] rounded-lg hover:bg-[lightsteelblue]">
    <div>
      <input type="radio" id={id} name="selectModel" value={value} class="hidden peer" checked={isChecked} on:click={() => loadChatModel(id)} />
      <label for={id} class="inline-flex items-center justify-between w-full h-full p-3 cursor-pointer peer-checked:border-solid peer-checked:cursor-default peer-checked:bg-[lightsteelblue] peer-checked:border-[#151b1e] peer-checked:text-[#151b1e] hover:text-gray-600 hover:bg-[lightsteelblue]">
        <div class="block">
          <div class="w-full text-[#151b1e] text-md font-semibold">{name}</div>
          <div class="w-full text-sm font-normal">
            {parameters}
          </div>

          <!-- Model Performance -->
          <div class="relative inline-block">
            <span
              class="performance-span text-[#151b1e] text-xs font-medium me-1.5 px-2.5 py-0.5 bg-gray-300 rounded border-2 border-[#151b1e]"
              on:mouseenter={() => showPerformanceTooltip = true}
              on:mouseleave={() => showPerformanceTooltip = false}
            >
              {performance}
            </span>
            {#if showPerformanceTooltip}
              <div class="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 z-50 w-48 p-2 text-sm text-white bg-black rounded-lg shadow-lg">
                Performance of the AI model (how "smart" it is)
              </div>
            {/if}
          </div>

          <!-- Model size -->
          <span 
            class="bg-gray-100 text-gray-800 text-xs font-medium mx-0 px-2.5 py-0.5 rounded border border-gray-500 relative inline-block cursor-pointer"
            on:mouseenter={() => showVramTooltip = true}
            on:mouseleave={() => showVramTooltip = false}
          >
            {vramRequired ? vramMBtoGB(vramRequired) : "N/A"}GB
            {#if showVramTooltip}
              <div class="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 z-50 p-2 text-sm text-white bg-black rounded-lg shadow-lg whitespace-nowrap">
                Aprox. model size to download
              </div>
            {/if}
          </span>
          
          <!-- Language support -->
          <div class="relative inline-block">
            <span 
              class="inline-flex items-center text-indigo-900 text-xs font-medium me-1.5 px-2.5 py-0.5 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-300 cursor-pointer transition-colors duration-200"
              on:mouseenter={() => showLanguagesTooltip = true}
              on:mouseleave={() => showLanguagesTooltip = false}
            >
              Good for
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M18 6h-8M18 6v8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            {#if showLanguagesTooltip}
              <div class="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 z-50 w-48 p-2 text-sm text-white bg-black rounded-lg shadow-lg">
                {goodFor}
              </div>
            {/if}
          </div>
            
        </div>
        <svg class="w-6 h-5 ms-3 min-w-5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
        </svg>
      </label>
    </div>
    <div class="p-3 pt-1 pb-2 bg-[ghostwhite] empty:p-0 rounded-b-lg">
      {#if isDownloaded}
        {#if initiateText}
          <div class="w-full bg-gray-200 my-1 rounded-full relative overflow-hidden">
            <div class="relative z-10 bg-[dimgrey] text-xs font-medium text-[#151b1e] text-center p-0.5 leading-none rounded-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 animate-bgMove" style="width: 100%;">
              {initiateText}
            </div>
          </div>
        {/if}
        <span class="inline-flex items-center bg-[#cb8bd0] text-[#151b1e] text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
          Downloaded
          <svg class="ml-0.5 w-3 h-3 text-[#151b1e]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8.032 12 1.984 1.984 4.96-4.96m4.55 5.272.893-.893a1.984 1.984 0 0 0 0-2.806l-.893-.893a1.984 1.984 0 0 1-.581-1.403V7.04a1.984 1.984 0 0 0-1.984-1.984h-1.262a1.983 1.983 0 0 1-1.403-.581l-.893-.893a1.984 1.984 0 0 0-2.806 0l-.893.893a1.984 1.984 0 0 1-1.403.581H7.04A1.984 1.984 0 0 0 5.055 7.04v1.262c0 .527-.209 1.031-.581 1.403l-.893.893a1.984 1.984 0 0 0 0 2.806l.893.893c.372.372.581.876.581 1.403v1.262a1.984 1.984 0 0 0 1.984 1.984h1.262c.527 0 1.031.209 1.403.581l.893.893a1.984 1.984 0 0 0 2.806 0l.893-.893a1.985 1.985 0 0 1 1.403-.581h1.262a1.984 1.984 0 0 0 1.984-1.984V15.7c0-.527.209-1.031.581-1.403Z"/>
          </svg>
        </span>
        
        <!-- Delete button -->
        <button
          on:click|stopPropagation={() => deleteModel(id)}
          class="inline-flex items-center bg-red-600 hover:bg-red-700 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full transition-colors duration-200"
          title="Delete model from cache"
        >
          Delete
          <svg class="ml-0.5 w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
          </svg>
        </button>
        {#if $selectedAiModelId === id}
          <span class="inline-flex items-center bg-green-700 text-yellow-300 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
            In use
            <svg class="ml-0.5 w-3 h-3 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 0 0-2 2v4m5-6h8M8 7V5c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2m0 0h3a2 2 0 0 1 2 2v4m0 0v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6m18 0h-3m-3 0h-4m-3 0H5"/>
            </svg>
          </span>
        {/if}
      {:else}
        {#if downloadProgress}
          <div class="w-full bg-gray-200 my-1 rounded-full relative overflow-hidden">
            <!-- Background animation + progress bar -->
            <div class="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 animate-bgMove"></div>
            <div class="relative z-10 bg-[dimgrey] text-xs font-medium text-orange-50 text-center p-0.5 leading-none rounded-full" style="width: {downloadProgress}%;">
              {downloadProgress}%
            </div>
          </div>
        {:else if downloadText}
          <div class="w-full bg-gray-200 my-1 rounded-full">
            <div class="bg-[dimgrey] text-xs font-medium text-orange-50 text-center p-0.5 leading-none rounded-full" style="width: 100%">{downloadText}</div>
          </div>
        {/if}
      {/if}
    </div>
  </li>
{/if}

<style>
	.peer:checked + label svg {
		color: rgb(176 196 222);
	}

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

  .relative {
    position: relative;
  }
  .absolute {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 0.5rem;
  }
  .cursor-pointer {
    cursor: pointer;
  }
</style>
