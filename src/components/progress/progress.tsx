"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { ensureProgressStyles } from "./styles";

export type ProgressSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ProgressShape = "square" | "rounded" | "pill";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  size?: ProgressSize;
  shape?: ProgressShape;
  showValue?: boolean;
  label?: React.ReactNode;
}

const SIZES: Record<ProgressSize, { track: string; font: string }> = {
  xs: { track: "h-1", font: "text-[10px]" },
  sm: { track: "h-1.5", font: "text-xs" },
  md: { track: "h-2", font: "text-xs" },
  lg: { track: "h-3", font: "text-sm" },
  xl: { track: "h-4", font: "text-sm" },
};

const SHAPES: Record<ProgressShape, string> = {
  square: "rounded-none",
  rounded: "rounded-sm",
  pill: "rounded-full",
};

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  function Progress(
    {
      value,
      max = 100,
      indeterminate = false,
      size = "md",
      shape = "pill",
      showValue = false,
      label,
      className,
      ...rest
    },
    ref,
  ) {
    React.useEffect(() => {
      if (indeterminate) ensureProgressStyles();
    }, [indeterminate]);

    const s = SIZES[size];
    const isIndeterminate = indeterminate || value === undefined;
    const safeValue = Math.min(max, Math.max(0, value ?? 0));
    const percentage = (safeValue / max) * 100;

    return (
      <div
        ref={ref}
        data-slot="progress-root"
        className={cn("flex flex-col gap-1.5", className)}
        {...rest}
      >
        {(label || (showValue && !isIndeterminate)) && (
          <div className="flex items-center justify-between gap-2">
            {label && (
              <span className={cn("font-medium text-zinc-700", s.font)}>
                {label}
              </span>
            )}
            {showValue && !isIndeterminate && (
              <span className={cn("font-semibold text-zinc-900 tabular-nums", s.font)}>
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        <div
          role="progressbar"
          aria-label={
            !label && typeof rest["aria-label"] !== "string" ? "Progress" : undefined
          }
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={isIndeterminate ? undefined : safeValue}
          data-slot="progress-track"
          className={cn(
            "relative w-full bg-zinc-100 overflow-hidden",
            s.track,
            SHAPES[shape],
          )}
        >
          {isIndeterminate ? (
            <div
              data-slot="progress-bar"
              className={cn(
                "absolute inset-y-0 w-1/3 bg-zinc-900 eglador-progress-indeterminate",
                SHAPES[shape],
              )}
            />
          ) : (
            <div
              data-slot="progress-bar"
              className={cn(
                "h-full bg-zinc-900 transition-[width] duration-500 ease-out",
                SHAPES[shape],
              )}
              style={{ width: `${percentage}%` }}
            />
          )}
        </div>
      </div>
    );
  },
);

Progress.displayName = "Progress";
