<script lang="ts">
  import { Router, Link, Route } from "svelte-navigator";
  import Nav from "./lib/Nav.svelte";
  import Footer from "./lib/Footer.svelte";
  import pages from "./routes";
  import Heading from "./lib/Heading.svelte";
</script>

<main>
  <Nav />
  <Router>
    <div class="m-5" />
    {#each pages as page}
      <Route path={page.location}>
        <svelte:component this={page.page} />
      </Route>
    {/each}
    <Route path="*">
      <Heading>Page not found 😭</Heading>
    </Route>
  </Router>
  <Footer />
</main>

<style>
  .logo {
    height: 5em;

    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
