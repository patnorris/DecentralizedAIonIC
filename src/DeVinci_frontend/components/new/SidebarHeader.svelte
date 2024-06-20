<script>
  import newchaticon from "/newchat.svg";
  import devincilogo from "/devinci-logo.svg";

</script>

<div class="flex flex-col justify-center w-full items-center">
  <a href="#/devinci">
      <img src={devincilogo} class="w-14 h-14 p-0 bg-gray-100 rounded-full" alt="devinci logo" />
  </a>
  <button type="button" class="mr-auto  mt-5 flex text-gray-800 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-full text-xs px-3 py-1.5 text-center mb-1">
<!--      <img src={newchaticon} class="w-5 mr-1 p-0 rounded-full" alt="new chat" />-->
      New chat
  </button>

  <!--
  --- Show when user is logged and has saved chats
  -->
  <ul class="flex flex-col w-full">
    <li class="relative group hover:bg-gray-400">
      <a href="#" class="truncate bg-gray-200 flex flex-row items-center text-xs p-1.5 rounded-lg text-gray-500 w-full">
        Consider the ethical implications and potential benefits
      </a>
      <button class="delete-btn hidden absolute right-3.5 transform translate-x-1/2 -translate-y-1/2 top-1/2 bg-gray-500 hover:bg-red-600 text-white text-xs p-1.5 rounded-l">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4" viewBox="0 -960 960 960" fill="#ffffff"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/></svg>
      </button>
    </li>
    <li class="relative group hover:bg-gray-400">
      <a href="#" class="truncate bg-gray-200 flex flex-row items-center text-xs p-1.5 rounded-lg text-gray-500 w-full">
        Discuss how globalization is impacting cultural
      </a>
      <button class="delete-btn hidden absolute right-3.5 transform translate-x-1/2 -translate-y-1/2 top-1/2 bg-gray-500 hover:bg-red-600 text-white text-xs p-1.5 rounded-l">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4" viewBox="0 -960 960 960" fill="#ffffff"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/></svg>
      </button>
    </li>
    <li class="relative group hover:bg-gray-400">
      <a href="#" class="truncate bg-gray-200 flex flex-row items-center text-xs p-1.5 rounded-lg text-gray-500 w-full">
        Talk about the latest developments in space exploration
      </a>
      <button class="delete-btn hidden absolute right-3.5 transform translate-x-1/2 -translate-y-1/2 top-1/2 bg-gray-500 hover:bg-red-600 text-white text-xs p-1.5 rounded-l">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4" viewBox="0 -960 960 960" fill="#ffffff"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/></svg>
      </button>
    </li>
  </ul>
</div>

<style>
	.group:hover .delete-btn {
		display: flex;
	}
</style>
