"use client";

import type { ScyllaKeyspace } from "@lambda-group/scylladb";
import { queryKeyspaceAction } from "@scylla-studio/actions/query-keyspaces";
import { useAction } from "next-safe-action/hooks";
import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

export interface ILayoutContext {
  keyspaces: Record<string, ScyllaKeyspace>;
  setKeyspaces: Dispatch<SetStateAction<Record<string, ScyllaKeyspace>>>;
}

export const LayoutContext = createContext<ILayoutContext>(
  {} as ILayoutContext,
);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [keyspaces, setKeyspaces] = useState({});

  const queryKeyspace = useAction(queryKeyspaceAction, {
    onExecute: () => {},
    onSuccess: ({ data }) => {
      if (data?.keyspaces) setKeyspaces(data.keyspaces);
    },
    onError: () => {
      toast.error("Failed to query keyspaces.");
    },
  });

  useEffect(() => {
    queryKeyspace.execute({});
  }, [queryKeyspace.execute]);

  return (
    <LayoutContext.Provider value={{ keyspaces, setKeyspaces }}>
      {children}
    </LayoutContext.Provider>
  );
}
