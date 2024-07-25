<script lang="ts">
  import * as webllm from "@mlc-ai/web-llm";
  import {
    store,
    chatModelGlobal,
    chatModelDownloadedGlobal,
    selectedAiModelId,
    deviceType
  } from "../../store";

  import SelectModelOption from './SelectModelOption.svelte';

  import { getAvailableAiModels } from "../../helpers/ai_model_helpers";
  import { syncLocalChanges, setUserSettingsSyncFlag } from "../../helpers/localStorage";

  let availableAiModels = getAvailableAiModels(deviceType === 'Android');
  let chatModelDownloadInProgress = false;
  let chatModelDownloaded = false;
  chatModelDownloadedGlobal.subscribe((value) => chatModelDownloaded = value);

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
      }
    } else {
      console.log("Using webllm");
      $chatModelGlobal = new webllm.MLCEngine();
    };

    /* const initProgressCallback = (report) => {
      setLabel("init-label", report.text);
    };
    $chatModelGlobal.setInitProgressCallback(initProgressCallback); */
    console.log("in loadChatModel reload");
    await $chatModelGlobal.reload(modelOptionId);
    $chatModelDownloadedGlobal = true;
    chatModelDownloadInProgress = false;
    console.log("in loadChatModel loaded");
  };

</script>

  <ul class="grid w-full gap-2 md:grid-cols-2 px-4 mt-4">
    {#each availableAiModels as option}
      <SelectModelOption
        id={option.id}
        name="{option.name}"
        value={option.value}
        title={option.title}
        parameters={option.parameters}
        performance={option.performance}
        size={option.size}
        callbackLoadChatModel={loadChatModel}
      />
    {/each}
  </ul>
