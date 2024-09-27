import { ThemeToggler } from "@scylla-studio/components/composed/theme-toggler";
import { UserNav } from "@scylla-studio/components/composed/sidebar/user-nav";
import { SheetMenu } from "@scylla-studio/components/composed/sidebar/sheet-menu";
import { cn } from "@scylla-studio/lib/utils";

interface NavbarProps {
  title: string;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
}

export function Navbar({ title, className }: NavbarProps) {
  return (
    <header className={cn("sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary", className)}>
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <ThemeToggler />
          {/* <UserNav /> */}
        </div>
      </div>
    </header>
  );
}
