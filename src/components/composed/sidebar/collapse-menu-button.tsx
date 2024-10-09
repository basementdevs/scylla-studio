"use client";

import { ChevronDown, Dot, LucideIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { Button } from "@scylla-studio/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@scylla-studio/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@scylla-studio/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@scylla-studio/components/ui/tooltip";
import { cn } from "@scylla-studio/lib/utils";

type Submenu = {
	href: string;
	label: string;
	active: boolean;
};

interface CollapseMenuButtonProperties {
	icon: LucideIcon;
	label: string;
	active: boolean;
	submenus: Submenu[];
	isOpen: boolean | undefined;
}

export function CollapseMenuButton({
	icon: Icon,
	label,
	active,
	submenus,
	isOpen,
}: CollapseMenuButtonProperties) {
	const isSubmenuActive = submenus.some((submenu) => submenu.active);
	const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);

	return isOpen ? (
		<Collapsible
			open={isCollapsed}
			onOpenChange={setIsCollapsed}
			className="w-full"
		>
			<CollapsibleTrigger
				className="[&[data-state=open]>div>div>svg]:rotate-180 mb-1"
				asChild
			>
				<Button
					variant={active ? "secondary" : "ghost"}
					className="w-full justify-start h-10"
				>
					<div className="w-full items-center flex justify-between">
						<div className="flex items-center">
							<span className="mr-4">
								<Icon size={18} />
							</span>
							<p
								className={cn(
									"max-w-[150px] truncate",
									isOpen
										? "translate-x-0 opacity-100"
										: "-translate-x-96 opacity-0",
								)}
							>
								{label}
							</p>
						</div>
						<div
							className={cn(
								"whitespace-nowrap",
								isOpen
									? "translate-x-0 opacity-100"
									: "-translate-x-96 opacity-0",
							)}
						>
							<ChevronDown
								size={18}
								className="transition-transform duration-200"
							/>
						</div>
					</div>
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
				{submenus.map(({ href, label, active }, index) => (
					<Button
						key={index}
						variant={active ? "secondary" : "ghost"}
						className="w-full justify-start h-10 mb-1"
						asChild
					>
						<Link href={href}>
							<span className="mr-4 ml-2">
								<Dot size={18} />
							</span>
							<p
								className={cn(
									"max-w-[170px] truncate",
									isOpen
										? "translate-x-0 opacity-100"
										: "-translate-x-96 opacity-0",
								)}
							>
								{label}
							</p>
						</Link>
					</Button>
				))}
			</CollapsibleContent>
		</Collapsible>
	) : (
		<DropdownMenu>
			<TooltipProvider disableHoverableContent>
				<Tooltip delayDuration={100}>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<Button
								variant={active ? "secondary" : "ghost"}
								className="w-full flex justify-center h-10 mb-1"
							>
								<Icon size={18} />
							</Button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent side="right" align="start" alignOffset={2}>
						{label}
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<DropdownMenuContent side="right" sideOffset={25} align="start">
				<DropdownMenuLabel className="max-w-[190px] truncate">
					{label}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{submenus.map(({ href, label }, index) => (
					<DropdownMenuItem key={index} asChild>
						<Link className="cursor-pointer" href={href}>
							<p className="max-w-[180px] truncate">{label}</p>
						</Link>
					</DropdownMenuItem>
				))}
				<DropdownMenuArrow className="fill-border" />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
