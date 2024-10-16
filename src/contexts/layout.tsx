import type { ScyllaKeyspace } from "@lambda-group/scylladb";
import { queryKeyspaceAction } from "@scylla-studio/actions/query-keyspaces";
import { fetchConnections } from "@scylla-studio/app/(main)/connections/actions/connections";
import type { KeyspaceDefinition } from "@scylla-studio/lib/cql-parser/keyspace-parser";
import type { Connection } from "@scylla-studio/lib/internal-db/connections";
import { startTransition } from "react";
import { toast } from "sonner";
import { create } from "zustand";

interface LayoutState {
  keyspaces: Record<string, ScyllaKeyspace>;
  betterKeyspaces: Record<string, KeyspaceDefinition>;
  connections: Connection[];
  selectedConnection: Connection | undefined;
  setKeyspaces: (keyspaces: Record<string, ScyllaKeyspace>) => void;
  setBetterKeyspaces: (
    betterKeyspaces: Record<string, KeyspaceDefinition>,
  ) => void;
  setConnections: (connections: Connection[]) => void;
  setSelectedConnection: (connection: Connection | undefined) => void;
  queryKeyspace: (selectedConnection: Connection) => void;
  fetchInitialConnections: () => void;
}

export const useLayout = create<LayoutState>((set, get) => ({
  keyspaces: {},
  betterKeyspaces: {},
  connections: [],
  selectedConnection: undefined,

  setKeyspaces: (keyspaces) => set({ keyspaces }),

  setBetterKeyspaces: (betterKeyspaces) => set({ betterKeyspaces }),

  setConnections: (connections) => {
    if (JSON.stringify(get().connections) !== JSON.stringify(connections)) {
      set({ connections });
    }
  },

  setSelectedConnection: (connection) => {
    set({ selectedConnection: connection });
  },

  fetchInitialConnections: async () => {
    try {
      const initialConnections = await fetchConnections();
      if (
        JSON.stringify(get().connections) !== JSON.stringify(initialConnections)
      ) {
        startTransition(() => {
          set({ connections: initialConnections });
        });
      }
    } catch (error) {
      console.error("Error fetching connections:", error);
      toast.error("Failed to fetch connections.");
    }
  },

  queryKeyspace: async (selectedConnection) => {
    try {
      const queryKeyspace = await queryKeyspaceAction({
        host: selectedConnection.host,
        port: selectedConnection.port,
        password: selectedConnection.password,
        username: selectedConnection.username,
      });
      return queryKeyspace;
    } catch (error) {
      console.error(error);
      toast.error("Failed to query keyspaces.");
      get().setSelectedConnection(undefined);
      throw error;
    }
  },
}));
