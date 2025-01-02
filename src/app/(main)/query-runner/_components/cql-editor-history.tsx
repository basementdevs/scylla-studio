import { Button } from "@scylla-studio/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@scylla-studio/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@scylla-studio/components/ui/sheet";
import { HistoryItem } from "@scylla-studio/hooks/use-cql-query-history";
import { formatDate } from "@scylla-studio/utils";
import { History } from "lucide-react";

interface CqlEditorHistoryProps {
  history: HistoryItem[];
}

export const CqlEditorHistory = ({ history }: CqlEditorHistoryProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2"
        >
          <History size={16} />
          History
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-auto">
        <SheetTitle>History</SheetTitle>
        <div className="flex flex-col gap-2 pt-2">
          {history.map((item) => {
            const date = formatDate(item.date);
            return (
              <Card key={item.date.toString()} className="dark:bg-slate-900">
                <CardContent className="pt-4">
                  <p className=" text-black dark:text-white"> {item.query}</p>
                </CardContent>
                <CardFooter>
                  <p className=" text-sm text-slate-400">Executed at {date}</p>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};
