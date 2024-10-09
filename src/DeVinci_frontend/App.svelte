<script lang="ts">
  import Router from "svelte-spa-router";
  import { onMount } from "svelte";
  import { store } from "./store";

  import { deviceType, supportsWebGpu } from "./store";

  import UnsupportedBrowserBanner from "./components/UnsupportedBrowserBanner.svelte";
  import UnsupportedDeviceBanner from "./components/UnsupportedDeviceBanner.svelte";

  // import UserChatsOverview from "./pages/UserChatsOverview.svelte";

  import Sidebar from "./components/Sidebar.svelte";
  import Navigation from "./components/Navigation.svelte";
  import Breadcrumbs from "./components/Breadcrumbs.svelte";
  import Footer from "./components/Footer.svelte";

  import UserSettings from "./pages/UserSettings.svelte";
  import About from "./pages/About.svelte";
  import Brand from "./pages/Brand.svelte";
  import NotFound from "./pages/NotFound.svelte";
  import deVinci from "./pages/deVinci.svelte";
  import Models from "./pages/Models.svelte";

  import { syncLocalChanges } from "./helpers/local_storage";

  const routes = {
    // Exact path (with /# in front of route, e.g. .../#/about)
    "/": deVinci,
    //"/mychats": UserChatsOverview, TODO
    "/settings": UserSettings,
    "/about": About,
    "/brand": Brand,
    "/models": Models,
    // Catch-all (this is optional, but if present it must be the last)
    "*": NotFound,
  };

  onMount(async () => {
    // Check login state
    await store.checkExistingLoginAndConnect();
    if ($store.isAuthed) {
      syncLocalChanges(); // Sync any local changes (from offline usage), only works if back online
    };
  });
</script>

<div class="App">
    {#if !(deviceType === 'desktop' || deviceType === 'Android')}
    <UnsupportedDeviceBanner />
    {:else if !supportsWebGpu}
    <UnsupportedBrowserBanner />
    {:else}
    <div class="flex flex-row h-screen">
      <aside id="chat" class="fixed z-50 bg-gray-200 w-72 min-w-72 h-full md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in">
        <div class="sidebar-content p-4 pt-0 h-full overflow-hidden">
          <Sidebar />
        </div>
      </aside>
      <main class="main flex flex-col flex-grow ml-0 md:ml-72 transition-all duration-150 ease-in">
        <header class="header bg-white shadow py-2 px-4">
          <div class="header-content flex items-center flex-row">
            <button id="sidebarToggle" data-drawer-target="chat" data-drawer-toggle="chat" aria-controls="chat" type="button" class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
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
        <Breadcrumbs />
        <Router {routes} />
        <Footer />
      </main>
    </div>
    {/if}
</div>
