<script lang="ts">
  import { onMount } from 'svelte';
  import { deviceType, supportsWebGpu } from "../store";

  import Sidebar from "../components/Sidebar.svelte";
  import Navigation from "../components/Navigation.svelte";

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

  onMount(() => {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const chat = document.getElementById('chat');

    function toggleSidebar(event) {
      event.stopPropagation();
      chat.classList.toggle('-translate-x-full');
    };

    function closeSidebar(event) {
      if (!chat.contains(event.target) && !sidebarToggle.contains(event.target)) {
        chat.classList.add('-translate-x-full');
      };
    };

    function stopPropagation(event) {
      event.stopPropagation();
    };

    sidebarToggle.addEventListener('click', toggleSidebar);
    document.body.addEventListener('click', closeSidebar);
    chat.addEventListener('click', stopPropagation);

    return () => {
      sidebarToggle.removeEventListener('click', toggleSidebar);
      document.body.removeEventListener('click', closeSidebar);
      chat.removeEventListener('click', stopPropagation);
    };
  });
</script>

<div class="flex flex-row h-screen">
  <aside id="chat" class="fixed z-50 bg-gray-200 w-72 min-w-72 h-full md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in">
    <div class="sidebar-content p-4 pt-0 h-full overflow-hidden">
      <Sidebar />
    </div>
  </aside>
  <main class="main flex flex-col flex-grow ml-0 md:ml-72 transition-all duration-150 ease-in">
    <header class="header bg-white shadow py-2 px-4">
      <div class="header-content flex items-center flex-row">
        <!--
        -- triggers sidebar on small devices TODO: own component (also use it on other pages then)
        -->
        <button id="sidebarToggle" data-drawer-target="chat" data-drawer-toggle="chat" aria-controls="chat" type="button" class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
          <span class="sr-only">Open sidebar</span>
          <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
          </svg>
        </button>
        <div class="flex ml-auto">
          <Navigation />
        </div>
      </div>
    </header>
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
      {#if searchResult}
        <div class="justify-between m-4 mt-0 px-4 py-3 text-gray-700 border border-gray-200 rounded-lg sm:flex sm:px-5 bg-gray-50">
          {searchResult}
        </div>
      {/if}
    </div>
  </main>
</div>

<style global>
  .footer {
    background: rgba(255,255,255,1);
    padding-top: 10px;
    padding-bottom: 10px;
  }
</style>
