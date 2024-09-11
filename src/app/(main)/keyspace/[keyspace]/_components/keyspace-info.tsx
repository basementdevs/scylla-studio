import {Card, CardContent, CardHeader, CardTitle} from "@scylla-studio/components/ui/card"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@scylla-studio/components/ui/tooltip"
import {CodeIcon, DatabaseIcon, HashIcon, NetworkIcon, SettingsIcon, Trash} from "lucide-react"

export default function KeyspaceInfo() {
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
        storage_usage: {
            total_size: "500 GB",
            used_size: "350 GB",
            free_size: "150 GB",
        },
    }
    return (
        <Card>
            <CardHeader className="flex-row justify-between">
                <CardTitle
                    className="text-3xl font-bold flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                    <DatabaseIcon className="w-8 h-8"/>
                    Keyspace: {keyspaceInfo.name}
                </CardTitle>
                <div className="flex flex-row space-x-3">
                    <KeyspaceCQLTooltip keyspaceInfo={keyspaceInfo}/>
                    <DeleteKeyspaceButton/>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12">

                        <div className="grid grid-cols-3 gap-4">
                            <KeyspaceInfoItem
                                icon={<NetworkIcon className="w-5 h-5"/>}
                                label="Replication Strategy"
                                value={keyspaceInfo.replication.class}
                            />
                            <KeyspaceInfoItem
                                icon={<HashIcon className="w-5 h-5"/>}
                                label="Replication Factor"
                                value={keyspaceInfo.replication.replication_factor}
                            />

                            <KeyspaceInfoItem
                                icon={<SettingsIcon className="w-5 h-5"/>}
                                label="Durable Writes"
                                value={keyspaceInfo.durable_writes ? "Enabled" : "Disabled"}
                            />
                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}

function KeyspaceInfoItem({icon, label, value}: any) {
    return (
        <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-md ">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">{icon}</div>
            <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{value}</p>
            </div>
        </div>
    )
}

function KeyspaceCQLTooltip({keyspaceInfo}: any) {
    const cql = `CREATE KEYSPACE ${keyspaceInfo.name}
WITH replication = {
    'class': '${keyspaceInfo.replication.class}',
    'replication_factor': ${keyspaceInfo.replication.replication_factor}
} AND tablets = {
    'initial': ${keyspaceInfo.tablets.initial}
} AND durable_writes = ${keyspaceInfo.durable_writes};`

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                        <CodeIcon className="w-5 h-5"/>
                        <span>View CQL</span>
                    </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-md p-0">
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
            <code className="text-sm text-gray-800 dark:text-gray-200">{cql}</code>
          </pre>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

function DeleteKeyspaceButton() {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        className="flex items-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors">
                        <Trash className="w-5 h-5"/>
                        <span>Delete Keyspace</span>
                    </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-md p-0">

                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}