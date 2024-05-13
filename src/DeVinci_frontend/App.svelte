<script lang="ts">
  import Router from "svelte-spa-router";

  import Intro from "./pages/Intro.svelte";
  import UserChatsOverview from "./pages/UserChatsOverview.svelte";
  import UserSettings from "./pages/UserSettings.svelte";
  import About from "./pages/About.svelte";
  import NotFound from "./pages/NotFound.svelte";
  import deVinci from "./pages/deVinci.svelte";

  const routes = {
    // Exact path (with /# in front of route, e.g. .../#/about)
    "/": Intro,
    "/mychats": UserChatsOverview,
    "/settings": UserSettings,
    "/about": About,
    "/devinci": deVinci,
    // Catch-all (this is optional, but if present it must be the last)
    "*": NotFound,
  };
</script>

<div class="App">
  <Router {routes} />
</div>
