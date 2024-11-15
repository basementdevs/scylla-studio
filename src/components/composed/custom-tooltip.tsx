import type { PropsWithChildren, ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface CustomTooltipProps {
  Trigger: ReactNode;
  side?: "right" | "top" | "bottom" | "left";
}

export function CustomTooltip({
  Trigger,
  children,
  side,
}: PropsWithChildren<CustomTooltipProps>) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{Trigger}</TooltipTrigger>
        <TooltipContent side={side}>{children}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
