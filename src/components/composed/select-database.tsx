import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@scylla-studio/components/ui/select";
import type { Connection } from "@scylla-studio/lib/internal-db/connections";
import type { Dispatch, SetStateAction } from "react";

type SelectKeySpaceProperties = {
  connections: Connection[];
  setSelectedConnection: Dispatch<SetStateAction<Connection | undefined>>;
  selectedConnection: Connection | undefined;
};

export const SelectKeySpace = ({
  setSelectedConnection,
  connections,
  selectedConnection,
}: SelectKeySpaceProperties) => {
  const handleChange = (value: string) => {
    const selectedConn = connections.find(
      (conn: Connection) => conn.id === Number(value),
    );
    setSelectedConnection(selectedConn);
  };

  return (
    <div className="w-11/12 ml-px">
      <Select
        onValueChange={handleChange}
        value={String(selectedConnection?.id) || ""}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a connection">
            {selectedConnection
              ? selectedConnection.name
              : "Select a connection"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {connections.map((conn: any) => (
            <SelectItem key={conn.id} value={conn.id}>
              {conn.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
