"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@scylla-studio/components/ui/select"
import { Database, Table as TableIcon, Eye, Search, X, Plus, Github } from "lucide-react"

export function Sidebar() {
  const [selectedConnection, setSelectedConnection] = useState("");
  const [expandedKeyspaces, setExpandedKeyspaces] = useState<string[]>([])

  const toggleKeyspace = (keyspace: string) => {
    setExpandedKeyspaces(prev =>
      prev.includes(keyspace)
        ? prev.filter(k => k !== keyspace)
        : [...prev, keyspace]
    )
  }

  const connections = [
    { name: "Production 1", host: "prod1.scylladb.com" },
    { name: "Staging", host: "staging.scylladb.com" },
    { name: "Localhost", host: "localhost" },
  ];

  const keyspacesAndTables = [
    {
      name: "ecommerce",
      tables: ["products", "orders", "users"],
      materializedViews: ["daily_sales"],
      udts: ["address"]
    },
    {
      name: "analytics",
      tables: ["events", "metrics"],
      materializedViews: ["hourly_events"],
      udts: ["event_details"]
    },
  ]

  return (
    <aside className="w-64 h-full bg-white border-r overflow-y-auto flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800">ScyllaDB Studio</h2>
      </div>
      <nav className="flex-grow">
        <div className="p-4 border-b">
          <h3 className="font-semibold mb-2">My Databases</h3>
          <ul className="space-y-1">
            <li>
              <a href="#" className="text-blue-600 hover:underline">Manage Connections</a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">Overall Metrics</a>
            </li>
          </ul>
        </div>
        <div className="p-4 border-b">
          <h3 className="font-semibold mb-2">Select Connection</h3>
          <Select onValueChange={setSelectedConnection} value={selectedConnection}>
            <SelectTrigger>
              <SelectValue placeholder="Select a connection" />
            </SelectTrigger>
            <SelectContent>
              {connections.map((conn) => (
                <SelectItem key={conn.name} value={conn.name}>
                  {conn.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="p-4">
          <h3 className="font-semibold mb-2">Available Keyspaces</h3>
          <ul className="space-y-1">
            {keyspacesAndTables.map((keyspace) => (
              <li key={keyspace.name}>
                <button
                  onClick={() => toggleKeyspace(keyspace.name)}
                  className="flex items-center w-full text-left"
                >
                  <Database className="mr-2 h-4 w-4" />
                  {keyspace.name}
                </button>
                {expandedKeyspaces.includes(keyspace.name) && (
                  <ul className="pl-6 mt-1 space-y-1">
                    {keyspace.tables.map((table) => (
                      <li key={table} className="flex items-center">
                        <TableIcon className="mr-2 h-4 w-4" /> {table}
                      </li>
                    ))}
                    {keyspace.materializedViews.map((view) => (
                      <li key={view} className="flex items-center">
                        <Eye className="mr-2 h-4 w-4" /> {view}
                      </li>
                    ))}
                    {keyspace.udts.map((udt) => (
                      <li key={udt} className="flex items-center">
                        udt
                        {/* <Cube className="mr-2 h-4 w-4" /> {udt} */}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="p-4 border-t mt-auto">
        <a href="https://github.com/Daniel-Boll" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
          <Github className="mr-2 h-4 w-4" />

          Created by @daniel-boll
        </a>
      </div>
    </aside>
  )
}
