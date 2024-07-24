<script lang="ts">
    import {
        store,
        selectedAiModelId,
        chatModelDownloadedGlobal,
        deviceType,
        userSettings
    } from "../store";

    import Topnav from "../components/Topnav.svelte";
    import Footer from "../components/Footer.svelte";
    import LoginMenu from "../components/LoginMenu.svelte";

    import { getAvailableAiModels, getDefaultAiModelId } from "../helpers/ai_model_helpers";
    import { syncLocalChanges, setUserSettingsSyncFlag } from "../helpers/localStorage";

    let availableAiModels = getAvailableAiModels(deviceType === 'Android');
    let hasLoadedSettings = false;

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

    const handleKeydown = (event, modelId) => {
        // 13 is the keycode for the "Enter" key, and 32 for the "Space" key.
        if (event.keyCode === 13 || event.keyCode === 32) {
            changeModel(modelId);
        };
    };

    const loadUserSettings = async () => {
        try {
            const retrievedSettingsResponse = await $store.backendActor.get_caller_settings();
            console.log("in loadUserSettings retrievedSettingsResponse ", retrievedSettingsResponse);
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
            console.log("in loadUserSettings local userSettings ", localStorage.getItem("userSettings"));
            if (localStorage.getItem("userSettings")) {
                console.log("get userSettings");
                userSettings.set(localStorage.getItem("userSettings"));
            };
            console.log("in loadUserSettings local selectedAiModelId ", localStorage.getItem("selectedAiModelId"));
            if (localStorage.getItem("selectedAiModelId")) {
                console.log("get selectedAiModelId");
                selectedAiModelId.set(localStorage.getItem("selectedAiModelId"));
            } else {
                selectedAiModelId.set(getDefaultAiModelId(deviceType === 'Android'));
            };     
        };
        hasLoadedSettings = true;
    };
</script>

<Topnav />

<LoginMenu />

<section id="usersettings" class="py-7 space-y-6 items-center text-center bg-slate-100">
    <h3 class="font-bold">My Settings</h3>
    {#if !$store.isAuthed}
      <p id='settingsSubtext'>Please login to view and edit Your Settings.</p>
    {:else}
      {#if !hasLoadedSettings}
        <p id='settingsSubtext'>Retrieving Your Settings...</p>
        <p hidden>{loadUserSettings()}</p>
      {:else}
        <div id="modelsetting">
            <h4 class="font-semibold">AI Model In Use</h4>
            <p>Please select the AI model you want to be used to power your DeVinci chat bot.</p>
            <p>Please note: AI models are pretty huge and require quite some computational resources. 
                As DeVinci runs on your device (via the browser), whether and how fast it may run depend on the device's hardware. If a given model doesn't work, you can thus try a smaller one and see if the device can support it.</p>
            <p>For the best possible experience, we recommend running as few other programs and browser tabs as possible besides DeVinci as those can limit the computational resources available for DeVinci.</p>
            <div class="model-options">
                {#each availableAiModels as model (model.id)}
                    <div 
                        class="model-option"
                        class:selected={model.id === $selectedAiModelId} 
                        on:click={() => changeModel(model.id)}
                        on:keydown={(event) => handleKeydown(event, model.id)}
                        tabindex="0"
                        role="button"
                    >
                        {model.name}: {model.size} Size ({model.numberOfParameters} parameters), {model.performance} Performance
                    </div>
                {/each}
            </div>
            
        </div>
      {/if}
    {/if}
</section>

<Footer />

<style>
    button {
        margin-left: 5px;
    }
    .model-option {
        padding: 10px;
        border: 1px solid #ccc;
        cursor: pointer;
    }
    .model-option:hover {
        background-color: #f0f0f0;
    }
    .model-option.selected {
        background-color: #e0e0e0;
    }
    .model-options {
        border: 1px solid #e0e0e0;
        border-radius: 5px;
        width: 100%;
        max-height: 400px;
        overflow-y: auto; /* allows vertical scrolling when content exceeds the container's height */
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    }
</style>
