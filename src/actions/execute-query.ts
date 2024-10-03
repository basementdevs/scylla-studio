"use server";

import { Cluster } from "@lambda-group/scylladb";
import { connections } from "@scylla-studio/lib/connections";
import type { QueryResult } from "@scylla-studio/lib/execute-query";
import type { Connection } from "@scylla-studio/lib/internal-db/connections";
import { actionClient } from "@scylla-studio/lib/safe-actions";
import { z } from "zod";

export const executeQueryAction = actionClient
	.schema(
		z.object({
			query: z.string(),
			limit: z.number().optional(),
			connection: z.object({
				host: z.string(),
				id: z.number().optional(),
				name: z.string().optional(),
				username: z.string().optional(),
				password: z.string().optional(),
				nodes: z.any().optional(),
				dc: z.any().optional(),
			}),
		}),
	)
	.action(async ({ parsedInput }) => {
		const session = await getSession(parsedInput.connection);
		let query = parsedInput.query;

		// remove the semicolon, then add the limit
		if (parsedInput.limit)
			query = query.replace(/;$/, ` LIMIT ${parsedInput.limit};`);

		return (await session.executeWithTracing(query)) as QueryResult;
	});

/**
 * Retrieves or establishes a session for the given connection.
 *
 * This function attempts to find an existing connection by matching the provided
 * `inputConnection`'s `id` with the stored connections. If a matching connection is found,
 * it validates the session by performing a health check query. If the session is invalid or
 * not found, a new session is created and stored.
 *
 * If no matching connection is found, a new connection and session are created and stored.
 *
 * @param {Partial<Connection>} inputConnection - The connection details used to find or establish a session.
 * @returns {Promise<Session>} - A promise that resolves to the session object.
 * @throws {Error} - Throws an error if the session is not found after validation.
 */
export const getSession = async (inputConnection: Partial<Connection>) => {
	const connection = connections.find((c) => c.id === inputConnection.id);

	let session = connection?.session;

	// if a connection was never open and stored, then create a new connection
	if (!connection) {
		const cluster = new Cluster({
			nodes: [`${inputConnection.host}:9042`],
		});
		session = await cluster.connect();
		connections.push({
			...(inputConnection as Connection),
			session,
		});

		return session;
	}

	// validate if the session still exists on the database
	const healthCheck = await session?.execute("SELECT * FROM system.local");
	console.debug("healthCheck", healthCheck);

	// if the session is not valid, then create a new connection
	if (!healthCheck) {
		const cluster = new Cluster({
			nodes: [`${inputConnection.host}:9042`],
		});
		const newSession = await cluster.connect();
		connection.session = newSession;

		return newSession;
	}

	if (!session) throw new Error("Session not found");

	// the session exists and still valid
	return session;
};
