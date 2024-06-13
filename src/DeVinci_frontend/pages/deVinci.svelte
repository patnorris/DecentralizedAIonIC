<script lang="ts">
  import ChatInput from "../components/new/ChatInput.svelte";
  import SelectModel from "../components/new/SelectModel.svelte";
  import MyChats from "../components/new/MyChats.svelte";
  import Login from "../components/new/Login.svelte";


  document.addEventListener('DOMContentLoaded', function () {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const chat = document.getElementById('chat');

    sidebarToggle.addEventListener('click', function (event) {
      event.stopPropagation();
      chat.classList.toggle('-translate-x-full');
    });

    document.body.addEventListener('click', function (event) {
      if (!chat.contains(event.target) && !sidebarToggle.contains(event.target)) {
        chat.classList.add('-translate-x-full');
      }
    });

    chat.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  });

</script>

<div class="flex flex-row">
  <aside id="chat" class="bg-gray-200 w-64 min-w-64 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in" >
    <div class="sidebar-content px-4">
      <MyChats />
    </div>
  </aside>
  <main class="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
    <header class="header bg-white shadow py-2 px-4">
      <div class="header-content flex items-center flex-row">
        <button id="sidebarToggle"  data-drawer-target="chat" data-drawer-toggle="chat" aria-controls="chat" type="button" class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
          <span class="sr-only">Open sidebar</span>
          <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
          </svg>
        </button>
        <div class="flex ml-auto">
            <Login />
        </div>
      </div>
    </header>
    <div class="flex flex-col flex-grow p-4">
        <SelectModel />
    </div>
    <footer class="footer px-4">
        <ChatInput />
    </footer>
  </main>
</div>

<style global>
  .footer {
      background: rgba(1,1,1,0);
  }
</style>
