<script lang="ts">
  import {
    deviceType
  } from "../../store";

  import SelectModelOption from './SelectModelOption.svelte';

  import { getAvailableAiModels } from "../../helpers/ai_model_helpers";
  import { userHasDownloadedModel } from "../../helpers/localStorage";

  export let onlyShowDownloadedModels = false;

  // Reactive statement to check if the user has already downloaded at least one AI model
  $: userHasDownloadedAtLeastOneModel = userHasDownloadedModel();

  let availableAiModels = getAvailableAiModels(deviceType === 'Android');
  let chatModelDownloadInProgress = false;

</script>

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
