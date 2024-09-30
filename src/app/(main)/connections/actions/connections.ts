"use server";

import {
  addConnection,
  connection,
  getAllConnections,
} from "@scylla-studio/lib/internal-db/connections";

export async function fetchConnections(): Promise<connection[]> {
  return await getAllConnections();
}

export async function saveNewConnection(newConnection: connection) {
  await addConnection(newConnection);
}
