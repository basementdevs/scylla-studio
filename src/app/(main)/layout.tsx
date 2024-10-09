import SidebarLayout from "@scylla-studio/components/composed/sidebar/admin-panel-layout";
import { LayoutProvider } from "@scylla-studio/contexts/layout";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LayoutProvider>
      <SidebarLayout>{children}</SidebarLayout>
    </LayoutProvider>
  );
}
