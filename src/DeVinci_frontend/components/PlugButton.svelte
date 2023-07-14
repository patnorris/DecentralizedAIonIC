<script lang="ts">
  import { onMount } from "svelte";
  import { store } from "../store";

  import spinner from "../assets/loading.gif";
  import Button from "./Button.svelte";

  export let loading;
  export let toggleModal;

  onMount(async () => {
    const connected = await window.ic?.plug?.isConnected();
    if (connected) {
      console.log("plug connection detected");
      store.plugConnect();
    }
  });

  async function connect() {
    loading = "plug";
    await store.plugConnect();
    loading = "";
    toggleModal();
  }
</script>

<Button
  on:click={connect}
  disabled={loading}
  style={"lg:h-16 2xl:h-20 lg:rounded-[55px]"}
>
  {#if loading === "plug"}
    <img class="h-6 block" src={spinner} alt="loading animation" />
  {:else}
    plug
  {/if}
</Button>
