"use client";
import Editor, { Monaco } from "@monaco-editor/react";
import { Button } from "@scylla-studio/components/ui/button";
import debounce from "lodash.debounce";
import { editor } from "monaco-editor";
import { useCallback, useEffect, useRef, useState } from "react";
import { getFullQueryAtCursor } from "./utils";

export function CqlEditor() {
  const [code, setCode] = useState("");
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null); // Ref for Monaco editor
  const decorationsRef = useRef<editor.IEditorDecorationsCollection | null>(null);

  // Load saved query from localStorage when the component mounts
  useEffect(() => {
    const savedCode = localStorage.getItem("cqlEditorQuery");
    if (savedCode) {
      setCode(savedCode);
    }
  }, []);

  // Function to save the query to local storage
  const saveToLocalStorage = (query: string) => {
    localStorage.setItem("cqlEditorQuery", query);
  };

  // Debounced save function using lodash
  const debouncedSave = useCallback(debounce(saveToLocalStorage, 500), []);


  // Function to execute the selected CQL query
  const executeStatement = (statement: string) => {
    alert(`Executing: ${statement}`);
    // Add your CQL execution logic here (e.g., send to backend service)
  };

  const handleCodeChange = (newValue?: string) => {
    const updatedCode = newValue || "";
    setCode(updatedCode);
    debouncedSave(updatedCode); // Save to local storage with debounce
  };

  // Handle execution of the selected statement or all statements
  const handleExecute = () => {
    const editor = editorRef.current;
    const range = editor?.getSelection();

    if (!range) return;

    const selectedText = editor?.getSelection() ? editor?.getModel()?.getValueInRange(range) : '';

    if (!selectedText) return

    if (selectedText.trim()) {
      // If there is a selected query, execute it
      executeStatement(selectedText);
    } else {
      // If no selection, execute all queries
      const statements = code.split(";").filter((stmt) => stmt.trim() !== "");
      statements.forEach(executeStatement);
    }
  };

  const highlightQueryAtCursor = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    if (!decorationsRef.current)
      decorationsRef.current = editor.createDecorationsCollection()

    const currentQuery = getFullQueryAtCursor(editor, monaco);

    if (!currentQuery) {
      decorationsRef.current.clear();
      return;
    }

    decorationsRef.current.clear();
    decorationsRef.current.set([
      {
        range: currentQuery.range,
        options: {
          isWholeLine: true,
          className: 'border-l-2 border-yellow-500', // Apply Tailwind highlight classes
        },
      },
    ]);
  };

  // Use the onMount lifecycle to get access to the editor and monaco instance
  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;

    // Add event listener to highlight the query whenever the cursor position changes
    editor.onDidChangeCursorPosition(() => {
      highlightQueryAtCursor(editor, monaco);
    });

    // Ctrl+Enter to execute the query the cursor is above
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      const fullQuery = getFullQueryAtCursor(editor, monaco);

      if (fullQuery && fullQuery.query) {
        executeStatement(fullQuery.query);
      }
    });
  };

  return (
    <div className="h-[calc(100vh-112px)] w-full flex flex-col">
      <div className="flex-1">
        <Editor
          height="100%"
          theme="vs-dark"
          language="sql"
          value={code}
          onMount={handleEditorDidMount}
          onChange={handleCodeChange}
          options={{
            fontSize: 16,
            selectOnLineNumbers: true,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
        />
      </div>
      <div className="p-2 bg-slate-800 text-white flex justify-end">
        <Button
          variant="outline"
          onClick={handleExecute}
        >
          Execute All CQL Statements
        </Button>
      </div>
    </div>
  );
}
