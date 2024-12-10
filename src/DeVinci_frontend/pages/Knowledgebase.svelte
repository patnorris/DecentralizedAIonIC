<script lang="ts">
  import { store } from '../store';
  
  import ToastNotification from '../components/ToastNotification.svelte';

  import {
    addPdfToUserKnowledgebase,
    addTextFileToUserKnowledgebase,
    addToUserKnowledgebase,
    searchUserKnowledgebase,
    createUserKnowledgebaseCanister
  } from "../helpers/vector_database";

  import spinner from "../assets/loading.gif";

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

// User can upload a pdf to add to their knowledge base
  let pathToUploadedPdf = '';
  let loadingKnowledgeDatabase = false;

  let showToast = false;
  let toastMessage = '';

  async function uploadPdfToKnowledgeBase() {
    const fileInput = document.getElementById('pdf_chat') as HTMLInputElement;
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      pathToUploadedPdf = URL.createObjectURL(file);
      loadingKnowledgeDatabase = true;
      await addPdfToUserKnowledgebase(pathToUploadedPdf);
      loadingKnowledgeDatabase = false;
      showToast = true;
      toastMessage = "PDF processed and added to your knowledge base!";
    } else {
      showToast = true;
      toastMessage = "Please select a PDF file.";
    }
  };

  let fileContentType = 'application/pdf'; // Default to PDF, switch to text/plain for text files
  let pathToUserFile = '';

  async function uploadFileToKnowledgeBase() {
    const fileInput = document.getElementById('file_upload') as HTMLInputElement;
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      fileContentType = file.type;
      pathToUserFile = URL.createObjectURL(file);
      loadingKnowledgeDatabase = true;
      
      if (fileContentType === 'application/pdf') {
        await addPdfToUserKnowledgebase(pathToUserFile);
      } else if (fileContentType === 'text/plain') {
        await addTextFileToUserKnowledgebase(file);
      };

      loadingKnowledgeDatabase = false;
      showToast = true;
      toastMessage = "File processed and added to your knowledge base!";
    } else {
      showToast = true;
      toastMessage = "Please select a file.";
    }
  };

  function closeToast() {
    showToast = false;
  };
</script>

{#if !$store.isAuthed}
  <p id='chatsSubtext'>Please login first.</p>
{:else}
  <div class="flex items-center px-3 p-2 rounded-full bg-gray-200">
    <button  type="submit" on:click={() => {createUserKnowledgebaseCanister()}} class="inline-flex justify-center p-2 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
      <svg class="w-5 h-5 rotate-0 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
        <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
      </svg>
      <span class="sr-only">Create Knowledgebase</span>
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
  {:else if searchingKnowledgeInProgress}
    <p class="font-semibold text-gray-900">Searching in your Knowledge Base for you...</p>
    <img class="h-12 mx-auto p-1 block" src={spinner} alt="loading animation" />
  {/if}
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
    <label for="file_upload">
      <button type="button" on:click={() => document.getElementById('file_upload').click()} class="inline-flex justify-center p-2 text-gray-500 rounded-full cursor-pointer hover:text-gray-900 hover:bg-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z"/></svg>
      </button>
    </label>
    <input id="file_upload" type="file" accept=".pdf, .txt" on:change={uploadFileToKnowledgeBase} class="hidden text-sm text-gray-900 border border-gray-300 cursor-pointer bg-gray-50 ml-2">
    {#if loadingKnowledgeDatabase}
      <p class="font-semibold text-gray-900">Loading the content into your Knowledge Base for you...</p>
      <img class="h-12 mx-auto p-1 block" src={spinner} alt="loading animation" />
    {/if}
  </div>
{/if}

{#if showToast}
  <ToastNotification message={toastMessage} onClose={closeToast} />
{/if}

