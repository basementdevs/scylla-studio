"use client";

import Editor, { type Monaco, useMonaco } from "@monaco-editor/react";
import {
  executeQueryAction,
  type TracingResult,
} from "@scylla-studio/actions/execute-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@scylla-studio/components/ui/dropdown-menu";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@scylla-studio/components/ui/resizable";
import debounce from "lodash.debounce";
import { Braces, Play, SearchCode } from "lucide-react";
import type { editor } from "monaco-editor";
import { useAction } from "next-safe-action/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ResultsRender } from "./results-render";
import { getFullQueryAtCursor } from "./utils";
import { Tabs, TabsList, TabsTrigger } from "@scylla-studio/components/ui/tabs";
import { cn } from "@scylla-studio/lib/utils";
import { TracingRender } from "./tracing-render";

enum ExecuteType {
  ALL = 0,
  CURRENT = 1,
}

enum DisplayTabs {
  RESULT = "result",
  TRACING = "tracing",
}

export function CqlEditor() {
  const [code, setCode] = useState("");
  const [queryResult, setQueryResult] = useState<
    Array<Record<string, unknown>>
  >([]);
  const [queryTracing, setQueryTracing] = useState<TracingResult>(
    {} as TracingResult,
  );
  const [activeTab, setActiveTab] = useState<string>(DisplayTabs.RESULT);

  const monaco = useMonaco();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<editor.IEditorDecorationsCollection | null>(
    null,
  );
  const executeQuery = useAction(executeQueryAction, {
    onSuccess: ({ data }) => {
      setQueryResult(data?.result ?? []);
      setQueryTracing(data?.tracing ?? ({} as TracingResult));
    },
    onError: ({ error }) => {
      console.error("Failed to execute query", error);
      toast.error("Failed to execute query", {
        description:
          error?.serverError ??
          error?.validationErrors?._errors ??
          error?.bindArgsValidationErrors ??
          "",
        closeButton: true,
      });
    },
  });

  // Load saved query from localStorage when the component mounts
  useEffect(() => {
    const savedCode = localStorage.getItem("cqlEditorQuery");
    if (savedCode) setCode(savedCode);
  }, []);

  // Debounced save function using lodash
  const debouncedSave = useCallback(
    (query: string) =>
      debounce(() => localStorage.setItem("cqlEditorQuery", query), 500),
    [],
  );

  const handleCodeChange = (newValue?: string) => {
    const updatedCode = newValue || "";
    setCode(updatedCode);
    debouncedSave(updatedCode); // Save to local storage with debounce
  };

  const highlightQueryAtCursor = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) => {
    if (!decorationsRef.current)
      decorationsRef.current = editor.createDecorationsCollection();

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
          className: "border-l-2 border-yellow-500", // Apply Tailwind highlight classes
        },
      },
    ]);
  };

  // Use the onMount lifecycle to get access to the editor and monaco instance
  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) => {
    editorRef.current = editor;

    // Add event listener to highlight the query whenever the cursor position changes
    editor.onDidChangeCursorPosition(() => {
      highlightQueryAtCursor(editor, monaco);
    });

    // Ctrl+Enter to execute the query the cursor is above
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      const fullQuery = getFullQueryAtCursor(editor, monaco);

      if (fullQuery?.query) executeQuery.execute(fullQuery.query);
    });

    // Shift+Enter to execute all queries
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      const statements = editor
        .getModel()
        ?.getValue()
        .split(";")
        .filter((stmt) => stmt.trim() !== "");
      statements?.forEach(executeQuery.execute);
    });
  };

  const handleExecute = (executeType: ExecuteType) => {
    if (!editorRef.current || !monaco) return;

    switch (executeType) {
      case ExecuteType.CURRENT: {
        const fullQuery = getFullQueryAtCursor(editorRef.current, monaco);
        if (fullQuery?.query) executeQuery.execute(fullQuery.query);
        break;
      }
      case ExecuteType.ALL: {
        const statements = code.split(";").filter((stmt) => stmt.trim() !== "");
        statements.forEach(executeQuery.execute);
        break;
      }
    }
  };

  return (
    <div className="h-[calc(100vh-112px)] w-full flex flex-col">
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel
          defaultSize={75}
          className="flex flex-col w-full h-full"
        >
          <div className="flex justify-between px-4 sm:px-8 border-t bg-background/60 py-1">
            <div />
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-green-600 rounded p-1">
                <Play size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="flex justify-between"
                  onClick={() => handleExecute(ExecuteType.CURRENT)}
                >
                  <span>Run current query</span>
                  <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">Ctrl + Enter</span>
                  </kbd>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex justify-between"
                  onClick={() => handleExecute(ExecuteType.ALL)}
                >
                  <span>Run all</span>
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
        <ResizablePanel className="flex flex-row">
          {!queryResult || queryResult.length === 0 ? null : (
            <Tabs
              orientation="vertical"
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex"
            >
              <TabsList className="flex h-full flex-col justify-start p-0 rounded-none">
                <TabsTrigger
                  value={DisplayTabs.RESULT}
                  className={cn(
                    "w-full justify-center rounded-none px-4 py-2 text-left hover:bg-white/10",
                    activeTab === DisplayTabs.RESULT && "bg-white",
                  )}
                >
                  <Braces size={16} />
                </TabsTrigger>

                <TabsTrigger
                  value={DisplayTabs.TRACING}
                  className={cn(
                    "w-full justify-center rounded-none px-4 py-2 text-left hover:bg-white/10",
                    activeTab === DisplayTabs.TRACING && "bg-white",
                  )}
                >
                  <SearchCode size={18} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          {activeTab === DisplayTabs.TRACING ? (
            <TracingRender data={queryTracing} />
          ) : (
            <ResultsRender data={queryResult} />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
