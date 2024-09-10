"use server";

import { actionClient } from "@scylla-studio/lib/safe-actions";
import { z } from "zod";

import { Cluster } from "@lambda-group/scylladb";

export const queryKeyspaceAction = actionClient.schema(
  z.object({
    keyspace: z.string().min(1).max(255),
  })
).action(async ({
  parsedInput: {
    keyspace
  }
}) => {
  const cluster = new Cluster({
    nodes: ["localhost:9042"]
  });

  const session = await cluster.connect("system");

  const clients = await session.execute("SELECT * FROM clients");

  console.log(clients);

  return {
    clients
  };
});
