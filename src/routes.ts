//@ts-ignore
import Home from "./pages/Home.svelte";
//@ts-ignore
import Latex from "./pages/Latex.svelte";
import NotFound from "./pages/NotFound.svelte";
import QR from "./pages/QR.svelte";
import URL from "./pages/URL.svelte"
import type { SvelteComponentDev } from "svelte/internal";

type page = {
    label: string,
    location: string,
    page: typeof SvelteComponentDev,
    hidden?: boolean
}

const pages: page[] = [
    { label: "Home", location: "/", page: Home },
    { label: "LaTeX Editor", location: "/latex", page: Latex },
    { label: "QR Generator", location: "/qrcode", page: QR},
    { label: "URL Shortener", location: "/shorten", page: URL},
    { label: "Not Found", hidden: true, location: "*", page: NotFound},
]

export type { page };

export default { pages };
