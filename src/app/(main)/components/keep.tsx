import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@scylla-studio/components/ui/breadcrumb";
import { Button } from "@scylla-studio/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@scylla-studio/components/ui/card";
import { Input } from "@scylla-studio/components/ui/input";
import { ScrollArea } from "@scylla-studio/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@scylla-studio/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@scylla-studio/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@scylla-studio/components/ui/tabs";
import {
  Database,
  Eye,
  Github,
  Plus,
  Search,
  Table as TableIcon,
  X,
} from "lucide-react";
import { useState } from "react";

export default function ScyllaDBStudio() {
  const [activeTab, setActiveTab] = useState("manage-connections");
  const [selectedConnection, setSelectedConnection] = useState("");
  const [expandedKeyspaces, setExpandedKeyspaces] = useState<string[]>([]);

  const toggleKeyspace = (keyspace: string) => {
    setExpandedKeyspaces((previous) =>
      previous.includes(keyspace)
        ? previous.filter((k) => k !== keyspace)
        : [...previous, keyspace],
    );
  };

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
      udts: ["address"],
    },
    {
      name: "analytics",
      tables: ["events", "metrics"],
      materializedViews: ["hourly_events"],
      udts: ["event_details"],
    },
  ];

  const renderTabContent = (tabName: string) => {
    switch (tabName) {
      case "manage-connections": {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Manage Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name/Alias</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead>DC</TableHead>
                    <TableHead>Nodes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {connections.map((conn) => (
                    <TableRow key={conn.name}>
                      <TableCell>{conn.name}</TableCell>
                      <TableCell>{conn.host}</TableCell>
                      <TableCell>user</TableCell>
                      <TableCell>••••••••</TableCell>
                      <TableCell>DC1</TableCell>
                      <TableCell>3</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> New Connection
              </Button>
            </CardContent>
          </Card>
        );
      }
      case "ecommerce": {
        return (
          <>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Keyspace: ecommerce</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Replication Strategy:</strong>{" "}
                    NetworkTopologyStrategy
                  </div>
                  <div>
                    <strong>Durable Writes:</strong> true
                  </div>
                  <div>
                    <strong>Table Count:</strong> 3
                  </div>
                  <div>
                    <strong>Materialized View Count:</strong> 1
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tables and Views</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <TableIcon className="mr-2 h-4 w-4" /> products
                  </li>
                  <li className="flex items-center">
                    <TableIcon className="mr-2 h-4 w-4" /> orders
                  </li>
                  <li className="flex items-center">
                    <TableIcon className="mr-2 h-4 w-4" /> users
                  </li>
                  <li className="flex items-center">
                    <Eye className="mr-2 h-4 w-4" /> daily_sales (Materialized
                    View)
                  </li>
                </ul>
              </CardContent>
            </Card>
          </>
        );
      }
      case "ecommerce-products": {
        return (
          <>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Table: products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Partition Count:</strong> 1000
                  </div>
                  <div>
                    <strong>Caching:</strong> Keys and Rows
                  </div>
                  <div>
                    <strong>Compression:</strong> LZ4
                  </div>
                  <div>
                    <strong>Time to Live:</strong> None
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Table Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Column Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Key Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>id</TableCell>
                      <TableCell>uuid</TableCell>
                      <TableCell>Partition Key</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>name</TableCell>
                      <TableCell>text</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>price</TableCell>
                      <TableCell>decimal</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>created_at</TableCell>
                      <TableCell>timestamp</TableCell>
                      <TableCell>Clustering Key</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        );
      }
      case "ecommerce-daily_sales": {
        return (
          <>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Materialized View: daily_sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Base Table:</strong> orders
                  </div>
                  <div>
                    <strong>Partition Count:</strong> 365
                  </div>
                  <div>
                    <strong>Caching:</strong> Keys Only
                  </div>
                  <div>
                    <strong>Compression:</strong> LZ4
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>View Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Column Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Key Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>date</TableCell>
                      <TableCell>date</TableCell>
                      <TableCell>Partition Key</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>total_sales</TableCell>
                      <TableCell>decimal</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>order_count</TableCell>
                      <TableCell>int</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        );
      }
      case "ecommerce-address": {
        return (
          <>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>User Defined Type: address</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <strong>Usage Count:</strong> 2 (users, orders)
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>UDT Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field Name</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>street</TableCell>
                      <TableCell>text</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>city</TableCell>
                      <TableCell>text</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>state</TableCell>
                      <TableCell>text</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>zip_code</TableCell>
                      <TableCell>text</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>country</TableCell>
                      <TableCell>text</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        );
      }
      default: {
        return <div>Select a tab to view details</div>;
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r overflow-y-auto flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">ScyllaDB Studio</h2>
        </div>
        <nav className="flex-grow">
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-2">My Databases</h3>
            <ul className="space-y-1">
              <li>
                <a href="#" className="text-blue-600 hover:underline">
                  Manage Connections
                </a>
              </li>
              <li>
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
          <a
            href="https://github.com/Daniel-Boll"
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <Github className="mr-2 h-4 w-4" />
            Created by @daniel-boll
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              ScyllaDB Dashboard
            </h1>
            <div className="flex items-center">
              <Input type="text" placeholder="Search..." className="mr-4" />
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">
                {selectedConnection || "Select Connection"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {activeTab.includes("-") && (
              <BreadcrumbItem>
                <BreadcrumbLink href="#">
                  {activeTab.split("-")[0]}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {/* <BreadcrumbItem isCurrentPage> */}
            <BreadcrumbItem>
              <BreadcrumbLink href="#">
                {activeTab.includes("-") ? activeTab.split("-")[1] : activeTab}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList>
                <TabsTrigger
                  value="manage-connections"
                  className="flex items-center"
                >
                  Manage Connections
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 p-0"
                    onClick={() => setActiveTab("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TabsTrigger>
                <TabsTrigger value="ecommerce" className="flex items-center">
                  [K] ecommerce
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 p-0"
                    onClick={() => setActiveTab("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TabsTrigger>
                <TabsTrigger
                  value="ecommerce-products"
                  className="flex items-center"
                >
                  [T] products
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 p-0"
                    onClick={() => setActiveTab("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TabsTrigger>
                <TabsTrigger
                  value="ecommerce-daily_sales"
                  className="flex items-center"
                >
                  [MV] daily_sales
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 p-0"
                    onClick={() => setActiveTab("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TabsTrigger>
                <TabsTrigger
                  value="ecommerce-address"
                  className="flex items-center"
                >
                  [UDT] address
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 p-0"
                    onClick={() => setActiveTab("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TabsTrigger>
              </TabsList>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {renderTabContent(activeTab)}
        </div>
      </main>
    </div>
  );
}
