"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";
export type ScrollAreaScrollbarVisibility = "auto" | "always" | "hover";
export type ScrollAreaSize = "xs" | "sm" | "md" | "lg" | "xl";

const OVERFLOW: Record<ScrollAreaOrientation, string> = {
  vertical: "overflow-y-auto overflow-x-hidden",
  horizontal: "overflow-x-auto overflow-y-hidden",
  both: "overflow-auto",
};

const SCROLLBAR_SIZE: Record<ScrollAreaSize, string> = {
  xs: "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:h-1",
  sm: "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5",
  md: "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2",
  lg: "[&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar]:h-2.5",
  xl: "[&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar]:h-3",
};

const SCROLLBAR_BASE = [
  "[&::-webkit-scrollbar-track]:bg-transparent",
  "[&::-webkit-scrollbar-thumb]:rounded-full",
  "[&::-webkit-scrollbar-corner]:bg-transparent",
].join(" ");

const VISIBILITY: Record<ScrollAreaScrollbarVisibility, string> = {
  auto: "[&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-thumb:hover]:bg-zinc-400",
  always:
    "[&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-thumb:hover]:bg-zinc-400",
  hover:
    "[&::-webkit-scrollbar-thumb]:bg-transparent [&:hover::-webkit-scrollbar-thumb]:bg-zinc-300 [&:hover::-webkit-scrollbar-thumb:hover]:bg-zinc-400 transition-[scrollbar-color]",
};

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: ScrollAreaOrientation;
  scrollbarVisibility?: ScrollAreaScrollbarVisibility;
  scrollbarSize?: ScrollAreaSize;
  viewportClassName?: string;
  maxHeight?: string | number;
  maxWidth?: string | number;
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  function ScrollArea(
    {
      orientation = "vertical",
      scrollbarVisibility = "auto",
      scrollbarSize = "sm",
      viewportClassName,
      maxHeight,
      maxWidth,
      style: rootStyle,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const viewportStyle: React.CSSProperties = {};
    if (maxHeight !== undefined)
      viewportStyle.maxHeight =
        typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
    if (maxWidth !== undefined)
      viewportStyle.maxWidth =
        typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;

    return (
      <div
        ref={ref}
        data-slot="scroll-area"
        className={cn("relative", className)}
        style={rootStyle}
        {...rest}
      >
        <div
          tabIndex={0}
          data-slot="scroll-area-viewport"
          className={cn(
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 rounded-sm",
            OVERFLOW[orientation],
            SCROLLBAR_BASE,
            SCROLLBAR_SIZE[scrollbarSize],
            VISIBILITY[scrollbarVisibility],
            viewportClassName,
          )}
          style={viewportStyle}
        >
          {children}
        </div>
      </div>
    );
  },
);

ScrollArea.displayName = "ScrollArea";
