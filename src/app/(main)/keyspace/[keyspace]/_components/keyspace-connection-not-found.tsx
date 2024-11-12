import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@scylla-studio/components/ui/card";

export function KeyspaceConnectionNotFound() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection not found or selected!</CardTitle>
        <CardDescription>
          Please select your connection to see this keyspace data
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
