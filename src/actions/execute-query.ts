"use server";

import { Cluster } from "@lambda-group/scylladb";
import { actionClient } from "@scylla-studio/lib/safe-actions";
import { z } from "zod";

export const executeQueryAction = actionClient
  .schema(z.string())
  .action(async ({ parsedInput }) => {
    const cluster = new Cluster({
      nodes: ["localhost:9042"],
    });

    const session = await cluster.connect();
    return await session.execute(parsedInput) as Array<Record<string, unknown>>;
  });
