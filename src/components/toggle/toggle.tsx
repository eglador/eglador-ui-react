"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { useControlledSync } from "../../lib/use-controlled-sync";

export type ToggleVariant = "ghost" | "outline" | "soft";
export type ToggleSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ToggleShape = "square" | "rounded" | "circle";

export interface ToggleProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "type" | "onChange" | "value"
  > {
  variant?: ToggleVariant;
  size?: ToggleSize;
  shape?: ToggleShape;
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  icon?: React.ReactNode;
}

const SIZES: Record<
  ToggleSize,
  {
    height: string;
    square: string;
    padding: string;
    gap: string;
    font: string;
    iconSize: string;
  }
> = {
  xs: { height: "h-7", square: "w-7", padding: "px-2", gap: "gap-1", font: "text-xs", iconSize: "size-3" },
  sm: { height: "h-8", square: "w-8", padding: "px-2.5", gap: "gap-1.5", font: "text-sm", iconSize: "size-3.5" },
  md: { height: "h-9", square: "w-9", padding: "px-3", gap: "gap-1.5", font: "text-sm", iconSize: "size-4" },
  lg: { height: "h-10", square: "w-10", padding: "px-4", gap: "gap-2", font: "text-base", iconSize: "size-4" },
  xl: { height: "h-12", square: "w-12", padding: "px-5", gap: "gap-2", font: "text-lg", iconSize: "size-5" },
};

const SHAPES: Record<ToggleShape, string> = {
  square: "",
  rounded: "rounded-sm",
  circle: "rounded-full",
};

const VARIANTS: Record<ToggleVariant, { base: string; pressed: string }> = {
  ghost: {
    base: "bg-transparent text-zinc-700 hover:bg-zinc-100 border border-transparent",
    pressed: "bg-zinc-100 text-zinc-900",
  },
  outline: {
    base: "bg-white text-zinc-700 hover:bg-zinc-50 border border-zinc-300",
    pressed: "bg-zinc-100 text-zinc-900 border-zinc-400",
  },
  soft: {
    base: "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-transparent",
    pressed: "bg-zinc-200 text-zinc-900",
  },
};

const BASE_CLASSES =
  "inline-flex items-center justify-center font-medium transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed";

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  function Toggle(
    {
      variant = "ghost",
      size = "md",
      shape = "rounded",
      pressed: controlled,
      defaultPressed = false,
      onPressedChange,
      icon,
      disabled = false,
      onClick,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const isControlled = controlled !== undefined;
    const [internal, setInternal] = React.useState(
      controlled !== undefined ? controlled : defaultPressed,
    );
    const pressed = isControlled ? controlled : internal;
    useControlledSync(controlled, setInternal);

    const s = SIZES[size];
    const v = VARIANTS[variant];
    const isIconOnly = !children && !!icon;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      const next = !pressed;
      setInternal(next);
      onPressedChange?.(next);
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={pressed}
        data-state={pressed ? "on" : "off"}
        data-slot="toggle"
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          BASE_CLASSES,
          s.font,
          s.gap,
          SHAPES[shape],
          s.height,
          isIconOnly ? s.square : s.padding,
          v.base,
          pressed && v.pressed,
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
      </button>
    );
  },
);

Toggle.displayName = "Toggle";
