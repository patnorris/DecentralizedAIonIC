<script lang="ts">
  import { push } from "svelte-spa-router";
  import { onMount } from "svelte";
  import { store } from "../store";
  import Login from "../components/Login.svelte";
  import Button from "../components/Button.svelte";
  import Topnav from "../components/Topnav.svelte";
  import Footer from "../components/Footer.svelte";
  import ChatInterface from "../components/ChatInterface.svelte";

</script>

<Topnav />

<ChatInterface />

<!-- <div class="py-7 items-center leading-8 text-center text-xl font-semibold">
  <h3>Want to have your own Virtual Home?</h3>
  <h3>Want to become part of the Open Metaverse Neighborhood?</h3>
  <h3>Want to have your Personal Web Space as a 3D webpage?</h3>
</div>

<section id="login" class="py-7 space-y-6 items-center text-center bg-slate-100">
  {#if !$store.isAuthed}
    <Login />
  {:else}
    <h3 class="font-bold">You're Logged In</h3>
    <div>Principal: {$store.principal}</div>
    <div>AccountId: {$store.accountId}</div>
    <Button on:click={() => store.disconnect()}>disconnect</Button>
  {/if}
</section>

<section id="create" class="py-7 space-y-6 items-center text-center">
  <h3 class="font-bold">Create a new Personal Web Space</h3>
  {#if !$store.isAuthed}
    <button type='button' id='createButton' disabled class="bg-slate-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed">Create Space</button>
    <p id='createSubtext'>Log in to generate a 3D room (Your Space, Your Realm, Your Virtual Home) which you can edit afterwards. Fun fact: The Space is an NFT itself and will be sent to your wallet. This way you know it's truly yours!</p>
  {:else}
    <button type='button' id='createButton' on:click={() => push("#/create")} class="active-app-button bg-slate-500 text-white font-bold py-2 px-4 rounded">Create Space</button>
    <p id='createSubtext'>Click and we'll generate a 3D room for you (Your Space, Your Realm, Your Virtual Home) which you can edit afterwards. Fun fact: The Space is an NFT itself and will be sent to your wallet. This way you know it's truly yours!</p>
  {/if}
</section>

<section id="spaces" class="py-7 space-y-6 items-center text-center bg-slate-100">
  <h3 class="font-bold">My Personal Web Spaces</h3>
  {#if !$store.isAuthed}
    <p id='spacesSubtext'>Log in to see which Spaces you own.</p>
  {:else}
    <p id='spacesSubtext'>Let's see which Spaces you own...</p>
    {#if !hasLoadedSpaces}
      <p hidden>{loadUserSpaces()}</p>
    {:else}
      <UserSpaces spaces={loadedUserSpaces} />
    {/if}
  {/if}
</section>

<div class='clearfix'></div> -->

<Footer />

<style global>
/* NOTE: these styles are global and affect any element in the app. Thus, ensure that there aren't any conflicts with the class names chosen (i.e. avoid generic names as they might conflict with an A-Frame class, e.g. content which is used in the Inspector)  */
  .App-logo {
    height: 15vmin;
    pointer-events: none;
  }

  .App-header {
    margin-top: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
  }

  .App-link {
    color: rgb(26, 117, 255);
  }

  .demo-button {
    background: #a02480;
    padding: 0 1.3em;
    margin-top: 1em;
    border-radius: 60px;
    font-size: 0.7em;
    height: 35px;
    outline: 0;
    border: 0;
    cursor: pointer;
    color: white;
  }

  .demo-button:active {
    color: white;
    background: #979799;
  }

  .space-details-collapsible {
    padding: 7px;
    text-align: center;
    border: none;
    outline: none;
    cursor: pointer;
  }

  .active-app-button:hover, .space-details-collapsible:hover {
    background-color: #555;
  }

  .space-details-content {
    display: none;
    overflow: hidden;
  }

  .devinci-topnav {
    background: #333;
  }

  footer {
    background: #333;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 20px 0;
  }

  footer p {
    margin-bottom: 20px;
  }

  footer a {
    margin: 0 10px;
    color: #ffffff;
  }

  footer img {
    display: block;
    width: 20%;
    max-width: 900px;
    height: auto;
    margin: auto;
  }
</style>
