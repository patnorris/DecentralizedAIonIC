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

<div id="accordion-collapse" data-accordion="collapse" class="p-4 m-4 text-[#151b1e] bg-gray-100 border-2 border-dotted border-[#151b1e] rounded-lg">
  <h2 id="accordion-collapse-heading-1" class="text-lg font-medium text-[#151b1e]">
    <button type="button" class="flex items-center justify-between w-full py-4 font-medium rtl:text-right text-[#151b1e] rounded-t-xl" data-accordion-target="#accordion-collapse-body-1" aria-expanded="true" aria-controls="accordion-collapse-body-1">
      <div class="text-left">
        <span>Deploy data in your own canister.</span>
        <p class="mt-4 mr-4 text-sm">
          Similarly to a shared server your data is on a shared canister. <br />This option enables you to hold your data on a dedicated canister.
        </p>
      </div>
      <label data-accordion-icon class="inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" class="sr-only peer">
        <div class="relative w-11 h-6 bg-gray-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </button>
  </h2>
  <div id="accordion-collapse-body-1" class="hidden" aria-labelledby="accordion-collapse-heading-1">
    <hr class="w-full h-0.5 mx-auto my-4 bg-gray-200 border-0 rounded md:my-4">
    <ol class="relative text-gray-500 border-s border-gray-200">
      <li class="mb-10 ms-6 mt-8">
        <span class="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white">
            <svg class="w-3.5 h-3.5 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z"/>
            </svg>
        </span>
        <h3 class="font-medium leading-tight">Step 1</h3>
        <p class="text-sm">Step details here</p>
      </li>
      <li class="mb-10 ms-6">
        <span class="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white">
            <svg class="w-3.5 h-3.5 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
            </svg>
        </span>
        <h3 class="font-medium leading-tight">Step 2</h3>
        <p class="text-sm">Step details here</p>
      </li>
      <li class="ms-6">
        <span class="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -start-4 ring-4 ring-white">
            <svg class="w-3.5 h-3.5 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z"/>
            </svg>
        </span>
        <h3 class="font-medium leading-tight">Step 3</h3>
        <p class="text-sm">Step details here</p>
      </li>
    </ol>

  </div>
</div>
