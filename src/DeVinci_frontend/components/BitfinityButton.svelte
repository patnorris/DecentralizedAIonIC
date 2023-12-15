<script lang="ts">
  import { onMount } from "svelte";
  import { store } from "../store";

  import spinner from "../assets/loading.gif";
  import Button from "./Button.svelte";

  export let loading;
  export let toggleModal;

  async function connect() {
    loading = "bitfinity";
    await store.bitfinityConnect();
    loading = "";
    toggleModal();
  }
</script>

<Button
  on:click={connect}
  disabled={loading}
  style={"lg:h-16 2xl:h-20 lg:rounded-[55px]"}
>
  {#if loading === "bitfinity"}
    <img class="h-6 block" src={spinner} alt="loading animation" />
  {:else}
    Bitfinity
  {/if}
</Button>
