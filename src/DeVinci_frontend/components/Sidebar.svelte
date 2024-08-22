<script lang="ts">
  import SidebarHeader    from "./SidebarHeader.svelte";
  import SidebarInfo        from "./SidebarFooter.svelte";
  import SidebarBottomNav from "./SidebarBottomNav.svelte";
  //import Knowledgebase  from "./Knowledgebase.svelte"; TODO

  import { userHasDownloadedModel } from "../helpers/localStorage";

  // Reactive statement to check if the user has already downloaded at least one AI model
  $: userHasDownloadedAtLeastOneModel = userHasDownloadedModel();
</script>

<div class="sidebar-header flex flex-col items-center justify-between py-4 h-lvh">
    <SidebarHeader />
    {#if !userHasDownloadedAtLeastOneModel}
        <SidebarInfo />
    {/if}
    {#if userHasDownloadedAtLeastOneModel}
      <SidebarBottomNav />
    {/if}
</div>
