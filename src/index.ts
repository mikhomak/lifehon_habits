import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { getSiteConfiguration } from "./pg/site_configuration";
import dotenv from "dotenv";
import { check_token } from "./hapi/hapi_user";

dotenv.config();
const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/token/:token", async (c) => {
  const user = await check_token(c.req.param("token"));
  return c.text(JSON.stringify(user));
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  async (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
