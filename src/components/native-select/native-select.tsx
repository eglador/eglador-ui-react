"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { ChevronDownIcon } from "../../lib/icons";

export type NativeSelectVariant = "outline" | "soft" | "ghost";
export type NativeSelectSize = "xs" | "sm" | "md" | "lg" | "xl";
export type NativeSelectShape = "square" | "rounded" | "pill";

const SIZES: Record<
  NativeSelectSize,
  { control: string; font: string; icon: string; padEnd: string }
> = {
  xs: { control: "h-7", font: "text-xs", icon: "size-3", padEnd: "pe-7" },
  sm: { control: "h-8", font: "text-xs", icon: "size-3.5", padEnd: "pe-8" },
  md: { control: "h-9", font: "text-sm", icon: "size-4", padEnd: "pe-9" },
  lg: { control: "h-10", font: "text-base", icon: "size-4", padEnd: "pe-10" },
  xl: { control: "h-11", font: "text-base", icon: "size-5", padEnd: "pe-12" },
};

const SHAPES: Record<NativeSelectShape, string> = {
  square: "rounded-none",
  rounded: "rounded-md",
  pill: "rounded-full",
};

const VARIANTS: Record<NativeSelectVariant, string> = {
  outline:
    "border border-zinc-300 bg-white hover:border-zinc-400 focus:border-zinc-400 focus:ring-[3px] focus:ring-zinc-900/[0.06]",
  soft: "border border-transparent bg-zinc-100 hover:bg-zinc-200 focus:bg-zinc-50 focus:ring-[3px] focus:ring-zinc-900/[0.06]",
  ghost: "border border-transparent bg-transparent hover:bg-zinc-100 focus:ring-[3px] focus:ring-zinc-900/[0.06]",
};

export interface NativeSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: NativeSelectVariant;
  selectSize?: NativeSelectSize;
  shape?: NativeSelectShape;
}

export const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  NativeSelectProps
>(function NativeSelect(
  {
    variant = "outline",
    selectSize = "md",
    shape = "rounded",
    className,
    children,
    "aria-invalid": ariaInvalid,
    disabled,
    ...rest
  },
  ref,
) {
  const s = SIZES[selectSize];
  return (
    <div
      data-slot="native-select"
      data-disabled={disabled || undefined}
      className={cn("relative inline-flex w-full", className)}
    >
      <select
        ref={ref}
        aria-invalid={ariaInvalid}
        disabled={disabled}
        className={cn(
          "appearance-none w-full ps-3 outline-none transition-colors cursor-pointer text-zinc-900",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-[3px] aria-[invalid=true]:ring-red-500/10",
          s.control,
          s.font,
          s.padEnd,
          SHAPES[shape],
          VARIANTS[variant],
        )}
        {...rest}
      >
        {children}
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-zinc-500",
          s.icon,
        )}
      />
    </div>
  );
});

NativeSelect.displayName = "NativeSelect";
