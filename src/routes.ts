//@ts-nocheck
import Home from "./pages/Home.svelte";
import Latex from "./pages/Latex.svelte";
const pages = [
    { label: "Home", location: "/", page: Home },
    { label: "LaTeX Editor", location: "/latex", page: Latex }
]
export default pages; 
