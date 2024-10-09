import Database from "better-sqlite3";

const database = new Database("connections.db");

database.exec(`
  CREATE TABLE IF NOT EXISTS connections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    host TEXT,
    port INTEGER,
    username TEXT,
    password TEXT,
    dc INTEGER,
    nodes INTEGER
  )
`);

database.exec(`
  INSERT OR IGNORE INTO connections 
    (id, name, host, port, username, password, dc, nodes)
  VALUES 
    (1, 'ScyllaDB Localhost', 'localhost', '9042', null, null, 'local', 1) 
`);

export async function getAllConnections(): Promise<Connection[]> {
	return database
		.prepare(
			"SELECT id, name, host, port, username, password, dc, nodes FROM connections",
		)
		.all() as Connection[];
}

export function addConnection(connection: Connection) {
	const { name, host, port, username, password, dc, nodes } = connection;

	const stmt = database.prepare(`
    INSERT INTO connections (name, host, port, username, password, dc, nodes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
	stmt.run(name, host, port, username, password, 3, nodes);
}

export function updateConnectionById(
	connectionId: number,
	updatedConnection: Connection,
) {
	const { name, host, username, password, dc, nodes, port } = updatedConnection;
	const stmt = database.prepare(`
    UPDATE connections
    SET name = ?, host = ?, username = ?, password = ?, dc = ?, nodes = ?, port = ?
    WHERE id = ?
  `);
	stmt.run(name, host, username, password, dc, nodes, port, connectionId);
}

export function deleteConnectionById(connectionId: number) {
	const stmt = database.prepare(`
    DELETE FROM connections WHERE id = ?
  `);
	stmt.run(connectionId);
}

export type Connection = {
	id?: number;
	name: string;
	host: string;
	port: number;
	username: string | null;
	password: string | null;
	dc?: string;
	nodes?: number;
};
