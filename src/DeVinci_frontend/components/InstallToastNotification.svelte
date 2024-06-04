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
  <div class="toast">
    <p>This app can be installed and used offline!</p>
    <button on:click={installPWA}>Install</button>
  </div>
{/if}

<style>
  .toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    background-color: #323232;
    color: white;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    z-index: 1000;
  }

  .toast p {
    margin: 0;
    padding-right: 10px;
  }

  button {
    border: none;
    padding: 10px 15px;
    background-color: #f0f0f0;
    cursor: pointer;
    border-radius: 4px;
  }

  button:hover {
    background-color: #e8e8e8;
  }
</style>