<script lang="ts">
  import Router from "svelte-spa-router";
  import { onMount } from "svelte";
  import { store } from "./store";

  import Intro from "./pages/Intro.svelte";
  import UserChatsOverview from "./pages/UserChatsOverview.svelte";
  import UserSettings from "./pages/UserSettings.svelte";
  import About from "./pages/About.svelte";
  import NotFound from "./pages/NotFound.svelte";

  const routes = {
    // Exact path (with /# in front of route, e.g. .../#/about)
    "/": Intro,
    "/mychats": UserChatsOverview,
    "/settings": UserSettings,
    "/about": About,
    // Catch-all (this is optional, but if present it must be the last)
    "*": NotFound,
  };

  onMount(async () => {
    // Check login state
    await store.checkExistingLoginAndConnect();
  });
</script>

<div class="App">
  <Router {routes} />
</div>
