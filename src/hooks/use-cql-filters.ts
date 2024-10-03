import type { AvailableConnections } from "@scylla-studio/lib/connections";
import { create } from "zustand";

export interface UseSqlFiltersStore {
	renderSize: number;
	fetchSize: string;
	currentConnection?: AvailableConnections | null;
	setRenderSize: (size: number) => void;
	setFetchSize: (size: string) => void;
	setCurrentConnection: (connection: AvailableConnections | null) => void;
}

export const useCqlFilters = create<UseSqlFiltersStore>((set) => ({
	renderSize: 50,
	fetchSize: "unset",
	setRenderSize: (size: number) => {
		set({ renderSize: size });
	},
	setFetchSize: (size: string) => {
		set({ fetchSize: size });
	},
	setCurrentConnection: (connection: AvailableConnections | null) => {
		set({ currentConnection: connection });
	},
}));
