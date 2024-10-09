"use client";

import { ContentLayout } from "@scylla-studio/components/composed/sidebar/content-layout";
import { Card } from "@scylla-studio/components/ui/card";
import { useLayout } from "@scylla-studio/hooks/layout";
import TableGeneralInfo from "./_components/table-general-info";
import TableStructure from "./_components/table-structure";

export default function TableInfo({
	params: { keyspace, table },
}: { params: { keyspace: string; table: string } }) {
	const { betterKeyspaces } = useLayout();

	const selectedKeyspace = Object.values(betterKeyspaces).find(
		(value) => value.name === keyspace,
	);
	const selectedTable = selectedKeyspace?.tables.get(table);

	return (
		<ContentLayout title={selectedTable?.tableName ?? "Table information"}>
			<div className="container mx-auto p-4 space-y-6">
				<Card>
					{selectedTable && <TableGeneralInfo table={selectedTable} />}
					{selectedTable && <TableStructure table={selectedTable} />}
				</Card>
			</div>
		</ContentLayout>
	);
}
