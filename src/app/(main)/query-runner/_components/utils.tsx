"use client";
import { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";

/**
 * Get the full query at the cursor position in the editor
**/
export const getFullQueryAtCursor = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
  const model = editor.getModel();
  let position = editor.getPosition();

  if (!model || !position) return null;

  const fullText = model.getValue(); // Get all text

  // find the line with the semicolon
  let found = false;
  let endLineIdx = position.lineNumber;
  while (model.getLineCount() >= endLineIdx) {
    const currentLine = model.getLineContent(endLineIdx);
    if (currentLine.includes(";")) { found = true; break; }
    endLineIdx++;
  }

  if (!found) return null;

  // get the index of the semicolon in the line
  const endQueryIndex = model.getLineLastNonWhitespaceColumn(endLineIdx);
  const endQueryPosition = new monaco.Position(endLineIdx, endQueryIndex);

  // from the end of the query, find the beggining of the query
  let startIndex = 0;
  for (let i = model.getOffsetAt(endQueryPosition) - 2; i >= 0; i--) {
    if (fullText[i] === ";") break;

    // if the current index is any letter or number, set the start index to the current index
    if (fullText[i].match(/[a-zA-Z0-9]/i))
      startIndex = i;
  }

  // Create the range for the query
  const range = new monaco.Range(
    model.getPositionAt(startIndex).lineNumber,
    model.getPositionAt(startIndex).column,
    endQueryPosition.lineNumber,
    endQueryPosition.column
  );

  // Extract the full query
  const query = model.getValueInRange(range).trim();
  return {
    range,
    query
  };
};
