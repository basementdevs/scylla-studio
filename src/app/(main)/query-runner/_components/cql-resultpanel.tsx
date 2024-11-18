"use client";

import { useCallback, useState } from "react";

import { ResizablePanel } from "@scylla-studio/components/ui/resizable";
import { Skeleton } from "@scylla-studio/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@scylla-studio/components/ui/tabs";
import type { TracingResult } from "@scylla-studio/lib/execute-query";
import { cn } from "@scylla-studio/lib/utils";
import { Braces, ChartArea, Play, SearchCode } from "lucide-react";
import { ResultsRender } from "./results-render";
import QueryDashboard from "./tracing-dashboard-render";
import { TracingRender } from "./tracing-render";

import { CustomTooltip } from "@scylla-studio/components/composed/custom-tooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@scylla-studio/components/ui/tooltip";

interface CqlResultPanelProps {
  updateKey: number;
  queryTracing: TracingResult;
  queryResult: Record<string, unknown>[];
  loadingResults: boolean;
}

enum DisplayTabs {
  RESULT = "result",
  TRACING = "tracing",
  DASHBOARD = "dashboard",
}

export function CqlResultPanel({
  updateKey,
  queryResult,
  queryTracing,
  loadingResults,
}: CqlResultPanelProps) {
  const [activeTab, setActiveTab] = useState<string>(DisplayTabs.RESULT);

  const renderResult = useCallback(
    () => (
      <ResultsRender
        key={`result-${updateKey}`}
        data={queryResult}
        tracingData={queryTracing}
      />
    ),
    [queryTracing, updateKey],
  );

  const renderTracing = useCallback(
    () => <TracingRender key={`tracing-${updateKey}`} data={queryTracing} />,
    [queryTracing, updateKey],
  );

  const renderDashboard = useCallback(
    () => (
      <QueryDashboard
        key={`dashboard-${updateKey}`}
        tracingInfo={queryTracing}
      />
    ),
    [queryTracing, updateKey],
  );

  const renderTabs = {
    [DisplayTabs.RESULT]: renderResult(),
    [DisplayTabs.TRACING]: renderTracing(),
    [DisplayTabs.DASHBOARD]: renderDashboard(),
  };

  return (
    <ResizablePanel className="flex flex-row">
      {!queryResult || queryResult.length === 0 ? null : (
        <Tabs
          orientation="vertical"
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex"
        >
          <TabsList className="flex h-full flex-col justify-start p-0 rounded-none">
            <CustomTooltip
              side="right"
              Trigger={
                <TabsTrigger
                  value={DisplayTabs.RESULT}
                  className={cn(
                    "w-full justify-center rounded-none px-4 py-2 text-left hover:bg-white/10",
                    activeTab === DisplayTabs.RESULT && "bg-white",
                  )}
                >
                  <Braces size={16} />
                </TabsTrigger>
              }
            >
              Results
            </CustomTooltip>

            <CustomTooltip
              side="right"
              Trigger={
                <TabsTrigger
                  value={DisplayTabs.TRACING}
                  className={cn(
                    "w-full justify-center rounded-none px-4 py-2 text-left hover:bg-white/10",
                    activeTab === DisplayTabs.TRACING && "bg-white",
                  )}
                >
                  <SearchCode size={18} />
                </TabsTrigger>
              }
            >
              Tracing
            </CustomTooltip>

            <CustomTooltip
              side="right"
              Trigger={
                <TabsTrigger
                  value={DisplayTabs.DASHBOARD}
                  className={cn(
                    "w-full justify-center rounded-none px-4 py-2 text-left hover:bg-white/10",
                    activeTab === DisplayTabs.DASHBOARD && "bg-white",
                  )}
                >
                  <ChartArea size={18} />
                </TabsTrigger>
              }
            >
              Dashboard
            </CustomTooltip>
          </TabsList>
        </Tabs>
      )}
      {loadingResults && (
        <div className="flex flex-col w-full h-full gap-1 p-1">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-full w-full" />
        </div>
      )}

      {!loadingResults && (!queryResult || queryResult.length === 0)
        ? null
        : renderTabs[activeTab as DisplayTabs]}
    </ResizablePanel>
  );
}
