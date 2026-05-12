import * as React from "react";
import { cn } from "../../lib/utils";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "role"> {
  size?: SpinnerSize;
  label?: string;
}

const SIZES: Record<
  SpinnerSize,
  { spinner: string; labelFont: string; gap: string }
> = {
  xs: { spinner: "size-4", labelFont: "text-xs", gap: "gap-1.5" },
  sm: { spinner: "size-5", labelFont: "text-sm", gap: "gap-2" },
  md: { spinner: "size-8", labelFont: "text-sm", gap: "gap-2.5" },
  lg: { spinner: "size-12", labelFont: "text-base", gap: "gap-3" },
  xl: { spinner: "size-16", labelFont: "text-lg", gap: "gap-3.5" },
};

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  function Spinner({ size = "sm", label, className, ...rest }, ref) {
    const s = SIZES[size];
    return (
      <div
        ref={ref}
        role="status"
        className={cn("inline-flex flex-col items-center", s.gap, className)}
        {...rest}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("animate-spin", s.spinner)}
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            className="text-zinc-200"
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="text-zinc-600"
          />
        </svg>
        {label ? (
          <span className={cn("font-medium text-zinc-500", s.labelFont)}>
            {label}
          </span>
        ) : (
          <span className="sr-only">Loading…</span>
        )}
      </div>
    );
  },
);

Spinner.displayName = "Spinner";
