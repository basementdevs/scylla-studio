import { ContentLayout } from "@scylla-studio/components/composed/sidebar/content-layout";
import ConnectionTable from "./_components/connection-table";

export default async function ConnectionPage() {
	return (
		<ContentLayout title="Manage Connections">
			<ConnectionTable />
		</ContentLayout>
	);
}
