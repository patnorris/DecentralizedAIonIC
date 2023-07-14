<script lang="ts">
  import Modal from "./Modal.svelte";
  import PlugButton from "./PlugButton.svelte";
  import StoicButton from "./StoicButton.svelte";

  export let toggleModal;

  let loading = ""; // this allows us to disable both buttons if one of them is clicked
</script>

<Modal title={"login with …"} {toggleModal}>
  <div class="flex gap-3 flex-col flex-1 justify-center items-center">
    <PlugButton bind:loading {toggleModal} />
    <StoicButton bind:loading {toggleModal} />
  </div>
</Modal>
