"use server";

import {
  addConnection,
  connection,
  deleteConnectionById,
  getAllConnections,
  updateConnectionById,
} from "@scylla-studio/lib/internal-db/connections";

export async function fetchConnections(): Promise<connection[]> {
  return await getAllConnections();
}

export async function saveNewConnection(newConnection: connection) {
  await addConnection(newConnection);
}

export async function updateConnection(
  connectionId: number,
  updatedConnection: connection
) {
  await updateConnectionById(connectionId, updatedConnection);
}

export async function deleteConnection(connectionId: number) {
  if (!connectionId) {
    throw new Error("Connection ID is required to delete.");
  }
  await deleteConnectionById(connectionId);
}
