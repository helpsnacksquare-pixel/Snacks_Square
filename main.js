import {Hono} from "hono";
import { serveStatic } from "hono/deno";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());
app.get("/", serveStatic({root:"public/admin/pages"}))
app.get("*", serveStatic({root:"public/admin"}))

Deno.serve({port:8000},app.fetch)
