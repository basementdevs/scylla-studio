"use client";

import {
  type ILayoutContext,
  LayoutContext,
} from "@scylla-studio/contexts/layout";
import { use } from "react";

export function useLayout() {
  return use(LayoutContext);
}
