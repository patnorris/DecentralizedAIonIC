<script lang="ts">
  import { marked } from 'marked';

  export let messageContent;
</script>

<div class="mt-4 ml-auto">
  <div class="flex flex-col ml-auto text-right max-w-[360px] leading-1.5 p-4 border-gray-200 bg-gray-200 rounded-se-xl rounded-s-xl">
    <p class="text-sm font-normal py-2 text-gray-900 dark:text-white">{@html marked(messageContent)}</p>
  </div>
</div>
