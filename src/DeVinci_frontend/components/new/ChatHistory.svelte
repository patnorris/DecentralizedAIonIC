<script lang="ts">
  import { store } from "../../store";

  import {
    getLocallyStoredChatHistory,
    storeChatHistoryLocally,
    syncLocalChanges
  } from "../../helpers/localStorage";

  export let selectedChat;

  let chats = [];
  let chatsRetrievalInProgress = false;
  let hasLoadedChats = false;

  const loadUserChats = async () => {
    if (chatsRetrievalInProgress) {
      return;
    };
    chatsRetrievalInProgress = true;
    try {
      const retrievedChatsResponse = await $store.backendActor.get_caller_chat_history();      
      // @ts-ignore
      if (retrievedChatsResponse.Ok) {
        // @ts-ignore
        chats = retrievedChatsResponse.Ok;
        // store chat history locally for offline usage
        // @ts-ignore
        storeChatHistoryLocally(retrievedChatsResponse.Ok);
        syncLocalChanges(); // Sync any local changes (from offline usage), only works if back online
      } else {
        // @ts-ignore
        console.error("Error retrieving chat history: ", retrievedChatsResponse.Err);
        // @ts-ignore
        throw new Error("Error retrieving chat history: ", retrievedChatsResponse.Err);
      };        
    } catch (error) {
      // Likely in offline usage
      const storedChatHistory = getLocallyStoredChatHistory();
      if (storedChatHistory) {
        chats = storedChatHistory;
      };
    };
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
  <div class="h-screen w-full">
    <ul class="flex flex-col w-full h-full overflow-y-auto overflow-x-hidden">
      {#each chats as chat (chat.id)}
        <li class="relative group rounded-xl hover:bg-slate-100">
          <a href="javascript:;" on:click={() => handleChatClick(chat)} class="truncate rounded-xl hover:bg-slate-100 flex flex-row items-center text-xs p-1.5 text-gray-500 w-full">
            {chat.firstMessagePreview.substring(0, 100)}
          </a>
          <button class="delete-btn hidden absolute right-6 transform translate-x-1/2 -translate-y-1/2 top-1/2 bg-gray-500 hover:bg-orange-700 text-white text-xs py-1 px-1.5 rounded-xl">
            delete
          </button>
        </li>
      {/each}
    </ul>
  </div>
{/if}



