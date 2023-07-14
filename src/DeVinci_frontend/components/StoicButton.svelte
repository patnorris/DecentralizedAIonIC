<script>
    import { onMount } from "svelte";
    import { StoicIdentity } from "ic-stoic-identity";
    import { store } from "../store";

    import Button from "./Button.svelte";
    import spinner from "../assets/loading.gif";

    export let loading;
    export let toggleModal;

    onMount(async () => {
        StoicIdentity.load().then(async (identity) => {
            if (identity !== false) {
                //ID is a already connected wallet!
                store.stoicConnect();
            }
        });
    });

    async function connect() {
        loading = "stoic";
        await store.stoicConnect();
        loading = "";
        toggleModal();
    }
</script>

<Button
    on:click={connect}
    disabled={loading}
    style={"lg:h-16 2xl:h-20 lg:rounded-[55px]"}
>
    {#if loading === "stoic"}
        <img class="h-6 block h-" src={spinner} alt="loading animation" />
    {:else}
        stoic
    {/if}
</Button>
