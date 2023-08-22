<script lang="ts">
  import { store } from "../store";
  import { fly, scale } from 'svelte/transition';
  import { quadOut } from 'svelte/easing';
  import { Hamburger } from 'svelte-hamburgers';

  import Login from "../components/Login.svelte";
  import Modal from "../components/Modal.svelte";

  // Whether hamburger menu is open
  let open;

// User clicked on Logout
  const logout = async () => {
    await store.disconnect();
    open = false;
  };

// Menu Modal
  function toggleModal() {
    open = !open;
  }

  function handleEscape({ key }) {
    if (key === "Escape") {
      open = false;
    }
  }
</script>

<svelte:window on:keyup={handleEscape} />

<div class="hamburgerParent">
  {#if !$store.isAuthed}
    <Login />
  {:else}
    <Hamburger
      bind:open />  
  {/if}
</div>

{#if open}
  <Modal title={"Menu Options:"} {toggleModal}>
    <div class="mainMenu">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <p class="mainMenuItem" transition:fly={{ y: -15, delay: 50 * 4 }}>
        <a href="/#">Chat</a>
      </p>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <p class="mainMenuItem" transition:fly={{ y: -15, delay: 50 * 4 }}>
        <a href="/#/mychats">My Chats</a>
      </p>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <p class="mainMenuItem" transition:fly={{ y: -15, delay: 50 * 4 }}>
        <a href="/#/settings">Settings</a>
      </p>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <p class="mainMenuItem" transition:fly={{ y: -15, delay: 50 * 4 }}>
        <a href="/#/about" target="_blank">About DeVinci</a>
      </p>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <p class="mainMenuItem" on:click={() => logout()} transition:fly={{ y: -15, delay: 50 * 5 }}>
        Logout
      </p>
    </div>
  
    <hr transition:scale={{ duration: 650, easing: quadOut, opacity: 1 }} />
  </Modal>
{/if}

<style>
  .hamburgerParent {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 100;
  }
  div.mainMenu {
    z-index: 10;
    position: relative;
    height: 60%; 
    width: 50%;
    margin: auto;
    text-align: center;
    font-size: 1.5em;
    letter-spacing: 0.15em;
    padding: 1em;
    padding-top: 0;
    opacity: 90%;
    color: #eef;
  }
  p.mainMenuItem {
    cursor: pointer;
    width: max-content;
    margin: 1rem auto;
    color: #1d1d2f;
    font-weight: bold;
  }
  p.mainMenuItem:hover {
    text-decoration: underline;
  }
</style>
