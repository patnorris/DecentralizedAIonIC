<script lang="ts">
  import Router from "svelte-spa-router";

  import Intro from "./pages/Intro.svelte";
  import UserChatsOverview from "./pages/UserChatsOverview.svelte";
  import About from "./pages/About.svelte";
  import NotFound from "./pages/NotFound.svelte";

  const routes = {
    // Exact path (with /# in front of route)
    "/": Intro,
    "/mychats": UserChatsOverview,
    "/about": About,
    // "/spaces": Spaces, //e.g. URL: https://vdfyi-uaaaa-aaaai-acptq-cai.ic0.app/#/spaces
    // Catch-all (this is optional, but if present it must be the last)
    "*": NotFound,
  };
</script>

<div class="App">
  <Router {routes} />
</div>
