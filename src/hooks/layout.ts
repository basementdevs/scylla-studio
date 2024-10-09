"use client";

import {
  type ILayoutContext,
  LayoutContext,
} from "@scylla-studio/contexts/layout";
import { useContext } from "react";

export function useLayout() {
  return useContext<ILayoutContext>(LayoutContext);
}
