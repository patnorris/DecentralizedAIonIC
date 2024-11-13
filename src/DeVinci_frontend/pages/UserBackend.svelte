<script lang="ts">
  import { store } from '../store';

  import ToastNotification from '../components/ToastNotification.svelte';

  import {
    createUserBackendCanister
  } from "../helpers/vector_database";

  import spinner from "../assets/loading.gif";

  let showToast = false;
  let toastMessage = '';

  function closeToast() {
    showToast = false;
  };
</script>

{#if !$store.isAuthed}
  <p id='chatsSubtext'>Please login first.</p>
{:else}
  <div class="flex items-center px-3 p-2 rounded-full bg-gray-200">
    <button  type="submit" on:click={() => {createUserBackendCanister()}} class="inline-flex justify-center p-2 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
      <svg class="w-5 h-5 rotate-0 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
        <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
      </svg>
      <span class="sr-only">Create Own Backend</span>
    </button>
  </div>
{/if}

{#if showToast}
  <ToastNotification message={toastMessage} onClose={closeToast} />
{/if}

