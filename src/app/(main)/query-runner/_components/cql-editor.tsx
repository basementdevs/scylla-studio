"use client";

import type { ScyllaKeyspace } from "@lambda-group/scylladb";
import Editor, { type Monaco, useMonaco } from "@monaco-editor/react";
import { executeQueryAction } from "@scylla-studio/actions/execute-query";
import { queryKeyspaceAction } from "@scylla-studio/actions/query-keyspaces";
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
import { useCqlFilters } from "@scylla-studio/hooks/use-cql-filters";
import type { AvailableConnections } from "@scylla-studio/lib/connections";
import type { TracingResult } from "@scylla-studio/lib/execute-query";
import debounce from "lodash.debounce";
import { Play } from "lucide-react";
import { CancellationToken, Position, editor, languages } from "monaco-editor";
import { useAction } from "next-safe-action/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CqlResultPanel } from "./cql-resultpanel";
import { ResultFilters } from "./result-filters";
import {
  formatKeyspaces,
  formatKeyspacesTables,
  getFullQueryAtCursor,
} from "./utils";

enum ExecuteType {
  ALL = 0,
  CURRENT = 1,
}

export function CqlEditor() {
  const [code, setCode] = useState("");
  const [loadingResults, setLoadingResults] = useState(false);
  const [keyspaces, setKeyspaces] = useState<Record<string, ScyllaKeyspace>>(
    {},
  );
  const [isFetchedKeys, setIsFetchedKeys] = useState(false);
  const [queryResult, setQueryResult] = useState<
    Array<Record<string, unknown>>
  >([]);
  const [queryTracing, setQueryTracing] = useState<TracingResult>(
    {} as TracingResult,
  );
  const [updateKey, setUpdateKey] = useState(0); // Used to force re-render when query is executed
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

  // Highlights line when put ";"
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

    const keyspaceData = formatKeyspaces(keyspaces);
    const keyspacesTables = formatKeyspacesTables(keyspaces);

    monaco.languages.registerCompletionItemProvider("cql", {
      triggerCharacters: [" ", ".", "(", ")"],
      provideCompletionItems(
        model: editor.ITextModel,
        position: Position,
        _context: languages.CompletionContext,
        _token: CancellationToken,
      ): languages.ProviderResult<languages.CompletionList> {
        const word = model.getWordUntilPosition(position);
        const prevChar = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: position.column - 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        if (prevChar === ".") {
          // If prevChar is "." we need to get the word before it.
          const wordBeforePosition = model.getWordAtPosition({
            lineNumber: position.lineNumber,
            column: position.column - 1,
          });

          range.startColumn = wordBeforePosition
            ? wordBeforePosition.startColumn
            : position.column - 1;
          range.endColumn = position.column;
        }

        const suggestions = cqlCompletionItemProvider(
          monaco,
          editor,
          keyspaceData,
          keyspacesTables,
        )
          .filter((item) =>
            (typeof item.label === "string" ? item.label : item.label.label)
              .toLowerCase()
              .startsWith(word.word.toLowerCase()),
          )
          .map((item) => ({ ...item, range }));

        return { suggestions };
      },
    });

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

  const queryKeySpaces = async (selectedConnection: AvailableConnections) => {
    try {
      if (selectedConnection?.status === "Offline") {
        toast.error("Failed to query keyspaces.");
        setKeyspaces({});
        return;
      }
      const queriedKeyspaces = await queryKeyspaceAction({
        host: selectedConnection.host,
        port: selectedConnection.port,
        password: selectedConnection.password,
        username: selectedConnection.username,
      });

      setKeyspaces(queriedKeyspaces?.data?.keyspaces || {});
    } catch (error) {
      toast.error("Failed to query keyspaces.");
      console.error(error);
    } finally {
      setIsFetchedKeys(true);
    }
  };

  useEffect(() => {
    currentConnectionReference.current = currentConnection ?? null;
  }, [currentConnection]);

  useEffect(() => {
    fetchSizeReference.current = fetchSize ?? null;
  }, [fetchSize]);

  // Load saved query from localStorage when the component mounts
  useEffect(() => {
    const savedCode = localStorage.getItem("cqlEditorQuery");
    if (savedCode) setCode(savedCode);
  }, []);

  // Load all keyspaces from the current connection
  useEffect(() => {
    if (currentConnection) queryKeySpaces(currentConnection);
  }, [currentConnection]);

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
          {currentConnection && isFetchedKeys && (
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
          )}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <CqlResultPanel
          updateKey={updateKey}
          queryResult={queryResult}
          queryTracing={queryTracing}
          loadingResults={loadingResults}
        />
      </ResizablePanelGroup>
    </div>
  );
}
