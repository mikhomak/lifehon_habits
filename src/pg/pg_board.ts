import * as db from "./pg_index";

export type Board_Model = {
  id: number;
  user_id: string;
};

export type Column_Model = {
  name: string;
  habits?: Habit_Model[];
  tasks?: Task_Model[];
};

export type Habit_Model = {
  id: number;
  name: string;
  positive: boolean;
  counter: number;
};

export type Task_Model = {
  id: number;
  name: string;
  finished: boolean;
};

export async function getBoard(user_id: number): Promise<Board_Model> {
  const { rows } = await db.query("SELECT * FROM lh_board WHERE user_id = $1", [
    user_id,
  ]);

  return rows[0] as Board_Model;
}

export async function createBoard(user_id: number) {
  const { rows } = await (
    await db.getClient()
  ).query("INSERT INTO lh_board(user_id) VALUES($1) RETURNING *", [user_id]);

  return rows[0] as Board_Model;
}

export async function getColumns(
  board_id: number,
  user_id: number
): Promise<Column_Model[]> {
  const { rows } = await db.query(
    `SELECT col.*, coalesce(json_agg_strict( DISTINCT task), '[]'::json) AS "tasks", coalesce(json_agg_strict(DISTINCT habit), '[]'::json) AS "habits"
      FROM lh_board_column AS col 
      INNER JOIN lh_task AS task ON task.column_name=col.name 
      INNER JOIN lh_habit AS habit ON habit.column_name=col.name 
      WHERE col.board_id = $1 AND col.user_id = $2 
      AND task.board_id IS NULL OR (task.board_id = $1 AND task.user_id = $2)
      AND habit.board_id IS NULL OR (habit.board_id = $1 AND habit.user_id = $2)
      GROUP BY col.name, col.board_id`,
    [board_id, user_id]
  );

  return rows as Column_Model[];
}

export async function createColumn(
  name: string,
  position: number,
  board_id: number,
  user_id: number
): Promise<Column_Model> {
  const { rows } = await db.query(
    "INSERT INTO lh_board_column(name, position, board_id, user_id) VALUES($1, $2, $3, $4) RETURNING *",
    [name, position, board_id, user_id]
  );

  return rows[0] as Column_Model;
}

export async function createTask(
  name: string,
  column_name: string,
  board_id: number,
  user_id: number
): Promise<Task_Model> {
  const { rows } = await db.query(
    "INSERT INTO lh_task(name, column_name, board_id, user_id) VALUES($1, $2, $3, $4) RETURNING *",
    [name, column_name, board_id, user_id]
  );

  return rows[0] as Task_Model;
}

export async function createHabit(
  name: string,
  positive: boolean,
  column_name: string,
  board_id: number,
  user_id: number
): Promise<Habit_Model> {
  const { rows } = await db.query(
    "INSERT INTO lh_habit(name, positive, column_name, board_id, user_id) VALUES($1, $2, $3, $4, $5) RETURNING *",
    [name, positive, column_name, board_id, user_id]
  );

  return rows[0] as Habit_Model;
}
