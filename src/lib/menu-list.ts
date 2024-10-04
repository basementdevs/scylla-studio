import { useLayout } from "@scylla-studio/hooks/layout";
import {
  Users,
  Settings,
  LayoutGrid,
  LucideIcon,
  Cable,
  TableProperties,
  CodeSquare,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  const { keyspaces } = useLayout();

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
      groupLabel: "General",
      menus: [
        {
          href: "/",
          label: "Dashboard",
          active: pathname === "/",
          icon: LayoutGrid,
          submenus: []
        },
        {
          href: "/query-runner",
          label: "Query Runner",
          active: pathname === "/query-runner",
          icon: CodeSquare,
          submenus: []
        },
        {
          href: "/connections",
          label: "Connections",
          active: pathname.includes("/connections"),
          icon: Cable,
          submenus: []
        },
      ]
    },
    {
      groupLabel: "Database",
      menus: [
        {
          href: "",
          label: "Keyspaces",
          active: pathname.includes("/keyspace"),
          icon: TableProperties,
          submenus: keyspaceList
        },
      ]
    },
  ];
}
