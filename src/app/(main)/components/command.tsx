import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@scylla-studio/components/ui/command";
import { useLayout } from "@scylla-studio/hooks/layout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const { keyspaces } = useLayout();

  let parsedKeyspaces = Object.keys(keyspaces);
  const router = useRouter();

  React.useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const featureItems = [
    {
      title: "Dashboard",
      link: "/",
    },
    {
      title: "Query Runner",
      link: "/query-runner",
    },
    {
      title: "List Connections",
      link: "/connections",
    },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Features">
          {featureItems.map((feature) => (
            <CommandItem
              onSelect={() => router.push(feature.link)}
              key={feature.title}
            >
              {feature.title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Keyspaces">
          {parsedKeyspaces.map((keyspace) => (
            <CommandItem
              key={keyspace}
              onSelect={() => router.push(`/keyspace/${keyspace}`)}
            >
              {"Keyspace: " + keyspace}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Tables">
          {parsedKeyspaces.map((keyspace) => {
            let currentKeyspace = keyspaces[keyspace];
            let currentTables = Object.keys(currentKeyspace.tables);

            return currentTables.map((table) => (
              <CommandItem
                key={`${keyspace}-${table}`}
                onSelect={() =>
                  router.push(`/keyspace/${keyspace}/table/${table}`)
                }
              >
                {"Table: " + table + " > " + keyspace}
              </CommandItem>
            ));
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
