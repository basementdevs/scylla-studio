"use client";
import { fetchConnections } from "@scylla-studio/actions/fetch-connections";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@scylla-studio/components/ui/select";
import { useCqlFilters } from "@scylla-studio/hooks/use-cql-filters";
import type { AvailableConnections } from "@scylla-studio/lib/connections";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";

export const ResultFilters = () => {
	const [availableConnections, setAvailableConnections] = useState<
		AvailableConnections[]
	>([]);
	const setFetchSize = useCqlFilters((state) => state.setFetchSize);
	const setRenderSize = useCqlFilters((state) => state.setRenderSize);
	const currentConnection = useCqlFilters((state) => state.currentConnection);
	const setCurrentConnection = useCqlFilters(
		(state) => state.setCurrentConnection,
	);
	const fetchConnectionsAction = useAction(fetchConnections, {
		onSuccess: ({ data }) => {
			setAvailableConnections(data ?? []);
			setCurrentConnection(data?.[0] ?? null);
		},
		onError: ({ error }) => {
			console.error("[ResultFilters.fetchConnectionsAction]", error);
		},
	});

	useEffect(() => {
		fetchConnectionsAction.execute();
	}, []);

	const handleChangeConnection = (connectionId: string) => {
		if (!availableConnections) return;
		const connection = availableConnections?.find(
			(c) => c.id === +connectionId,
		);
		if (!connection) return;
		setCurrentConnection(connection);
	};

	return (
		<section className="flex gap-2 items-center">
			<span className="text-xs text-muted-foreground whitespace-nowrap">
				Query Options
			</span>
			<Select onValueChange={(v) => setFetchSize(v)} defaultValue="unset">
				<SelectTrigger className="h-6 text-xs">
					<SelectValue placeholder="Fetch size" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{["unset","25", "50", "100", "500"].map((size) => (
							<SelectItem key={size} value={size.toString()}>
								Fetch size: {size}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			<Select onValueChange={(v) => setRenderSize(+v)} defaultValue="50">
				<SelectTrigger className="h-6 text-xs">
					<SelectValue placeholder="Render size" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{[25, 50, 100, 200, 500].map((size) => (
							<SelectItem key={size} value={size.toString()}>
								Render results size: {size}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			<span className="text-xs text-muted-foreground whitespace-nowrap">
				Connection
			</span>
			<Select
				onValueChange={handleChangeConnection}
				value={currentConnection?.id?.toString() ?? undefined}
			>
				<SelectTrigger className="h-6 text-xs">
					<SelectValue placeholder="Select a connection" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{availableConnections?.map((connection) => (
							<SelectItem
								key={connection.id}
								value={(connection?.id ?? "").toString()}
							>
								{connection.name}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</section>
	);
};
