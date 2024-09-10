import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import { LayoutProvider } from "@scylla-studio/contexts/layout";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LayoutProvider>
      <main className="h-dvh flex flex-row w-full">
        <Sidebar />
        <section className="flex flex-col w-full">
          <Header />
          <div className="w-full h-full flex bg-primary-foreground px-4 sm:px-6 lg:px-8 py-6 justify-center">
            {children}
          </div>
        </section>
      </main>
    </LayoutProvider>
  );
}
