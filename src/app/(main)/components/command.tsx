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
} from "@scylla-studio/components/ui/command"
import React from "react"
import Link from "next/link";
import {useLayout} from "@scylla-studio/hooks/layout";


export function CommandMenu() {
    const [open, setOpen] = React.useState(false)
    const {keyspaces} = useLayout();

    let parsedKeyspaces = Object.keys(keyspaces);


    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const featureItems = [
        {
            title: "Dashboard",
            link: "/"
        },
        {
            title: "Query Runner",
            link: "/query-runner"
        },
        {
            title: "List Connections",
            link: "/connections"
        },
    ];

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..."/>
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Features">
                    {featureItems.map((feature) => (
                        <CommandItem key={feature.title}>
                            <Link href={feature.link}>{feature.title}</Link>
                        </CommandItem>
                    ))}
                </CommandGroup>
                <CommandGroup heading="Keyspaces">
                    {parsedKeyspaces.map((keyspace) => (
                        <CommandItem key={keyspace}>
                            <Link href={`/keyspace/${keyspace}`}>{keyspace}</Link>
                        </CommandItem>
                    ))}
                </CommandGroup>
                <CommandGroup heading="Tables">
                    {parsedKeyspaces.map((keyspace) => {
                        let currentKeyspace = keyspaces[keyspace];
                        let currentTables = Object.keys(currentKeyspace.tables);

                        return currentTables.map((table) => (
                                <CommandItem key={`${keyspace}-${table}`}>
                                    <Link href={`/keyspace/${keyspace}/table/${table}`}>
                                        {table + " > " + keyspace}
                                    </Link>
                                </CommandItem>
                            )
                        );
                    })}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}
