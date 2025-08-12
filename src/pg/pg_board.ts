import * as db from "./pg_index";

export type Board_Model = {
  id: number;
  user_id: string;
};

export type Column_Model = {
  name: string;
  habbits?: Habbit_Model[];
  tasks?: Task_Model[];
};

export type Habbit_Model = {
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
  user_id: string
): Promise<Column_Model[]> {
  const { rows } = await db.query(
    "SELECT * FROM lh_board_column JOIN WHERE board_id = $1 AND user_id = $1",
    [board_id, user_id]
  );

  return rows as Column_Model[];
}

export async function createColumn(
  name: string,
  position: number,
  board_id: number,
  user_id: number,
): Promise<Column_Model> {
  const { rows } = await db.query(
    "INSERT INTO lh_board_column(name, position, board_id, user_id) VALUES($1, $2, $3, $4) RETURNING *",
    [name, position, board_id, user_id]
  );

  return rows[0] as Column_Model;
}
