<script lang="ts">
  import LoginModal from "./LoginModal.svelte";

  let openModal = false;

  function toggleModal() {
    openModal = !openModal;
  }

  function handleEscape({ key }) {
    if (key === "Escape") {
      openModal = false;
    }
  }
</script>

<svelte:window on:keyup={handleEscape} />

<button
  on:click={toggleModal}
  class="hover:shadow dark:hover:shadow-white flex-1 lg:flex-none font-mono -ml-0.5 text-xl lg:text-base 2xl:text-xl bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-t-3xl lg:rounded-t-none lg:rounded-b-[37px] lg:min-w-[300px]"
  >login</button
>

<div class={openModal ? "" : "hidden"}>
  <LoginModal {toggleModal} />
</div>

<style>
  button {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 80px;
    width: 80px;
    display: flex;
    justify-content: center;
    align-items: end;
    z-index: 10;
  }
</style>
