<script lang="ts">
    // import { copy } from 'svelte-copy';
    let random = [
        "f(x)=x^2-4",
        "g(x)=\\int_0^xt^2dt",
        "\\frac{d}{dx}f(x)=f'(x)",
    ];
    let input = localStorage.getItem("latex") || random[Math.floor(Math.random() * random.length)];
    let latex;
    const baseUrl = "https://latex.codecogs.com/gif.latex?";
    $: {
        latex = baseUrl + encodeURIComponent(`\\dpi{300} ${input}`);
        localStorage.setItem("latex", input)
    }
</script>

<label
    for="message"
    class="block mb-2 text-sm font-medium lg:text-left md:text-center  dark:text-white"
    >Enter <a href="https://www.latex-project.org/">LaTeX</a> code</label
>
<textarea
    class="block p-2.5 w-full text-sm text-white bg-gray-800 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    placeholder="Enter LaTeX code here"
    bind:value={input}
/>
<br />
{#if input}
    <img src={latex} class="invert" alt="img response" />
{/if}
<a href={latex} download="output"><button>Output</button></a>
<button
    class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
    on:click={() => {
        input = "";
    }}>Clear</button
>

<style>
    .invert {
        filter: invert("100%");
    }
</style>
