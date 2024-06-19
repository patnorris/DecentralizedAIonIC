<script lang="ts">
  import { onMount } from 'svelte';

  // Function to open the modal
  const openModal = (modal: HTMLElement) => {
    modal.classList.remove('hidden');
  };

  // Function to close the modal
  const closeModal = (modal: HTMLElement) => {
    modal.classList.add('hidden');
  };

  // Main function to initialize modal functionality
  const initializeModal = () => {
    const modal = document.getElementById('crypto-modal');
    const button = document.querySelector('[data-modal-toggle="crypto-modal"]');

    if (modal && button) {
      // Add event listener to the button to open the modal
      button.addEventListener('click', () => openModal(modal));

      // Add event listener to close the modal when clicking outside of it
      window.addEventListener('click', (event) => {
        if (event.target === modal) {
          closeModal(modal);
        }
      });

      // Close modal on 'Escape' key press
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          closeModal(modal);
        }
      });

      // Optional: Close modal on 'X' button click inside the modal
      const closeButton = modal.querySelector('.close-modal-button');
      if (closeButton) {
        closeButton.addEventListener('click', () => closeModal(modal));
      }
    }
  };

  // Function to initialize dropdown functionality
  const initializeDropdown = () => {
    const dropdownMenuIconButton = document.getElementById('dropdownMenuIconButton');
    const dropdownDots = document.getElementById('dropdownDots');

    if (dropdownMenuIconButton && dropdownDots) {
      dropdownMenuIconButton.addEventListener('click', function (event) {
        event.stopPropagation();
        console.log('Dropdown button clicked');
        dropdownDots.classList.toggle('hidden');
      });

      document.body.addEventListener('click', function (event) {
        if (!dropdownDots.contains(event.target) && !dropdownMenuIconButton.contains(event.target)) {
          if (!dropdownDots.classList.contains('hidden')) {
            console.log('Clicked outside dropdown');
            dropdownDots.classList.add('hidden');
          }
        }
      });

      dropdownDots.addEventListener('click', function (event) {
        event.stopPropagation();
      });
    }
  };

  onMount(() => {
    initializeModal();
    initializeDropdown();
  });
</script>


<button type="button" data-modal-target="crypto-modal" data-modal-toggle="crypto-modal" class="mr-1 text-gray-900 bg-gray-100 hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center">
  <svg aria-hidden="true" class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
  Connect
</button>


<div class="relative inline-block">
  <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" class="inline-flex items-center p-2.5 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100" type="button">
    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
      <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
    </svg>
  </button>

  <!-- Dropdown menu -->
  <div id="dropdownDots" class="absolute right-0 top-14 z-10 hidden bg-gray-100 divide-y divide-gray-200 rounded-lg shadow-2xl w-52 border-gray-200 border-4">
    <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
      <li>
        <a href="#/about" class="block px-4 py-2 hover:bg-white">About</a>
      </li>
      <li>
        <a href="#/settings" class="block px-4 py-2 hover:bg-white">Settings</a>
      </li>
    </ul>
    <div>
      <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-white">Install app</a>
    </div>
    <div>
      <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-white">Disconnect</a>
    </div>
  </div>
</div>

<!-- Main modal -->
<div id="crypto-modal" tabindex="-1" aria-hidden="true" class="hidden bg-gray-900/[.36] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full">
  <div class="relative p-4 w-full mx-auto flex items-center content-center max-w-sm max-h-full h-full">
    <!-- Modal content -->
    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
      <!-- Modal header -->
      <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Connect wallet
        </h3>
        <button type="button" class="close-modal-button text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crypto-modal">
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
      </div>
      <!-- Modal body -->
      <div class="p-4 md:p-5">
        <p class="text-sm font-normal text-gray-500 dark:text-gray-400">Connect with one of our available wallet providers.</p>
        <ul class="my-4 space-y-3">
          <li>
            <a href="#" class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
              <img class="h-3" src="../../src/DeVinci_frontend/assets/internet-computer.svg"  alt="ic wallet" />
              <span class="flex-1 ms-3 whitespace-nowrap">Internet Identity</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
              <img class="h-5" src="../../src/DeVinci_frontend/assets/nfid.webp"  alt="nfid wallet" />
              <span class="flex-1 ms-3 whitespace-nowrap">NFID (incl. Google)</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
              <img class="h-5" src="../../src/DeVinci_frontend/assets/bitfinity.svg"  alt="bitfinity wallet" />
              <span class="flex-1 ms-3 whitespace-nowrap">Bitfinity</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
              <img class="h-6" src="../../src/DeVinci_frontend/assets/plug.webp"  alt="plug wallet" />
              <span class="flex-1 ms-3 whitespace-nowrap">Plug</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>


<style>
</style>
