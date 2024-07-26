<script lang="ts">
  import Sidebar from "../components/new/Sidebar.svelte";
  import Navigation from "../components/new/Navigation.svelte";
  import Newsletter from "../components/Newsletter.svelte";

  import { onMount } from 'svelte';

  import devincilogo from "/devinci.svg";
  import devincilogosvgdownload from "/devinci.zip?url";
  import devincilogopngdownload from "/devinci.png.zip?url";

  onMount(() => {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const chat = document.getElementById('chat');

    function toggleSidebar(event) {
      event.stopPropagation();
      chat.classList.toggle('-translate-x-full');
    }

    function closeSidebar(event) {
      if (!chat.contains(event.target) && !sidebarToggle.contains(event.target)) {
        chat.classList.add('-translate-x-full');
      }
    }

    function stopPropagation(event) {
      event.stopPropagation();
    }

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

    <main class="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-slate-100 dark:bg-gray-900 antialiased">
      <div class="flex justify-between px-4 mx-auto max-w-screen-xl ">
        <article class="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue">
          <header class="mb-4 lg:mb-6 not-format">
            <!-- Breadcrumb -->
            <nav class="justify-between mb-8 px-4 py-3 text-gray-700 border border-gray-200 rounded-lg sm:flex sm:px-5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700" aria-label="Breadcrumb">
              <ol class="inline-flex items-center mb-3 space-x-1 md:space-x-2 rtl:space-x-reverse sm:mb-0">
                <li>
                  <div class="flex items-center">
                    <a href="/" class="ms-1 text-sm font-medium text-gray-700 hover:text-gray-400 md:ms-2">Home</a>
                  </div>
                </li>
                <li aria-current="page">
                  <div class="flex items-center">
                    <svg class="rtl:rotate-180 w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <a href="#" class="cursor-not-allowed text-gray-400 ms-1 text-sm font-medium">Brand</a>
                  </div>
                </li>
              </ol>
            </nav>
          </header>
          <h1 class="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">Logo</h1>
          <div class="w-full mx-auto">
            <img class="h-1/3 w-1/3 rounded-full mx-auto" src={devincilogo} alt="deVinci logo">
            <div class="mt-12 flex justify-center">
              <a href="{devincilogosvgdownload}" download class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Download SVG</a>
              <a href="{devincilogopngdownload}" download  class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Download PNG</a>
            </div>
          </div>
          <h1 class="my-14 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">Color codification</h1>
          <h1 class="my-14 text-xl font-extrabold leading-tight text-gray-700 lg:mb-6 lg:text-3xl dark:text-white">Primary colors</h1>
          
          <div class="flex flex-col items-center bg-white mb-2 border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 ">
            <div class="bg-[#b0c4de] h-40 w-40"></div>
            <div class="flex flex-col justify-between p-4 leading-normal">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-700">#b0c4de</h5>
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-700">rgb(176,196,222)</h5>
            </div>
          </div>

          <div class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100">
            <div class="bg-[#151b1e] h-40 w-40"></div>
            <div class="flex flex-col justify-between p-4 leading-normal">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-700">#151b1e</h5>
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-700">rgb(21,27,30)</h5>
            </div>
          </div>


        </article>
      </div>
    </main>

<!--    <Newsletter />-->

  </main>
</div>

<style global>
	.footer {
		background: rgba(255,255,255,1);
		padding-top: 10px;
	}
</style>




