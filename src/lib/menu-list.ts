import { SelectKeySpace } from "@scylla-studio/components/composed/select-database";
import { useLayout } from "@scylla-studio/contexts/layout";
import {
  Cable,
  CodeSquare,
  HomeIcon,
  LayoutGrid,
  LucideIcon,
  TableProperties,
} from "lucide-react";
import { ReactNode } from "react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
  element?: ReactNode;
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function useGetMenuList(pathname: string): Group[] {
  const keyspaces = useLayout((state) => state.keyspaces);
  const connections = useLayout((state) => state.connections);
  const setSelectedConnection = useLayout(
    (state) => state.setSelectedConnection,
  );
  const selectedConnection = useLayout((state) => state.selectedConnection);

  const keyspaceList = Object.entries(keyspaces).map(([keyspaceName]) => {
    const keyspacePath = `/keyspace/${keyspaceName}`;
    return {
      href: keyspacePath, // TODO: handle tables too
      label: keyspaceName,
      active: pathname === keyspacePath, // Exact match of the keyspace path
    };
  });

  return [
    {
      groupLabel: "Manage Databases",
      menus: [
        {
          href: "/connections",
          label: "Connections",
          active: pathname.includes("/connections"),
          icon: Cable,
          submenus: [],
          element: SelectKeySpace({
            connections,
            setSelectedConnection,
            selectedConnection,
          }),
        },
      ],
    },
    {
      groupLabel: "General",
      menus: [
        {
          href: "/",
          label: "Home",
          active: pathname === "/",
          icon: HomeIcon,
          submenus: [],
        },
        {
          href: "/query-runner",
          label: "Query Runner",
          active: pathname === "/query-runner",
          icon: CodeSquare,
          submenus: [],
        },
        {
          href: "/connections",
          label: "Connections",
          active: pathname.includes("/connections"),
          icon: Cable,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Database",
      menus: [
        {
          href: "",
          label: "Keyspaces",
          active: pathname.includes("/keyspace"),
          icon: TableProperties,
          submenus: keyspaceList,
        },
      ],
    },
  ];
}
