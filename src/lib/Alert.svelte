<script lang="ts">
    import { dismissToast } from "../assets/alerts";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import type { toast } from "../assets/alerts";
    export let message: toast["message"];
    export let title: toast["title"];
    export let id: toast["id"];
    onMount(() => {
        document
            .getElementById(id.toString())
            .scrollIntoView({ behavior: "smooth" });
    });
</script>

<div
    class="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 hover:bg-red-50 hover:line-through cursor-pointer dark:text-blue-400"
    role="alert"
    on:click={() => dismissToast(id)}
    on:keydown={() => dismissToast(id)}
    on:keyup={() => dismissToast(id)}
    id={id.toString()}
    transition:fade
>
    <svg
        aria-hidden="true"
        class="flex-shrink-0 inline w-5 h-5 mr-3"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        ><path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
        /></svg
    >
    <span class="sr-only">Info</span>
    <div>
        <span class="font-bold">{title || ""}</span>
        {message}
    </div>
</div>
