import { useMonaco } from "@monaco-editor/react";
import { getFullQueryAtCursor } from "@scylla-studio/app/(main)/query-runner/_components/utils";
import { useCqlFilters } from "@scylla-studio/hooks/use-cql-filters";
import { editor } from "monaco-editor";

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

function getDefaultSuggestions(monacoInstance: MonacoInstance) {
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
    item.data.map((value) => ({
      label: {
        label: value,
        detail: null,
        description:
          monacoInstance.languages.CompletionItemKind[
            syntaxType as keyof typeof monacoInstance.languages.CompletionItemKind
          ],
      },
      kind: monacoInstance.languages.CompletionItemKind[
        syntaxType as keyof typeof monacoInstance.languages.CompletionItemKind
      ],
      documentation: item.description,
      range: defaultRange,
      insertText: value,
      insertTextRules:
        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    })),
  );
}

// Helper function to create completion items
export const cqlCompletionItemProvider = (
  monacoInstance: MonacoInstance,
  editor: editor.IStandaloneCodeEditor,
) => {
  const cursor = getFullQueryAtCursor(editor, monacoInstance);

  if (!cursor) return getDefaultSuggestions(monacoInstance);

  const textUntilPosition = cursor.query.split("\n\n").shift() || "";

  console.log(textUntilPosition);

  const useKeyspaceRegex = /USE\s+(\w*)$/i;
  const fromTableRegex = /FROM\s+(\w*)$/i;
  const selectColumnRegex = /SELECT\s+([\w,\s]*)$/i;
  const whereColumnRegex = /WHERE\s+(\w*)$/i;

  if (useKeyspaceRegex.test(textUntilPosition)) {
    return [
      {
        label: {
          label: "my_keyspace",
          detail: "lalalala",
          description: "Keyspace",
        },
        kind: monacoInstance.languages.CompletionItemKind.Keyword,
        documentation: "Keyspace belongs to the current cluster {cluster_name}",
        range: defaultRange,
        insertText: "my_keyspace",
        insertTextRules:
          monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
    ];
  } else if (fromTableRegex.test(textUntilPosition)) {
    return [
      {
        label: {
          label: "my_keyspace.messages",
          detail: "lalalala",
          description: "Table", // materialized views?
        },
        kind: monacoInstance.languages.CompletionItemKind.Class,
        documentation: "Table with stuff trust me",
        range: defaultRange,
        insertText: "monstrously_long_keyspace_name.messages",
        insertTextRules:
          monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      },
    ];
  } else if (selectColumnRegex.test(textUntilPosition)) {
    // TODO: or we display everything related to all tables or we display nothing
    return getDefaultSuggestions(monacoInstance);

    // return [
    //   {
    //     label: {
    //       label: "monstrously_long_keyspace_name.messages",
    //       detail: "lalalala",
    //       description: "that's definitely something"
    //     },
    //     kind: monacoInstance.languages.CompletionItemKind.Keyword,
    //     documentation: "Keyword",
    //     range: defaultRange,
    //     insertText: "monstrously_long_keyspace_name.messages",
    //     insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    //   },
    // ];
  } else if (whereColumnRegex.test(textUntilPosition)) {
    return [
      {
        label: {
          label: "field1",
          detail: "(from table x)",
          description: "Column",
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
