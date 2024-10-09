import { Badge } from "@scylla-studio/components/ui/badge";
import { Button } from "@scylla-studio/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@scylla-studio/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@scylla-studio/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@scylla-studio/components/ui/tooltip";
import { KeyspaceDefinition } from "@scylla-studio/lib/cql-parser/keyspace-parser";
import {
	ArrowDownIcon,
	EyeIcon,
	KeyIcon,
	LayersIcon,
	Table2Icon,
	TableIcon,
	TrashIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";

interface KeyspaceInfoProperties {
	keyspace: KeyspaceDefinition;
}

export default function KeyspaceDefinitions({
	keyspace,
}: KeyspaceInfoProperties) {
	const tables = Array.from(keyspace.tables, ([name, table]) => ({
		name,
		table,
	}));

	return (
		<Card className="dark:from-gray-800 dark:to-gray-900">
			<CardHeader>
				<CardTitle className="text-3xl font-bold flex items-center gap-2">
					<Table2Icon className="w-8 h-8" />
					Schema
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
					<Table>
						<TableHeader>
							<TableRow className="bg-purple-100 dark:bg-purple-900">
								<TableHead className="font-bold text-purple-700 dark:text-purple-300">
									Table Name
								</TableHead>
								<TableHead className="font-bold text-purple-700 dark:text-purple-300">
									Keys
								</TableHead>
								<TableHead className="font-bold text-purple-700 dark:text-purple-300">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{tables.map(({ name, table }) => (
								<TableRow
									key={table.tableName}
									className="hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
								>
									<TableCell className="font-medium">
										<Link
											href={`/keyspace/${keyspace.name}/table/${table.tableName}`}
										>
											<Badge
												variant="secondary"
												className="gap-2 bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200"
											>
												<TableIcon className="w-5 h-5" />
												{table.tableName}
											</Badge>
										</Link>
									</TableCell>

									<TableCell>
										<div className="flex gap-2">
											<Badge
												variant="secondary"
												className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
											>
												<KeyIcon className="w-3 h-3 mr-1" />
												{table.primaryKey.length} Partition
											</Badge>
											<Badge
												variant="secondary"
												className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
											>
												<ArrowDownIcon className="w-3 h-3 mr-1" />
												{table.clusteringKeys.length} Clustering
											</Badge>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex gap-2">
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<Button variant="outline" size="sm">
															<EyeIcon className="w-4 h-4" />
														</Button>
													</TooltipTrigger>
													<TooltipContent>
														<p>View Data</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<Button variant="outline" size="sm">
															<LayersIcon className="w-4 h-4" />
														</Button>
													</TooltipTrigger>
													<TooltipContent>
														<p>Generate MV</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<Button variant="outline" size="sm">
															<TrashIcon className="w-4 h-4" />
														</Button>
													</TooltipTrigger>
													<TooltipContent>
														<p>Drop Table</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
