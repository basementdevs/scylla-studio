import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@scylla-studio/components/ui/table";

export const ResultsRender = ({ data }: { data: Array<Record<string, unknown>> }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const headers = Object.keys(data[0] as object);

  return (
    <Table className="relative">
      <TableHeader className="sticky top-0 dark:bg-background">
        <TableRow>
          {headers.map((header) => (
            <TableHead key={header}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-auto">
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {headers.map((header) => (
              <TableCell key={`${rowIndex}-${header}`}>
                {row[header] !== undefined ? String(row[header]) : "N/A"}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}