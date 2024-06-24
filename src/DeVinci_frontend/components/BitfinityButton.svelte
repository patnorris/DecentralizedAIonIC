<script lang="ts">
  import { store } from "../store";

  import spinner from "../assets/loading.gif";
  import bitfinitylogo from "/bitfinity.svg";

  export let loading;
  export let toggleModal;

  async function connect() {
    loading = "bitfinity";
    await store.bitfinityConnect();
    loading = "";
    toggleModal();
  }
</script>

<a
class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow cursor-pointer"
  on:click={connect}
  disabled={loading}
>
  {#if loading === "bitfinity"}
    <img class="h-6 block" src={spinner} alt="loading animation" />
  {:else}
    <img class="h-5" src={bitfinitylogo}  alt="bitfinity wallet" />
    <span class="flex-1 ms-3 whitespace-nowrap">Bitfinity</span>
  {/if}
</a>
