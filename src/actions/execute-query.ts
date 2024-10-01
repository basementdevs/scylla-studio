"use server";

import { Cluster } from "@lambda-group/scylladb";
import { actionClient } from "@scylla-studio/lib/safe-actions";
import { z } from "zod";

export interface TracingResult {
  client: string;
  command: string;
  coordinator: string;
  duration: number;
  events: Event[];
  parameters: Parameters;
  request: string;
  started_at: number;
}

export interface Event {
  activity: string;
  event_id: string;
  source: string;
  source_elapsed: number;
  thread: string;
}

export interface Parameters {
  consistency_level: string;
  "param[0]": string;
  query: string;
  serial_consistency_level: string;
}

interface QueryResult {
  result: Array<Record<string, unknown>>;
  tracing: TracingResult;
}

export const executeQueryAction = actionClient
  .schema(z.string())
  .action(async ({ parsedInput }) => {
    const cluster = new Cluster({
      nodes: ["localhost:9042"],
    });

    const session = await cluster.connect();
    return (await session.executeWithTracing(parsedInput)) as QueryResult;
  });
