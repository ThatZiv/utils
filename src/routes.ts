//@ts-ignore
import Home from "./pages/Home.svelte";
//@ts-ignore
import Latex from "./pages/Latex.svelte";
import NotFound from "./pages/NotFound.svelte";
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
    { label: "Not Found", hidden: true, location: "*", page: NotFound}
]

export type { page };

export default { pages };
