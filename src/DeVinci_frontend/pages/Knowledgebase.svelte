<script lang="ts">
  import { onMount } from 'svelte';
  import { deviceType, supportsWebGpu } from "../store";

  import {
    addToUserKnowledgebase,
    searchUserKnowledgebase
  } from "../helpers/vector_database";

  let newKnowledgeText = '';
  let addingKnowledgeInProgress = false;

  async function addToKnowledgebase() {
    addingKnowledgeInProgress = true;
    if(newKnowledgeText.trim() !== '') {
      const newKnowledge = newKnowledgeText.trim();
      await addToUserKnowledgebase(newKnowledge);
    };
    addingKnowledgeInProgress = false;
  };

  let searchText = '';
  let searchingKnowledgeInProgress = false;
  let searchResult = '';

  async function searchKnowledgebase() {
    searchingKnowledgeInProgress = true;
    if(searchText.trim() !== '') {
      const newSearch = searchText.trim();
      searchResult = await searchUserKnowledgebase(newSearch);
    };
    searchingKnowledgeInProgress = false;
  };
</script>

<div class="flex items-center px-3 p-2 rounded-full bg-gray-200">
  <input bind:value={newKnowledgeText} type="text" id="chat" autofocus class="block mx-4 p-3 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:outline-none focus:ring-[#24292F]/50 " placeholder="Add to your knowledgebase..." />
  <button class:has-text={newKnowledgeText.length > 1}  type="submit" on:click={() => {addToKnowledgebase()}} class="inline-flex justify-center p-2 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
    <svg class="w-5 h-5 rotate-0 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
      <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
    </svg>
    <span class="sr-only">Add to Knowledgebase</span>
  </button>
</div>
<div class="flex items-center px-3 p-2 rounded-full bg-gray-200">
  <input bind:value={searchText} type="text" id="chat" autofocus class="block mx-4 p-3 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:outline-none focus:ring-[#24292F]/50 " placeholder="Search your knowledgebase..." />
  <button class:has-text={searchText.length > 1}  type="submit" on:click={() => {searchKnowledgebase()}} class="inline-flex justify-center p-2 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
    <svg class="w-5 h-5 rotate-0 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
      <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
    </svg>
    <span class="sr-only">Search Knowledgebase</span>
  </button>
</div>
{#if searchResult}
  <div class="justify-between m-4 mt-0 px-4 py-3 text-gray-700 border border-gray-200 rounded-lg sm:flex sm:px-5 bg-gray-50">
    {searchResult}
  </div>
{/if}
