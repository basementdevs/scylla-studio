"use server";

import {
  addConnection,
  type Connection,
  deleteConnectionById,
  getAllConnections,
  updateConnectionById,
} from "@scylla-studio/lib/internal-db/connections";

export async function fetchConnections(): Promise<Connection[]> {
  return await getAllConnections();
}

export async function saveNewConnection(newConnection: Connection) {

  // TODO: validate the connection status before saving


  await addConnection(newConnection);
}

export async function updateConnection(
  connectionId: number,
  updatedConnection: Connection
) {
  await updateConnectionById(connectionId, updatedConnection);
}

export async function deleteConnection(connectionId: number) {
  if (!connectionId) {
    throw new Error("Connection ID is required to delete.");
  }
  await deleteConnectionById(connectionId);
}
