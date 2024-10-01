'use client'

import { Navbar } from "@scylla-studio/components/composed/sidebar/navbar";
import { cn } from "@scylla-studio/lib/utils";
import {CommandMenu} from "@scylla-studio/app/(main)/components/command";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
  nav?: {
    className?: React.HTMLAttributes<HTMLDivElement>["className"];
  }
}

export function ContentLayout({ title, children, className, nav }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} {...nav} />
      <div className={cn("pt-8 pb-8 px-4 sm:px-8", className)}>{children}</div>
      <CommandMenu/>
    </div>
  );
}
