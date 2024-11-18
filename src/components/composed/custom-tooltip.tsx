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
  triggerAsChild?: boolean;
}

export function CustomTooltip({
  Trigger,
  children,
  side,
  triggerAsChild,
}: PropsWithChildren<CustomTooltipProps>) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild={triggerAsChild}>{Trigger}</TooltipTrigger>
        <TooltipContent side={side}>{children}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
