import * as React from "react";
import { cn } from "../../lib/utils";

export type ButtonVariant = "solid" | "soft" | "outline" | "ghost" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ButtonShape = "square" | "rounded" | "circle";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "active"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  active?: boolean;
}

const SIZES: Record<
  ButtonSize,
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

const SHAPES: Record<ButtonShape, string> = {
  square: "",
  rounded: "rounded-sm",
  circle: "rounded-full",
};

const VARIANTS: Record<ButtonVariant, { base: string; active: string }> = {
  solid: {
    base: "bg-zinc-900 text-white hover:bg-zinc-700 border border-zinc-900",
    active: "bg-zinc-700",
  },
  soft: {
    base: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-200",
    active: "bg-zinc-200",
  },
  outline: {
    base: "bg-white text-zinc-700 hover:bg-zinc-50 border border-zinc-300",
    active: "bg-zinc-100",
  },
  ghost: {
    base: "bg-transparent text-zinc-700 hover:bg-zinc-100 border border-transparent",
    active: "bg-zinc-100",
  },
  link: {
    base: "bg-transparent text-zinc-900 hover:underline underline-offset-4 border-0",
    active: "underline",
  },
};

const BASE_CLASSES =
  "inline-flex items-center justify-center font-medium transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none";

export interface ButtonVariantOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
}

export function buttonVariants({
  variant = "solid",
  size = "md",
  shape = "rounded",
}: ButtonVariantOptions = {}): string {
  const s = SIZES[size];
  const v = VARIANTS[variant];
  const isLink = variant === "link";
  return cn(
    BASE_CLASSES,
    s.font,
    s.gap,
    !isLink && SHAPES[shape],
    !isLink && s.height,
    !isLink && s.padding,
    v.base,
  );
}

function MiniSpinner({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("animate-spin", className)}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "solid",
      size = "md",
      shape = "rounded",
      icon,
      iconRight,
      loading = false,
      active = false,
      disabled = false,
      className,
      children,
      type = "button",
      ...rest
    },
    ref,
  ) {
    const s = SIZES[size];
    const v = VARIANTS[variant];
    const isLink = variant === "link";
    const isIconOnly = !isLink && !children && (!!icon || loading);
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        data-active={active || undefined}
        className={cn(
          BASE_CLASSES,
          s.font,
          s.gap,
          !isLink && SHAPES[shape],
          !isLink && s.height,
          !isLink && (isIconOnly ? s.square : s.padding),
          v.base,
          active && v.active,
          className,
        )}
        {...rest}
      >
        {loading ? (
          <MiniSpinner className={s.iconSize} />
        ) : icon ? (
          <span
            className={cn(
              "shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full",
              s.iconSize,
            )}
          >
            {icon}
          </span>
        ) : null}

        {children}

        {iconRight && !loading && (
          <span
            className={cn(
              "shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full",
              s.iconSize,
            )}
          >
            {iconRight}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
