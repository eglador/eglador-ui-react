import * as React from "react";
import { cn } from "../../lib/utils";
import { XIcon } from "../../lib/icons";

export type BadgeVariant = "solid" | "soft" | "outline";
export type BadgeSize = "xs" | "sm" | "md" | "lg" | "xl";
export type BadgeShape = "square" | "rounded" | "pill";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  shape?: BadgeShape;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  children: React.ReactNode;
}

const SIZES: Record<
  BadgeSize,
  { padding: string; font: string; iconSize: string; gap: string }
> = {
  xs: { padding: "px-1.5 py-0.5", font: "text-[10px]", iconSize: "size-2.5", gap: "gap-0.5" },
  sm: { padding: "px-2 py-0.5", font: "text-xs", iconSize: "size-3", gap: "gap-1" },
  md: { padding: "px-2.5 py-1", font: "text-sm", iconSize: "size-3.5", gap: "gap-1" },
  lg: { padding: "px-3 py-1.5", font: "text-base", iconSize: "size-4", gap: "gap-1.5" },
  xl: { padding: "px-4 py-2", font: "text-lg", iconSize: "size-5", gap: "gap-2" },
};

const SHAPES: Record<BadgeShape, string> = {
  square: "",
  rounded: "rounded-sm",
  pill: "rounded-full",
};

const VARIANTS: Record<BadgeVariant, { base: string; removeHover: string }> = {
  solid: {
    base: "bg-zinc-900 text-white border border-zinc-900",
    removeHover: "hover:bg-zinc-700",
  },
  soft: {
    base: "bg-zinc-100 text-zinc-700 border border-zinc-200",
    removeHover: "hover:bg-zinc-200 hover:text-zinc-900",
  },
  outline: {
    base: "bg-transparent text-zinc-700 border border-zinc-300",
    removeHover: "hover:bg-zinc-100 hover:text-zinc-900",
  },
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge(
    {
      variant = "soft",
      size = "sm",
      shape = "rounded",
      icon,
      iconRight,
      removable = false,
      onRemove,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const s = SIZES[size];
    const v = VARIANTS[variant];
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium whitespace-nowrap",
          s.padding,
          s.font,
          s.gap,
          SHAPES[shape],
          v.base,
          className,
        )}
        {...rest}
      >
        {icon && (
          <span
            className={cn(
              "shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full",
              s.iconSize,
            )}
          >
            {icon}
          </span>
        )}

        {children}

        {iconRight && !removable && (
          <span
            className={cn(
              "shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full",
              s.iconSize,
            )}
          >
            {iconRight}
          </span>
        )}

        {removable && (
          <button
            type="button"
            aria-label="Remove"
            onClick={onRemove}
            className={cn(
              "shrink-0 flex items-center justify-center rounded-full transition-colors cursor-pointer -mr-0.5",
              s.iconSize,
              v.removeHover,
            )}
          >
            <XIcon className="size-full" strokeWidth={2.5} />
          </button>
        )}
      </span>
    );
  },
);

Badge.displayName = "Badge";
