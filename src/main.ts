import './app.css'
import routing from "./routes"
import type { page as pageType } from "./routes"
import { routes} from "svelte-hash-router";
//@ts-ignore
import App from './App.svelte'

let routingConf = {};
for (let { location, page } of routing.pages) {
  routingConf[location] = page;
}

routes.set(routingConf);

/*  let routingConf = routing.pages.map((page: pageType) => {
    return { [page.location]: page.page };
  }); */
const app = new App({
  target: document.getElementById('app'),
})

export default app
