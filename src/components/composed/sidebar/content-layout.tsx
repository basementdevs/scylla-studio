import { Navbar } from "@scylla-studio/components/composed/sidebar/navbar";
import { cn } from "@scylla-studio/lib/utils";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
}

export function ContentLayout({ title, children, className }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className={cn("container pt-8 pb-8 px-4 sm:px-8", className)}>{children}</div>
    </div>
  );
}
