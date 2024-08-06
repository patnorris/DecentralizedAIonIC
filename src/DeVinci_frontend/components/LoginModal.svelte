<script lang="ts">
  import { onMount } from 'svelte';

  import InternetIdentityButton from "./InternetIdentityButton.svelte";
  import NfidButton from "./NfidButton.svelte";
  import BitfinityButton from "./BitfinityButton.svelte";
  import PlugButton from "./PlugButton.svelte";

  export let toggleModal;

  let loading = ""; // this allows us to disable all buttons if one of them is clicked

  // Main function to initialize modal functionality
  const initializeModal = () => {
    const modal = document.getElementById('crypto-modal');
    // Add event listener to close the modal when clicking outside of it
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        toggleModal();
      };
    });

    // Close modal on 'Escape' key press
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        toggleModal();
      };
    });
  };

  onMount(() => {
    initializeModal();
  });
</script>

<div id="crypto-modal" tabindex="-1" aria-hidden="true" class="bg-gray-900/[.36] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full">
  <div class="relative p-4 w-full mx-auto flex items-center content-center max-w-sm max-h-full h-full">
    <!-- Modal content -->
    <div class="relative bg-[lightsteelblue] rounded-lg shadow">
      <!-- Modal header -->
      <div class="flex items-center justify-between p-4 pb-0 rounded-t">
        <h3 class="text-lg font-semibold text-[#151b1e]">
          Connect wallet
        </h3>
        <button type="button" on:click={() => {toggleModal()}} class="close-modal-button bg-blue-50 inline-flex justify-center items-center text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-400 p-1 hover:bg-blue-200 hover:text-gray-900 text-sm h-8 w-8 ms-auto" data-modal-toggle="crypto-modal">
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>
      <!-- Modal body -->
      <div class="p-4 md:p-5">
        <p class="text-sm font-normal text-[#151b1e]">Connect with one of our available wallet providers.</p>
        <ul class="my-4 space-y-3">
          <li>
            <InternetIdentityButton bind:loading {toggleModal} />
          </li>
          <li>
            <NfidButton bind:loading {toggleModal} />
          </li>
          <li>
            <BitfinityButton bind:loading {toggleModal} />
          </li>
          <li>
            <PlugButton bind:loading {toggleModal} />
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
