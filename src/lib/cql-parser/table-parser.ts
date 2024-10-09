import { DescriptionRow } from "@scylla-studio/lib/cql-parser/parser";

interface ColumnDefinition {
  name: string;
  type: string;
}

interface ClusteringDefinition {
  name: string;
  order: "ASC" | "DESC";
}

export interface TableDefinition {
  rawQuery: string;
  tableName: string;
  keyspace: string;
  columns: ColumnDefinition[];
  primaryKey: string[];
  clusteringKeys: string[];
  clusteringOrder: ClusteringDefinition[];
  options: TableOptions;
}

interface TableOptions {
  clusteringOrder: string[];
  bloomFilterFpChance: number;
  caching: Record<string, string>;
  comment: string;
  compaction: Record<string, string>;
  compression: Record<string, string>;
  crcCheckChance: number;
  defaultTimeToLive: number;
  gcGraceSeconds: number;
  maxIndexInterval: number;
  memtableFlushPeriodInMs: number;
  minIndexInterval: number;
  speculativeRetry: string;
}

export const parseTable = (row: DescriptionRow): TableDefinition => {
  const query = row.create_statement;
  if (!query.startsWith("CREATE TABLE")) {
    throw new Error("Invalid input");
  }

  const columns = getColumnDefinitions(query);
  const { partitionKeys, clusteringKeys } = parseTableKeys(query);
  const clusteringOrder = parseClusteringOrder(query);

  return {
    rawQuery: query,
    tableName: row.name,
    keyspace: row.keyspace_name,
    columns: columns,
    primaryKey: partitionKeys,
    clusteringKeys: clusteringKeys,
    clusteringOrder: clusteringOrder,
    options: parseTableOptions(query),
  };
};

const parseTableOptions = (optionsPart: string): TableOptions => {
  const options = {} as TableOptions;

  // Parse clustering order
  const clusteringOrderMatch = optionsPart.match(
    /CLUSTERING ORDER BY\s*\(([^)]+)\)/,
  );
  if (clusteringOrderMatch) {
    options.clusteringOrder = clusteringOrderMatch[1]
      .split(",")
      .map((co) => co.trim());
  }

  // Parse other options using regex
  const optionRegex = /([a-zA-Z0-9_]+)\s*=\s*({[^}]+}|[a-zA-Z0-9_.'%]+)/g;
  let match;
  while ((match = optionRegex.exec(optionsPart)) !== null) {
    const [_, key, value] = match;
    switch (key) {
      case "bloom_filter_fp_chance": {
        options.bloomFilterFpChance = Number.parseFloat(value);
        break;
      }
      case "caching": {
        options.caching = JSON.parse(value.replaceAll("'", '"'));
        break;
      }
      case "comment": {
        options.comment = value.replaceAll("'", "");
        break;
      }
      case "compaction": {
        options.compaction = JSON.parse(value.replaceAll("'", '"'));
        break;
      }
      case "compression": {
        options.compression = JSON.parse(value.replaceAll("'", '"'));
        break;
      }
      case "crc_check_chance": {
        options.crcCheckChance = Number.parseFloat(value);
        break;
      }
      case "default_time_to_live": {
        options.defaultTimeToLive = Number.parseInt(value, 10);
        break;
      }
      case "gc_grace_seconds": {
        options.gcGraceSeconds = Number.parseInt(value, 10);
        break;
      }
      case "max_index_interval": {
        options.maxIndexInterval = Number.parseInt(value, 10);
        break;
      }
      case "memtable_flush_period_in_ms": {
        options.memtableFlushPeriodInMs = Number.parseInt(value, 10);
        break;
      }
      case "min_index_interval": {
        options.minIndexInterval = Number.parseInt(value, 10);
        break;
      }
      case "speculative_retry": {
        options.speculativeRetry = value.replaceAll("'", "");
        break;
      }
      default: {
        break;
      }
    }
  }

  return options;
};
// Function to parse table details from a DescriptionRow

// Helper functions (parseClusteringOrder, parseTableKeys, getColumnDefinitions) remain unchanged

function parseClusteringOrder(
  create_table_cql: string,
): ClusteringDefinition[] {
  if (!create_table_cql.includes("CLUSTERING ORDER BY")) {
    return [];
  }

  return create_table_cql
    .split("CLUSTERING ORDER BY (")[1]
    .split(")")[0]
    .split(", ")
    .map((key) => key.trim())
    .filter((key) => key !== "")
    .map((key) => {
      const [name, order] = key.split(" ");
      return { name, order: order as "ASC" | "DESC" };
    });
}

function parseTableKeys(create_table_cql: string) {
  const keysPart = create_table_cql
    .split("PRIMARY KEY (")[1]
    ?.split(") WITH")[0]
    ?.trim();

  const partitionKeys: string[] = [];
  const clusteringKeys: string[] = [];

  if (!keysPart?.includes(",")) {
    let partitionKeys = keysPart?.split(")") || [];
    return { partitionKeys, clusteringKeys };
  }

  if (keysPart?.startsWith("(")) {
    partitionKeys.push(
      ...keysPart
        .split("(")[1]
        .split(")")[0]
        .split(", ")
        .map((key) => key.trim()),
    );
    clusteringKeys.push(
      ...keysPart
        .split(")")[1]
        .split(", ")
        .map((key) => key.trim()),
    );
  } else {
    const keysArray = keysPart?.split(", ").map((key) => key.trim()) || [];
    partitionKeys.push(keysArray[0]);
    clusteringKeys.push(...keysArray.slice(1));
  }

  return { partitionKeys, clusteringKeys };
}

function getColumnDefinitions(create_table_cql: string): ColumnDefinition[] {
  return create_table_cql
    .split("(")[1]
    .split(")")[0]
    .split(",")
    .map((column) => {
      const [name, type] = column.trim().split(" ");
      return { name, type };
    })
    .slice(0, -1);
}
