import { serve } from "@hono/node-server";
import { Hono } from "hono";
import dotenv from "dotenv";
import { check_token, type User } from "./hapi/hapi_user";
import { bearerAuth } from "hono/bearer-auth";
import { contextStorage, getContext } from "hono/context-storage";
import { createBoard, getBoard } from "./pg/pg_board";

dotenv.config();

type Context = {
  Variables: {
    currentUser: User;
  };
};

const app = new Hono<Context>();

app.use(contextStorage());

app.use(
  "/api/*",
  bearerAuth({
    verifyToken: async (token, c) => {
      try {
        const currentUser = await check_token(token);
        c.set("currentUser", currentUser);
      } catch (err) {
        console.error(err);
        return false;
      }

      return true;
    },
  })
);

app.get("/api/board", async (c) => {
  const currentUser = getContext<Context>().var.currentUser;
  const board = await getBoard(currentUser.id);

  return c.json(board);
});

app.post("/api/board", async (c) => {
  c.status(201);

  const currentUser = await getContext<Context>().var.currentUser;
  console.log(currentUser)
  const board = await createBoard(currentUser.id);
  return c.json(board);
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
