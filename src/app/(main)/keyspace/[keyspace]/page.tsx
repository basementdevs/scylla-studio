"use client";


import KeyspaceInfo from "./_components/keyspace-info";
import KeyspaceTables from "./_components/keyspace-tables";
import {useLayout} from "@scylla-studio/hooks/layout";

export default function KeyspacePage({params: {keyspace}}: { params: { keyspace: string } }) {
    const {betterKeyspaces} = useLayout();

    const selectedFodase = Object.values(betterKeyspaces).find((value) => value.name === keyspace);
    console.log(selectedFodase)

    return (
        <div className="container mx-auto p-4 space-y-6">
            {selectedFodase && <KeyspaceInfo keyspace={selectedFodase}/>}
            {selectedFodase && <KeyspaceTables keyspace={selectedFodase}/>}
        </div>
    )
}


