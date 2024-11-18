import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@scylla-studio/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@scylla-studio/components/ui/table";
import type { TracingResult } from "@scylla-studio/lib/execute-query";

export const TracingRender = ({ data }: { data: TracingResult }) => {
  if (!data || data.events.length === 0) return null;

  const headers = Object.keys(data.events[0] as object);

  return (
    <Table className="relative">
      <TableHeader className="sticky top-0 dark:bg-background">
        <TableRow>
          {headers.map((header) => (
            <TableHead key={header} className="pl-4">
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-auto">
        {data.events.map((row, rowIndex) => (
          <TableRow key={row.event_id}>
            {headers.map((header) => (
              <Popover key={`${rowIndex}-${header}`}>
                <PopoverTrigger asChild>
                  <TableCell className="max-w-12 truncate hover:cursor-pointer pl-4">
                    {row[header as keyof typeof row] === undefined
                      ? "N/A"
                      : String(row[header as keyof typeof row])}
                  </TableCell>
                </PopoverTrigger>
                <PopoverContent>
                  {row[header as keyof typeof row] === undefined
                    ? "N/A"
                    : String(row[header as keyof typeof row])}
                </PopoverContent>
              </Popover>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
