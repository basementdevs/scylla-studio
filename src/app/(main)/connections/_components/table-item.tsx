import { Badge } from "@scylla-studio/components/ui/badge";
import { Label } from "@scylla-studio/components/ui/label";
import { Connection } from "@scylla-studio/lib/internal-db/connections";
import React from "react";

export default function TableLabel({
  itemKey,
  conn,
}: {
  itemKey: string;
  conn: Connection;
}) {
  const labels = {
    Connected: {
      text: "Connected" as const,
      variant: "default" as const,
    },
    Refused: {
      text: "Refused" as const,
      variant: "destructive" as const,
    },
    Offline: {
      text: "Offline" as const,
      variant: "secondary" as const,
    },
  };

  return (
    <>
      {itemKey === "status" && (
        <Badge variant={labels[conn.status ?? "Offline"].variant}>
          {labels[conn.status ?? "Offline"].text}{" "}
        </Badge>
      )}
      {itemKey === "password" && <Label>********</Label>}
      {itemKey !== "status" && itemKey !== "password" && (
        <Label>{conn[itemKey as keyof Connection]} </Label>
      )}
    </>
  );
}
