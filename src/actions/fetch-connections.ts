"use server";

import type { AvailableConnections } from "@scylla-studio/lib/connections";
import { getAllConnections } from "@scylla-studio/lib/internal-db/connections";
import { actionClient } from "@scylla-studio/lib/safe-actions";

export const fetchConnections = actionClient.action(async () => {
	return (await getAllConnections()) as AvailableConnections[];
});
