<script>
  import { onMount } from 'svelte';
  import {
    installAppDeferredPrompt
  } from "../store";

  let deferredPrompt;
  installAppDeferredPrompt.subscribe((value) => deferredPrompt = value); // needed to persist the prompt across reloads of this component

  let showToast = true; // Notify the user they can install the PWA

  onMount(() => {
    console.log("in onMount");
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log("in beforeinstallprompt");
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      $installAppDeferredPrompt = e;
    });

    window.addEventListener('appinstalled', () => {
      // Hide the app-provided install promotion
      showToast = false;
      console.log('PWA was installed');
    });
  });

  async function installPWA() {
    console.log("in installPWA");
    console.log(deferredPrompt);
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      };
      deferredPrompt = null;
    };
  };
</script>

{#if showToast}
  <div class="toast flex items-center w-full max-w-md p-8 text-[#151b1e] bg-[lightsteelblue] rounded-lg shadow" role="alert">
    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clip-rule="evenodd"/>
    </svg>

    <div class="ms-3 text-md font-normal">This app can be installed and used offline.</div>
    <button on:click={installPWA} type="button" class="bg-blue-50 rounded-lg focus:ring-2 focus:ring-blue-400 py-1.5 px-4 hover:bg-[#151b1e] hover:text-white ml-2 border-2 border-solid border-[#151b1e] text-sm font-medium text-[#151b1e] inline-flex items-center justify-center">
      Install
    </button>
  </div>
{/if}

<style>
  .toast {
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 1000;
  }
</style>
