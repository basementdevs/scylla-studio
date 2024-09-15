"use client";

import type {ScyllaKeyspace} from "@lambda-group/scylladb";
import {queryKeyspaceAction} from "@scylla-studio/actions/query-keyspaces";
import {useAction} from "next-safe-action/hooks";
import {createContext, type Dispatch, type SetStateAction, useEffect, useState,} from "react";
import {toast} from "sonner";
import {KeyspaceDefinition} from "@scylla-studio/lib/cql-parser/keyspace-parser";

export interface ILayoutContext {
    keyspaces: Record<string, ScyllaKeyspace>;
    setKeyspaces: Dispatch<SetStateAction<Record<string, ScyllaKeyspace>>>;
    betterKeyspaces: Record<string, KeyspaceDefinition>;
    setBetterKeyspaces: Dispatch<SetStateAction<Record<string, KeyspaceDefinition>>>;
}

export const LayoutContext = createContext<ILayoutContext>(
    {} as ILayoutContext,
);

export function LayoutProvider({children}: { children: React.ReactNode }) {
    const [keyspaces, setKeyspaces] = useState({});
    const [betterKeyspaces, setBetterKeyspaces] = useState({});

    const queryKeyspace = useAction(queryKeyspaceAction, {
        onExecute: () => {
        },
        onSuccess: ({data}) => {
            console.log(data)
            if (data?.keyspaces) setKeyspaces(data.keyspaces);
            if (data?.betterKeyspaces) setBetterKeyspaces(data.betterKeyspaces);
        },
        onError: () => {
            toast.error("Failed to query keyspaces.");
        },
    });

    useEffect(() => {
        queryKeyspace.execute({});
    }, [queryKeyspace.execute]);

    return (
        <LayoutContext.Provider value={{keyspaces, setKeyspaces, betterKeyspaces, setBetterKeyspaces}}>
            {children}
        </LayoutContext.Provider>
    );
}
