"use client";
import type { ScyllaKeyspace } from "@lambda-group/scylladb";
import type { Monaco } from "@monaco-editor/react";
import type { KeyspaceDefinition } from "@scylla-studio/lib/cql-parser/keyspace-parser";
import { editor } from "monaco-editor";

type TableCompletion = {
  keyspace: string;
  table: string;
};

/**
 * Get the full query at the cursor position in the editor
 **/
export const getFullQueryAtCursor = (
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco,
) => {
  const model = editor.getModel();
  const position = editor.getPosition();

  if (!model || !position) return null;

  const fullText = model.getValue(); // Get all text

  // find the line with the semicolon
  let found = false;
  let endLineIndex = position.lineNumber;
  while (model.getLineCount() >= endLineIndex) {
    const currentLine = model.getLineContent(endLineIndex);

    if (currentLine.includes(";")) {
      found = true;
      break;
    }
    endLineIndex++;
  }

  if (!found) return null;

  // get the index of the semicolon in the line
  const endQueryIndex = model.getLineLastNonWhitespaceColumn(endLineIndex);
  const endQueryPosition = new monaco.Position(endLineIndex, endQueryIndex);

  // from the end of the query, find the beggining of the query
  let startIndex = 0;
  for (
    let index = model.getOffsetAt(endQueryPosition) - 2;
    index >= 0;
    index--
  ) {
    if (fullText[index] === ";") break;

    // if the current index is any letter or number, set the start index to the current index
    if (/[a-zA-Z0-9]/i.test(fullText[index])) startIndex = index;
  }

  // Create the range for the query
  const range = new monaco.Range(
    model.getPositionAt(startIndex).lineNumber,
    model.getPositionAt(startIndex).column,
    endQueryPosition.lineNumber,
    endQueryPosition.column,
  );

  // Extract the full query
  const query = model.getValueInRange(range).trim();
  return {
    range,
    query,
  };
};

// Get the query of the line that has been edited
export const getSingleLineQueryAtCursor = (
  editor: editor.IStandaloneCodeEditor,
  monaco: Monaco,
) => {
  const model = editor.getModel();
  const position = editor.getPosition();

  if (!model || !position) return null;

  const lineText = model.getLineContent(position.lineNumber);

  return {
    range: position,
    query: lineText,
  };
};

// Format keyspaces to suggestions model
export const formatKeyspaces = (
  data: Record<string, ScyllaKeyspace>,
): KeyspaceDefinition[] => {
  const keyspaces = Object.entries(data).map((keyspace) => ({
    name: keyspace[0],
    ...keyspace[1],
  }));

  return keyspaces as any as KeyspaceDefinition[];
};

// Format Keyspaces tables to suggestions format
export const formatKeyspacesTables = (data: Record<string, ScyllaKeyspace>) => {
  const tables = Object.entries(data).reduce((acc, value) => {
    const data = Object.keys(value[1].tables).map((table) => ({
      keyspace: value[0],
      table: table,
    }));

    acc.push(...data);

    return acc;
  }, [] as TableCompletion[]);

  return tables;
};
