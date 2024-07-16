<script>
  import { onMount } from 'svelte';

  // Function to hide the alert
  function closeAlert() {
    const alertElement = document.getElementById('dropdown-cta');
    if (alertElement) {
      alertElement.style.display = 'none';
    }
  }

  onMount(() => {
    const closeButton = document.getElementById('close-button');
    if (closeButton) {
      closeButton.addEventListener('click', closeAlert);
    }
  });
</script>

<div class="mt-auto w-full">
  <!--
  --- Show if user is not logged
  -->
  <div id="dropdown-cta" class="p-4 mr-3 mb-4 absolute bottom-0 rounded-lg bg-[#e5ddd4] border-2 border-[#151b1e]" role="alert">
    <div class="flex items-center mb-3">
      <span class="bg-orange-100 text-orange-800 text-sm font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-orange-200 dark:text-orange-900">Which model to choose?</span>
      <button id="close-button" type="button" class="ms-auto -mx-1.5 -my-1.5 bg-blue-50 inline-flex justify-center items-center w-6 h-6 text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-400 p-1 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800" data-dismiss-target="#dropdown-cta" aria-label="Close">
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
      <span class="bg-orange-100 text-orange-800 text-sm font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-orange-200 dark:text-orange-900">Privacy</span>
    </div>
    <p class="mb-3 text-sm text-[#151b1e]">
      DeVinci values your privacy. You can use it without logging in, and we won't save any of your chats. To privately save chats please login.
    </p>
  </div>

</div>
