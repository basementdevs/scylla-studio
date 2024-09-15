"use client";

import TableGeneralInfo from "./_components/table-general-info";
import TableStructure from "./_components/table-structure";
import {Card} from "@scylla-studio/components/ui/card";
import {useLayout} from "@scylla-studio/hooks/layout";

export default function TableInfo({params: {keyspace, table}}: { params: { keyspace: string, table: string } }) {

    const {betterKeyspaces} = useLayout();

    const selectedKeyspace = Object.values(betterKeyspaces).find((value) => value.name === keyspace);
    const selectedTable = selectedKeyspace?.tables.get(table);
    console.log(selectedTable)
    return (
        <Card className="container mx-auto p-4 ">
            {selectedTable && <TableGeneralInfo table={selectedTable}/>}
            {selectedTable && <TableStructure table={selectedTable}/>}
        </Card>
    )
}

