<script lang="ts">
    import {
      setLocalFlag,
      getLocalFlag
    } from "../helpers/localStorage";

    // Holds the value of the selected option whether to store chats or not
    let saveChats = getLocalFlag("saveChatsUserSelection") === false ? "doNotSave" : "save"; // default is save
    // Function to be called whenever the chat storage selection changes
    function handleSelectionChange() {
      let saveChatsValue = true;
      if (saveChats === "doNotSave") {
      saveChatsValue = false;
    };
      setLocalFlag("saveChatsUserSelection", {saveChats: saveChatsValue});
    };
</script>

<div id="alert-additional-content-4" class="p-4 m-4 text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800" role="alert">
  <div class="flex items-center">
    <svg class="w-6 h-6 text-yellow-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z"/>
    </svg>
    <span class="sr-only">Info</span>
    <h3 class="text-lg font-medium"> Manage your chat data</h3>
  </div>
  <div class="mt-2 mb-4 text-sm">
    To enhance your experience we offer you the choice to save your chat history. By opting in, your chat history will be saved. If you choose to opt out, your chat history will not be saved.
  </div>
  <div class="flex">
    <ul class="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex">
      <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
        <div class="flex items-center ps-3">
          <input
            id="horizontal-list-radio-license"
            type="radio"
            value="save"
            name="list-radio"
            class="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
            bind:group={saveChats}
            on:change={handleSelectionChange}>
          <label for="horizontal-list-radio-license" class="cursor-pointer w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Save my chats
          </label>
        </div>
      </li>
      <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
        <div class="flex items-center ps-3 cursor-pointer">
          <input
            id="horizontal-list-radio-id"
            type="radio"
            value="doNotSave"
            name="list-radio"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer"
            bind:group={saveChats}
            on:change={handleSelectionChange}>
          <label for="horizontal-list-radio-id" class="w-full py-3 ms-2 text-sm font-medium text-gray-900 cursor-pointer">
            Do not save my chats
          </label>
        </div>
      </li>
    </ul>
  </div>
</div>
