<script lang="ts">
  import { onMount } from 'svelte';

  onMount(() => {
    const checkbox = document.querySelector<HTMLInputElement>('[data-accordion-icon] input[type="checkbox"]');
    const accordionContent = document.querySelector<HTMLDivElement>('#accordion-collapse-body-1');
    const button = document.querySelector<HTMLButtonElement>('[data-accordion-target="#accordion-collapse-body-1"]');

    if (checkbox && accordionContent && button) {
      checkbox.addEventListener('change', () => {
        const isChecked = checkbox.checked;

        // Toggle the aria-expanded attribute
        button.setAttribute('aria-expanded', isChecked.toString());

        // Toggle the visibility of the content
        if (isChecked) {
          accordionContent.classList.remove('hidden');
        } else {
          accordionContent.classList.add('hidden');
        }
      });
    }
  });
</script>

<div id="accordion-collapse" data-accordion="collapse" class="p-4 m-4 text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50">
  <h2 id="accordion-collapse-heading-1">
    <button type="button" class="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 rounded-t-xl" data-accordion-target="#accordion-collapse-body-1" aria-expanded="true" aria-controls="accordion-collapse-body-1">
      <span>Deploy data in your own canister.</span>
      <label data-accordion-icon class="inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" class="sr-only peer">
        <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </button>
  </h2>
  <div id="accordion-collapse-body-1" class="hidden" aria-labelledby="accordion-collapse-heading-1">
    <div class="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
      <p class="mb-2 text-gray-500 dark:text-gray-400">hello</p>
      <p class="text-gray-500 dark:text-gray-400">world</p>
    </div>
  </div>
</div>
