"use server";

import {
  addConnection,
  type Connection,
  deleteConnectionById,
  getAllConnections,
  updateConnectionById,
} from "@scylla-studio/lib/internal-db/connections";
import {Auth, Cluster, ClusterConfig} from "@lambda-group/scylladb";

export async function fetchConnections(): Promise<Connection[]> {
  return await getAllConnections();
}

async function validateConnectionStatus(newConnection: Connection) {
  let connectionObject = {
    nodes: [`${newConnection.host}:${newConnection.port}`],
    auth: ((newConnection.username && newConnection.password) && {
      username: newConnection.username,
      password: newConnection.password
    } as Auth || undefined),
  } as ClusterConfig;

  try {
    const cluster = new Cluster(connectionObject);
    let session = await cluster.connect();
    newConnection.status = 'Connected';
  } catch (e: any) {
    let message = e.message as string;
    console.log(message)
    if (message.includes('Connection reset by peer') || message.includes('Authentication is required')) {
      newConnection.status = 'Refused';
    } else {
      newConnection.status = 'Offline';
    }
  }
  return newConnection;
}

export async function saveNewConnection(newConnection: Connection) {

  // TODO: validate the connection status before saving
  newConnection = await validateConnectionStatus(newConnection);

  await addConnection(newConnection);
}

export async function updateConnection(
  connectionId: number,
  updatedConnection: Connection
) {

  updatedConnection = await validateConnectionStatus(updatedConnection);
  await updateConnectionById(connectionId, updatedConnection);
}

export async function deleteConnection(connectionId: number) {
  if (!connectionId) {
    throw new Error("Connection ID is required to delete.");
  }
  await deleteConnectionById(connectionId);
}
