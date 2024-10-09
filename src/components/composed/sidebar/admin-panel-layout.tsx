"use client";

import { useSidebarToggle } from "@scylla-studio/hooks/use-sidebar-toggle";
import { useStore } from "@scylla-studio/hooks/use-store";
import { cn } from "@scylla-studio/lib/utils";
import { Footer } from "./footer";
import { Sidebar } from "./sidebar";

export default function SidebarLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const sidebar = useStore(useSidebarToggle, (state) => state);

	if (!sidebar) return null;

	return (
		<>
			<Sidebar />
			<div className="flex flex-col">
				<main
					className={cn(
						"min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300 mb-14",
						sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72",
					)}
				>
					{children}
				</main>
				<footer
					className={cn(
						"transition-[margin-left] ease-in-out duration-300",
						sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72",
					)}
				>
					<Footer />
				</footer>
			</div>
		</>
	);
}
