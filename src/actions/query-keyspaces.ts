"use server";

import { actionClient } from "@scylla-studio/lib/safe-actions";
import { z } from "zod";

import { Cluster } from "@lambda-group/scylladb";
import { parseKeyspaces } from "@scylla-studio/lib/cql-parser/parser";



export const queryKeyspaceAction = actionClient
    .schema(
        z.object({
            host: z.string().min(1, "Host is required"),
            port: z.number().min(1, "Port is required"),
            username: z.string().nullable(),
            password: z.string().nullable(),
        })
    )
    .action(async ({ parsedInput }) => {
        const { host, port, username, password } = parsedInput;

        const clusterConfig: any = {
            nodes: [`${host}:${port}`],
        };

        if (username && password) {
            clusterConfig.auth = {
                username,
                password,
            };
        }

        const session = await new Cluster(clusterConfig).connect();
        const clusterData = await session.getClusterData();
        const keyspaces = clusterData.getKeyspaceInfo();
        let betterKeyspaces = await parseKeyspaces(session);

        return { keyspaces, betterKeyspaces };
    });
