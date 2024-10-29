import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@scylla-studio/components/ui/dropdown-menu";
import { useConnectionsStore } from "@scylla-studio/hooks/use-connections";
import type { Connection } from "@scylla-studio/lib/internal-db/connections";
import { EditIcon } from "lucide-react";
import { toast } from "sonner";

export const RowActions = ({
  connection: conn,
}: { connection: Connection }) => {
  const { deleteConnection, refreshConnection, setCurrentConnection } =
    useConnectionsStore();

  const handleDelete = async () => {
    try {
      await deleteConnection(conn);
      toast.success("Connection deleted successfully");
    } catch (error) {
      console.error("[ConnectionTableServer.handleDelete]", error);
      toast.error("Error deleting connection, please try again later");
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshConnection(conn);
      toast.success("Connection refreshed successfully");
    } catch (error) {
      console.error("[ConnectionTableServer.handleRefresh]", error);
      toast.error("Error refreshing connection, please try again later");
    }
  };

  const handleUpdate = () => {
    setCurrentConnection(conn);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EditIcon size={16} className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleUpdate} className="cursor-pointer">
          Update
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleRefresh} className="cursor-pointer">
          Refresh
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* styles to keep consistent in both themes */}
        <DropdownMenuItem
          onClick={handleDelete}
          className="bg-red-600 focus:bg-red-500 focus:text-white text-white transition-all duration-300 cursor-pointer"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
