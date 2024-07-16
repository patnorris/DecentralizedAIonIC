<script lang="ts">
  import { store } from "../../store";

  export let selectedChat;

  let chats = [];
  let chatsRetrievalInProgress = false;
  let hasLoadedChats = false;

  const loadUserChats = async () => {
    if (chatsRetrievalInProgress) {
      return;
    };
    chatsRetrievalInProgress = true;
    const retrievedChatsResponse = await $store.backendActor.get_caller_chat_history();
    // @ts-ignore
    chats = retrievedChatsResponse.Ok;
    chatsRetrievalInProgress = false;
    hasLoadedChats = true;
  };

  const handleChatClick = (chat) => {
    selectedChat = chat;
  };

  const handleMouseOver = (event) => {
    event.target.style.backgroundColor = "lightgrey";
  };

  const handleMouseOut = (event) => {
    event.target.style.backgroundColor = "";
  };

  const editTitle = async (id) => {
    const newTitle = prompt('Enter new title');
    const chatIndex = chats.findIndex(chat => chat.id === id);
    chats[chatIndex].chatTitle = newTitle;
    // Persist to backend
    const updatedChatObject = {
        id: id,
        chatTitle: newTitle,
    };
    const chatUpdatedResponse = await $store.backendActor.update_chat_metadata(updatedChatObject);
  };

  const deleteChat = async (id) => {
    chats = chats.filter(chat => chat.id !== id);
    // Persist to backend
    const chatDeletedResponse = await $store.backendActor.delete_chat(id);
  };
</script>

{#if !hasLoadedChats}
  <div id='chatsSubtext' class="p-4 w-full text-sm text-gray-800 rounded-lg bg-gray-50" role="alert">
    <span class="font-medium">Retrieving your chats...</span>
  </div>
  <p hidden>{loadUserChats()}</p>
{:else}
  <ul class="flex flex-col w-full">
    {#each chats as chat (chat.id)}
      <li class="relative group hover:bg-gray-400">
        <a href="javascript:;" on:click={() => handleChatClick(chat)} class="truncate bg-gray-200 hover:bg-slate-100 flex flex-row items-center text-xs p-1.5 text-gray-500 w-full">
          {chat.firstMessagePreview.substring(0, 100)}
        </a>
        <button class="delete-btn hidden absolute right-3.5 transform translate-x-1/2 -translate-y-1/2 top-1/2 bg-gray-500 hover:bg-red-600 text-white text-xs p-1.5 rounded-l">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4" viewBox="0 -960 960 960" fill="#ffffff"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/></svg>
        </button>
      </li>
    {/each}
  </ul>
{/if}



