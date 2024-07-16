<script lang="ts">
  import { marked } from 'marked';
  import devincilogobit from "/android-chrome-192x192.png";

  export let messageContent;
</script>

<div class="flex items-start gap-2.5 mt-4">
  <img class="w-8 h-8 rounded-full border-solid border-2 p-1 border-gray-200" src={devincilogobit} alt="DeVinci Logo">
  <div class="flex flex-col w-full max-w-full leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
    <p class="text-sm font-normal py-2 text-gray-900 dark:text-white">
      {@html marked(messageContent)}
    </p>
    <span class="text-sm cursor-pointer font-normal text-gray-500 hover:text-gray-200 dark:text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5" viewBox="0 -960 960 960"  fill="#5f6368"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>
    </span>
  </div>
</div>

<style>
</style>
