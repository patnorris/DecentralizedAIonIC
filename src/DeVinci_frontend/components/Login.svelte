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

<h3 class="font-bold">We're glad you're here! Get started right away by logging in:</h3>

<button
  on:click={toggleModal}
  class="hover:shadow dark:hover:shadow-white flex-1 lg:flex-none font-mono -ml-0.5 text-xl lg:text-base 2xl:text-xl bg-white dark:bg-black border-black dark:border-white dark:text-white border-2 rounded-t-3xl lg:rounded-t-none lg:rounded-b-[37px] lg:min-w-[300px]"
  >login</button
>

<p>You need to be logged in to create and update spaces. If you want to see others' spaces first, click on the Explore tab.</p>

<div class={openModal ? "" : "hidden"}>
  <LoginModal {toggleModal} />
</div>
