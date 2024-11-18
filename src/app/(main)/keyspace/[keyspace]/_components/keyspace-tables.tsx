import { CustomTooltip } from "@scylla-studio/components/composed/custom-tooltip";
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
        <div className=" rounded-lg shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-purple-100 dark:bg-purple-900">
                <TableHead className="font-bold   px-4 py-3">
                  Table Name
                </TableHead>
                <TableHead className="font-bold  px-4 py-3">Keys</TableHead>
                <TableHead className="font-bold  px-4 py-3">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tables.map(({ name, table }) => (
                <TableRow key={table.tableName} className="">
                  <TableCell className="font-medium px-4 py-3">
                    <CustomTooltip
                      Trigger={
                        <Link
                          href={`/keyspace/${keyspace.name}/table/${table.tableName}`}
                        >
                          <Badge
                            variant="secondary"
                            className="gap-2 bg-cyan-700 text-white dark:bg-cyan-900 "
                          >
                            <TableIcon className="w-5 h-5" />
                            {table.tableName}
                          </Badge>
                        </Link>
                      }
                    >
                      View details
                    </CustomTooltip>
                  </TableCell>

                  <TableCell className="px-4 py-3">
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
                  <TableCell className="px-4 py-3">
                    <div className="flex gap-2">
                      <CustomTooltip
                        triggerAsChild
                        Trigger={
                          <Button variant="outline" size="sm" disabled>
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                        }
                      >
                        <p>View Data</p>
                      </CustomTooltip>

                      <CustomTooltip
                        triggerAsChild
                        Trigger={
                          <Button variant="outline" size="sm" disabled>
                            <LayersIcon className="w-4 h-4" />
                          </Button>
                        }
                      >
                        <p>Generate MV</p>
                        (Work In Progress)
                      </CustomTooltip>

                      <CustomTooltip
                        triggerAsChild
                        Trigger={
                          <Button variant="outline" size="sm" disabled>
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        }
                      >
                        <p>Drop Table</p>
                        (Work In Progress)
                      </CustomTooltip>
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
