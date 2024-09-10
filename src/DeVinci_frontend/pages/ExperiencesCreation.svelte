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
  import Stepper from "../components/molecules/Stepper.svelte";
  import Footer from "../components/Footer.svelte";

  import {
    syncLocalChanges,
    setLocalFlag,
    getLocalFlag
  } from "../helpers/localStorage";

  let hasLoadedSettings = false;

  const onDeviceExperienceSteps = [
    { title: "Step 1", description: "Create On-device Experience" },
    { title: "Step 2", description: "Describe content" },
    { title: "Step 3", description: "submit a PR" },
  ];

  const icpExperienceSteps = [
    { title: "Step 1", description: "Create ICP Experience" },
    { title: "Step 2", description: "Deploy to ICP" },
  ];

  const offChainExperienceSteps = [
    { title: "Step 1", description: "Create Off-chain Experience" },
    { title: "Step 2", description: "Host Experience" },
  ];

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

    <main class="pt-12 pb-16 lg:pt-12 lg:pb-24 bg-slate-100 antialiased">
      <div class="flex flex-col justify-between px-4 mx-auto max-w-screen-xl ">
        <!-- Breadcrumb -->
        <nav class="justify-between m-4 mt-0 px-4 py-3 text-gray-700 border border-gray-200 rounded-lg sm:flex sm:px-5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700" aria-label="Breadcrumb">
          <ol class="inline-flex items-center mb-3 space-x-1 md:space-x-2 rtl:space-x-reverse sm:mb-0">
            <li>
              <div class="flex items-center">
                <a href="#/experiences" class="ms-1 text-sm font-medium text-gray-700 hover:text-gray-400 md:ms-2">Experiences</a>
              </div>
            </li>
            <li aria-current="page">
              <div class="flex items-center">
                <svg class="rtl:rotate-180 w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                </svg>
                <a href="#/experiences/create" class="cursor-not-allowed text-gray-400 ms-1 text-sm font-medium">Creation</a>
              </div>
            </li>
          </ol>
        </nav> 
        <accordion class="px-4">
          <!-- Intro -->
          <div class="border-b ">
            <input type="radio" name="accordion" id="accordion1" class="hidden">
            <label for="accordion1" class="block text-lg p-6 rounded-t-lg bg-[lightsteelblue] text-[#151b1e] font-medium cursor-pointer">
                Create On-device Experience
            </label>
            <div class="accordion-content overflow-hidden max-h-0 transition-all duration-500 ease">
              <div class="p-4 bg-white relative">
                <Stepper steps={onDeviceExperienceSteps} />
              </div>
            </div>
            <div class="accordion-content overflow-hidden max-h-0 transition-all duration-500 ease">
              <p>

              </p>
            </div>
        </div>
        <!-- Integrate UN materials -->
        <div class="border-b ">
          <input type="radio" name="accordion" id="accordion1" class="hidden">
          <label for="accordion1" class="block text-lg p-6 rounded-t-lg bg-[lightsteelblue] text-[#151b1e] font-medium cursor-pointer">
            Integrate UN materials
          </label>
          <div class="accordion-content overflow-hidden max-h-0 transition-all duration-500 ease">
            <p>
              1) as local vector database/s (see Oxford entry, find other in-browser database options)
            </p>
            <p>
              2) as on-chain vector database/s (see branch https://github.com/patnorris/DecentralizedAIonIC/tree/firstUserKnowledgeBase, additional IC vector database projects as options)
            </p>
            <p>
              3) as off-chain vector database/s (point to codebase reference where to integrate)
            </p>
            <p>
              4) another approach
            </p>
          </div>
        </div>
        <!-- On-device model selection -->
        <div class="border-b ">
          <input type="radio" name="accordion" id="accordion1" class="hidden">
          <label for="accordion1" class="block text-lg p-6 rounded-t-lg bg-[lightsteelblue] text-[#151b1e] font-medium cursor-pointer">
            On-device model selection
          </label>
          <div class="accordion-content overflow-hidden max-h-0 transition-all duration-500 ease">
            <p>
              1) Just one option or several models to select from?
            </p>
            <p>
              2) More background info provided to the learner/user?
            </p>
            <p>
              3) Create your own on-device LLM and integrate it (e.g. finetune the model, integrate into app: https://github.com/mlc-ai/web-llm?tab=readme-ov-file#custom-models)
            </p>
          </div>
        </div>
        <!-- Replace the on-device model -->
        <div class="border-b ">
          <input type="radio" name="accordion" id="accordion1" class="hidden">
          <label for="accordion1" class="block text-lg p-6 rounded-t-lg bg-[lightsteelblue] text-[#151b1e] font-medium cursor-pointer">
            Replace the on-device model
          </label>
          <div class="accordion-content overflow-hidden max-h-0 transition-all duration-500 ease">
            <p>
              1) with an on-chain model: llama.cpp, other IC examples, other decentralized backend
            </p>
            <p>
              2) with an off-chain model: examples like Juno, Arcmind, Elna
            </p>
          </div>
        </div>
        <!-- Improve the UX -->
        <div class="border-b ">
          <input type="radio" name="accordion" id="accordion1" class="hidden">
          <label for="accordion1" class="block text-lg p-6 rounded-t-lg bg-[lightsteelblue] text-[#151b1e] font-medium cursor-pointer">
            Improve the UX
          </label>
          <div class="accordion-content overflow-hidden max-h-0 transition-all duration-500 ease">
            <p>
              ideas: redesign the flow, the UI, the info displayed to the learner/user
            </p>
            <p>
              implement new features
            </p>
          </div>
        </div>
        <!-- Issue a PR -->
        <div class="border-b ">
          <input type="radio" name="accordion" id="accordion1" class="hidden">
          <label for="accordion1" class="block text-lg p-6 rounded-t-lg bg-[lightsteelblue] text-[#151b1e] font-medium cursor-pointer">
            Issue a PR
          </label>
          <div class="accordion-content overflow-hidden max-h-0 transition-all duration-500 ease">
            <p>
              Issue a PR to the repo such that your experience shows on the overview page
              [repo]
            </p>
            <p>
              [overview page]
            </p>
            <p>
              instructions for the PR and metadata format
            </p>
          </div>
        </div>
        <!-- On-device Experience -->
          <!-- <div class="border-b ">
            <input type="radio" name="accordion" id="accordion1" class="hidden">
            <label for="accordion1" class="block text-lg p-6 rounded-t-lg bg-[lightsteelblue] text-[#151b1e] font-medium cursor-pointer">
                Create On-device Experience
            </label>
            <div class="accordion-content overflow-hidden max-h-0 transition-all duration-500 ease">
              <div class="p-4 bg-white relative">
                <Stepper steps={onDeviceExperienceSteps} />
              </div>
            </div>
          </div> -->
        <!-- ICP experience -->
          <!-- <div class="border-b">
            <input type="radio" name="accordion" id="accordion2" class="hidden">
            <label for="accordion2" class="block text-lg p-6 bg-[lightsteelblue] text-[#151b1e] font-medium cursor-pointer">
                Create Experience on ICP
            </label>
            <div class="accordion-content overflow-hidden max-h-0 transition-all duration-500 ease">
              <div class="p-4 bg-white">
                <Stepper steps={icpExperienceSteps} />
              </div>
            </div>
          </div> -->
        <!-- Off-chain experience -->
          <!-- <div class="border-b rounded-b-lg">
            <input type="radio" name="accordion" id="accordion3" class="hidden">
            <label for="accordion3" class="block text-lg p-6 bg-[lightsteelblue] text-[#151b1e] font-medium p-4 cursor-pointer">
                Create off-chain Experience
            </label>
            <div class="accordion-content rounded-b-lg overflow-hidden max-h-0 transition-all duration-500 ease">
              <div class="p-4 bg-white">
                <Stepper steps={offChainExperienceSteps} />
              </div>
            </div>
          </div> -->
        </accordion>
      </div>
    </main>
    <Footer />
  </main>
</div>

<style>
  /* Open accordion if input is checked */
  input:checked + label + .accordion-content {
      max-height: 1300px;
  }
  ol.experience-stepper {
    margin-left: 1rem !important;
  }
</style>





