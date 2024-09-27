"use client";
import Editor, { Monaco, useMonaco } from "@monaco-editor/react";
import { executeQueryAction } from "@scylla-studio/actions/execute-query";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@scylla-studio/components/ui/dropdown-menu";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@scylla-studio/components/ui/resizable";
import debounce from "lodash.debounce";
import { Play } from "lucide-react";
import { editor } from "monaco-editor";
import { useAction } from "next-safe-action/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ResultsRender } from "./results-render";
import { getFullQueryAtCursor } from "./utils";

enum ExecuteType {
  ALL,
  CURRENT,
}

export function CqlEditor() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<Array<Record<string, unknown>>>([]);
  const monaco = useMonaco();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<editor.IEditorDecorationsCollection | null>(null);
  const executeQuery = useAction(executeQueryAction, {
    onSuccess: ({ data }) => {
      setResult(data ?? []);
    },
    onError: ({ error }) => {
      console.error("Failed to execute query", error);
      toast.error("Failed to execute query", {
        description: error?.serverError ?? error?.validationErrors?._errors ?? error?.bindArgsValidationErrors ?? "",
        closeButton: true,
      });
    },
  });

  // Load saved query from localStorage when the component mounts
  useEffect(() => {
    const savedCode = localStorage.getItem("cqlEditorQuery");
    if (savedCode) {
      setCode(savedCode);
    }
  }, []);

  // Function to save the query to local storage
  const saveToLocalStorage = (query: string) => localStorage.setItem("cqlEditorQuery", query);
  // Debounced save function using lodash
  const debouncedSave = useCallback(debounce(saveToLocalStorage, 500), []);

  const handleCodeChange = (newValue?: string) => {
    const updatedCode = newValue || "";
    setCode(updatedCode);
    debouncedSave(updatedCode); // Save to local storage with debounce
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
        executeQuery.execute(fullQuery.query);
      }
    });

    // Shift+Enter to execute all queries
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      const statements = editor.getModel()?.getValue().split(";").filter((stmt) => stmt.trim() !== "");
      statements?.forEach(executeQuery.execute);
    });
  };

  const handleExecute = (executeType: ExecuteType) => {
    if (!editorRef.current || !monaco) return;

    switch (executeType) {
      case ExecuteType.CURRENT:
        const fullQuery = getFullQueryAtCursor(editorRef.current, monaco);
        if (fullQuery && fullQuery.query) executeQuery.execute(fullQuery.query);
        break;
      case ExecuteType.ALL:
        const statements = code.split(";").filter((stmt) => stmt.trim() !== "");
        statements.forEach(executeQuery.execute);
        break;
    }
  }

  return (
    <div className="h-[calc(100vh-112px)] w-full flex flex-col">
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={75} className="flex flex-col w-full h-full">
          <div className="flex justify-between px-4 sm:px-8 border-t bg-background/60 py-1">
            <div />
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-green-600 rounded p-1"><Play size={16} /></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="flex justify-between" onClick={() => handleExecute(ExecuteType.CURRENT)}>
                  <span>Run current query</span>
                  <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">Ctrl + Enter</span>
                  </kbd>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex justify-between" onClick={() => handleExecute(ExecuteType.ALL)}>
                  <span>
                    Run all
                  </span>
                  <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">Shift + Enter</span>
                  </kbd>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="flex flex-col">
          <ResultsRender data={result} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
