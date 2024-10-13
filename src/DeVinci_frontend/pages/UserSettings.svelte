<script lang="ts">
  import {
    store,
    selectedAiModelId,
    deviceType,
    userSettings
  } from "../store";

  import InOutSaveChats   from "../components/InOutSaveChats.svelte";
  import OwnCanister      from "../components/OwnCanister.svelte";
  import GeneralSettings  from "../components/GeneralSettings.svelte";
  import AdvancedSettings from "../components/AdvancedSettings.svelte";

  import {
    syncLocalChanges
  } from "../helpers/local_storage";

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
        userSettings.set(JSON.parse(localStorage.getItem("userSettings"))); 
      };
      if (localStorage.getItem("selectedAiModelId")) {
        selectedAiModelId.set(localStorage.getItem("selectedAiModelId"));
      };
    };
    hasLoadedSettings = true;
  };

</script>


<div class="flex flex-col justify-between px-4 mx-auto max-w-screen-xl ">
    {#if !$store.isAuthed}
      <div class="justify-between m-4 mt-0 px-4 py-3 text-gray-700 border border-gray-200 rounded-lg sm:flex sm:px-5 bg-gray-50">
        Please connect to view and edit your settings.
      </div>
    {:else}
      {#if !hasLoadedSettings}
        <div class="justify-between m-4 mt-0 px-4 py-3 text-gray-700 border border-gray-200 rounded-lg sm:flex sm:px-5 bg-gray-50">
          Retrieving your settings...
        </div>
        <p hidden>{loadUserSettings()}</p>
      {:else}
        <InOutSaveChats />
        <!-- <GeneralSettings /> -->
        <!-- <OwnCanister /> -->
        <AdvancedSettings />
      {/if}
    {/if}
</div>