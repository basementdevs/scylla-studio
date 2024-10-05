import type {Connection} from "@scylla-studio/lib/internal-db/connections";
import type {Dispatch, SetStateAction} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@scylla-studio/components/ui/select";

type SelectKeySpaceProps = {
    connections: Connection[]
    setSelectedConnection: Dispatch<SetStateAction<Connection | undefined>>
    selectedConnection: Connection | undefined
}

export const SelectKeySpace = ({setSelectedConnection, connections, selectedConnection}: SelectKeySpaceProps) => {
    const handleChange = (value: string) => {
        const selectedConn = connections.find((conn: any) => conn.name === value);
        setSelectedConnection(selectedConn);
    };

    return (
        <Select onValueChange={handleChange} value={selectedConnection?.name || ""}>
            <SelectTrigger >
                <SelectValue placeholder="Select a connection"/>
            </SelectTrigger>
            <SelectContent>
                {connections.map((conn: any) => (
                    <SelectItem key={conn.name} value={conn.name}>
                        {conn.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
