<script lang="ts">
    import { fade } from 'svelte/transition';
    export let message: string;
    export let duration: number = 3000;
    export let onClose: () => void;
  
    setTimeout(onClose, duration);
  </script>
  
  <div
    transition:fade="{{ duration: 900 }}"
    class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50"
  >
    {message}
  </div>