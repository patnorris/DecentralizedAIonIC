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
      <b>Please select a model</b>. When choosing an AI model, balance performance with hardware needs. Larger models offer better accuracy and features but require more powerful hardware and may run slower.
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
