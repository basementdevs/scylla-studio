import { ThemeToggler } from "@scylla-studio/components/composed/theme-toggler";
import { Input } from "@scylla-studio/components/ui/input";
import { Search } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow-sm w-full">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          ScyllaDB Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <ThemeToggler />
          <Input type="text" placeholder="Search..." />
          <Search className="size-5 text-gray-400" />
        </div>
      </div>
    </header>
  );
}
