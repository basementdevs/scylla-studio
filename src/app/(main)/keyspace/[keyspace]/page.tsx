"use client";


import KeyspaceInfo from "./_components/keyspace-info";
import KeyspaceTables from "./_components/keyspace-tables";

export default function Component() {
    const tableInfo = {
        name: "fodase.tabela",
        columns: [
            {name: "id", type: "int", isPrimaryKey: true},
            {name: "name", type: "text", isPrimaryKey: false},
        ],
        settings: {
            bloomFilterFpChance: 0.01,
            caching: {keys: "ALL", rowsPerPartition: "ALL"},
            compaction: {class: "SizeTieredCompactionStrategy"},
            compression: {sstableCompression: "org.apache.cassandra.io.compress.LZ4Compressor"},
            crcCheckChance: 1,
            defaultTimeToLive: 0,
            gcGraceSeconds: 864000,
            maxIndexInterval: 2048,
            memtableFlushPeriodInMs: 0,
            minIndexInterval: 128,
            speculativeRetry: "99.0PERCENTILE",
            tombstoneGc: {mode: "timeout", propagationDelayInSeconds: 3600},
        },
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <KeyspaceInfo/>
            <KeyspaceTables/>
            <marquee>TODO: UDT spot with expandable CQL (?)</marquee>
        </div>
    )
}


