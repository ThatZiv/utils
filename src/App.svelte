<script lang="ts">
  import Nav from "./lib/Nav.svelte";
  import Footer from "./lib/Footer.svelte";
  import Heading from "./lib/Heading.svelte";
  import { Router } from "svelte-hash-router";
  import routing from "./routes";
  import type { page as pageType } from "./routes";
  import type { SvelteComponentDev } from "svelte/internal";
  import Alert from "./lib/Alert.svelte";
  import { toasts } from "./assets/alerts";
  const basepath = process.env.NODE_ENV === "production" ? "/" : "/"; // TODO: change this
</script>

<main>
  <Nav />
  <div class="m-5" />
  {#each $toasts as toast (toast.id)}
    <Alert
      message={toast.message}
      title={toast.title}
      id={toast.id}
      on:click={() => alert("sd")}
    />
  {/each}
  <Router />
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
