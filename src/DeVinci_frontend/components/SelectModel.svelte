<script lang="ts">
  import {
    deviceType
  } from "../store";

  import SelectModelOption from './SelectModelOption.svelte';

  import { getAvailableAiModels } from "../helpers/ai_model_helpers";
  import { userHasDownloadedModel } from "../helpers/localStorage";

  export let onlyShowDownloadedModels = false;
  export let autoInitiateSelectedModel = false;

  // Reactive statement to check if the user has already downloaded at least one AI model
  $: userHasDownloadedAtLeastOneModel = userHasDownloadedModel();

  let availableAiModels = getAvailableAiModels(deviceType === 'Android');
  let chatModelDownloadInProgress = false;

</script>

  <div>
    <div class="m-4 mt-2 px-4 py-3 text-gray-500 inline-block border border-[#b0c4de] rounded-lg sm:px-5 bg-gray-50">
      <svg class="flex-shrink-0 inline w-4 h-4 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
      </svg>
      <b>When you select an LLM model</b>, it will download to your browser cache and will need to be started afterward. This ensures 100% privacy, but please note that the download process might take some time.
    </div>
    <ul class="grid w-full gap-2 md:grid-cols-2 px-4 mt-4">
      {#each availableAiModels as option}
        {#if userHasDownloadedAtLeastOneModel}
          <SelectModelOption
            id={option.id}
            name="{option.name}"
            value={option.value}
            title={option.title}
            parameters={option.parameters}
            performance={option.performance}
            size={option.size}
            bind:chatModelDownloadInProgress
            onlyShowIfDownloaded={onlyShowDownloadedModels}
            autoInitiateIfModelSelected={autoInitiateSelectedModel}
          />
        {:else}
          <SelectModelOption
            id={option.id}
            name="{option.name}"
            value={option.value}
            title={option.title}
            parameters={option.parameters}
            performance={option.performance}
            size={option.size}
            bind:chatModelDownloadInProgress
          />
        {/if}
      {/each}
    </ul>
  </div>
