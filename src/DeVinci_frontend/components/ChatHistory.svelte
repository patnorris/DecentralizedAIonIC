<script lang="ts">
  import { store } from "../store";

  export let selectedChat;

  let chats = [];

  let chatsRetrievalInProgress = false;
  
  let showChats = false;

  const handleClick = async () => {
    if (chatsRetrievalInProgress) {
      return;
    };
    if (!showChats) {
      chatsRetrievalInProgress = true;
      const retrievedChatsResponse = await $store.backendActor.get_caller_chat_history();
      // @ts-ignore
      chats = retrievedChatsResponse.Ok;
      chatsRetrievalInProgress = false;
    };
    showChats = !showChats;    
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
</script>

<div class="dropdown">
  <button class="dropbtn" on:click={handleClick}>
    Load a Previous Chat
  </button>
  {#if showChats}
    <div class="dropdown-content">
      {#each chats as chat (chat.id)}
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a href="javascript:;" on:click={() => handleChatClick(chat)}>
          <span>{new Date(Number(chat.creationTime) / 1000000).toLocaleDateString()}</span>
          <span>{chat.firstMessagePreview.substring(0, 30)}</span>
        </a>
      {/each}
    </div>
  {/if}
</div>

<style>
  .dropdown {
    position: relative;
    display: inline-block;
  }
  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f1f1f1;
    min-width: 200px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
  }
  .dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }
  .dropdown-content a:hover {
    background-color: #ddd;
  }
  .dropdown:hover .dropdown-content {
    display: block;
  }
  .dropdown:hover .dropbtn {
    background-color: #3e8e41;
  }
  .dropbtn {
    background-color: #4caf50;
    color: white;
    padding: 16px;
    font-size: 16px;
    border: none;
    cursor: pointer;
  }
  .dropbtn:hover, .dropbtn:focus {
    background-color: #3e8e41;
  }
</style>



