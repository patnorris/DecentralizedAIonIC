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
  <div id="dropdown-cta" class="p-4 mb-16 text-[#151b1e] border-2 border-dotted border-[#151b1e] rounded-2xl bg-[lightsteelblue]" role="alert">
    <div class="flex items-center mb-3">
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

      <span class="text-lg font-medium">Privacy</span>
    </div>
    <p class="mb-3 text-sm text-[#151b1e]">
      DeVinci values your privacy. You can use it without logging in, and we won't save any of your chats. To privately save chats please login.
    </p>
  </div>
</div>
