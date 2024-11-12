"use client";

import { ContentLayout } from "@scylla-studio/components/composed/sidebar/content-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@scylla-studio/components/ui/card";
import { Skeleton } from "@scylla-studio/components/ui/skeleton";
import { useLayout } from "@scylla-studio/contexts/layout";
import { KeyspaceConnectionNotFound } from "./_components/keyspace-connection-not-found";
import KeyspaceInfo from "./_components/keyspace-info";
import KeyspaceTables from "./_components/keyspace-tables";

export default function KeyspacePage({
  params: { keyspace },
}: {
  params: { keyspace: string };
}) {
  const { betterKeyspaces, selectedConnection, loadingKeyspaces } = useLayout();

  const selectedKeyspace = Object.values(betterKeyspaces).find(
    (value) => value.name === keyspace
  );

  return (
    <ContentLayout title={selectedKeyspace?.name ?? "Keyspace"}>
      <div className="container mx-auto p-4 space-y-6">
        {!selectedConnection && !loadingKeyspaces && (
          <KeyspaceConnectionNotFound />
        )}

        {loadingKeyspaces && (
          <Card>
            <CardHeader>
              <Skeleton className="flex-1 h-52" />
            </CardHeader>
            <CardContent className="flex-1 h-96"></CardContent>
          </Card>
        )}

        {selectedConnection && (
          <>
            {!selectedKeyspace && !loadingKeyspaces && (
              <Card>
                <CardHeader>
                  <CardTitle>Keyspace not found!</CardTitle>
                </CardHeader>
              </Card>
            )}

            {selectedKeyspace && !loadingKeyspaces && (
              <>
                <KeyspaceInfo keyspace={selectedKeyspace} />
                <KeyspaceTables keyspace={selectedKeyspace} />
              </>
            )}
          </>
        )}
      </div>
    </ContentLayout>
  );
}
