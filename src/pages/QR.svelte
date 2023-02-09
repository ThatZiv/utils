<script>
    import { onMount } from "svelte";
    import { addToast } from "../assets/alerts";
    let input;
    let baseURL;
   /*  if (!input) {
        addToast({title: "Info", message: "Please enter input values!"})
    } */
    $ : {baseURL = `https://chart.apis.google.com/chart?cht=qr&chs=350x350&chld=L&choe=UTF-8&chl=${encodeURIComponent(input)}`};
</script>

<input type="text" placeholder="QR Code contents" bind:value={input} class="border border-gray-300 text-white bg-gray-800 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
<br />
{#if input}
    <img class="h-auto max-w-lg rounded-lg" src={baseURL} alt="QR code"/>
{:else}
    <p>Please input values...</p>
{/if}
