<script lang="ts">
  import { onMount } from 'svelte';
  import {
    store,
    selectedAiModelId,
    deviceType,
    userSettings
  } from "../store";

  import Sidebar from "../components/Sidebar.svelte";
  import Navigation from "../components/Navigation.svelte";
  import SelectModel from "../components/SelectModel.svelte";
  import Footer from "../components/Footer.svelte";

  import { getDefaultAiModelId } from "../helpers/ai_model_helpers";
  import {
    syncLocalChanges,
    setLocalFlag,
    getLocalFlag
  } from "../helpers/localStorage";

  let hasLoadedSettings = false;

  const loadUserSettings = async () => {
    try {
      const retrievedSettingsResponse = await $store.backendActor.get_caller_settings();
      // @ts-ignore
      if (retrievedSettingsResponse.Ok) {
        // @ts-ignore
        userSettings.set(retrievedSettingsResponse.Ok);
        // @ts-ignore
        const userSelectedAiModelId = retrievedSettingsResponse.Ok.selectedAiModelId;
        selectedAiModelId.set(userSelectedAiModelId);
        syncLocalChanges(); // Sync any local changes (from offline usage), only works if back online
      } else {
        // @ts-ignore
        console.error("Error retrieving user settings: ", retrievedSettingsResponse.Err);
        // @ts-ignore
        throw new Error("Error retrieving user settings: ", retrievedSettingsResponse.Err);
      };
    } catch (error) {
      console.error("Error in get_caller_settings: ", error);
      if (localStorage.getItem("userSettings")) {
        userSettings.set(localStorage.getItem("userSettings"));
      };
      if (localStorage.getItem("selectedAiModelId")) {
        selectedAiModelId.set(localStorage.getItem("selectedAiModelId"));
      } else {
        selectedAiModelId.set(getDefaultAiModelId(deviceType === 'Android'));
      };
    };
    hasLoadedSettings = true;
  };

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
        -- triggers sidebar on small devices
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

    <main class="pt-8 pb-16 lg:pt-8 lg:pb-24 bg-slate-100 dark:bg-gray-900 antialiased">
      <div class="flex flex-col justify-between px-4 mx-auto max-w-screen-xl ">
        <!-- Breadcrumb -->
        <nav class="justify-between m-4 mt-0 px-4 py-3 text-gray-700 border border-gray-200 rounded-lg sm:flex sm:px-5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700" aria-label="Breadcrumb">
          <ol class="inline-flex items-center mb-3 space-x-1 md:space-x-2 rtl:space-x-reverse sm:mb-0">
            <li>
              <div class="flex items-center">
                <a href="/" class="ms-1 text-sm font-medium text-gray-700 hover:text-gray-400 md:ms-2">Chat</a>
              </div>
            </li>
            <li aria-current="page">
              <div class="flex items-center">
                <svg class="rtl:rotate-180 w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                </svg>
                <a href="#" class="cursor-not-allowed text-gray-400 ms-1 text-sm font-medium">Settings</a>
              </div>
            </li>
          </ol>
        </nav>
        {#if !$store.isAuthed}
          <div class="justify-between m-4 mt-0 px-4 py-3 text-gray-700 border border-gray-200 rounded-lg sm:flex sm:px-5 bg-gray-50">
            Please connect to view and edit your settings.
          </div>
        {:else}
          {#if !hasLoadedSettings}
            <div class="justify-between m-4 mt-0 px-4 py-3 text-gray-700 border border-gray-200 rounded-lg sm:flex sm:px-5 bg-gray-50">
              Retrieving your settings...
            </div>
            <p hidden>{loadUserSettings()}</p>
          {:else}
            <!-- Opt-in-out saving chats TODO: refactor into own component -->
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
          {/if}
        {/if}
        <SelectModel />
      </div>
    </main>
    <Footer />
  </main>
</div>





