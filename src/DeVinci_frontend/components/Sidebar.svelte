<script lang="ts">
import { onMount } from 'svelte';
  import SidebarHeader    from "./SidebarHeader.svelte";
  import SidebarInfo        from "./SidebarFooter.svelte";
  import SidebarBottomNav from "./SidebarBottomNav.svelte";
  import { downloadedModels } from "../store";
  //import Knowledgebase  from "./Knowledgebase.svelte"; TODO

  import { userHasDownloadedModel } from "../helpers/localStorage";

  onMount(() => {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const chat = document.getElementById('chat');

    function toggleSidebar(event) {
      event.stopPropagation();
      chat.classList.toggle('-translate-x-full');
    };

    function closeSidebar(event) {
      if (!chat.contains(event.target) && !sidebarToggle.contains(event.target)) {
        chat.classList.add('-translate-x-full');
      };
    };

    function stopPropagation(event) {
      event.stopPropagation();
    };

    sidebarToggle.addEventListener('click', toggleSidebar);
    document.body.addEventListener('click', closeSidebar);
    chat.addEventListener('click', stopPropagation);

    return () => {
      sidebarToggle.removeEventListener('click', toggleSidebar);
      document.body.removeEventListener('click', closeSidebar);
      chat.removeEventListener('click', stopPropagation);
    };
  });

  // Reactive statement to check if the user has already downloaded at least one AI model
  $: userHasDownloadedAtLeastOneModel = $downloadedModels.length > 0;
</script>

<div class="sidebar-header flex flex-col items-center justify-between py-4 h-lvh">
    <SidebarHeader />
    {#if userHasDownloadedAtLeastOneModel}
        <SidebarBottomNav />
    {:else}
        <SidebarInfo />
    {/if}
</div>
