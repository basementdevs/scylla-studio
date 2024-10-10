import { ScyllaSession } from "@lambda-group/scylladb";
import {
  KeyspaceDefinition,
  parseCreateKeyspace,
} from "@scylla-studio/lib/cql-parser/keyspace-parser";
import {
  TableDefinition,
  parseTable,
} from "@scylla-studio/lib/cql-parser/table-parser";

export interface DescriptionRow {
  type: string;
  create_statement: string;
  keyspace_name: string;
  name: string;
}

export async function parseKeyspaces(
  session: ScyllaSession,
): Promise<Record<string, KeyspaceDefinition>> {
  const parsedKeyspaces = new Map<string, KeyspaceDefinition>();
  const rows = await session.execute("DESC keyspaces");

  for (const row of rows) {
    const result: DescriptionRow[] = await session.execute(
      `DESC ${row.keyspace_name}`,
    );

    let parsedKeyspace = {} as KeyspaceDefinition;

    for (const row of result) {
      switch (row.type) {
        case "keyspace": {
          parsedKeyspace = parseCreateKeyspace(row);
          break;
        }
        case "table": {
          parsedKeyspace.tables.set(row.name, parseTable(row));
          break;
        }
        // eslint-disable-next-line unicorn/no-useless-switch-case
        case "materialized_view":
        // TODO: Implement materialized view parser

        // eslint-disable-next-line unicorn/no-useless-switch-case
        case "UDTs":
        // TODO: Implement UDT parser
        default: {
          break;
        }
      }
    }

    parsedKeyspaces.set(row.keyspace_name, parsedKeyspace);
  }

  return Object.fromEntries(parsedKeyspaces);
}
