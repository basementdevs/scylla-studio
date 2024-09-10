import { Plus } from "lucide-react"
import { Button } from "@scylla-studio/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@scylla-studio/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@scylla-studio/components/ui/table"

export default function MainPage() {
  const connections = [
    { name: "Production 1", host: "prod1.scylladb.com" },
    { name: "Staging", host: "staging.scylladb.com" },
    { name: "Localhost", host: "localhost" },
  ];

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
                <TableCell>user</TableCell>
                <TableCell>••••••••</TableCell>
                <TableCell>DC1</TableCell>
                <TableCell>3</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button className="mt-4">
          <Plus className="mr-2 h-4 w-4" /> New Connection
        </Button>
      </CardContent>
    </Card>
  );
}
