import { useMonaco } from "@monaco-editor/react";
import KeyspaceDefinitions from "@scylla-studio/app/(main)/keyspace/[keyspace]/_components/keyspace-tables";
import { getFullQueryAtCursor } from "@scylla-studio/app/(main)/query-runner/_components/utils";
import { useCqlFilters } from "@scylla-studio/hooks/use-cql-filters";
import { KeyspaceDefinition } from "@scylla-studio/lib/cql-parser/keyspace-parser";
import { TableDefinition } from "@scylla-studio/lib/cql-parser/table-parser";
import {
  CompletionItem,
  CompletionItemLabel,
  editor,
  languages,
} from "monaco-editor";

export type MonacoInstance = NonNullable<ReturnType<typeof useMonaco>>;

// Define CQL keywords, functions, data types, and operators
const keywords = [
  "ADD",
  "AGGREGATE",
  "ALL",
  "ALLOW",
  "ALTER",
  "AND",
  "ANY",
  "APPLY",
  "AS",
  "ASC",
  "AUTHORIZE",
  "BATCH",
  "BEGIN",
  "BY",
  "CAST",
  "COLUMNFAMILY",
  "CREATE",
  "CUSTOM",
  "DELETE",
  "DESC",
  "DISTINCT",
  "DROP",
  "ENTRIES",
  "EXISTS",
  "FILTERING",
  "FROM",
  "FULL",
  "FUNCTION",
  "GRANT",
  "IF",
  "IN",
  "INDEX",
  "INFINITY",
  "INSERT",
  "INTO",
  "IS",
  "JSON",
  "KEY",
  "KEYSPACE",
  "KEYSPACES",
  "LANGUAGE",
  "LIMIT",
  "LOGIN",
  "MATERIALIZED",
  "MODIFY",
  "NAN",
  "NAMESPACE",
  "NORECURSIVE",
  "NOT",
  "NULL",
  "OF",
  "ON",
  "OPTIONS",
  "OR",
  "ORDER",
  "PARTITION",
  "PASSWORD",
  "PER",
  "PERMISSION",
  "PERMISSIONS",
  "PRIMARY",
  "REVOKE",
  "SCHEMA",
  "SELECT",
  "SET",
  "SFUNCTION",
  "STATIC",
  "STORAGE",
  "SUPERUSER",
  "TABLE",
  "TOKEN",
  "TRUNCATE",
  "TTL",
  "TYPE",
  "UNLOGGED",
  "UPDATE",
  "USE",
  "USER",
  "USERS",
  "USING",
  "VALUES",
  "VIEW",
  "WHERE",
  "WITH",
  "WRITETIME",
];

const functions = [
  "blobAsBigint",
  "blobAsBoolean",
  "blobAsDecimal",
  "blobAsDouble",
  "blobAsFloat",
  "blobAsInt",
  "blobAsText",
  "blobAsTimestamp",
  "blobAsUUID",
  "blobAsVarchar",
  "blobAsVarint",
  "dateOf",
  "now",
  "unixTimestampOf",
  "uuid",
  "timeuuid",
  "minTimeuuid",
  "maxTimeuuid",
  "toDate",
  "toTimestamp",
  "toUnixTimestamp",
  "writetime",
  "ttl",
  "token",
  "bigintAsBlob",
  "booleanAsBlob",
  "dateAsBlob",
  "decimalAsBlob",
  "doubleAsBlob",
  "floatAsBlob",
  "inetAsBlob",
  "intAsBlob",
  "textAsBlob",
  "timestampAsBlob",
  "timeuuidAsBlob",
  "uuidAsBlob",
  "varcharAsBlob",
  "varintAsBlob",
];

const dataTypes = [
  "ascii",
  "bigint",
  "blob",
  "boolean",
  "counter",
  "date",
  "decimal",
  "double",
  "float",
  "frozen",
  "inet",
  "int",
  "list",
  "map",
  "set",
  "smallint",
  "text",
  "time",
  "timestamp",
  "timeuuid",
  "tinyint",
  "tuple",
  "uuid",
  "varchar",
  "varint",
];

const operators = [
  "=",
  ">",
  "<",
  ">=",
  "<=",
  "!=",
  "+",
  "-",
  "*",
  "/",
  "%",
  "IN",
  "CONTAINS",
  "CONTAINS KEY",
  "AND",
  "OR",
  "NOT",
  "IS",
  "NULL",
  "IS NOT NULL",
  "IS NULL",
];

const defaultRange = {
  startLineNumber: 0,
  startColumn: 0,
  endLineNumber: 0,
  endColumn: 0,
};

function getDefaultSuggestions(
  monacoInstance: MonacoInstance,
): languages.CompletionItem[] {
  const cqlSyntax = {
    [monacoInstance.languages.CompletionItemKind.Keyword]: {
      data: keywords,
      description: "Keyword",
    },
    [monacoInstance.languages.CompletionItemKind.Function]: {
      data: functions,
      description: 'func + "($0)"',
    },
    [monacoInstance.languages.CompletionItemKind.TypeParameter]: {
      data: dataTypes,
      description: "Data Type",
    },
    [monacoInstance.languages.CompletionItemKind.Operator]: {
      data: operators,
      description: "Operator",
    },
  };

  return Object.entries(cqlSyntax).flatMap(([syntaxType, item]) =>
    item.data.map(
      (value) =>
        ({
          label: {
            label: value,
            detail:
              monacoInstance.languages.CompletionItemKind[
                syntaxType as keyof typeof monacoInstance.languages.CompletionItemKind
              ].toString(),
            description: item.description,
          } as languages.CompletionItemLabel,
          kind: monacoInstance.languages.CompletionItemKind[
            syntaxType as keyof typeof monacoInstance.languages.CompletionItemKind
          ],
          documentation: item.description,
          range: defaultRange,
          insertText: value,
          insertTextRules:
            monacoInstance.languages.CompletionItemInsertTextRule
              .InsertAsSnippet,
        }) as languages.CompletionItem,
    ),
  );
}

function prepareUseSuggestions(
  monacoInstance: MonacoInstance,
  keyspaces: KeyspaceDefinition[],
): languages.CompletionItem[] {
  return keyspaces.map(
    (keyspace) =>
      ({
        label: {
          label: keyspace.name,
          detail: "",
          description: "Keyspace",
        } as languages.CompletionItemLabel,
        kind: monacoInstance.languages.CompletionItemKind.Class,
        documentation: "TODO: build documentation with the Keyspace Object",
        range: defaultRange,
        insertText: keyspace.name,
        insertTextRules:
          monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      }) as languages.CompletionItem,
  );
}

type TableCompletion = {
  keyspace: string;
  table: string;
};

function prepareTablesSuggestions(
  monacoInstance: MonacoInstance,
  tables: TableCompletion[],
): languages.CompletionItem[] {
  return tables.map(
    (table) =>
      ({
        label: {
          label: `${table.keyspace}.${table.table}`,
          detail: "",
          description: "Table",
        } as languages.CompletionItemLabel,
        kind: monacoInstance.languages.CompletionItemKind.Class,
        documentation: "TODO: build documentation with the Keyspace Object",
        range: defaultRange,
        insertText: `${table.keyspace}.${table.table}`,
        insertTextRules:
          monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      }) as languages.CompletionItem,
  );
}

// Helper function to create completion items
export const cqlCompletionItemProvider = (
  monacoInstance: MonacoInstance,
  editor: editor.IStandaloneCodeEditor,
): languages.CompletionItem[] => {
  const cursor = getFullQueryAtCursor(editor, monacoInstance);

  if (!cursor) return getDefaultSuggestions(monacoInstance);

  const textUntilPosition = cursor.query.split("\n\n").shift() || "";

  const useKeyspaceRegex = /USE\s+(\w*)$/i;
  const fromTableRegex = /FROM\s+(\w*)$/i;
  const selectColumnRegex = /SELECT\s+([\w,\s]*)$/i;
  const whereColumnRegex = /WHERE\s+(\w*)$/i;

  // Check if you're typing a keyspace
  if (useKeyspaceRegex.test(textUntilPosition)) {
    const keyspaces = [
      {
        // TODO: this should be a real keyspace
        name: "my_keyspace",
        entitiesCount: 1337, // Ignore this until I figure out what it is
        replication: {
          class: "NetworkTopologyStrategy",
          datacenters: new Map<string, number>(),
        },
        durableWrites: true,
        tablets: true,
        tables: new Map<string, TableDefinition>(),
      },
    ] as KeyspaceDefinition[];

    return prepareUseSuggestions(monacoInstance, keyspaces);
  } else if (fromTableRegex.test(textUntilPosition)) {
    const tables = [
      {
        keyspace: "my_keyspace",
        table: "my_table",
      },
      {
        keyspace: "my_keyspace",
        table: "my_table2",
      },
    ] as TableCompletion[];

    return prepareTablesSuggestions(monacoInstance, tables);
  } else if (selectColumnRegex.test(textUntilPosition)) {
    // TODO: or we display everything related to all tables or we display nothing
    return getDefaultSuggestions(monacoInstance);
  } else if (whereColumnRegex.test(textUntilPosition)) {
    // TODO: here we would need to fetch all related columns from the specific table mentioned previously
    return [
      {
        label: {
          label: "field1",
          detail: "Column",
          description: " - table x ",
        },
        kind: monacoInstance.languages.CompletionItemKind.Keyword,
        documentation: "Column from table x",
        range: defaultRange,
        insertText: "field1",
        insertTextRules:
          monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
    ];
  }

  return getDefaultSuggestions(monacoInstance);
};
