import { serve } from "@hono/node-server";
import { Hono } from "hono";
import dotenv from "dotenv";
import { check_token, type User } from "./hapi/hapi_user";
import { bearerAuth } from "hono/bearer-auth";
import { contextStorage, getContext } from "hono/context-storage";
import {
  createBoard,
  createColumn,
  createHabit,
  createTask,
  getBoard,
  getColumns,
  type Board_Model,
} from "./pg/pg_board";

dotenv.config();

type Context = {
  Variables: {
    currentUser: User;
    currentBoard: Board_Model;
  };
};

const app = new Hono<Context>();

app.use(contextStorage());

app.use(
  "/api/*",
  bearerAuth({
    verifyToken: async (token, c) => {
      try {
        // setting session context
        const currentUser = await check_token(token);
        c.set("currentUser", currentUser);

        let currentBoard = await getBoard(currentUser.id);
        if (!currentBoard) {
          currentBoard = await createBoard(currentUser.id);
        }
        c.set("currentBoard", currentBoard);
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

  const currentUser = getContext<Context>().var.currentUser;
  const board = await createBoard(currentUser.id);
  return c.json(board);
});

app.get("/api/board/columns", async (c) => {
  const currentUser = getContext<Context>().var.currentUser;
  const currentBoard = getContext<Context>().var.currentBoard;
  const columns = await getColumns(currentBoard.id, currentUser.id);

  return c.json(columns);
});

app.post("/api/board/column", async (c) => {
  const body = await c.req.json();
  const currentUser = getContext<Context>().var.currentUser;
  const currentBoard = getContext<Context>().var.currentBoard;

  const column = await createColumn(
    body.name,
    body.position,
    currentBoard.id,
    currentUser.id
  );
  c.status(201);
  return c.json(column);
});

app.post("/api/board/column/:name/task", async (c) => {
  const body = await c.req.json();
  const column_name = c.req.param("name");
  const currentUser = getContext<Context>().var.currentUser;
  const currentBoard = getContext<Context>().var.currentBoard;

  const task = await createTask(
    body.name,
    column_name,
    currentBoard.id,
    currentUser.id
  );
  c.status(201);
  return c.json(task);
});

app.post("/api/board/column/:name/habit", async (c) => {
 const body = await c.req.json();
  const column_name = c.req.param("name");
  const currentUser = getContext<Context>().var.currentUser;
  const currentBoard = getContext<Context>().var.currentBoard;

  const task = await createHabit(
    body.name,
    body.positive,
    column_name,
    currentBoard.id,
    currentUser.id
  );
  c.status(201);
  return c.json(task);
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
