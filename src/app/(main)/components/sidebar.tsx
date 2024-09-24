"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@scylla-studio/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@scylla-studio/components/ui/accordion";
import { Database, Github, Table as TableIcon, } from "lucide-react";
import { useLayout } from "@scylla-studio/hooks/layout";
import Link from "next/link";

export function Sidebar() {
  const { keyspaces } = useLayout();

  const [selectedConnection, setSelectedConnection] = useState("");
  const [selectedKeyspace, setSelectedKeyspace] = useState("system");
  const [selectedItem, setSelectedItem] = useState({ type: "", name: "" });

  const connections = [
    { name: "Production 1", host: "prod1.scylladb.com" },
    { name: "Staging", host: "staging.scylladb.com" },
    { name: "Localhost", host: "localhost" },
  ];

  const handleItemClick = (keyspace: string, type: string, name: string) => {
    setSelectedItem({ type, name });
    setSelectedKeyspace(keyspace);
  };

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
              {/* biome-ignore lint/a11y/useValidAnchor: tmp */}
              <Link href="/keyspace" className="text-blue-600 hover:underline">
                Manage Connections
              </Link>
            </li>
            <li>
              {/* biome-ignore lint/a11y/useValidAnchor: tmp */}
              <a href="#" className="text-blue-600 hover:underline">
                Overall Metrics
              </a>
            </li>
          </ul>
        </div>
        <div className="p-4 border-b">
          <h3 className="font-semibold mb-2">Select Connection</h3>
          <Select
            onValueChange={setSelectedConnection}
            value={selectedConnection}
          >
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

          <Accordion type="multiple" className="w-full">
            {Object.entries(keyspaces).map(([keyspaceName, keyspaceInfo]) => (
              <AccordionItem value={keyspaceName} key={keyspaceName}>
                <AccordionTrigger className="flex gap-2 justify-start overflow-hidden">
                  <Database className="size-4 flex-shrink-0" />
                  <Link href={"/keyspace/" + keyspaceName} title={keyspaceName} className="truncate">
                    {keyspaceName}
                  </Link>
                </AccordionTrigger>

                <AccordionContent>
                  <ul className="space-y-1">
                    {Object.entries(keyspaceInfo.tables).map(
                      ([tableName, tableInfo]) => (
                        <li key={tableName}>
                          <Link
                            href={"/keyspace/" + keyspaceName + "/table/" + tableName}
                            className="w-full justify-start text-sm gap-2 flex"
                            onClick={() =>
                              handleItemClick(keyspaceName, "table", tableName)
                            }
                          >
                            <TableIcon className="size-4 flex-shrink-0" />
                            {tableName}
                          </Link>
                        </li>
                      ),
                    )}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </nav>
      <div className="p-4 border-t mt-auto">
        <a
          href="https://github.com/Daniel-Boll"
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <Github className="mr-2 h-4 w-4" />
          Created by @daniel-boll
        </a>
      </div>
    </aside>
  );
}

// <ul className="space-y-1">
//   {Object.entries(keyspaces).map(([keyspaceName, keyspaceInfo]) => (
//     <li key={keyspaceName}>
//       <Button
//         onClick={() => toggleKeyspace(keyspaceName)}
//         className="flex gap-2 w-full text-left justify-start"
//         variant="ghost"
//       >
//         <Database className="size-4 flex-shrink-0" />
//         <p title={keyspaceName} className="truncate">
//           {keyspaceName}
//         </p>

//         {expandedKeyspaces.includes(keyspaceName) && (
//           <ul className="pl-6 mt-1 space-y-1">
//             {Object.entries(keyspaceInfo).map(
//               ([table, tableInfo]) => (
//                 <li key={table} className="flex items-center">
//                   <TableIcon className="mr-2 h-4 w-4" /> {table}
//                 </li>
//               ),
//             )}
//           </ul>
//         )}
//       </Button>
//     </li>
//   ))}
// </ul>

// {
//   keyspacesAndTables.map((keyspace) => (
//     <li key={keyspace.name}>
//       <button
//         onClick={() => toggleKeyspace(keyspace.name)}
//         className="flex items-center w-full text-left"
//       >
//         <Database className="mr-2 h-4 w-4" />
//         {keyspace.name}
//       </button>
//       {expandedKeyspaces.includes(keyspace.name) && (
//         <ul className="pl-6 mt-1 space-y-1">
//           {keyspace.tables.map((table) => (
//             <li key={table} className="flex items-center">
//               <TableIcon className="mr-2 h-4 w-4" /> {table}
//             </li>
//           ))}
//           {keyspace.materializedViews.map((view) => (
//             <li key={view} className="flex items-center">
//               <Eye className="mr-2 h-4 w-4" /> {view}
//             </li>
//           ))}
//           {keyspace.udts.map((udt) => (
//             <li key={udt} className="flex items-center">
//               udt
//               {/* <Cube className="mr-2 h-4 w-4" /> {udt} */}
//             </li>
//           ))}
//         </ul>
//       )}
//     </li>
//   ));
// }
