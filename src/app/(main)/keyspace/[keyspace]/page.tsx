"use client";

import { ContentLayout } from "@scylla-studio/components/composed/sidebar/content-layout";
import { useLayout } from "@scylla-studio/hooks/layout";
import KeyspaceInfo from "./_components/keyspace-info";
import KeyspaceTables from "./_components/keyspace-tables";

export default function KeyspacePage({
  params: { keyspace },
}: { params: { keyspace: string } }) {
  const { betterKeyspaces } = useLayout();

  const selectedKeyspace = Object.values(betterKeyspaces).find(
    (value) => value.name === keyspace,
  );

  return (
    <ContentLayout title={selectedKeyspace?.name ?? "Keyspace"}>
      <div className="container mx-auto p-4 space-y-6">
        {selectedKeyspace && <KeyspaceInfo keyspace={selectedKeyspace} />}
        {selectedKeyspace && <KeyspaceTables keyspace={selectedKeyspace} />}
      </div>
    </ContentLayout>
  );
}
