<script>
  import {
    store,
    activeChatGlobal
  } from "../../store";

  import ChatHistory from "./ChatHistory.svelte";

  import newchaticon from "/newchat.svg";
  import devincilogo from "/devinci-logo.svg";

  // User can select between chats (global variable is kept)
  async function showNewChat() {
    $activeChatGlobal = null;
    return;
  };

</script>

<div class="flex flex-col justify-center w-full items-center">
  <a href="#/devinci">
      <img src={devincilogo} class="w-16 h-16 p-0 rounded-full" alt="devinci logo" />
  </a>

  <button type="button" on:click={showNewChat} class="mr-auto  my-5 flex text-gray-800 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-full text-xs px-3 py-1.5 text-center">
    <!--      <img src={newchaticon} class="w-5 mr-1 p-0 rounded-full" alt="new chat" />-->
    New chat
  </button>

  {#if $store.isAuthed}
    <!--
    --- Show when user is logged and has saved chats
    -->
    <ChatHistory bind:selectedChat={$activeChatGlobal} />
  {/if}
</div>

<style>
	.group:hover .delete-btn {
		display: flex;
	}
</style>
