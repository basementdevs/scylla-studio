"use server";

import {Auth, Cluster, ClusterConfig} from "@lambda-group/scylladb";
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
				host: z.string().refine((value) => {
					// Regex for matching localhost:port
					const localhostRegex = /^localhost$/;
					// Regex for matching IPv4 addresses
					const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})$/;
					// Regex for matching domain-style address (example: node-0.aws-sa-east-1.1695b05c8e05b5237178.clusters.scylla.cloud)
					const domainRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z0-9.-]+$/;

					return localhostRegex.test(value) || ipv4Regex.test(value) || domainRegex.test(value);
				}),
				id: z.number().optional(),
				name: z.string().optional(),
				port: z.coerce.number().optional(),
				username: z.string().nullable(),
				password: z.string().nullable(),
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
	console.log(`${inputConnection.host}:${inputConnection.port}`);
	let session = connection?.session;

	// prepare the object for upcomming connections
	let connectionObject = {
		nodes: [`${inputConnection.host}:${inputConnection.port}`],
	} as ClusterConfig;

	if (inputConnection.username && inputConnection.password) {
		connectionObject.auth = {
			username: inputConnection.username,
			password: inputConnection.password
		} as Auth;
	}

	// TODO: add support for tls

	// if a connection was never open and stored, then create a new connection
	if (!connection) {
		const cluster = new Cluster(connectionObject);
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
		const cluster = new Cluster(connectionObject);
		const newSession = await cluster.connect();
		connection.session = newSession;

		return newSession;
	}

	if (!session) throw new Error("Session not found");

	// the session exists and still valid
	return session;
};
