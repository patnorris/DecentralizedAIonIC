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
  class="text-black hover:shadow font-mono bg-white border-black rounded-t-3xl lg:rounded-t-none lg:rounded-b-[37px] lg:min-w-[150px]"
  >Login</button
>

<div class={openModal ? "" : "hidden"}>
  <LoginModal {toggleModal} />
</div>
