"use client";
import { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";

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
