<script>
  // Function to hide the alert
  function closeAlert() {
    const alertElement = document.getElementById('dropdown-cta');
    if (alertElement) {
      alertElement.style.display = 'none';
    };
  };
</script>

<div class="mt-auto w-full">
  <div id="dropdown-cta" class="p-4 mb-4 text-[#151b1e] border-2 border-dotted border-[#151b1e] rounded-2xl bg-[lightsteelblue]" role="alert">
    <div class="flex items-center mb-3">
      <svg class="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
      </svg>
      <span class="sr-only">Info</span>
      <span class="text-lg font-medium">Which model?</span>

      <button id="close-button" type="button" on:click={closeAlert} class="ms-auto -mx-1.5 -my-1.5 bg-blue-50 inline-flex justify-center items-center w-6 h-6 text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-400 p-1 hover:bg-blue-200" data-dismiss-target="#dropdown-cta" aria-label="Close">
        <span class="sr-only">Close</span>
        <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
      </button>
    </div>
    <p class="mb-3 text-sm text-[#151b1e]">
      Big models need significant computational resources, so if you're using a desktop computer, consider starting with a smaller model. You can always scale up if your machine can handle it.
    </p>

    <div class="flex items-center mb-3">
      <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clip-rule="evenodd"/>
      </svg>

      <span class="text-lg font-medium">Privacy</span>
    </div>
    <p class="mb-3 text-sm text-[#151b1e]">
      DeVinci values your privacy. You can use it without logging in, and we won't save any of your chats. To privately save chats please login.
    </p>
  </div>
</div>
