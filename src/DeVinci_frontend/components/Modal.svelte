<script lang="ts">
    import Card from "./Card.svelte";

    export let toggleModal;
    export let title;
</script>

<div
    class="text-black fixed flex justify-center items-center z-10 inset-0 bg-opacity-10 backdrop-blur-sm"
>
    <Card style="flex flex-col lg:w-1/2 w-full mx-2 pt-4 pb-6 px-4 max-h-screen overflow-auto">
        <div class="flex flex-row justify-between">
            <p class="font-everett-medium text-3xl 2xl:text-4xl">{title}</p>
            <div
                class="hover:shadow cursor-pointer flex justify-center items-center font-mono text-lg rounded-full border-2 border-black w-10 h-10"
                on:click={toggleModal}
            >
                x
            </div>
        </div>
        <div class="pt-10 pb-5 overflow-auto">
            <slot />
        </div>
    </Card>
</div>
