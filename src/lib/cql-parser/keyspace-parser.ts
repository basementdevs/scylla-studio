import { DescriptionRow } from "@scylla-studio/lib/cql-parser/parser";
import { TableDefinition } from "@scylla-studio/lib/cql-parser/table-parser";

export interface KeyspaceDefinition {
	name: string;
	entitiesCount: number;
	replication: {
		class: string;
		datacenters: Map<string, number>;
	};
	durableWrites: boolean;
	tablets: boolean;
	tables: Map<string, TableDefinition>;
}

// Parse the 'CREATE KEYSPACE' query into a KeyspaceDefinition object
export function parseCreateKeyspace(row: DescriptionRow): KeyspaceDefinition {
	const query = row.create_statement;
	let replicationClass = "";
	const datacenters = new Map<string, number>();
	let durableWrites = true; // Default in Cassandra
	let tablets = true; // Default value

	// Extract the 'WITH' clause
	const withClauseMatch = query.match(/WITH (.+)$/i);
	if (withClauseMatch) {
		const withClause = withClauseMatch[1];

		// Parse replication settings
		parseReplication(withClause, datacenters);
		replicationClass = getReplicationClass(withClause);

		// Extract durable_writes
		const durableWritesMatch = withClause.match(
			/durable_writes\s*=\s*(true|false)/i,
		);
		if (durableWritesMatch) {
			durableWrites = durableWritesMatch[1].toLowerCase() === "true";
		}

		// Extract tablets
		const tabletsMatch = withClause.match(
			/tablets\s*=\s*\{.*'enabled'\s*:\s*(true|false)\}/i,
		);
		if (tabletsMatch) {
			tablets = tabletsMatch[1].toLowerCase() === "true";
		}
	}

	return {
		name: row.name,
		entitiesCount: 0,
		replication: {
			class: replicationClass,
			datacenters: datacenters,
		},
		durableWrites: durableWrites,
		tablets: tablets,
		tables: new Map<string, TableDefinition>(),
	};
}

// Helper function to parse replication settings
function parseReplication(
	withClause: string,
	datacenters: Map<string, number>,
) {
	const replicationMatch = withClause.match(/replication\s*=\s*\{(.+?)\}/);
	if (replicationMatch) {
		const replicationSettings = replicationMatch[1].split(", ");
		for (const setting of replicationSettings) {
			const [key, value] = setting
				.split(":")
				.map((part) => part.trim().replaceAll(/['"]/g, ""));

			if (key !== "class") {
				// Assume it's a datacenter replication factor
				datacenters.set(key, Number.parseInt(value, 10));
			}
		}
	}
}

// Helper function to extract replication class
function getReplicationClass(withClause: string): string {
	const replicationClassMatch = withClause.match(/'class'\s*:\s*'(.+?)'/);
	return replicationClassMatch ? replicationClassMatch[1] : "";
}
