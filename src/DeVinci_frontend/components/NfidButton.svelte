<script lang="ts">
  import { onMount } from "svelte";
  import { store } from "../store";

  import { AuthClient } from "@dfinity/auth-client";

  import spinner from "../assets/loading.gif";
  import Button from "./Button.svelte";

  export let loading;
  export let toggleModal;
  
  onMount(async () => {
    const authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
      console.log("NFID connection detected");
      store.nfidConnect();
    };
  });

  async function connect() {
    loading = "nfid";
    store.nfidConnect();
    loading = "";
    toggleModal();
  };
</script>

<Button
  on:click={connect}
  disabled={loading}
  style={"lg:h-16 2xl:h-20 lg:rounded-[55px]"}
>
  {#if loading === "nfid"}
    <img class="h-6 block" src={spinner} alt="loading animation" />
  {:else}
    NFID
  {/if}
</Button>
