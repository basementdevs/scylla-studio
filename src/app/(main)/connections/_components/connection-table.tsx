"use client"; 

import { Card, CardContent, CardHeader, CardTitle } from "@scylla-studio/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@scylla-studio/components/ui/table";
import { connection } from "@scylla-studio/lib/internal-db/connections";
import { useEffect, useState, useTransition } from "react";
import { fetchConnections, saveNewConnection } from "../actions/connections";
import NewConnectionModal from "./modal";

export default function ConnectionTableServer() {
  const [connections, setConnections] = useState<connection[]>([]);
  const [_, startTransition] = useTransition();

  
  useEffect(() => {
    startTransition(async () => {
      const initialConnections = await fetchConnections();
      setConnections(initialConnections);
    });
  }, []);

  
  const handleSave = async (newConnection: connection) => {
    startTransition(async () => {
      await saveNewConnection(newConnection);
      const updatedConnections = await fetchConnections(); 
      setConnections(updatedConnections); 
    });
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
                <TableCell>{conn.name}</TableCell>
                <TableCell>{conn.host}</TableCell>
                <TableCell>{conn.username}</TableCell>
                <TableCell>••••••••</TableCell>
                <TableCell>{conn.dc}</TableCell>
                <TableCell>{conn.nodes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <NewConnectionModal onSave={handleSave} />
      </CardContent>
    </Card>
  );
}
