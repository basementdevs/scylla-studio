"use client";

import { Ellipsis, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { CollapseMenuButton } from "@scylla-studio/components/composed/sidebar/collapse-menu-button";
import { Button } from "@scylla-studio/components/ui/button";
import { ScrollArea } from "@scylla-studio/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@scylla-studio/components/ui/tooltip";
import { useGetMenuList } from "@scylla-studio/lib/menu-list";
import { cn } from "@scylla-studio/lib/utils";
import { getIsMacEnviroment } from "@scylla-studio/utils";

interface MenuProperties {
  isOpen: boolean | undefined;
}

const triggerCtrlK = () => {
  const isMac = navigator.platform.toUpperCase().includes("MAC");
  const keyEvent = new KeyboardEvent("keydown", {
    key: "k",
    code: "KeyK",
    keyCode: 75, // keyCode for 'K'
    ctrlKey: !isMac, // Control key for Windows/Linux
    metaKey: isMac, // Command key for Mac
    bubbles: true,
  });

  document.dispatchEvent(keyEvent);
};

const isMacEnvironment = getIsMacEnviroment(navigator.platform.toUpperCase());

export function Menu({ isOpen }: MenuProperties) {
  const pathname = usePathname();
  const menuList = useGetMenuList(pathname);

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : null}
              {menus.map(
                (
                  { href, label, icon: Icon, active, submenus, element },
                  index,
                ) =>
                  submenus.length === 0 ? (
                    <div className="w-full" key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            {element || (
                              <Button
                                variant={active ? "secondary" : "ghost"}
                                className="w-full justify-start h-10 mb-1"
                                asChild
                              >
                                <Link
                                  className={cn(
                                    !isOpen && "flex justify-center",
                                  )}
                                  href={href}
                                >
                                  <span className={cn(isOpen && "mr-4")}>
                                    <Icon size={18} />
                                  </span>
                                  {isOpen && (
                                    <p
                                      className={cn(
                                        "max-w-[200px] truncate",
                                        // isOpen === false
                                        //   ? "-translate-x-96 opacity-0"
                                        //   : "translate-x-0 opacity-100"
                                      )}
                                    >
                                      {label}
                                    </p>
                                  )}
                                </Link>
                              </Button>
                            )}
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="w-full" key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={active}
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  ),
              )}
            </li>
          ))}
          <li className="w-full grow flex items-end">
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => triggerCtrlK()}
                    variant="outline"
                    className="w-full justify-center h-100 mt-5"
                  >
                    {isOpen ? (
                      <p className="text-sm text-muted-foreground">
                        Press{" "}
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                          <span className="text-xs">
                            {isMacEnvironment ? "⌘" : "Ctrl"} + K
                          </span>
                        </kbd>
                        <br />
                        to open the Command Pallete
                      </p>
                    ) : (
                      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘ K</span>
                      </kbd>
                    )}
                  </Button>
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent side="right">
                    <p className="text-sm text-muted-foreground">
                      Press{" "}
                      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘ K</span>
                      </kbd>
                      <br />
                      to open the Command Pallete
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
}
