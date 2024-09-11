<script lang="ts">
  import { onMount } from 'svelte';
  import Sidebar from "../components/Sidebar.svelte";
  import Navigation from "../components/Navigation.svelte";
  import Footer from "../components/Footer.svelte";

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

    <main class="pt-8 pb-16 lg:pt-8 lg:pb-24 bg-slate-100 antialiased">
      <div class="flex flex-col justify-between px-4 mx-auto max-w-screen-xl ">
        <!-- Breadcrumb -->
        <nav class="justify-between m-4 mt-0 px-4 py-3 text-gray-700 border border-gray-200 rounded-lg sm:flex sm:px-5 bg-gray-50" aria-label="Breadcrumb">
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
        <div class="px-4">
          <!-- Intro -->
          <div class="block p-6 bg-white border border-gray-200 rounded-lg shadow mb-4">
            <h5 class="mb-2 text-4xl font-bold tracking-tight text-gray-600 dark:text-white">Let's build decentralized AI for education</h5>
            <p class="font-semibold text-lg text-gray-700">We're excited that you joined the hackathon and can't wait to see what you'll build!</p>
            <p class="font-normal text-md my-4 text-gray-700"><span class="font-semibold">This page</span> provides a few pointers and ideas what you could implement during the hackathon (and beyond if you like). It's meant to help you get started and doesn't constitute instructions you have to follow. Please make sure you read the official hackathon guide provided by the Knowledge Foundation for these.</p>
            <p class="font-normal text-md text-gray-700"><span class="font-semibold">Below</span>, you'll see a few potential paths to consider on your coding adventure over the weekend. These include examples that could inspire your implementation and get you going more quickly.</p>
          </div>

          <!-- Integrate UN materials -->
          <div class="border-b ">
            <input type="radio" name="accordion" id="accordion2" class="hidden">
            <label for="accordion2" class="block text-lg p-6 bg-[lightsteelblue] text-[#151b1e] font-medium cursor-pointer">
              Integrate UN materials
            </label>
            <div class="accordion-content overflow-hidden max-h-0 transition-all duration-500 ease">
              <div class="block p-6 bg-white border border-gray-200 rounded-lg shadow my-4">
                <p class="font-semibold text-lg text-gray-700">Here are some ideas on how you can use technology to integrate anti-corruption documents, allowing the AI model to reference them in its responses.</p>
              </div>

              <ol class="relative text-gray-500 border-s border-gray-200 ml-4 mt-6">
                <li class="mb-10 ms-6">
                  <span class="absolute flex items-center justify-center w-8 h-8 bg-[lightsteelblue] text-[#151b1e] rounded-full -start-4 ring-4 ring-gray-100">
                  1
                  </span>
                  <h3 class="font-medium text-xl leading-tight">Idea #1</h3>
                  <p class="text-md mt-2">As a local on-device vector database (or several vector databases). Please see our original Oxford hackathon entry as an example.
                    <a href="https://github.com/onicai/onicaiGoes2024OxfordBH/blob/main/frontend/src/deaissemblyline_frontend/helpers/vector_database.ts" target="_blank" class="inline-flex items-center font-medium text-blue-600 hover:underline">
                      Oxford hackathon entry
                      <svg class="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                      </svg>
                    </a>
                  </p>
                  <p class="text-md my-4">
                    The codebase also includes code for this (where the user selects a PDF from their device that's then turned into a vector database for the AI to use).
                    <a href="https://github.com/patnorris/DecentralizedAIonIC/blob/3d6b8547dcd0d562203d62c1d1d5a260cce65316/src/DeVinci_frontend/components/ChatBox.svelte#L162" target="_blank" class="inline-flex items-center font-medium text-blue-600 hover:underline">
                      Check it here
                      <svg class="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                      </svg>
                    </a>
                  </p>
                  <p class="text-md">
                    You could also see if you find other on-device/in-browser database options or completely other approaches to accomplish this.
                  </p>
                </li>
                <li class="mb-10 ms-6">
                  <span class="absolute flex items-center justify-center w-8 h-8 bg-[lightsteelblue] text-[#151b1e] rounded-full -start-4 ring-4 ring-gray-100">
                  2
                  </span>
                  <h3 class="font-medium text-xl leading-tight">Idea #2</h3>
                  <p class="text-md my-4">
                   As an on-chain vector database (or several vector databases).
                    For an example, see this branch in the codebase:
                    <a href="https://github.com/patnorris/DecentralizedAIonIC/blob/firstUserKnowledgeBase/src/DeVinci_frontend/pages/Knowledgebase.svelte" target="_blank" class="inline-flex items-center font-medium text-blue-600 hover:underline">
                      Check it here
                      <svg class="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                      </svg>
                    </a>
                  </p>
                  <p class="text-md my-2">
                    This examples uses the Arcmind vector database the team implemented for the Internet Computer
                    <a href="https://github.com/arcmindai/arcmindvector" target="_blank" class="inline-flex items-center font-medium text-blue-600 hover:underline">
                      Check it here
                      <svg class="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                      </svg>
                    </a>
                  </p>
                  <p class="text-md my-2">
                    There are other vector database projects on the Internet Computer as well though that you could consider as options: <br />
                    <a href="https://github.com/ClankPan/ic-vectune/tree/develop/kinic_db_instance" target="_blank" class="inline-flex my-2 items-center font-medium text-blue-600 hover:underline">
                      From Kinic DAO
                      <svg class="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                      </svg>
                    </a>
                    <br />
                    <a href="https://github.com/elna-ai/elna-vector-db" target="_blank" class="inline-flex items-center font-medium text-blue-600 hover:underline">
                      From ELNA DAO
                      <svg class="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                      </svg>
                    </a>
                  </p>
                </li>
                <li class="mb-10 ms-6">
                  <span class="absolute flex items-center justify-center w-8 h-8 bg-[lightsteelblue] text-[#151b1e] rounded-full -start-4 ring-4 ring-gray-100">
                  3
                  </span>
                  <h3 class="font-medium text-xl leading-tight">Idea #3</h3>
                  <p class="text-md my-2">
                    As an off-chain vector database (or several vector databases). You could integrate these into the codebase at this line:
                    <a href="https://github.com/patnorris/DecentralizedAIonIC/blob/3d6b8547dcd0d562203d62c1d1d5a260cce65316/src/DeVinci_frontend/components/ChatInterface.svelte#L86" target="_blank" class="inline-flex items-center font-medium text-blue-600 hover:underline">
                      Check it here
                      <svg class="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                      </svg>
                    </a>
                  </p>
                </li>
                <li class="mb-10 ms-6">
                  <span class="absolute flex items-center justify-center w-8 h-8 bg-[lightsteelblue] text-[#151b1e] rounded-full -start-4 ring-4 ring-gray-100">
                  4
                  </span>
                  <h3 class="font-medium text-xl leading-tight">Idea #4</h3>
                  <p class="text-md my-2">
                    Find a completely different approach than using a vector database :)
                  </p>
                </li>
              </ol>
            </div>
          </div>
          <!-- On-device model selection -->
          <div class="border-b ">
            <input type="radio" name="accordion" id="accordion3" class="hidden">
            <label for="accordion3" class="block text-lg p-6 bg-[lightsteelblue] text-[#151b1e] font-medium cursor-pointer">
              On-device model selection
            </label>
            <div class="accordion-content overflow-hidden max-h-0 transition-all duration-500 ease">
              <div class="block p-6 bg-white border border-gray-200 rounded-lg shadow my-4">
                <p class="font-semibold text-lg text-gray-700"> These are some ideas to consider for the default large language model selection that's shown to users.</p>
              </div>

              <ol class="relative text-gray-500 border-s border-gray-200 ml-4 mt-6">
                <li class="mb-10 ms-6">
                  <span class="absolute flex items-center justify-center w-8 h-8 bg-[lightsteelblue] text-[#151b1e] rounded-full -start-4 ring-4 ring-gray-100">
                  1
                  </span>
                  <h3 class="font-medium text-xl leading-tight">Idea #1</h3>
                  <p class="text-md mt-2">Just show one LLM option to the user or several models to select from?</p>
                </li>
                <li class="mb-10 ms-6">
                  <span class="absolute flex items-center justify-center w-8 h-8 bg-[lightsteelblue] text-[#151b1e] rounded-full -start-4 ring-4 ring-gray-100">
                  2
                  </span>
                  <h3 class="font-medium text-xl leading-tight">Idea #2</h3>
                  <p class="text-md mt-2">Should there maybe be more background info provided to the user? Which info and how?</p>
                </li>
                <li class="mb-10 ms-6">
                  <span class="absolute flex items-center justify-center w-8 h-8 bg-[lightsteelblue] text-[#151b1e] rounded-full -start-4 ring-4 ring-gray-100">
                  3
                  </span>
                  <h3 class="font-medium text-xl leading-tight">Idea #3</h3>
                  <p class="text-md mt-2">You could create your own on-device LLM and integrate it (e.g. finetune an LLM specifically for this task).</p>
                  <p class="text-md mt-2">This is how you could go about integrating it into the app (which uses WebLLM as the framework for on-device AI models):</p>
                  <a href="https://github.com/mlc-ai/web-llm?tab=readme-ov-file#custom-models" target="_blank" class="inline-flex items-center font-medium text-blue-600 hover:underline">
                    Check it here
                    <svg class="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                  </a>
                </li>
              </ol>
            </div>
          </div>
          <!-- Replace the on-device model -->
          <div class="border-b ">
            <input type="radio" name="accordion" id="accordion4" class="hidden">
            <label for="accordion4" class="block text-lg p-6 bg-[lightsteelblue] text-[#151b1e] font-medium cursor-pointer">
              Replace the on-device model
            </label>
            <div class="accordion-content overflow-hidden max-h-0 transition-all duration-500 ease">
              <div class="block p-6 bg-white border border-gray-200 rounded-lg shadow my-4">
                <p class="font-semibold text-lg text-gray-700">
                  The provided codebase uses the on-device AI model approach to deliver the experience. You might want to consider another approach and these are some ideas on options besides on-device.
                </p>
              </div>

              <ol class="relative text-gray-500 border-s border-gray-200 ml-4 mt-6">
                <li class="mb-10 ms-6">
                  <span class="absolute flex items-center justify-center w-8 h-8 bg-[lightsteelblue] text-[#151b1e] rounded-full -start-4 ring-4 ring-gray-100">
                  1
                  </span>
                  <h3 class="font-medium text-xl leading-tight">Idea #1</h3>
                  <p class="text-md mt-2">Replace with an on-chain model: take a look at the following LLMs that run on the Internet Computer.
                    <br />
                    <a href="https://github.com/onicai/llama_cpp_canister" target="_blank" class="inline-flex items-center font-medium text-blue-600 hover:underline">
                      llama.cpp
                      <svg class="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                      </svg>
                    </a>
                    <br />
                    <a href="https://github.com/gip/yllama.oc" target="_blank" class="inline-flex items-center font-medium text-blue-600 hover:underline">
                      Llama 3
                      <svg class="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                      </svg>
                    </a>
                    <br />
                    <a href="https://github.com/modclub-app/tract-ic-ai" target="_blank" class="inline-flex items-center font-medium text-blue-600 hover:underline">
                      Tract toolkit
                      <svg class="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                      </svg>
                    </a>
                    <br />
                    <a href="https://github.com/modclub-app/rust-connect-py-ai-to-ic" target="_blank" class="inline-flex items-center font-medium text-blue-600 hover:underline">
                      Rust framework for Python models
                      <svg class="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                      </svg>
                    </a>
                  </p>
                </li>
                <li class="mb-10 ms-6">
                  <span class="absolute flex items-center justify-center w-8 h-8 bg-[lightsteelblue] text-[#151b1e] rounded-full -start-4 ring-4 ring-gray-100">
                  2
                  </span>
                  <h3 class="font-medium text-xl leading-tight">Idea #2</h3>
                  <p class="text-md mt-2">
                    Replace with an off-chain model: there are some examples on the Internet Computer that integrate AI services APIs.
                    <br />
                    <a href="https://github.com/peterpeterparker/juno-openai" target="_blank" class="inline-flex items-center font-medium text-blue-600 hover:underline">
                      Juno
                      <svg class="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                      </svg>
                    </a>
                    <br />
                    <a href="https://github.com/arcmindai/arcmindai/tree/main/src/arcmindai_brain" target="_blank" class="inline-flex items-center font-medium text-blue-600 hover:underline">
                      Arcmind
                      <svg class="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                      </svg>
                    </a>
                    <br />
                    <a href="https://github.com/elna-ai/ELNA-DApp/blob/main/elnaAi/ChatAi.mo" target="_blank" class="inline-flex items-center font-medium text-blue-600 hover:underline">
                      Elna
                      <svg class="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                      </svg>
                    </a>
                  </p>
                </li>
              </ol>
            </div>


          </div>
          <!-- Improve the UX -->
          <div class="border-b ">
            <input type="radio" name="accordion" id="accordion5" class="hidden">
            <label for="accordion5" class="block text-lg p-6 bg-[lightsteelblue] text-[#151b1e] font-medium cursor-pointer">
              Improve the UX
            </label>
            <div class="accordion-content overflow-hidden max-h-0 transition-all duration-500 ease">
              <div class="block p-6 bg-white border border-gray-200 rounded-lg shadow my-4">
                <p class="font-semibold text-lg text-gray-700"> These are some general ideas what you could do to give users and learners a better experience with the app.</p>
                <p class="font-normal text-md mt-2 text-gray-700"> You could e.g. redesign the chat flow, change the User Interface or parts of it, or update the info displayed to the user.
                 There might also be completely new features you want to implement to enhance the experience.</p>
              </div>
            </div>
          </div>
          <!-- Issue a PR -->
          <div class="border-b ">
            <input type="radio" name="accordion" id="accordion6" class="hidden">
            <label for="accordion6" class="block text-lg p-6 bg-[lightsteelblue] text-[#151b1e] font-medium cursor-pointer">
              Issue a PR
            </label>
            <div class="accordion-content overflow-hidden max-h-0 transition-all duration-500 ease">
              <div class="block p-6 bg-white border border-gray-200 rounded-lg shadow my-4">
                <p class="font-semibold text-xl text-gray-600">
                  As part of the hackathon, we'd like to have your entry included on an overview page (along your peers' entries). This will be a fun outcome!
                </p>
                <p class="font-normal text-lg text-gray-700">
                  This describes the simple process to show your hackathon entry on the overview page.
                  Issue a PR to the repo such that your experience shows on the
                  <a href="#" target="_blank" class="inline-flex items-center font-medium text-blue-600 hover:underline">
                    [overview page]
                    <svg class="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                  </a>
                </p>
              </div>

              <div class="block p-6 bg-white border border-gray-200 rounded-lg shadow my-4">
                <p class="font-semibold text-lg text-gray-700">
                  Your PR should only include a new entry in the array for the experiences here:
                  <a href="#" target="_blank" class="inline-flex items-center font-medium text-blue-600 hover:underline">
                    [link]
                    <svg class="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                  </a>
                </p>


                <p class="font-normal text-lg text-gray-700">
                  Please take a look at the existing entries in the array to get an idea of your entry's format and at the type definition for explanations on each of the field.
                </p>
              </div>
                <div class="block p-6 bg-white border border-gray-200 rounded-lg shadow my-4">


                <p class="font-semibold text-lg mb-2 text-gray-700">
                  Each entry should look like this example:
                </p>
                  <div class="max-w-screen-xl">
                   <pre class="bg-gray-100 p-4 rounded border border-gray-300 overflow-x-auto">
<code>
id = "oxford";
title = "Oxford Hackathon Entry";
creator = "Arjaan & Patrick";
shortDescription = "This was the entry we put in at the Oxford hackathon";
longDescription = "Your long decription goes here.";
note = "Give it a try and think about how to improve it :)";
isStandaloneApp = true;
standaloneAppUrl = "https://6tht4-syaaa-aaaai-acriq-cai.icp0.io/#/learn";
experienceType = null;
aiModelIdentifier = null;
databaseToInclude = #None;
databaseIdentifier = null;
</code>
                  </pre>
                    <p class="mt-4">
                      <span class="bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded">isStandaloneApp</span>should be true and
                      <span class="bg-purple-100 text-purple-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded mb-2">standaloneAppUrl</span>
                      should point to your deployed app.<br /><br />
                      The fields
                      <span class="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded">experienceType</span>
                      <span class="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded">aiModelIdentifier</span>
                      <span class="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded">databaseToInclude</span> and
                      <span class="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded">databaseIdentifier</span>
                      can be ignored (just use the same values as in the examples).
                    </p>
                </div>
              </div>
            </div>
          </div>
        </div>

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

  .accordion-content {
	  max-height: 0;
	  transition: max-height 0.5s ease;
  }
</style>





