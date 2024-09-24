"use server";

import { actionClient } from "@scylla-studio/lib/safe-actions";
import { z } from "zod";

import { BatchStatement, Cluster, Query } from "@lambda-group/scylladb";
import { parseKeyspaces } from "@scylla-studio/lib/cql-parser/parser";



export const queryKeyspaceAction = actionClient
  .schema(z.object({}))
  .action(async ({ parsedInput }) => {
    const cluster = new Cluster({
      nodes: ["localhost:9042"],
    });

    const session = await cluster.connect();
    const clusterData = await session.getClusterData();
    const keyspaces = clusterData.getKeyspaceInfo();

    let betterKeyspaces = await parseKeyspaces(session);

    return { keyspaces, betterKeyspaces };
  });
