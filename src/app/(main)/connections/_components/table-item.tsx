import React from "react";
import {Label} from "@scylla-studio/components/ui/label";
import {Connection} from "@scylla-studio/lib/internal-db/connections";
import {Badge} from "@scylla-studio/components/ui/badge";


export default function TableLabel({itemKey, conn}: {itemKey: string, conn: Connection}) {
  const labels = {
    Connected: {
      text: "Connected",
      variant: "primary"
    },
    Refused: {
      text: "Refused",
      variant: "destructive"
    },
    Offline: {
      text: "Offline",
      variant: "secondary"
    }
  }

  return (
    <>
      { itemKey === "status" && <Badge variant={labels[conn.status].variant}> {labels[conn.status].text} </Badge>}
      { itemKey === "password" && <Label>********</Label> }
      { itemKey !== "status" && itemKey !== "password" && <Label>{conn[itemKey]} </Label> }
    </>
  );
}