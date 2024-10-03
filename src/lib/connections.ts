"server only";
import type { ScyllaSession } from "@lambda-group/scylladb";
import type { Connection } from "./internal-db/connections";

export interface AvailableConnections extends Connection {
	session: ScyllaSession;
}

export const connections: AvailableConnections[] = [];
