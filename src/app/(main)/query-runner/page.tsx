import { ContentLayout } from "@scylla-studio/components/composed/sidebar/content-layout";
import { CqlEditor } from "./_components/cql-editor";

export default function QueryRunnerPage() {
  return (
    <ContentLayout className="p-0 sm:p-0" title="Query Runner">
      <CqlEditor />
    </ContentLayout>
  );
}