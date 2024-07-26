<script lang="ts">
  import Router from "svelte-spa-router";
  import { onMount } from "svelte";
  import { store } from "./store";

  import Intro from "./pages/Intro.svelte";
  import UserChatsOverview from "./pages/UserChatsOverview.svelte";
  import UserSettings from "./pages/UserSettings.svelte";
  import About from "./pages/About.svelte";
  import Brand from "./pages/Brand.svelte";
  import NotFound from "./pages/NotFound.svelte";
  import deVinci from "./pages/deVinci.svelte";

  import { syncLocalChanges } from "./helpers/localStorage";

  const routes = {
    // Exact path (with /# in front of route, e.g. .../#/about)
    "/": Intro,
    "/mychats": UserChatsOverview,
    "/settings": UserSettings,
    "/about": About,
    "/brand": Brand,
    "/devinci": deVinci,
    // Catch-all (this is optional, but if present it must be the last)
    "*": NotFound,
  };

  onMount(async () => {
    // Check login state
    await store.checkExistingLoginAndConnect();
    if ($store.isAuthed) {
      syncLocalChanges(); // Sync any local changes (from offline usage), only works if back online
    };
  });
</script>

<div class="App">
  <Router {routes} />
</div>
