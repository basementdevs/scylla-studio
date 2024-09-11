import {Card, CardContent, CardHeader, CardTitle} from "@scylla-studio/components/ui/card"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@scylla-studio/components/ui/table"
import {Badge} from "@scylla-studio/components/ui/badge"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@scylla-studio/components/ui/tooltip"
import {Button} from "@scylla-studio/components/ui/button"
import {ArrowDownIcon, BoxIcon, ClockIcon, CodeIcon, HashIcon, KeyIcon, SettingsIcon} from "lucide-react"

export default function TableStructure() {
    const keyspaceInfo = {
        name: "excalibur",
        replication: {
            class: "NetworkTopologyStrategy",
            replication_factor: 3,
        },
        tablets: {
            initial: 2048,
        },
        durable_writes: true,
    }

    const tableInfo = {
        name: "users",
        columns: [
            {name: "user_id", type: "uuid", isPrimaryKey: true, isClusteringKey: false},
            {name: "username", type: "text", isPrimaryKey: false, isClusteringKey: false},
            {name: "email", type: "text", isPrimaryKey: false, isClusteringKey: false},
            {name: "created_at", type: "timestamp", isPrimaryKey: false, isClusteringKey: true},
            {name: "last_login", type: "timestamp", isPrimaryKey: false, isClusteringKey: false},
            {name: "is_active", type: "boolean", isPrimaryKey: false, isClusteringKey: false},
        ],
        settings: {
            bloomFilterFpChance: 0.01,
            caching: {keys: "ALL", rowsPerPartition: "NONE"},
            compaction: {class: "SizeTieredCompactionStrategy", max_threshold: 32, min_threshold: 4},
            compression: {sstable_compression: "org.apache.cassandra.io.compress.LZ4Compressor"},
            crcCheckChance: 1,
            defaultTimeToLive: 0,
            gcGraceSeconds: 864000,
            maxIndexInterval: 2048,
            memtableFlushPeriodInMs: 0,
            minIndexInterval: 128,
            speculativeRetry: "99.0PERCENTILE",
        },
    }

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-3 grid-rows-1 gap-6">
                <div className="bg-white col-span-2 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-purple-100 dark:bg-purple-900">
                                <TableHead className="font-bold text-purple-700 dark:text-purple-300">Column
                                    Name</TableHead>
                                <TableHead
                                    className="font-bold text-purple-700 dark:text-purple-300">Type</TableHead>
                                <TableHead className="font-bold text-purple-700 dark:text-purple-300">Key
                                    Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tableInfo.columns.map((column) => (
                                <TableRow key={column.name}
                                          className="hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors">
                                    <TableCell className="font-medium">{column.name}</TableCell>
                                    <TableCell>{column.type}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {column.isPrimaryKey && (
                                                <Badge variant="secondary"
                                                       className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                    <KeyIcon className="w-3 h-3 mr-1"/>
                                                    Primary
                                                </Badge>
                                            )}
                                            {column.isClusteringKey && (
                                                <Badge variant="secondary"
                                                       className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                    <ArrowDownIcon className="w-3 h-3 mr-1"/>
                                                    Clustering
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <Card
                    className=" col-span-1 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
                    <CardHeader>
                        <CardTitle
                            className="text-3xl font-bold flex items-center gap-2 text-green-700 dark:text-green-300">
                            <SettingsIcon className="w-8 h-8"/>
                            Table Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            <SettingItem
                                icon={<SettingsIcon className="w-4 h-4"/>}
                                label="Compaction"
                                value={`${tableInfo.settings.compaction.class}`}
                            />
                            <SettingItem
                                icon={<BoxIcon className="w-4 h-4"/>}
                                label="Compression"
                                value={tableInfo.settings.compression.sstable_compression.split('.').pop()}
                            />
                            <SettingItem
                                icon={<ClockIcon className="w-4 h-4"/>}
                                label="Default TTL"
                                value={`${tableInfo.settings.defaultTimeToLive} seconds`}
                            />
                            <SettingItem
                                icon={<ClockIcon className="w-4 h-4"/>}
                                label="GC Grace Seconds"
                                value={`${tableInfo.settings.gcGraceSeconds} seconds`}
                            />
                            <SettingItem
                                icon={<HashIcon className="w-4 h-4"/>}
                                label="Max Index Interval"
                                value={tableInfo.settings.maxIndexInterval}
                            />
                            <SettingItem
                                icon={<HashIcon className="w-4 h-4"/>}
                                label="Min Index Interval"
                                value={tableInfo.settings.minIndexInterval}
                            />
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}

function InfoItem({icon, label, value}) {
    return (
        <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">{icon}</div>
            <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{value}</p>
            </div>
        </div>
    )
}

function TableCQLTooltip({keyspaceInfo, tableInfo}: any) {
    const cql = `CREATE TABLE ${keyspaceInfo.name}.${tableInfo.name} (
  ${tableInfo.columns.map(col => `${col.name} ${col.type}`).join(',\n  ')}
  PRIMARY KEY ((${tableInfo.columns.filter(col => col.isPrimaryKey).map(col => col.name).join(', ')}), ${tableInfo.columns.filter(col => col.isClusteringKey).map(col => col.name).join(', ')})
)
WITH bloom_filter_fp_chance = ${tableInfo.settings.bloomFilterFpChance}
  AND caching = {'keys': '${tableInfo.settings.caching.keys}', 'rows_per_partition': '${tableInfo.settings.caching.rowsPerPartition}'}
  AND compaction = {'class': '${tableInfo.settings.compaction.class}', 'max_threshold': '${tableInfo.settings.compaction.max_threshold}', 'min_threshold': '${tableInfo.settings.compaction.min_threshold}'}
  AND compression = {'sstable_compression': '${tableInfo.settings.compression.sstable_compression}'}
  AND crc_check_chance = ${tableInfo.settings.crcCheckChance}
  AND default_time_to_live = ${tableInfo.settings.defaultTimeToLive}
  AND gc_grace_seconds = ${tableInfo.settings.gcGraceSeconds}
  AND max_index_interval = ${tableInfo.settings.maxIndexInterval}
  AND memtable_flush_period_in_ms = ${tableInfo.settings.memtableFlushPeriodInMs}
  AND min_index_interval = ${tableInfo.settings.minIndexInterval}
  AND speculative_retry = '${tableInfo.settings.speculativeRetry}';`

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" className="mt-4">
                        <CodeIcon className="w-5 h-5 mr-2"/>
                        View CQL
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-2xl p-0">
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
            <code className="text-sm text-gray-800 dark:text-gray-200">{cql}</code>
          </pre>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

function SettingItem({icon, label, value}: any) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="w-full">
                    <div
                        className="flex items-center space-x-2 p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm hover:shadow-md transition-shadow">
                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">{icon}</div>
                        <div className="flex-grow text-left">
                            <span className="font-medium text-sm text-gray-600 dark:text-gray-300">{label}</span>
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{value}</p>
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{label}: {value}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}