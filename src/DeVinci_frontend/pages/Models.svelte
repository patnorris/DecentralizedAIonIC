<script lang="ts">
  import {
    store,
    selectedAiModelId,
    deviceType,
    userSettings
  } from "../store";

  import SelectModel      from "../components/SelectModel.svelte";

  import {
    syncLocalChanges
  } from "../helpers/localStorage";

  let hasLoadedSettings = false;

  const loadUserSettings = async () => {
    try {
      const retrievedSettingsResponse = await $store.backendActor.get_caller_settings();
      // @ts-ignore
      if (retrievedSettingsResponse.Ok) {
        // @ts-ignore
        userSettings.set(retrievedSettingsResponse.Ok);
        // @ts-ignore
        const userSelectedAiModelId = retrievedSettingsResponse.Ok.selectedAiModelId;
        selectedAiModelId.set(userSelectedAiModelId);
        syncLocalChanges(); // Sync any local changes (from offline usage), only works if back online
      } else {
        // @ts-ignore
        console.error("Error retrieving user settings: ", retrievedSettingsResponse.Err);
        // @ts-ignore
        throw new Error("Error retrieving user settings: ", retrievedSettingsResponse.Err);
      };
    } catch (error) {
      console.error("Error in get_caller_settings: ", error);
      if (localStorage.getItem("userSettings")) {
        userSettings.set(localStorage.getItem("userSettings"));
      };
      if (localStorage.getItem("selectedAiModelId")) {
        selectedAiModelId.set(localStorage.getItem("selectedAiModelId"));
      };
    };
    hasLoadedSettings = true;
  };

</script>


<div class="flex flex-col justify-between px-4 mx-auto max-w-screen-xl ">
    <SelectModel />
</div>