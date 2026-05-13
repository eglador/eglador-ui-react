import * as React from "react";
import { cn } from "../../lib/utils";

export type InputVariant = "outline" | "soft" | "ghost";
export type InputSize = "xs" | "sm" | "md" | "lg" | "xl";
export type InputShape = "square" | "rounded" | "pill";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: InputVariant;
  size?: InputSize;
  shape?: InputShape;
}

const SIZES: Record<
  InputSize,
  { height: string; padding: string; font: string }
> = {
  xs: { height: "h-7", padding: "px-2", font: "text-xs" },
  sm: { height: "h-8", padding: "px-2.5", font: "text-sm" },
  md: { height: "h-9", padding: "px-3", font: "text-sm" },
  lg: { height: "h-10", padding: "px-3.5", font: "text-base" },
  xl: { height: "h-12", padding: "px-4", font: "text-lg" },
};

const SHAPES: Record<InputShape, string> = {
  square: "rounded-none",
  rounded: "rounded-sm",
  pill: "rounded-full",
};

const VARIANTS: Record<InputVariant, string> = {
  outline: "bg-white border border-zinc-300",
  soft: "bg-zinc-50 border border-zinc-200",
  ghost:
    "bg-transparent border border-transparent focus-visible:border-zinc-300",
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      variant = "outline",
      size = "md",
      shape = "rounded",
      className,
      type = "text",
      ...rest
    },
    ref,
  ) {
    const s = SIZES[size];
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          "w-full transition-colors",
          "text-zinc-900 placeholder:text-zinc-400",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-1 focus-visible:border-zinc-900",
          "aria-invalid:border-zinc-900 aria-invalid:ring-2 aria-invalid:ring-zinc-200",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-50",
          "read-only:bg-zinc-50 read-only:text-zinc-600",
          "file:border-0 file:bg-transparent file:text-zinc-700 file:font-medium file:me-3 file:cursor-pointer",
          VARIANTS[variant],
          SHAPES[shape],
          s.height,
          s.padding,
          s.font,
          className,
        )}
        {...rest}
      />
    );
  },
);

Input.displayName = "Input";
