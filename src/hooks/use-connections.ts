import {
  updateConnection as dbUpdateConnection,
  deleteConnection,
  fetchConnections,
  saveNewConnection,
} from "@scylla-studio/app/(main)/connections/actions/connections";
import type { Connection } from "@scylla-studio/lib/internal-db/connections";
import { create } from "zustand";

interface UseConnectionsStore {
  availableConnections: Connection[];
  currentConnection: Connection | null;

  loadingConnections: boolean;
  loadingDeleteConnection: boolean;
  loadingSaveConnection: boolean;

  setAvailableConnections: (connections: Connection[]) => void;
  setCurrentConnection: (connection: Connection | null) => void;
  getConnections: () => Promise<void>;
  deleteConnection: (conn: Connection) => Promise<void>;
  refreshConnection: (conn: Connection) => Promise<void>;
  saveConnection: (conn: Connection) => Promise<void>;
  updateConnection: (id: number, conn: Connection) => Promise<void>;
}

export const useConnectionsStore = create<UseConnectionsStore>((set) => ({
  availableConnections: [],
  currentConnection: null,

  // ========== loading states ========== //
  loadingConnections: false,
  loadingDeleteConnection: false,
  loadingSaveConnection: false,

  setAvailableConnections: (connections: Connection[]) => {
    set({ availableConnections: connections });
  },
  setCurrentConnection: (connection: Connection | null) => {
    set({ currentConnection: connection });
  },
  getConnections: async () => {
    set({ loadingConnections: true });
    const updatedConnections = await fetchConnections();
    set({ availableConnections: updatedConnections });
    set({ loadingConnections: false });
  },
  deleteConnection: async (conn: Connection) => {
    if (!conn.id) throw new Error("Connection ID not found");
    set({ loadingDeleteConnection: true });
    await deleteConnection(conn.id!);
    set({ availableConnections: await fetchConnections() });
    set({ loadingDeleteConnection: false });
  },
  refreshConnection: async (conn: Connection) => {
    if (!conn.id) throw new Error("Connection ID not found");
    await dbUpdateConnection(conn.id!, conn);
    set({ availableConnections: await fetchConnections() });
  },
  saveConnection: async (conn: Connection) => {
    set({ loadingSaveConnection: true });
    await saveNewConnection(conn);
    set({ availableConnections: await fetchConnections() });
    set({ loadingSaveConnection: false });
    set({ currentConnection: null });
  },
  updateConnection: async (id: number, conn: Connection) => {
    if (!id) throw new Error("Connection ID not found");
    set({ loadingSaveConnection: true });
    await dbUpdateConnection(id, conn);
    set({ availableConnections: await fetchConnections() });
    set({ loadingSaveConnection: false });
    set({ currentConnection: null });
  },
}));
