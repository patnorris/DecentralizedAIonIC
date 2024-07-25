<script lang="ts">
  //import { onMount } from "svelte";
  import { store } from "../store";

  //import { AuthClient } from "@dfinity/auth-client";

  import spinner from "../assets/loading.gif";
  import nfidlogo from "/nfid.webp"

  export let loading;
  export let toggleModal;
  
  /* onMount(async () => {
    // Accessing Local Storage to check login state
    const isAuthed = localStorage.getItem('isAuthed');
    if (isAuthed && isAuthed === "nfid"){
      const authClient = await AuthClient.create();
      if (await authClient.isAuthenticated()) {
        console.log("NFID connection detected");
        store.nfidConnect();
      };
    };
  }); */

  async function connect() {
    loading = "nfid";
    store.nfidConnect();
    loading = "";
    toggleModal();
  };
</script>

<a
  class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow cursor-pointer"
  on:click={connect}
  disabled={loading}
>
  {#if loading === "nfid"}
    <img class="h-6 block" src={spinner} alt="loading animation" />
  {:else}
    <img class="h-5" src={nfidlogo}  alt="nfid wallet" />
    <span class="flex-1 ms-3 whitespace-nowrap">NFID (incl. Google)</span>
  {/if}
</a>
