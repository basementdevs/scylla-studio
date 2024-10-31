import * as monaco from "monaco-editor";

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
function createCompletionItem(
  label: string,
  kind: monaco.languages.CompletionItemKind,
  documentation?: string,
  insertText?: string,
): monaco.languages.CompletionItem {
  return {
    label,
    kind,
    documentation,
    range: {
      startLineNumber: 0,
      startColumn: 0,
      endLineNumber: 0,
      endColumn: 0,
    },
    insertText: insertText || label,
    insertTextRules:
      monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  };
}

// Build completion items
const completionItems: monaco.languages.CompletionItem[] = [];

// Add keywords to completion items
keywords.forEach((keyword) => {
  completionItems.push(
    createCompletionItem(
      keyword,
      monaco.languages.CompletionItemKind.Keyword,
      "Keyword",
    ),
  );
});

// Add functions to completion items
functions.forEach((func) => {
  completionItems.push(
    createCompletionItem(
      func,
      monaco.languages.CompletionItemKind.Function,
      "Function",
      func + "($0)",
    ),
  );
});

// Add data types to completion items
dataTypes.forEach((type) => {
  completionItems.push(
    createCompletionItem(
      type,
      monaco.languages.CompletionItemKind.TypeParameter,
      "Data Type",
    ),
  );
});

// Add operators to completion items
operators.forEach((operator) => {
  completionItems.push(
    createCompletionItem(
      operator,
      monaco.languages.CompletionItemKind.Operator,
      "Operator",
    ),
  );
});

// Implement the CompletionItemProvider
export const cqlCompletionItemProvider: monaco.languages.CompletionItemProvider =
  {
    triggerCharacters: [" ", ".", "(", ")"],
    provideCompletionItems: (
      model: monaco.editor.ITextModel,
      position: monaco.Position,
      context: monaco.languages.CompletionContext,
      token: monaco.CancellationToken,
    ) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      // Filter suggestions based on the current word
      const suggestions = completionItems
        .filter((item) =>
          item.label.toLowerCase().startsWith(word.word.toLowerCase()),
        )
        .map((item) => ({ ...item, range }));

      return { suggestions };
    },
  };
