import { LaptopMinimal } from "lucide-react";
import Link from "next/link";

import { Menu } from "@scylla-studio/components/composed/sidebar/menu";
import { SidebarToggle } from "@scylla-studio/components/composed/sidebar/sidebar-toggle";
import { Button } from "@scylla-studio/components/ui/button";
import { useSidebarToggle } from "@scylla-studio/hooks/use-sidebar-toggle";
import { useStore } from "@scylla-studio/hooks/use-store";
import { cn } from "@scylla-studio/lib/utils";

export function Sidebar() {
	const sidebar = useStore(useSidebarToggle, (state) => state);

	if (!sidebar) return null;

	return (
		<aside
			className={cn(
				"fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
				sidebar?.isOpen === false ? "w-[90px]" : "w-72",
			)}
		>
			<SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
			<div className="relative h-full flex flex-col px-3 py-4 gap-6 overflow-y-auto shadow-md dark:shadow-zinc-800">
				<Button
					className={cn(
						"transition-transform ease-in-out duration-300 mb-1",
						sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0",
					)}
					variant="link"
					asChild
				>
					<Link href="/dashboard" className="flex items-center gap-2">
						<LaptopMinimal className="w-6 h-6 mr-1" />
						<h1
							className={cn(
								"font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
								sidebar?.isOpen === false
									? "-translate-x-96 opacity-0 hidden"
									: "translate-x-0 opacity-100",
							)}
						>
							Scylla Studio
						</h1>
					</Link>
				</Button>
				<Menu isOpen={sidebar?.isOpen} />
			</div>
		</aside>
	);
}
