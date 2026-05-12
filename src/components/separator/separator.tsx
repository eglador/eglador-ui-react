import * as React from "react";
import { cn } from "../../lib/utils";

export type SeparatorOrientation = "horizontal" | "vertical";
export type SeparatorVariant = "solid" | "dashed" | "dotted";

export interface SeparatorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "role" | "aria-orientation"> {
  orientation?: SeparatorOrientation;
  variant?: SeparatorVariant;
  label?: React.ReactNode;
  decorative?: boolean;
}

const VARIANTS: Record<SeparatorVariant, string> = {
  solid: "border-solid",
  dashed: "border-dashed",
  dotted: "border-dotted",
};

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  function Separator(
    {
      orientation = "horizontal",
      variant = "solid",
      label,
      decorative,
      className,
      ...rest
    },
    ref,
  ) {
    const a11yProps = decorative
      ? { role: "none" as const }
      : {
          role: "separator" as const,
          "aria-orientation": orientation,
        };

    if (orientation === "vertical") {
      return (
        <div
          ref={ref}
          {...a11yProps}
          className={cn(
            "self-stretch w-px border-l border-zinc-200",
            VARIANTS[variant],
            className,
          )}
          {...rest}
        />
      );
    }

    if (label) {
      return (
        <div
          ref={ref}
          {...a11yProps}
          className={cn("flex items-center gap-3", className)}
          {...rest}
        >
          <div
            aria-hidden="true"
            className={cn("flex-1 border-t border-zinc-200", VARIANTS[variant])}
          />
          <span className="text-xs text-zinc-500 font-medium shrink-0">
            {label}
          </span>
          <div
            aria-hidden="true"
            className={cn("flex-1 border-t border-zinc-200", VARIANTS[variant])}
          />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        {...a11yProps}
        className={cn(
          "w-full border-t border-zinc-200",
          VARIANTS[variant],
          className,
        )}
        {...rest}
      />
    );
  },
);

Separator.displayName = "Separator";
