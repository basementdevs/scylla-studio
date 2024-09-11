"use client";


import TableGeneralInfo from "./_components/table-general-info";
import TableStructure from "./_components/table-structure";
import {Card} from "@scylla-studio/components/ui/card";

export default function Component() {
    return (
        <Card className="container mx-auto p-4 ">
            <TableGeneralInfo/>
            <TableStructure/>
        </Card>
    )
}

