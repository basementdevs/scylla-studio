import { languages } from "monaco-editor";

const TokenClassConsts = {
  BINARY: "binary",
  BINARY_ESCAPE: "binary.escape",
  COMMENT: "comment",
  COMMENT_QUOTE: "comment.quote",
  DELIMITER: "delimiter",
  DELIMITER_CURLY: "delimiter.curly",
  DELIMITER_PAREN: "delimiter.paren",
  DELIMITER_SQUARE: "delimiter.square",
  IDENTIFIER: "identifier",
  IDENTIFIER_QUOTE: "identifier.quote",
  KEYWORD: "keyword",
  KEYWORD_SCOPE: "keyword.scope",
  NUMBER: "number",
  NUMBER_FLOAT: "number.float",
  NUMBER_BINARY: "number.binary",
  NUMBER_OCTAL: "number.octal",
  NUMBER_HEX: "number.hex",
  OPERATOR: "operator",
  OPERATOR_KEYWORD: "operator.keyword",
  OPERATOR_SYMBOL: "operator.symbol",
  PREDEFINED: "predefined",
  STRING: "string",
  STRING_DOUBLE: "string.double",
  STRING_ESCAPE: "string.escape",
  TYPE: "type",
  VARIABLE: "variable",
  WHITE: "white",
};

export const conf: languages.LanguageConfiguration = {
  comments: {
    lineComment: "--",
    blockComment: ["/*", "*/"],
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
};

export const cql_language = <languages.IMonarchLanguage>{
  defaultToken: "",
  tokenPostfix: ".cql",
  ignoreCase: true,

  brackets: [
    { open: "[", close: "]", token: TokenClassConsts.DELIMITER_SQUARE },
    { open: "(", close: ")", token: TokenClassConsts.DELIMITER_PAREN },
    { open: "{", close: "}", token: TokenClassConsts.DELIMITER_CURLY },
  ],

  keywords: [
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
  ],

  operators: [
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
  ],

  builtinFunctions: [
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
  ],

  builtinVariables: [],

  typeKeywords: [
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
  ],

  scopeKeywords: ["BEGIN", "APPLY", "BATCH", "IF", "ELSE"],

  pseudoColumns: [],

  tokenizer: {
    root: [
      { include: "@comments" },
      { include: "@whitespace" },
      { include: "@numbers" },
      { include: "@strings" },
      { include: "@complexIdentifiers" },
      { include: "@scopes" },
      { include: "@complexOperators" },
      [/[;,.]/, TokenClassConsts.DELIMITER],
      [/[\(\)\[\]\{\}]/, "@brackets"],
      [
        /[\w@]+/,
        {
          cases: {
            "@scopeKeywords": TokenClassConsts.KEYWORD_SCOPE,
            "@operators": TokenClassConsts.OPERATOR_KEYWORD,
            "@typeKeywords": TokenClassConsts.TYPE,
            "@builtinVariables": TokenClassConsts.VARIABLE,
            "@builtinFunctions": TokenClassConsts.PREDEFINED,
            "@keywords": TokenClassConsts.KEYWORD,
            "@default": TokenClassConsts.IDENTIFIER,
          },
        },
      ],
      [/[<>=!%&+\-*/|~^]/, TokenClassConsts.OPERATOR_SYMBOL],
    ],
    comments: [
      [/--+.*/, TokenClassConsts.COMMENT],
      [/\/\*/, { token: TokenClassConsts.COMMENT_QUOTE, next: "@comment" }],
    ],
    whitespace: [[/\s+/, TokenClassConsts.WHITE]],
    comment: [
      [/[^*/]+/, TokenClassConsts.COMMENT],
      [/\*\//, { token: TokenClassConsts.COMMENT_QUOTE, next: "@pop" }],
      [/./, TokenClassConsts.COMMENT],
    ],
    numbers: [
      [/0[xX][0-9a-fA-F]+/, TokenClassConsts.NUMBER_HEX],
      [/[$][+-]*\d*(\.\d*)?/, TokenClassConsts.NUMBER],
      [/((\d+(\.\d*)?)|(\.\d+))([eE][\-+]?\d+)?/, TokenClassConsts.NUMBER],
    ],
    strings: [
      [/'/, { token: TokenClassConsts.STRING, next: "@stringSingle" }],
      [/"/, { token: TokenClassConsts.STRING, next: "@stringDouble" }],
    ],
    stringSingle: [
      [/\\'/, TokenClassConsts.STRING_ESCAPE],
      [/[^']+/, TokenClassConsts.STRING],
      [/''/, TokenClassConsts.STRING],
      [/'/, { token: TokenClassConsts.STRING, next: "@pop" }],
    ],
    stringDouble: [
      [/[^"]+/, TokenClassConsts.STRING],
      [/""/, TokenClassConsts.STRING],
      [/"/, { token: TokenClassConsts.STRING, next: "@pop" }],
    ],
    complexIdentifiers: [
      [
        /"/,
        {
          token: TokenClassConsts.IDENTIFIER_QUOTE,
          next: "@quotedIdentifierDouble",
        },
      ],
    ],
    quotedIdentifierDouble: [
      [/[^"]+/, TokenClassConsts.IDENTIFIER],
      [/""/, TokenClassConsts.IDENTIFIER],
      [/"/, { token: TokenClassConsts.IDENTIFIER_QUOTE, next: "@pop" }],
    ],
    scopes: [],
    complexOperators: [
      [/IS\s+NOT\s+NULL\b/i, { token: TokenClassConsts.OPERATOR_KEYWORD }],
      [/IS\s+NULL\b/i, { token: TokenClassConsts.OPERATOR_KEYWORD }],
      [
        /NOT\s+(IN|CONTAINS|CONTAINS\s+KEY)\b/i,
        { token: TokenClassConsts.OPERATOR_KEYWORD },
      ],
      [/CONTAINS\s+KEY\b/i, { token: TokenClassConsts.OPERATOR_KEYWORD }],
      [/CONTAINS\b/i, { token: TokenClassConsts.OPERATOR_KEYWORD }],
      [/ALLOW\s+FILTERING\b/i, { token: TokenClassConsts.KEYWORD }],
    ],
  },
};
