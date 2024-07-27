<script>
  import {
    store,
    activeChatGlobal
  } from "../../store";

  import ChatHistory from "./ChatHistory.svelte";

  import newchaticon from "/newchat.svg";
  import devincilogo from "/devinci-logo.svg";

  import { userHasDownloadedModel } from "../../helpers/localStorage";

  // Reactive statement to check if the user has already downloaded at least one AI model
  $: userHasDownloadedAtLeastOneModel = userHasDownloadedModel();

  // User can select between chats (global variable is kept)
  async function showNewChat() {
    $activeChatGlobal = null;
    return;
  };

</script>

<div class="flex flex-col justify-center w-full items-center">
  <a href="#/devinci">
      <img src={devincilogo} class="rotating-image w-16 h-16 p-0 rounded-full bg-gray-50" alt="devinci logo" />
  </a>
  {#if userHasDownloadedAtLeastOneModel}
    <button type="button" on:click={showNewChat} class="disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-800 mr-auto w-full my-5 flex justify-center text-gray-800 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-full text-xs px-3 py-1.5 text-center">
      New chat
    </button>
  {:else}
    <button disabled type="button" on:click={showNewChat} class="disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-800 mr-auto w-full my-5 flex justify-center text-gray-800 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-full text-xs px-3 py-1.5 text-center">
      New chat
    </button>
  {/if}
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

  @keyframes rotate {
	  from {
		  transform: rotate(0deg);
	  }
	  to {
		  transform: rotate(360deg);
	  }
  }

  .rotating-image {
	  width: 64px; /* w-16 in Tailwind CSS */
	  height: 64px; /* h-16 in Tailwind CSS */
	  padding: 0; /* p-0 in Tailwind CSS */
	  border-radius: 50%; /* rounded-full in Tailwind CSS */
	  background-color: #f9fafb; /* bg-gray-50 in Tailwind CSS */
	  animation: rotate 360s linear infinite;
  }
</style>
