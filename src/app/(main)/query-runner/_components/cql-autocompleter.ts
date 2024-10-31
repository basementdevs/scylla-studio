import { useMonaco } from "@monaco-editor/react";

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

// Helper function to create completion items
export const cqlCompletionItemProvider = (monacoInstance: MonacoInstance) => {
  const defaultRange = {
    startLineNumber: 0,
    startColumn: 0,
    endLineNumber: 0,
    endColumn: 0,
  };
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
      label: value,
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
};
