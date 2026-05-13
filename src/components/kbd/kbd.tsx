import * as React from "react";
import { cn } from "../../lib/utils";

export type KbdSize = "xs" | "sm" | "md" | "lg" | "xl";
export type KbdVariant = "soft" | "outline" | "ghost";
export type KbdShape = "square" | "rounded";

export interface KbdProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  size?: KbdSize;
  variant?: KbdVariant;
  shape?: KbdShape;
  keys?: string[];
  separator?: React.ReactNode;
  children?: React.ReactNode;
}

export interface KbdGroupProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: KbdSize;
  separator?: React.ReactNode;
}

const SIZES: Record<
  KbdSize,
  { padding: string; font: string; minWidth: string; gap: string }
> = {
  xs: { padding: "px-1 py-px", font: "text-[10px]", minWidth: "min-w-4", gap: "gap-0.5" },
  sm: { padding: "px-1.5 py-0.5", font: "text-xs", minWidth: "min-w-5", gap: "gap-1" },
  md: { padding: "px-2 py-1", font: "text-sm", minWidth: "min-w-6", gap: "gap-1.5" },
  lg: { padding: "px-2.5 py-1", font: "text-base", minWidth: "min-w-7", gap: "gap-1.5" },
  xl: { padding: "px-3 py-1.5", font: "text-lg", minWidth: "min-w-8", gap: "gap-2" },
};

const SHAPES: Record<KbdShape, string> = {
  square: "",
  rounded: "rounded-sm",
};

const VARIANTS: Record<KbdVariant, string> = {
  soft: "bg-zinc-100 border border-zinc-300",
  outline: "bg-transparent border border-zinc-300",
  ghost: "bg-zinc-50 border border-transparent",
};

function Key({
  children,
  size,
  variant,
  shape,
  className,
}: {
  children: React.ReactNode;
  size: KbdSize;
  variant: KbdVariant;
  shape: KbdShape;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center font-mono font-medium text-zinc-700 leading-none",
        SHAPES[shape],
        s.padding,
        s.font,
        s.minWidth,
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </kbd>
  );
}

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(function Kbd(
  {
    size = "sm",
    variant = "soft",
    shape = "rounded",
    keys,
    separator,
    className,
    children,
    ...rest
  },
  ref,
) {
  const s = SIZES[size];

  if (!keys || keys.length === 0) {
    return (
      <kbd
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-mono font-medium text-zinc-700 leading-none",
          SHAPES[shape],
          s.padding,
          s.font,
          s.minWidth,
          VARIANTS[variant],
          className,
        )}
        {...rest}
      >
        {children}
      </kbd>
    );
  }

  const sep = separator ?? (
    <span className={cn("text-zinc-400 font-mono font-medium", s.font)}>+</span>
  );

  return (
    <span
      ref={ref as React.Ref<HTMLSpanElement>}
      className={cn("inline-flex items-center", s.gap, className)}
      {...(rest as React.HTMLAttributes<HTMLSpanElement>)}
    >
      {keys.map((key, i) => (
        <React.Fragment key={i}>
          <Key size={size} variant={variant} shape={shape}>
            {key}
          </Key>
          {i < keys.length - 1 && sep}
        </React.Fragment>
      ))}
    </span>
  );
});

Kbd.displayName = "Kbd";

export const KbdGroup = React.forwardRef<HTMLSpanElement, KbdGroupProps>(
  function KbdGroup({ size = "sm", separator, className, children, ...rest }, ref) {
    const s = SIZES[size];
    const childArray = React.Children.toArray(children).filter(Boolean);
    const sep = separator ?? (
      <span className={cn("text-zinc-400 font-mono font-medium", s.font)}>+</span>
    );
    return (
      <span
        ref={ref}
        className={cn("inline-flex items-center", s.gap, className)}
        {...rest}
      >
        {childArray.map((child, i) => (
          <React.Fragment key={i}>
            {child}
            {i < childArray.length - 1 && sep}
          </React.Fragment>
        ))}
      </span>
    );
  },
);

KbdGroup.displayName = "KbdGroup";
