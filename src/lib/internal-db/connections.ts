import Database from "better-sqlite3";

const db = new Database("./connections.db");

// Available Status: Connected, Refused, Offline
// -> Connected: Successfully connected to the database
// -> Refused: Connection refused by the database (wrong credentials, etc)
// -> Offline: Database is offline

type ConnectionStatus = "Connected" | "Refused" | "Offline";

db.exec(`
  CREATE TABLE IF NOT EXISTS connections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    host TEXT,
    port INTEGER,
    status TEXT,
    username TEXT,
    password TEXT,
    dc INTEGER,
    nodes INTEGER
  )
`);

// db.exec(`
//   INSERT OR IGNORE INTO connections
//     (id, name, status, host, port, username, password, dc, nodes)
//   VALUES
//     (1, 'ScyllaDB Localhost', 'Offline', 'localhost', '9042', null, null, 'local', 1)
// `);

export async function getAllConnections(): Promise<Connection[]> {
  return db
    .prepare(
      "SELECT id, name, status, host, port, username, password, dc, nodes FROM connections",
    )
    .all() as Connection[];
}

export function addConnection(connection: Connection) {
  const { name, host, port, status, username, password, dc, nodes } =
    connection;

  const stmt = db.prepare(`
    INSERT INTO connections (name, host, port, status, username, password, dc, nodes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(name, host, port, status, username, password, 3, nodes);
}

export function updateConnectionById(
  connectionId: number,
  updatedConnection: Connection,
) {
  const { name, host, username, status, password, dc, nodes, port } =
    updatedConnection;
  const stmt = db.prepare(`
    UPDATE connections
    SET name = ?, host = ?, username = ?, status = ?, password = ?, dc = ?, nodes = ?, port = ?
    WHERE id = ?
  `);
  stmt.run(
    name,
    host,
    username,
    status,
    password,
    dc,
    nodes,
    port,
    connectionId,
  );
}

export async function deleteConnectionById(connectionId: number) {
  const stmt = db.prepare(`
    DELETE FROM connections WHERE id = ?
  `);
  stmt.run(connectionId);
}

export type Connection = {
  id?: number;
  name: string;
  host: string;
  port: number;
  status?: ConnectionStatus;
  username: string | null;
  password: string | null;
  dc?: string;
  nodes?: number;
};
