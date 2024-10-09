"use client";

import { LayoutGrid, LogOut, User } from "lucide-react";
import Link from "next/link";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@scylla-studio/components/ui/avatar";
import { Button } from "@scylla-studio/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
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

export function UserNav() {
	return (
		<DropdownMenu>
			<TooltipProvider disableHoverableContent>
				<Tooltip delayDuration={100}>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="relative h-8 w-8 rounded-full"
							>
								<Avatar className="h-8 w-8">
									<AvatarImage src="#" alt="Avatar" />
									<AvatarFallback className="bg-transparent">DB</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent side="bottom">Profile</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">John Doe</p>
						<p className="text-xs leading-none text-muted-foreground">
							johndoe@example.com
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem className="hover:cursor-pointer" asChild>
						<Link href="/dashboard" className="flex items-center">
							<LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
							Dashboard
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem className="hover:cursor-pointer" asChild>
						<Link href="/account" className="flex items-center">
							<User className="w-4 h-4 mr-3 text-muted-foreground" />
							Account
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="hover:cursor-pointer" onClick={() => {}}>
					<LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
