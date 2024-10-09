import { ContentLayout } from "@scylla-studio/components/composed/sidebar/content-layout";
import { CqlEditor } from "./_components/cql-editor";

export default function QueryRunnerPage() {
  return (
    <ContentLayout
      nav={{ className: "shadow-none" }}
      className="p-0 sm:p-0 flex"
      title="Query Runner"
    >
      <CqlEditor />
    </ContentLayout>
  );
}
