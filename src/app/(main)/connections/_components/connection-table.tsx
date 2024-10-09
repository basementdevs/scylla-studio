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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@scylla-studio/components/ui/table";
import type { Connection } from "@scylla-studio/lib/internal-db/connections";
import { useEffect, useState, useTransition } from "react";
import {
  deleteConnection,
  fetchConnections,
  saveNewConnection,
  updateConnection,
} from "../actions/connections";
import NewConnectionModal from "./modal";
import TableLabel from "./table-item";

export default function ConnectionTableServer() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedConnection, setSelectedConnection] =
    useState<Connection | null>(null);
  const [_, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const initialConnections = await fetchConnections();
      setConnections(initialConnections);
    });
  }, []);

  const handleSave = async (newConnection: Connection) => {
    startTransition(async () => {
      await (selectedConnection && selectedConnection?.id
        ? updateConnection(selectedConnection.id, newConnection)
        : saveNewConnection(newConnection));
      const updatedConnections = await fetchConnections();
      setConnections(updatedConnections);
      setSelectedConnection(null);
    });
  };

  const handleDelete = async (conn: Connection) => {
    if (conn?.id) {
      startTransition(async () => {
        await deleteConnection(conn.id!);
        const updatedConnections = await fetchConnections();
        setConnections(updatedConnections);
      });
    }
  };

  const handleRefresh = async (conn: Connection) => {
    startTransition(async () => {
      await updateConnection(conn.id!, conn);
      const updatedConnection = await fetchConnections();
      setConnections(updatedConnection);
    });
  };

  const handleUpdateClick = (conn: Connection) => {
    setSelectedConnection(conn);
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {connections.map((conn) => (
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
                ].map((key) => (
                  <ContextMenu key={`${conn.name}-${key}`}>
                    <ContextMenuTrigger asChild>
                      <TableCell>
                        <TableLabel itemKey={key} conn={conn} />
                      </TableCell>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem onSelect={() => handleUpdateClick(conn)}>
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
        <NewConnectionModal
          onSave={handleSave}
          connectionToEdit={selectedConnection}
        />
      </CardContent>
    </Card>
  );
}
