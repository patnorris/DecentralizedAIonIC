<script lang="ts">
  import {
    store,
    chatModelGlobal,
    chatModelDownloadedGlobal,
    selectedAiModelId,
    deviceType
  } from "../../store";

  import SelectModelOption from './SelectModelOption.svelte';

  import { getAvailableAiModels } from "../../helpers/ai_model_helpers";

  let availableAiModels = getAvailableAiModels(deviceType === 'Android');
  let chatModelDownloadInProgress = false;
  let chatModelDownloaded = false;
  chatModelDownloadedGlobal.subscribe((value) => chatModelDownloaded = value);

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
        bind:chatModelDownloadInProgress
      />
    {/each}
  </ul>
