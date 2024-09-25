import { useLayout } from "@scylla-studio/hooks/layout";
import {
  Users,
  Settings,
  LayoutGrid,
  LucideIcon,
  Cable,
  TableProperties
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
      groupLabel: "",
      menus: [
        {
          href: "/",
          label: "Dashboard",
          active: pathname === "/",
          icon: LayoutGrid,
          submenus: []
        }
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
        {
          href: "/connections",
          label: "Connections",
          active: pathname.includes("/connections"),
          icon: Cable,
          submenus: []
        },
        {
          href: "/users",
          label: "Users",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/users",
          label: "Users",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: []
        },
        {
          href: "/account",
          label: "Account",
          active: pathname.includes("/account"),
          icon: Settings,
          submenus: []
        }
      ]
    }
  ];
}
