"use client";

import type { ScyllaKeyspace } from "@lambda-group/scylladb";
import { queryKeyspaceAction } from "@scylla-studio/actions/query-keyspaces";
import { fetchConnections } from "@scylla-studio/app/(main)/connections/actions/connections";
import { KeyspaceDefinition } from "@scylla-studio/lib/cql-parser/keyspace-parser";
import type { Connection } from "@scylla-studio/lib/internal-db/connections";
import { useAction } from "next-safe-action/hooks";
import {
	type Dispatch,
	type SetStateAction,
	createContext,
	startTransition,
	useEffect,
	useState,
} from "react";
import { toast } from "sonner";

export interface ILayoutContext {
	keyspaces: Record<string, ScyllaKeyspace>;
	setKeyspaces: Dispatch<SetStateAction<Record<string, ScyllaKeyspace>>>;
	betterKeyspaces: Record<string, KeyspaceDefinition>;
	setBetterKeyspaces: Dispatch<
		SetStateAction<Record<string, KeyspaceDefinition>>
	>;
	connections: Connection[];
	setSelectedConnection: Dispatch<SetStateAction<Connection | undefined>>;
	selectedConnection: Connection | undefined;
}

export const LayoutContext = createContext<ILayoutContext>(
	{} as ILayoutContext,
);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
	const [keyspaces, setKeyspaces] = useState({});
	const [betterKeyspaces, setBetterKeyspaces] = useState({});
	const [connections, setConnections] = useState<Connection[]>([]);
	const [selectedConnection, setSelectedConnection] = useState<Connection>();

	useEffect(() => {
		const fetchInitialConnections = async () => {
			const initialConnections = await fetchConnections();
			startTransition(() => {
				setConnections(initialConnections);
			});
		};

		fetchInitialConnections();
	}, []);

	const queryKeyspace = useAction(queryKeyspaceAction, {
		onExecute: () => {},
		onSuccess: ({ data }) => {
			console.log(data);
			if (data?.keyspaces) setKeyspaces(data.keyspaces);
			if (data?.betterKeyspaces) setBetterKeyspaces(data.betterKeyspaces);
		},
		onError: (error) => {
			console.log(error);
			toast.error("Failed to query keyspaces.");
			setSelectedConnection(undefined);
			setKeyspaces({});
		},
	});

	useEffect(() => {
		if (selectedConnection) {
			queryKeyspace.execute({
				host: selectedConnection.host,
				port: selectedConnection.port,
				password: selectedConnection.password,
				username: selectedConnection.username,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryKeyspace.execute, selectedConnection]);

	return (
		<LayoutContext.Provider
			value={{
				keyspaces,
				setKeyspaces,
				betterKeyspaces,
				setBetterKeyspaces,
				connections,
				selectedConnection,
				setSelectedConnection,
			}}
		>
			{children}
		</LayoutContext.Provider>
	);
}
