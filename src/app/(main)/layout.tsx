import { LayoutProvider } from "@scylla-studio/contexts/layout";
import SidebarLayout from "@scylla-studio/components/composed/sidebar/admin-panel-layout";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LayoutProvider>
      <SidebarLayout>
        {children}
      </SidebarLayout>
    </LayoutProvider>
  );
}
