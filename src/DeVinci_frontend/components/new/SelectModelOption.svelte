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
  <input type="radio" id={id} name="selectModel" value={value} class="hidden peer" on:click={() => callbackLoadChatModel(id)} />
  <label for={id} class="inline-flex items-center justify-between w-full p-3 text-[#151b1e] bg-[#e5ddd4] border-2 border-[#151b1e] rounded-lg cursor-pointer peer-checked:cursor-default peer-checked:bg-gray-100 peer-checked:border-[#f9c490] peer-checked:text-[#151b1e] hover:text-gray-600 hover:bg-gray-100">
    <div class="block">
      <div class="w-full text-[#151b1e] text-md font-semibold">{name}</div>
      <div class="w-full text-sm font-normal">{parameters}</div>
      <span class="text-[#151b1e] text-xs font-medium me-2 px-2.5 py-0.5 bg-[#f9c490] rounded border-2 border-[#151b1e]">{performance}</span>
      <span class="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-gray-500">{size}</span>
    </div>
    <svg class="w-5 h-5 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
    </svg>
  </label>
</li>

<style>
	.peer:checked + label svg {
		color: rgb(243, 244, 246);
	}
</style>
