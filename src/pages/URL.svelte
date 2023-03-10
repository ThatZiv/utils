<script lang="ts">
    import axios from "axios";
    import type { InferType } from "yup";
    import { addToast } from "../assets/alerts";
    import Card from "../lib/Card.svelte";
    import schemas from "../lib/forms";
    import Loader from "../lib/Loader.svelte";
    import { copy } from 'svelte-copy';
    // api wrapper from https://github.com/ThatZiv/urlshorten/blob/master/client/src/api.js
    const api = {
        api: axios.create({ baseURL: "https://s.zavaar.net/api" }),
        create: function (url: string) {
            return this.api
                .post(`/create?url=${encodeURIComponent(url)}`)
                .then((response) => response.data);
        },
        get: function (id: string) {
            return this.api.get(`/get/${id}`).then((response) => response.data);
        },
    };

    let input = "";
    let res;
    const handleSubmit = async () => {
        try {
            await schemas.url.validate({ url: input });
        } catch (err) {
            addToast({
                message: err?.errors ? err.errors[0] : err.message,
            });
            return;
        }
        res = api.create(input);
        addToast({
            message: "Creating URL …"
        });
    };
</script>

<p class="my-4 text-lg text-gray-200 text-left">Shorten any URL</p>
<form on:submit|preventDefault={handleSubmit}>
    <div class="flex">
        <div class="relative w-full">
            <input
                type="text"
                bind:value={input}
                class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                placeholder="Enter a URL link (eg. https://google.com)"
                required
            />
            <button
                class="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg rounded-l-none border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                <svg
                    aria-hidden="true"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    /></svg
                >
                <span class="sr-only">Search</span>
            </button>
        </div>
    </div>
</form>
<br/>
{#if res}
    {#await res}
        <Loader open />
    {:then data}
        <Card title="Shortened URL" description={data.shortened}>
            <p></p>
            <button use:copy={data.shortened} class="inline-flex items-center text-blue-600 bg-gray-100 hover:bg-gray-300">
                Copy
                <svg class="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
            </button>
        </Card>
    {:catch err}
        <Card title={err.name} description={err.message}/>
    {/await}
{/if}
