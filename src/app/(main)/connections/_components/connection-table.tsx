"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@scylla-studio/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@scylla-studio/components/ui/context-menu";
import { Skeleton } from "@scylla-studio/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@scylla-studio/components/ui/table";
import { useConnectionsStore } from "@scylla-studio/hooks/use-connections";
import type { Connection } from "@scylla-studio/lib/internal-db/connections";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";
import NewConnectionModal from "./modal";
import { RowActions } from "./row-actions";
import TableLabel from "./table-item";

export default function ConnectionTableServer() {
  const {
    availableConnections,
    loadingConnections,
    currentConnection,
    getConnections,
    deleteConnection,
    refreshConnection,
    saveConnection,
    setCurrentConnection,
    updateConnection,
  } = useConnectionsStore();

  const [_, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      await getConnections();
    });
  }, []);

  const handleSave = async (newConnection: Connection) => {
    return currentConnection && currentConnection?.id
      ? await updateConnection(currentConnection.id, newConnection)
      : await saveConnection(newConnection);
  };

  const handleDelete = async (conn: Connection) => {
    try {
      await deleteConnection(conn);
      toast.success("Connection deleted successfully");
    } catch (error) {
      console.error("[ConnectionTableServer.handleDelete]", error);
      toast.error("Error deleting connection, please try again later");
    }
  };

  const handleRefresh = async (conn: Connection) => {
    try {
      await refreshConnection(conn);
      toast.success("Connection refreshed successfully");
    } catch (error) {
      console.error("[ConnectionTableServer.handleRefresh]", error);
      toast.error("Error refreshing connection, please try again later");
    }
  };

  const handleUpdateClick = (conn: Connection) => {
    setCurrentConnection(conn);
  };

  return (
    <Card className="w-full h-fit max-w-7xl">
      <CardHeader>
        <CardTitle className="text-2xl">Manage Connections</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Name/Alias</TableHead>
              <TableHead>Host</TableHead>
              <TableHead>Port</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>DC</TableHead>
              <TableHead>Nodes</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loadingConnections &&
              availableConnections?.map((conn) => (
                <TableRow key={conn.name}>
                  {[
                    "status",
                    "name",
                    "host",
                    "port",
                    "username",
                    "password",
                    "dc",
                    "nodes",
                    "actions",
                  ].map((key) => (
                    <ContextMenu key={`${conn.name}-${key}`}>
                      <ContextMenuTrigger asChild>
                        <TableCell>
                          {key === "actions" ? (
                            <RowActions connection={conn} />
                          ) : (
                            <TableLabel itemKey={key} conn={conn} />
                          )}
                        </TableCell>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem
                          onSelect={() => handleUpdateClick(conn)}
                        >
                          Update
                        </ContextMenuItem>
                        <ContextMenuItem onSelect={() => handleRefresh(conn)}>
                          Refresh
                        </ContextMenuItem>
                        <ContextMenuItem onSelect={() => handleDelete(conn)}>
                          Delete
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {loadingConnections && (
          <div className="flex flex-col gap-1 mt-1">
            <Skeleton className="flex h-9" />
            <Skeleton className="flex h-9" />
          </div>
        )}
        <NewConnectionModal
          onSave={handleSave}
          connectionToEdit={currentConnection}
        />
      </CardContent>
    </Card>
  );
}
