<script lang="ts">
  import * as webllm from "@mlc-ai/web-llm";
  import {
    store,
    chatModelGlobal,
    chatModelDownloadedGlobal,
    activeChatGlobal,
    selectedAiModelId,
    deviceType
  } from "../../store";

  import SelectModelOption from './SelectModelOption.svelte';

  import { getAvailableAiModels } from "../../helpers/ai_model_helpers";

  let availableAiModels = getAvailableAiModels(deviceType === 'Android');

  /* const modelOptions = [
    {
      id: "TinyLlama",
      name: "models",
      value: "TinyLlama",
      title: "TinyLlama",
      parameters: "1.1 billion parameters",
      performance: "Alright performance",
      size: "Small size"
    },
    {
      id: "Gemma",
      name: "models",
      value: "Gemma",
      title: "Gemma",
      parameters: "2 billion parameters",
      performance: "Good performance",
      size: "Small size"
    },
    {
      id: "RedPajama",
      name: "models",
      value: "RedPajama",
      title: "Red Pajama",
      parameters: "3 billion parameters",
      performance: "Alright performance",
      size: "Small size"
    },
    {
      id: "Mistral",
      name: "models",
      value: "Mistral",
      title: "Mistral",
      parameters: "7 billion parameters",
      performance: "Very good performance",
      size: "Large size"
    },
    {
      id: "Llama38B",
      name: "models",
      value: "Llama38B",
      title: "Llama 3 8B",
      parameters: "8 billion parameters",
      performance: "Super good performance",
      size: "Large size"
    },
    {
      id: "Llama213B",
      name: "models",
      value: "Llama213B",
      title: "Llama2 13B",
      parameters: "13 billion parameters",
      performance: "Super good performance",
      size: "Large size"
    },
    {
      id: "Llama370B",
      name: "models",
      value: "Llama370B",
      title: "Llama3 70B",
      parameters: "70 billion parameters",
      performance: "Insane performance",
      size: "Very large size"
    }
  ]; */

  let chatModelDownloadInProgress = false;
  let chatModelDownloaded = false;
  chatModelDownloadedGlobal.subscribe((value) => chatModelDownloaded = value);

  async function loadChatModel(modelOptionId) {
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
    if (!modelOptionId) {
      modelOptionId = $selectedAiModelId;
    };
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

    /* const initProgressCallback = (report) => {
      setLabel("init-label", report.text);
    };
    $chatModelGlobal.setInitProgressCallback(initProgressCallback); */
    await $chatModelGlobal.reload(modelOptionId);
    $chatModelDownloadedGlobal = true;
    chatModelDownloadInProgress = false;
  };

</script>

  <ul class="grid w-full gap-2 md:grid-cols-2 px-4 mt-4">
    {#each availableAiModels as option}
      <SelectModelOption
        id={option.id}
        name={option.name}
        value={option.value}
        title={option.title}
        parameters={option.parameters}
        performance={option.performance}
        size={option.size}
        on:click={() => loadChatModel(option.id)}
      />
    {/each}
  </ul>

<style>
</style>
