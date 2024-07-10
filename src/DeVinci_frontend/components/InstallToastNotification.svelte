<script>
  import { onMount } from 'svelte';

  let deferredPrompt;
  let showToast = false;

  onMount(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
      // Update UI notify the user they can install the PWA
      showToast = true;
    });

    window.addEventListener('appinstalled', () => {
      // Hide the app-provided install promotion
      showToast = false;
      console.log('PWA was installed');
    });
  });

  async function installPWA() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      if (outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    }
  }
</script>

{#if showToast}
  <div class="toast flex items-center w-full max-w-xs p-4 text-gray-500 bg-gray-100 rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
      <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.147 15.085a7.159 7.159 0 0 1-6.189 3.307A6.713 6.713 0 0 1 3.1 15.444c-2.679-4.513.287-8.737.888-9.548A4.373 4.373 0 0 0 5 1.608c1.287.953 6.445 3.218 5.537 10.5 1.5-1.122 2.706-3.01 2.853-6.14 1.433 1.049 3.993 5.395 1.757 9.117Z"/>
      </svg>
      <span class="sr-only">Fire icon</span>
    </div>
    <div class="ms-3 text-sm font-normal">This app can be installed and used offline!</div>
    <button on:click={installPWA} type="button" class="bg-gray-400 ml-2 text-sm text-gray-100 p-1.5 hover:bg-gray-400 hover:text-gray-600 rounded-lg focus:ring-2 focus:ring-gray-300 inline-flex items-center justify-center">
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
