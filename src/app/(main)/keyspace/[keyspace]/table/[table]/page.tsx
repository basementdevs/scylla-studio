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
import { KeyspaceConnectionNotFound } from "../../_components/keyspace-connection-not-found";
import TableGeneralInfo from "./_components/table-general-info";
import TableStructure from "./_components/table-structure";

export default function TableInfo({
  params: { keyspace, table },
}: {
  params: { keyspace: string; table: string };
}) {
  const { betterKeyspaces, selectedConnection, loadingKeyspaces } = useLayout();

  const selectedKeyspace = Object.values(betterKeyspaces).find(
    (value) => value.name === keyspace,
  );
  const selectedTable = selectedKeyspace?.tables.get(table);

  return (
    <ContentLayout title={selectedTable?.tableName ?? "Table information"}>
      <div className="container mx-auto p-4 space-y-6">
        {!selectedConnection && !loadingKeyspaces && (
          <KeyspaceConnectionNotFound />
        )}

        {selectedConnection && (
          <Card>
            {loadingKeyspaces && (
              <>
                <CardHeader>
                  <Skeleton className="w-full h-9" />
                </CardHeader>
                <CardContent>
                  <div className="flex gap-6">
                    <Skeleton className="flex-1 h-80" />
                    <Skeleton className="h-80 w-28" />
                  </div>
                </CardContent>
              </>
            )}

            {!selectedTable && !loadingKeyspaces && (
              <>
                <CardHeader>
                  <CardTitle>Table not found!</CardTitle>
                </CardHeader>
              </>
            )}

            {selectedTable && !loadingKeyspaces && (
              <>
                <TableGeneralInfo table={selectedTable} />
                <TableStructure table={selectedTable} />
              </>
            )}
          </Card>
        )}
      </div>
    </ContentLayout>
  );
}
