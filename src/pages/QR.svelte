<!-- thisis a mess, ik - still learning ok? -->
<script lang="ts">
    import { onMount } from "svelte";
    import { addToast } from "../assets/alerts";
    import type { InferType } from "yup";
    import { writable } from "svelte/store";
    import schemas from "../lib/forms";
    const input = writable<string>(""); // this is the qr img src
    let active = "Text";
    const sections: Array<string> = [
        "Text",
        "URL",
        "Email",
        "Phone",
        "WI-FI",
        "OTP",
    ];
    let activeStyling =
        "text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500";
    const toQR = (content: string): string =>
        `https://chart.apis.google.com/chart?cht=qr&chs=350x350&chld=L&choe=UTF-8&chl=${encodeURIComponent(
            content
        )}`;

    // text form
    const textForm = writable<InferType<typeof schemas.text>>({ text: "" });
    const handleText = () => {
        input.set(""); //clear img
        schemas.text
            .validate($textForm)
            .then(() => {
                input.set(toQR($textForm.text));
            })
            .catch((err) => {
                for (let e of err.errors) {
                    addToast({ message: e.toString() });
                }
            });
    };

    // url form
    const urlForm = writable<InferType<typeof schemas.url>>({ url: "" });
    const handleURL = () => {
        input.set(""); // reset older qr code
        schemas.url
            .validate($urlForm)
            .then(() => {
                input.set(toQR($urlForm.url));
            })
            .catch((err) => {
                for (let e of err.errors) {
                    addToast({ message: e.toString() });
                }
            });
    };

    // email form
    const emailForm = writable<InferType<typeof schemas.email>>({
        email: "",
        cc: "",
        subject: "No Subject",
        body: "",
    });
    const handleEmail = () => {
        input.set("");
        let { email, body, subject, cc } = $emailForm;
        schemas.email
            .validate($emailForm, { abortEarly: false })
            .then(() => {
                input.set(
                    toQR(
                        `mailto:${email}&cc=${cc}&subject=${subject}&body=${body}`
                    )
                );
            })
            .catch((err) => {
                for (let e of err.errors) {
                    addToast({ message: e.toString() });
                }
            });
    };

    // phone form
    const phoneForm = writable<InferType<typeof schemas.phone>>({ number: "" });
    const handlePhone = () => {
        schemas.phone
            .validate($phoneForm)
            .then(() => {
                input.set(toQR(`tel:${$phoneForm.number}`));
            })
            .catch((err) => {
                for (let e of err.errors) {
                    addToast({ message: e.toString() });
                }
            });
    };

    // wifi form
    const wifiForm = writable<InferType<typeof schemas.wifi>>({
        ssid: "",
        pwd: "",
        user: "",
        encryption: "WPA",
        hidden: false,
    });
    const handleWifi = () => {
        const mappings = {
            S: "ssid",
            P: "pwd",
            I: "user",
            H: "hidden",
            T: "encryption",
        }; // vals must be same as wifi form
        input.set("");
        schemas.wifi
            .validate($wifiForm)
            .then(() => {
                let wifiStr = "WIFI:";
                for (let [k, v] of Object.entries(mappings)) {
                    wifiStr += `${k}:${$wifiForm[v]};`;
                }
                input.set(toQR(wifiStr));
            })
            .catch((err) => {
                console.log(err);
                for (let e of err.errors) {
                    addToast({ message: e.toString() });
                }
            });
    };

    // otp form
    const otpForm = writable<InferType<typeof schemas.otp>>({
        type: "totp",
        label: "",
        params: {
            secret: "",
            issuer: "",
            algorithm: "SHA1",
            digits: 6,
            counter: null,
            period: 30,
        },
    });
    const handleOtp = () => {
        input.set("");
        schemas.otp
            .validate($otpForm)
            .then(() => {
                
                let final = `otpauth://${$otpForm.type}/${$otpForm.label}?`;
                if ($otpForm.type == "totp") { //  make period when otp.type is totp
                    $otpForm.params.counter = null;
                } else {
                    $otpForm.params.period = 30;
                }
                $otpForm.params.secret = $otpForm.params.secret.toUpperCase(); // make secret all caps (this needs to be done for it to work)
                //$otpForm.params.issuer = $otpForm.label.split(':')[0]
                for (let [k, v] of Object.entries($otpForm.params)) {
                    if (k && v) final += `${k}=${v}&`;
                }
                final = final.substring(0, final.length - 1); // strip out last &
                console.log(final);
                input.set(toQR(final));
                $otpForm.params.secret = ""; // clear password after submit
            })
            .catch((err) => {
                for (let e of err.errors) {
                    addToast({ message: e.toString() });
                }
            });
    };
</script>

<div
    class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
>
    <p class="my-4 text-lg text-gray-200 text-left">
        Create your own {active.toLocaleLowerCase()}-encoded QR Code.
    </p>
    <ul class="flex flex-wrap -mb-px">
        {#each sections as section}
            <li class="mr-2">
                <!-- svelte-ignore a11y-invalid-attribute -->
                <a
                    class={`inline-block p-4 ${
                        section == active
                            ? activeStyling
                            : "border-b-2 border-transparent rounded-t-lg text-white hover:text-gray-400 hover:border-gray-300 dark:hover:text-gray-300"
                    }`}
                    href="javascript:void(0)"
                    on:click={() => {
                        active = section;
                    }}>{section}</a
                >
            </li>
        {/each}
    </ul>
</div>
<div id="content">
    {#if active == "Text"}
        <div class={`p-4 rounded-lg bg-gray-800`}>
            <section>
                <label
                    for="text1"
                    class="block mb-2 text-sm font-medium text-white"
                    >Enter text</label
                >
                <input
                    type="text"
                    id="text1"
                    placeholder="Text"
                    bind:value={$textForm.text}
                    class="border border-gray-300 text-white bg-gray-800 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <br />
                <button
                    type="button"
                    on:click={handleText}
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >Generate QR</button
                >
            </section>
        </div>
    {:else if active == "URL"}
        <div class={`p-4 rounded-lg bg-gray-800`}>
            <label for="url1" class="block mb-2 text-sm font-medium text-white"
                >Enter URL</label
            >
            <input
                type="text"
                id="url1"
                placeholder="URL"
                bind:value={$urlForm.url}
                class="border border-gray-300 text-white bg-gray-800 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <br />
            <button
                type="button"
                on:click={handleURL}
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >Generate QR</button
            >
        </div>
    {:else if active == "Email"}
        <div class={`p-4 rounded-lg bg-gray-800`}>
            <div class="grid gap-6 mb-6 md:grid-cols-2">
                <div class="mb-6">
                    <label
                        for="email.email"
                        class="block mb-2 text-sm text-left font-medium dark:text-white"
                        >Email address</label
                    >
                    <input
                        type="email"
                        id="email.email"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="john.doe@company.com"
                        bind:value={$emailForm.email}
                        required
                    />
                </div>
                <div class="mb-6">
                    <label
                        for="email.cc"
                        class="block mb-2 text-sm text-left font-medium dark:text-white"
                        >CC</label
                    >
                    <input
                        type="text"
                        id="email.cc"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="jane.doe@othercompany.com"
                        bind:value={$emailForm.cc}
                    />
                </div>
            </div>
            <div class="mb-6">
                <label
                    for="email.subject"
                    class="block mb-2 text-sm text-left font-medium dark:text-white"
                    >Subject</label
                >
                <input
                    type="text"
                    id="email.subject"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Subject"
                    bind:value={$emailForm.subject}
                />
            </div>
            <div class="mb-6">
                <label
                    for="email.body"
                    class="block mb-2 text-sm text-left font-medium dark:text-white"
                    >Body</label
                >
                <textarea
                    id="email.body"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="My email content"
                    bind:value={$emailForm.body}
                />
            </div>
            <button
                type="button"
                on:click={handleEmail}
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >Generate Email QR</button
            >
        </div>
    {:else if active == "Phone"}
        <div class={`p-4 rounded-lg bg-gray-800`}>
            <label for="phone" class="block mb-2 text-sm font-medium text-white"
                >Enter phone number</label
            >
            <input
                type="phone"
                id="phone"
                placeholder="313 596 5200"
                bind:value={$phoneForm.number}
                class="border border-gray-300 text-white bg-gray-800 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <br />
            <button
                type="button"
                on:click={handlePhone}
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >Generate QR</button
            >
        </div>
    {:else if active == "WI-FI"}
        <div class={`p-4 rounded-lg bg-gray-800`}>
            <div class="grid gap-4 mb-6 md:grid-cols-2">
                <div class="mb-6">
                    <label
                        for="wifi.ssid"
                        class="block mb-2 text-sm text-left font-medium dark:text-white"
                        >Network name</label
                    >
                    <input
                        type="text"
                        id="wifi.ssid"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="SSID (required)"
                        bind:value={$wifiForm.ssid}
                        required
                    />
                </div>
                <div class="mb-6">
                    <label
                        for="wifi.user"
                        class="block mb-2 text-sm text-left font-medium dark:text-white"
                        >Username</label
                    >
                    <input
                        type="text"
                        id="wifi.user"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Optional"
                        bind:value={$wifiForm.user}
                    />
                </div>
                <div class="mb-6">
                    <label
                        for="wifi.pwd"
                        class="block mb-2 text-sm text-left font-medium dark:text-white"
                        >Password</label
                    >
                    <input
                        type="password"
                        id="wifi.pwd"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Optional"
                        bind:value={$wifiForm.pwd}
                    />
                </div>
                {#if $wifiForm.pwd}
                    <div class="mb-6">
                        <label
                            for="wifi.encryption"
                            class="block mb-2 text-sm text-left font-medium dark:text-white"
                            >Encryption</label
                        >
                        <select
                            id="wifi.encryption"
                            bind:value={$wifiForm.encryption}
                            class="block w-full h-1/2 p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option value="WPA" selected>WPA/WPA2</option>
                            <option value="WEP">WEP</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                {/if}
            </div>
            <div class="flex items-center mb-6">
                <input
                    id="wifi.hidden"
                    type="checkbox"
                    bind:checked={$wifiForm.hidden}
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                    for="wifi.hidden"
                    class="ml-2 text-sm font-medium text-white dark:text-gray-300"
                    >Hidden</label
                >
            </div>
            <button
                type="button"
                on:click={handleWifi}
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >Generate WI-FI QR</button
            >
        </div>
    {:else if active == "OTP"}
        <div class={`p-4 rounded-lg bg-gray-800`}>
            <div class="grid gap-4 mb-6 md:grid-cols-2">
                <div class="mb-6">
                    <label
                        for="otp.type"
                        class="block mb-2 text-sm text-left font-medium dark:text-white"
                        >Type</label
                    >
                    <!-- <input
                        type="text"
                        id="otp.type"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="totp or hotp"
                        bind:value={$otpForm.type}
                        required
                    /> -->
                    <select
                        bind:value={$otpForm.type}
                        id="otp.type"
                        class="block w-full h-1/2 p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        <option value="totp" selected>TOTP</option>
                        <option value="hotp">HOTP</option>
                    </select>
                </div>
                <div class="mb-6">
                    <label
                        for="otp.label"
                        class="block mb-2 text-sm text-left font-medium dark:text-white"
                        >Label</label
                    >
                    <input
                        type="text"
                        id="otp.label"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Name:alice@google.com"
                        bind:value={$otpForm.label}
                        required
                    />
                </div>
                <div class="mb-6">
                    <label
                        for="otp.params.secret"
                        class="block mb-2 text-sm text-left font-medium dark:text-white"
                        >Secret</label
                    >
                    <input
                        type="password"
                        id="otp.params.secret"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="mysecretkey"
                        bind:value={$otpForm.params.secret}
                        required
                    />
                </div>
                <div class="mb-6">
                    <label
                        for="otp.params.issuer"
                        class="block mb-2 text-sm text-left font-medium dark:text-white"
                        >Issuer</label
                    >
                    <input
                        type="text"
                        id="otp.params.issuer"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Provider (recommended)"
                        bind:value={$otpForm.params.issuer}
                    />
                </div>
                <div class="mb-6">
                    <label
                        for="otp.params.algo"
                        class="block mb-2 text-sm text-left font-medium dark:text-white"
                        >Algorithm</label
                    >
                    <!-- <input
                        type="text"
                        id="otp.params.algo"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="SHA1 (default)"
                        bind:value={$otpForm.params.algorithm}
                    /> -->
                    <select
                        bind:value={$otpForm.params.algorithm}
                        id="otp.params.type"
                        class="block w-full h-1/2 p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        <option value="SHA1" selected>SHA1</option>
                        <option value="SHA256">SHA256</option>
                        <option value="SHA512">SHA512</option>
                    </select>
                </div>
                <div class="mb-6">
                    <label
                        for="otp.params.digits"
                        class="block mb-2 text-sm text-left font-medium dark:text-white"
                        >Digits</label
                    >
                    <input
                        type="number"
                        id="otp.params.digits"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="6 (default)"
                        bind:value={$otpForm.params.digits}
                    />
                </div>
                {#if $otpForm.type == "hotp"}
                    <div class="mb-6">
                        <label
                            for="otp.params.counter"
                            class="block mb-2 text-sm text-left font-medium dark:text-white"
                            >Counter</label
                        >
                        <input
                            type="number"
                            id="otp.params.counter"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder={Math.floor(
                                Math.random() * 100000
                            ).toString()}
                            bind:value={$otpForm.params.counter}
                        />
                    </div>
                {:else}
                    <div class="mb-6">
                        <label
                            for="otp.params.period"
                            class="block mb-2 text-sm text-left font-medium dark:text-white"
                            >Period</label
                        >
                        <input
                            type="number"
                            id="otp.params.period"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="30"
                            bind:value={$otpForm.params.period}
                        />
                    </div>
                {/if}
            </div>
            <button
                type="button"
                on:click={handleOtp}
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >Generate OTP Auth QR</button
            >
        </div>
    {/if}
</div>

<br />
{#if $input}
    <img class="h-auto max-w-lg rounded-lg" src={$input} alt="QR code" />
{/if}
