<script lang="ts">
  import { marked } from 'marked';
  import devincilogobit from "/android-chrome-192x192.png";

  export let messageContent;

  // Function to handle copying text to the clipboard
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      alert('Content successfully copied to clipboard!'); // Show success alert
    } catch (err) {
      console.error('Failed to copy!', err);
      alert('Failed to copy content to the clipboard.'); // Show error alert
    };
  };
</script>

<div class="flex items-start gap-2.5 mt-4">
  <img class="w-8 h-8 rounded-full border-solid border-2 p-1 border-gray-200" src={devincilogobit} alt="DeVinci Logo">
  <div class="flex flex-col w-full max-w-full leading-1.5 px-4 py-3 border-gray-200 bg-gray-100 rounded-xl rounded-tr-none dark:bg-gray-700">
    <p class="text-sm font-normal py-2 text-gray-900 dark:text-white">
      {@html marked(messageContent)}
    </p>
    <!-- Copy icon -->
    <span class="text-sm cursor-pointer font-normal text-gray-500 ml-auto " on:click={() => copyToClipboard(messageContent)}>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 hover:text-gray-200 hover:bg-gray-200 p-1.5 rounded-full" viewBox="0 -960 960 960" fill="#5f6368"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>
    </span>
  </div>
</div>

