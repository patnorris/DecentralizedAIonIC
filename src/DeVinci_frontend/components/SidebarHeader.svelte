<script>
  import { location, push } from 'svelte-spa-router';
  import {
    store,
    activeChatGlobal
  } from "../store";

  import ChatHistory from "./ChatHistory.svelte";

  import devincilogo from "/devinci-logo.svg";

  import { userHasDownloadedModel } from "../helpers/localStorage";

  // Reactive statement to check if the user has already downloaded at least one AI model
  $: userHasDownloadedAtLeastOneModel = userHasDownloadedModel();

  // User can select between chats (global variable is kept)
  async function showNewChat() {
    if ($activeChatGlobal !== null) {
      $activeChatGlobal = null;
    } else {
      $activeChatGlobal = false;
    };
    if ($location !== "/") {
      push('/');
    };
    return;
  };

</script>

<div class="flex flex-col justify-center w-full items-center">
  <a href="/">
      <img src={devincilogo} class="rotating-image w-16 h-16 p-0 rounded-full" alt="devinci logo" />
  </a>
  {#if userHasDownloadedAtLeastOneModel}
    <button type="button" on:click={showNewChat} class="disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-800 mr-auto w-full my-5 flex justify-center text-gray-800 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-full text-xs px-3 py-1.5 text-center">
      New chat
    </button>
  {:else}
    <button disabled aria-label="Choose a model first." type="button" class="tooltip-toggle disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-800 mr-auto w-full my-5 flex justify-center text-gray-800 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-full text-xs px-3 py-1.5 text-center">
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
	  animation: rotate 360s linear infinite;
  }

  .tooltip-toggle {
	  cursor: pointer;
	  position: relative;
  }
  .tooltip-toggle::before {
	  position: absolute;
	  top: -60px;
	  left: 0;
	  background-color: #2B222A;
	  border-radius: 5px;
	  color: #fff;
	  content: attr(aria-label);
	  padding: 0.7rem;
	  text-transform: none;
	  transition: all 0.5s ease;
	  width: 140px;
  }
  .tooltip-toggle::after {
	  position: absolute;
	  top: -12px;
	  left: 9px;
	  content: " ";
	  font-size: 0;
	  line-height: 0;
	  margin-left: -5px;
	  width: 0;
  }
  .tooltip-toggle::before, .tooltip-toggle::after {
	  color: #efefef;
	  font-family: monospace;
	  font-size: 12px;
	  opacity: 0;
	  pointer-events: none;
	  text-align: center;
  }
  .tooltip-toggle:focus::before, .tooltip-toggle:focus::after, .tooltip-toggle:hover::before, .tooltip-toggle:hover::after {
	  opacity: 1;
	  transition: all 0.75s ease;
  }
</style>
