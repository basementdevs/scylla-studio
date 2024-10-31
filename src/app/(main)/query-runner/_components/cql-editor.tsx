"use client";

import Editor, { type Monaco, useMonaco } from "@monaco-editor/react";
import { executeQueryAction } from "@scylla-studio/actions/execute-query";
import { cqlCompletionItemProvider } from "@scylla-studio/app/(main)/query-runner/_components/cql-autocompleter";
import { cql_language } from "@scylla-studio/app/(main)/query-runner/_components/cql-language";
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
import { Skeleton } from "@scylla-studio/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@scylla-studio/components/ui/tabs";
import { useCqlFilters } from "@scylla-studio/hooks/use-cql-filters";
import type { AvailableConnections } from "@scylla-studio/lib/connections";
import type { TracingResult } from "@scylla-studio/lib/execute-query";
import { cn } from "@scylla-studio/lib/utils";
import debounce from "lodash.debounce";
import { Braces, ChartArea, Play, SearchCode } from "lucide-react";
import {
  CancellationToken,
  CompletionItem,
  Position,
  editor,
  languages,
} from "monaco-editor";
import { useAction } from "next-safe-action/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ResultFilters } from "./result-filters";
import { ResultsRender } from "./results-render";
import QueryDashboard from "./tracing-dashboard-render";
import { TracingRender } from "./tracing-render";
import { getFullQueryAtCursor } from "./utils";

enum ExecuteType {
  ALL = 0,
  CURRENT = 1,
}

enum DisplayTabs {
  RESULT = "result",
  TRACING = "tracing",
  DASHBOARD = "dashboard",
}

export function CqlEditor() {
  const [code, setCode] = useState("");
  const [loadingResults, setLoadingResults] = useState(false);
  const [queryResult, setQueryResult] = useState<
    Array<Record<string, unknown>>
  >([]);
  const [queryTracing, setQueryTracing] = useState<TracingResult>(
    {} as TracingResult,
  );
  const [updateKey, setUpdateKey] = useState(0); // Used to force re-render when query is executed
  const [activeTab, setActiveTab] = useState<string>(DisplayTabs.RESULT);
  const currentConnection = useCqlFilters((state) => state.currentConnection);
  const fetchSize = useCqlFilters((state) => state.fetchSize);
  // probably the editor functions uses a memo, so the instance of currentConnection is not updated
  const currentConnectionReference = useRef<AvailableConnections | null>(null);
  const fetchSizeReference = useRef<string | undefined | null>(null);

  const monaco = useMonaco();

  const editorReference = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorationsReference =
    useRef<editor.IEditorDecorationsCollection | null>(null);
  const queryExecutor = useAction(executeQueryAction, {
    onSuccess: ({ data }) => {
      setQueryResult(data?.result ?? []);
      setQueryTracing(data?.tracing ?? ({} as TracingResult));
      setUpdateKey((prev) => prev + 1); // Increment key to force re-render
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

  useEffect(() => {
    currentConnectionReference.current = currentConnection ?? null;
  }, [currentConnection]);

  useEffect(() => {
    fetchSizeReference.current = fetchSize ?? null;
  }, [fetchSize]);

  const executeQuery = async (query: string) => {
    if (!currentConnectionReference.current) {
      toast.error("No connection selected");
      return;
    }
    const limit =
      fetchSizeReference.current === "unset" || !fetchSizeReference.current
        ? undefined
        : Number.parseInt(fetchSizeReference.current);

    const { username, password, ...rest } = currentConnectionReference.current;
    const connection = {
      ...rest,
      username: username ?? null,
      password: password ?? null,
    };

    setLoadingResults(true);
    await queryExecutor.executeAsync({
      query,
      connection,
      limit,
    });
    setLoadingResults(false);
  };

  // Load saved query from localStorage when the component mounts
  useEffect(() => {
    const savedCode = localStorage.getItem("cqlEditorQuery");
    if (savedCode) setCode(savedCode);
  }, []);

  // Debounced save function using lodash
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(
      (query: string) => localStorage.setItem("cqlEditorQuery", query),
      500,
    ),
    [],
  );

  const handleCodeChange = (updatedCode = "") => {
    setCode(updatedCode);
    debouncedSave(updatedCode); // Save to local storage with debounce
  };

  const highlightQueryAtCursor = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) => {
    if (!decorationsReference.current)
      decorationsReference.current = editor.createDecorationsCollection();

    const currentQuery = getFullQueryAtCursor(editor, monaco);

    if (!currentQuery) {
      decorationsReference.current.clear();
      return;
    }

    decorationsReference.current.clear();
    decorationsReference.current.set([
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
    monaco.languages.register({
      id: "cql",
      extensions: [".cql"],
      aliases: ["CQL", "cql"],
      mimetypes: ["text/cql"],
    });

    monaco.languages.setMonarchTokensProvider("cql", cql_language);
    // monaco.languages.registerCompletionItemProvider("cql", {
    //   triggerCharacters: [' ', '.', '(', ')'],
    //   provideCompletionItems(model: editor.ITextModel, position: Position, context: languages.CompletionContext, token: CancellationToken): languages.ProviderResult<languages.CompletionList> {
    //
    //     const completionItems: CompletionItem[] = [
    //       {
    //         label: 'SELECT',
    //         kind: languages.CompletionItemKind.Keyword,
    //         documentation: 'Select data from a table',
    //         range: {
    //           startLineNumber: 0,
    //           startColumn: 0,
    //           endLineNumber: 0,
    //           endColumn: 0
    //         },
    //         insertText: 'SELECT',
    //         insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet
    //       }
    //
    //     ];
    //     return {suggestions: completionItems};
    //
    //     const word = model.getWordUntilPosition(position);
    //     const range = {
    //       startLineNumber: position.lineNumber,
    //       endLineNumber: position.lineNumber,
    //       startColumn: word.startColumn,
    //       endColumn: word.endColumn
    //     };
    //     const suggestions = completionItems
    //       .filter((item) => item.label.toLowerCase().startsWith(word.word.toLowerCase()))
    //       .map((item) => ({ ...item, range }));
    //     return { suggestions };
    //   }
    // });

    editorReference.current = editor;

    // Add event listener to highlight the query whenever the cursor position changes
    editor.onDidChangeCursorPosition(() => {
      highlightQueryAtCursor(editor, monaco);
    });

    // Ctrl+Enter to execute the query the cursor is above
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      const fullQuery = getFullQueryAtCursor(editor, monaco);

      if (fullQuery?.query) executeQuery(fullQuery.query);
    });

    // Shift+Enter to execute all queries
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      const statements = editor
        .getModel()
        ?.getValue()
        .split(";")
        .filter((stmt) => stmt.trim() !== "");
      statements?.forEach(executeQuery);
    });
  };

  const handleExecute = (executeType: ExecuteType) => {
    if (!editorReference.current || !monaco) return;

    switch (executeType) {
      case ExecuteType.CURRENT: {
        const fullQuery = getFullQueryAtCursor(editorReference.current, monaco);
        if (fullQuery?.query) executeQuery(fullQuery.query);
        break;
      }
      case ExecuteType.ALL: {
        const statements = code.split(";").filter((stmt) => stmt.trim() !== "");
        statements.forEach((stmt) => executeQuery(stmt));
        break;
      }
    }
  };

  const renderResult = useCallback(
    () => (
      <ResultsRender
        key={`result-${updateKey}`}
        data={queryResult}
        tracingData={queryTracing}
      />
    ),
    [queryTracing, updateKey],
  );

  const renderTracing = useCallback(
    () => <TracingRender key={`tracing-${updateKey}`} data={queryTracing} />,
    [queryTracing, updateKey],
  );
  const renderDashboard = useCallback(
    () => (
      <QueryDashboard
        key={`dashboard-${updateKey}`}
        tracingInfo={queryTracing}
      />
    ),
    [queryTracing, updateKey],
  );
  const renderTabs = {
    [DisplayTabs.RESULT]: renderResult(),
    [DisplayTabs.TRACING]: renderTracing(),
    [DisplayTabs.DASHBOARD]: renderDashboard(),
  };

  return (
    <div className="h-[calc(100vh-112px)] w-full flex flex-col">
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel
          defaultSize={75}
          className="flex flex-col w-full h-full"
        >
          <div className="flex justify-between px-4 sm:px-8 border-t bg-background/60 py-1">
            <ResultFilters />
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
            language="cql"
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

                <TabsTrigger
                  value={DisplayTabs.DASHBOARD}
                  className={cn(
                    "w-full justify-center rounded-none px-4 py-2 text-left hover:bg-white/10",
                    activeTab === DisplayTabs.DASHBOARD && "bg-white",
                  )}
                >
                  <ChartArea size={18} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          {loadingResults ? (
            <div className="flex flex-col w-full h-full gap-1 p-1">
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-full w-full" />
            </div>
          ) : (
            renderTabs[activeTab as DisplayTabs]
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
