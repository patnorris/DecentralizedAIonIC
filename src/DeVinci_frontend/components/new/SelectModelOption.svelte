<script>
  import * as webllm from "@mlc-ai/web-llm";

  import {
    store,
    chatModelGlobal,
    chatModelDownloadedGlobal,
    selectedAiModelId,
    deviceType
  } from "../../store";
  import {
    setLocalFlag,
    syncLocalChanges,
    setUserSettingsSyncFlag,
    getLocalFlag
  } from "../../helpers/localStorage";

  export let id;
  export let name;
  export let value;
  export let title;
  export let parameters;
  export let performance;
  export let size;
  export let chatModelDownloadInProgress;

  // Reactive statement to check if the ID is included in the already downloaded model IDs
  $: isDownloaded = getLocalFlag("downloadedAiModels").includes(id);

  $: downloadProgress = getLocalFlag("aiModelDownloadingProgress", {modelId: id});
  // $: downloadProgress = `${getLocalFlag("aiModelDownloadingProgress", {modelId: id})} %`;

  let chatModelDownloaded = false;
  chatModelDownloadedGlobal.subscribe((value) => chatModelDownloaded = value);

  function toPercentage(floatValue, decimals = 2) {
    return (floatValue * 100).toFixed(decimals);
  };

  document.addEventListener("DOMContentLoaded", function() {
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
      }
    }

    // Function to load background color from localStorage
    function loadBackgroundColor(span) {
      const performance = span.textContent.trim();
      const savedColor = localStorage.getItem(`span-${performance}`);
      if (savedColor) {
        span.style.backgroundColor = savedColor;
      } else {
        // If no saved color, set it
        setBackgroundColor(span);
      }
    }

    // Apply background color change to each span element
    spans.forEach(span => loadBackgroundColor(span));

    // Observer to apply background colors on subsequent navigations
    const observer = new MutationObserver(function() {
      // Add a delay before applying background colors
      setTimeout(function() {
        const spans = document.querySelectorAll(".performance-span");
        spans.forEach(span => {
          const performance = span.textContent.trim();
          const savedColor = localStorage.getItem(`span-${performance}`);
          if (savedColor) {
            span.style.backgroundColor = savedColor;
          }
        });
      }, 1000); // 1 second delay
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });

  const changeModel = async (id) => {
    if ($selectedAiModelId === id) {
      return;
    };
    // Change the model in the store
    selectedAiModelId.set(id); // this also updates the locally stored model id
    chatModelDownloadedGlobal.set(false);
    // Persist to backend
    const updatedSettingsObject = {
      selectedAiModelId: id,
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

  async function loadChatModel(modelOptionId) {
    console.log("in loadChatModel modelOptionId", modelOptionId);
    //debugOutput += "###in loadChatModel###";
    //setLabel("debug-label", debugOutput);
    if (chatModelDownloadInProgress) {
      return;
    };
    changeModel(modelOptionId);
    if (chatModelDownloaded === true && $chatModelGlobal) {
      return;
    };
    console.log("Loading chat model...");
    chatModelDownloadInProgress = true;
    if (!modelOptionId) {
      modelOptionId = $selectedAiModelId;
    };
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
      console.log("in initProgressCallback report ", report);
      //setLabel("init-label", report.text);
      if (report.progress) {
        if (report.progress !== 0) {
          downloadProgress = toPercentage(report.progress);
          // Avoid setting the download progress for already downloaded models (which have progress as 0)
          setLocalFlag("aiModelDownloadingProgress", {modelId: id, downloadProgress: report.progress});
        } else {
          downloadProgress = report.text;
        };
      } else {
        downloadProgress = "Initiating...";
      };
    };
    try {
      $chatModelGlobal.setInitProgressCallback(initProgressCallback);
      console.log("in loadChatModel reload");
      await $chatModelGlobal.reload(modelOptionId);
      // Set flag that this model has been downloaded
      const flagObject = {
        modelId: modelOptionId,
      };
      setLocalFlag("downloadedAiModels", flagObject);
    } catch (error) {
      console.error("Error loading model: ", error);
      /* debugOutput += "###error in loadChatModel###";
      debugOutput += error;
      setLabel("debug-label", debugOutput); */
      throw error;
    };
    $chatModelDownloadedGlobal = true;
    chatModelDownloadInProgress = false;
    console.log("in loadChatModel loaded");
  };

</script>

<li class="text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#151b1e] rounded-lg">
  <div>
    <input type="radio" id={id} name="selectModel" value={value} class="hidden peer" on:click={() => loadChatModel(id)} />
    <label for={id} class="inline-flex items-center justify-between w-full p-3 cursor-pointer peer-checked:border-solid peer-checked:cursor-default peer-checked:bg-[lightsteelblue] peer-checked:border-[#151b1e] peer-checked:text-[#151b1e] hover:text-gray-600 hover:bg-gray-50">
      <div class="block">
        <div class="w-full text-[#151b1e] text-md font-semibold">{name}</div>
        <div class="w-full text-sm font-normal">{parameters}</div>
        <span class="performance-span text-[#151b1e] text-xs font-medium me-1.5 px-2.5 py-0.5 bg-gray-300 rounded border-2 border-[#151b1e]">{performance}</span>
        <span class="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-gray-500">{size}</span>
      </div>
      <svg class="w-5 h-5 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
      </svg>
    </label>
  </div>
  <div class="p-3 pt-1 pb-2">
    {#if downloadProgress && downloadProgress !== 0}
      <div class="w-full bg-gray-200 my-1 rounded-full">
        <div class="bg-[dimgrey] text-xs font-medium text-orange-50 text-center p-0.5 leading-none rounded-full" style="width: 45%">{downloadProgress}</div>
      </div>
    {/if}
    {#if isDownloaded}
      <span class="inline-flex items-center bg-[lightsteelblue] text-[#151b1e] text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
        Downloaded
        <svg class="ml-0.5 w-3 h-3 text-[#151b1e]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8.032 12 1.984 1.984 4.96-4.96m4.55 5.272.893-.893a1.984 1.984 0 0 0 0-2.806l-.893-.893a1.984 1.984 0 0 1-.581-1.403V7.04a1.984 1.984 0 0 0-1.984-1.984h-1.262a1.983 1.983 0 0 1-1.403-.581l-.893-.893a1.984 1.984 0 0 0-2.806 0l-.893.893a1.984 1.984 0 0 1-1.403.581H7.04A1.984 1.984 0 0 0 5.055 7.04v1.262c0 .527-.209 1.031-.581 1.403l-.893.893a1.984 1.984 0 0 0 0 2.806l.893.893c.372.372.581.876.581 1.403v1.262a1.984 1.984 0 0 0 1.984 1.984h1.262c.527 0 1.031.209 1.403.581l.893.893a1.984 1.984 0 0 0 2.806 0l.893-.893a1.985 1.985 0 0 1 1.403-.581h1.262a1.984 1.984 0 0 0 1.984-1.984V15.7c0-.527.209-1.031.581-1.403Z"/>
        </svg>
      </span>
    {/if}
  </div>
</li>

<style>
	.peer:checked + label svg {
		color: rgb(176 196 222);
	}

  .performance-span {
	  transition: background-color 3.3s ease-in-out; /* Adjust the duration and easing as needed */
  }
</style>
