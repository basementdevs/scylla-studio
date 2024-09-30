import Database from "better-sqlite3";

const db = new Database("connections.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS connections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    host TEXT,
    username TEXT,
    password TEXT,
    dc TEXT,
    nodes INTEGER
  )
`);

export function getAllConnections(): connection[] {
  return db
    .prepare(
      "SELECT id, name, host, username, password, dc, nodes FROM connections"
    )
    .all() as connection[];
}

export function addConnection(connection: connection) {
  const { name, host, username, password, dc, nodes } = connection;
  const stmt = db.prepare(`
    INSERT INTO connections (name, host, username, password, dc, nodes)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(name, host, username, password, dc, nodes);
}

export function updateConnectionById(
  connectionId: number,
  updatedConnection: connection
) {
  const { name, host, username, password, dc, nodes } = updatedConnection;
  const stmt = db.prepare(`
    UPDATE connections
    SET name = ?, host = ?, username = ?, password = ?, dc = ?, nodes = ?
    WHERE id = ?
  `);
  stmt.run(name, host, username, password, dc, nodes, connectionId);
}

export function deleteConnectionById(connectionId: number) {
  const stmt = db.prepare(`
    DELETE FROM connections WHERE id = ?
  `);
  stmt.run(connectionId);
}

export type connection = {
  id?: number;
  name: string;
  host: string;
  username: string;
  password: string;
  dc?: string;
  nodes: number;
};
