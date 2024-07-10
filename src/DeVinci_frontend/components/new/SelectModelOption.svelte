<script>
  export let id;
  export let name;
  export let value;
  export let title;
  export let parameters;
  export let performance;
  export let size;
  export let callbackLoadChatModel;
</script>

<li>
  <input type="radio" id={id} name={name} value={value} class="hidden peer" on:click={() => callbackLoadChatModel(id)} />
  <label for={id} class="inline-flex items-center justify-between w-full p-3 text-gray-400 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
    <div class="block">
      <div class="w-full text-gray-500 text-md font-semibold">{name}</div>
      <div class="w-full text-sm font-normal">{parameters}</div>
      <span class="text-blue-400 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">{performance}</span>
      <span class="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400 border border-gray-500">{size}</span>
    </div>
    <svg class="w-5 h-5 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
    </svg>
  </label>
</li>
