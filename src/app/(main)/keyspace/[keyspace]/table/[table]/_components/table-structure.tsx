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
import { TableDefinition } from "@scylla-studio/lib/cql-parser/table-parser";
import {
  ArrowDownIcon,
  BoxIcon,
  ClockIcon,
  CodeIcon,
  HashIcon,
  KeyIcon,
  SettingsIcon,
} from "lucide-react";

interface TableStructureProperties {
  table: TableDefinition;
}

export default function TableStructure({ table }: TableStructureProperties) {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-3 grid-rows-1 gap-6">
        <div className="bg-white col-span-2 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-purple-100 dark:bg-purple-900">
                <TableHead className="font-bold text-purple-700 dark:text-purple-300">
                  Column Name
                </TableHead>
                <TableHead className="font-bold text-purple-700 dark:text-purple-300">
                  Type
                </TableHead>
                <TableHead className="font-bold text-purple-700 dark:text-purple-300">
                  Key Type
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.columns.map((column) => (
                <TableRow
                  key={column.name}
                  className="hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <TableCell className="font-medium">{column.name}</TableCell>
                  <TableCell>{column.type}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {table?.primaryKey.includes(column.name) && (
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        >
                          <KeyIcon className="w-3 h-3 mr-1" />
                          Primary
                        </Badge>
                      )}
                      {table?.clusteringKeys.includes(column.name) && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          <ArrowDownIcon className="w-3 h-3 mr-1" />
                          Clustering{" "}
                          {
                            table?.clusteringOrder.find(
                              ({ name }) => name === column.name,
                            )?.order
                          }
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Card className=" col-span-1 bg-gradient-to-br from-white to-green-50 dark:from-gray-600 dark:to-gray-900">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center gap-2 text-green-700 dark:text-green-300">
              <SettingsIcon className="w-8 h-8" />
              Table Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <SettingItem
                icon={<SettingsIcon className="w-4 h-4" />}
                label="Compaction"
                value={`${table.options.compaction.class}`}
              />
              <SettingItem
                icon={<BoxIcon className="w-4 h-4" />}
                label="Compression"
                value={table.options.compression.sstable_compression
                  .split(".")
                  .pop()}
              />
              <SettingItem
                icon={<ClockIcon className="w-4 h-4" />}
                label="Default TTL"
                value={`${table.options.defaultTimeToLive} seconds ${
                  table.options.defaultTimeToLive === 0 ? "(disabled)" : ""
                }`}
              />
              <SettingItem
                icon={<ClockIcon className="w-4 h-4" />}
                label="GC Grace Seconds"
                value={`${table.options.gcGraceSeconds} seconds`}
              />
              <SettingItem
                icon={<HashIcon className="w-4 h-4" />}
                label="Max Index Interval"
                value={table.options.maxIndexInterval}
              />
              <SettingItem
                icon={<HashIcon className="w-4 h-4" />}
                label="Min Index Interval"
                value={table.options.minIndexInterval}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SettingItem({ icon, label, value }: any) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="w-full">
          <div className="flex items-center space-x-2 p-3 bg-transparent rounded-md ">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
              {icon}
            </div>
            <div className="flex-grow text-left">
              <span className="font-medium text-sm text-gray-600 dark:text-gray-300">
                {label}
              </span>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
                {value}
              </p>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {label}: {value}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
