<script lang="ts">

</script>

<form class="w-full max-w-xl mx-auto">
  <label for="chat" class="sr-only">Message deVinci</label>
  <div class="flex items-center px-3 p-2 rounded-full bg-gray-200">
    <label for="pdf_chat">
      <button type="button" class="inline-flex justify-center p-2 mr-1 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z"/></svg>
      </button>
    </label>
    <input class="hidden text-sm text-gray-900 border border-gray-300 cursor-pointer bg-gray-50 ml-2" id="pdf_chat" type="file">
    <input type="text" id="chat" autofocus rows="1" class="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:outline-none focus:ring-[#24292F]/50 " placeholder="Message deVinci..." />
    <button type="submit" class="inline-flex justify-center p-2 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100 dark:text-blue-500 dark:hover:bg-gray-600">
      <svg class="w-5 h-5 rotate-0 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
        <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
      </svg>
      <span class="sr-only">Send message</span>
    </button>
  </div>
</form>


<style>
</style>
