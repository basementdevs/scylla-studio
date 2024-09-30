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
import { connection } from "@scylla-studio/lib/internal-db/connections";
import { useEffect, useState, useTransition } from "react";
import {
  deleteConnection,
  fetchConnections,
  saveNewConnection,
  updateConnection,
} from "../actions/connections";
import NewConnectionModal from "./modal";

export default function ConnectionTableServer() {
  const [connections, setConnections] = useState<connection[]>([]);
  const [selectedConnection, setSelectedConnection] =
    useState<connection | null>(null);
  const [_, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const initialConnections = await fetchConnections();
      setConnections(initialConnections);
    });
  }, []);

  const handleSave = async (newConnection: connection) => {
    startTransition(async () => {
      if (selectedConnection && selectedConnection?.id) {
        await updateConnection(selectedConnection.id, newConnection);
      } else {
        await saveNewConnection(newConnection);
      }
      const updatedConnections = await fetchConnections();
      setConnections(updatedConnections);
      setSelectedConnection(null);
    });
  };

  const handleDelete = async (conn: connection) => {
    if (conn?.id) {
      startTransition(async () => {
        await deleteConnection(conn.id!);
        const updatedConnections = await fetchConnections();
        setConnections(updatedConnections);
      });
    }
  };

  const handleUpdateClick = (conn: connection) => {
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
              <TableHead>Name/Alias</TableHead>
              <TableHead>Host</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>DC</TableHead>
              <TableHead>Nodes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {connections.map((conn) => (
              <TableRow key={conn.name}>
                {["name", "host", "username", "password", "dc", "nodes"].map(
                  (key) => (
                    <ContextMenu key={`${conn.name}-${key}`}>
                      <ContextMenuTrigger asChild>
                        <TableCell>
                          {key === "password" ? "••••••••" : (conn as any)[key]}
                        </TableCell>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem
                          onSelect={() => handleUpdateClick(conn)}
                        >
                          Update
                        </ContextMenuItem>
                        <ContextMenuItem onSelect={() => handleDelete(conn)}>
                          Delete
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  )
                )}
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
