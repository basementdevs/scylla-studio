import { memo, useEffect, useState } from "react";

import { Badge } from "@scylla-studio/components/ui/badge";
import { Button } from "@scylla-studio/components/ui/button";
import {
  ScrollArea,
  ScrollBar,
} from "@scylla-studio/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@scylla-studio/components/ui/table";
import { useCqlFilters } from "@scylla-studio/hooks/use-cql-filters";
import type { TracingResult } from "@scylla-studio/lib/execute-query";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ResultsRenderComponent = ({
  data,
  tracingData,
}: {
  data: Array<Record<string, unknown>>;
  tracingData: TracingResult;
}) => {
  // Assuming renderSize comes from your global state or hooks
  const renderSize = useCqlFilters((state) => state.renderSize);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / renderSize);

  useEffect(() => {
    // if you change the render size, the current page can't be higher than the total pages
    if (currentPage > Math.ceil(data.length / renderSize))
      setCurrentPage(Math.max(Math.ceil(data.length / renderSize), 1));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, renderSize]);

  // Calculate the data to display for the current page
  const paginatedData = data.slice(
    (currentPage - 1) * renderSize,
    currentPage * renderSize,
  );

  if (!data || data.length === 0) {
    return null;
  }

  const headers = Object.keys(data[0] as object);

  // Function to handle page changes
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="flex flex-col w-[calc(100%-50px)] overflow-hidden">
      <div className="flex justify-between items-center sticky top-0 dark:bg-background px-3 py-2 border-b">
        <div className="flex gap-2 items-center">
          <Badge className="text-muted-foreground" variant="secondary">
            {data.length} rows
          </Badge>
          <Badge className="text-muted-foreground" variant="secondary">
            {(tracingData.duration ?? 0) / 1000} ms
          </Badge>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            className="size-6 p-0"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ArrowLeft size={14} />
          </Button>
          <span className="text-xs">
            {currentPage}/{totalPages}
          </span>
          <Button
            className="size-6 p-0"
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ArrowRight size={14} />
          </Button>
        </div>
      </div>

      <ScrollArea>
        <ScrollBar orientation="horizontal" />
        <Table>
          <TableHeader className="sticky top-0 dark:bg-background ">
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header} className="pl-4">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, rowIndex) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: it needs to be
              <TableRow key={rowIndex}>
                {headers.map((header) => (
                  <TableCell key={`${rowIndex}-${header}`} className="pl-4">
                    {row[header] === undefined ? "N/A" : String(row[header])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export const ResultsRender = memo(ResultsRenderComponent);
