"use server";

import { Auth, Cluster, ClusterConfig } from "@lambda-group/scylladb";
import {
	type Connection,
	addConnection,
	deleteConnectionById,
	getAllConnections,
	updateConnectionById,
} from "@scylla-studio/lib/internal-db/connections";

export async function fetchConnections(): Promise<Connection[]> {
	return await getAllConnections();
}

async function validateConnectionStatus(newConnection: Connection) {
	let connectionObject = {
		nodes: [`${newConnection.host}:${newConnection.port}`],
		auth:
			(newConnection.username &&
				newConnection.password &&
				({
					username: newConnection.username,
					password: newConnection.password,
				} as Auth)) ||
			undefined,
	} as ClusterConfig;

	try {
		const cluster = new Cluster(connectionObject);
		await cluster.connect();
		newConnection.status = "Connected";
	} catch (error: any) {
		let message = error.message as string;
		console.log(message);
		newConnection.status =
			message.includes("Connection reset by peer") ||
			message.includes("Authentication is required")
				? "Refused"
				: "Offline";
	}
	return newConnection;
}

export async function saveNewConnection(newConnection: Connection) {
	// TODO: validate the connection status before saving
	newConnection = await validateConnectionStatus(newConnection);

	addConnection(newConnection);
}

export async function updateConnection(
	connectionId: number,
	updatedConnection: Connection,
) {
	updatedConnection = await validateConnectionStatus(updatedConnection);
	updateConnectionById(connectionId, updatedConnection);
}

export async function deleteConnection(connectionId: number) {
	if (!connectionId) {
		throw new Error("Connection ID is required to delete.");
	}
	deleteConnectionById(connectionId);
}
