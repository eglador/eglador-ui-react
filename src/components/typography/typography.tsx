import * as React from "react";
import { cn } from "../../lib/utils";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "lead"
  | "large"
  | "small"
  | "muted"
  | "blockquote"
  | "list"
  | "code"
  | "kbd";

export type TypographyColor = "default" | "muted";
export type TypographyAlign = "left" | "center" | "right";
export type TypographyWeight =
  | "thin"
  | "extralight"
  | "light"
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black";

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color"> {
  variant?: TypographyVariant;
  color?: TypographyColor;
  align?: TypographyAlign;
  weight?: TypographyWeight;
  truncate?: boolean;
  lines?: number;
  as?: React.ElementType;
  children: React.ReactNode;
}

interface VariantDef {
  tag: React.ElementType;
  style: string;
}

const VARIANTS: Record<TypographyVariant, VariantDef> = {
  h1: { tag: "h1", style: "text-4xl font-bold tracking-tight" },
  h2: { tag: "h2", style: "text-3xl font-bold tracking-tight" },
  h3: { tag: "h3", style: "text-2xl font-semibold tracking-tight" },
  h4: { tag: "h4", style: "text-xl font-semibold tracking-tight" },
  p: { tag: "p", style: "text-base leading-relaxed" },
  lead: { tag: "p", style: "text-xl leading-relaxed" },
  large: { tag: "p", style: "text-lg font-medium" },
  small: { tag: "p", style: "text-sm" },
  muted: { tag: "p", style: "text-sm text-zinc-500" },
  blockquote: {
    tag: "blockquote",
    style: "border-s-4 border-zinc-300 ps-4 italic",
  },
  list: {
    tag: "ul",
    style: "list-disc ms-6 [&>li]:mt-1.5 [&>li]:leading-relaxed",
  },
  code: {
    tag: "code",
    style: "bg-zinc-100 px-1.5 py-0.5 rounded-sm text-sm font-mono",
  },
  kbd: {
    tag: "kbd",
    style:
      "bg-zinc-100 border border-zinc-300 px-1.5 py-0.5 rounded-sm text-xs font-mono",
  },
};

const COLORS: Record<TypographyColor, string> = {
  default: "text-zinc-900",
  muted: "text-zinc-500",
};

const ALIGNS: Record<TypographyAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const WEIGHTS: Record<TypographyWeight, string> = {
  thin: "font-thin",
  extralight: "font-extralight",
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black",
};

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  function Typography(
    {
      variant = "p",
      color,
      align,
      weight,
      truncate = false,
      lines,
      as,
      className,
      children,
      style,
      ...rest
    },
    ref,
  ) {
    const v = VARIANTS[variant];
    const Tag = as || v.tag;

    const colorClass = color
      ? COLORS[color]
      : variant === "muted"
        ? ""
        : COLORS.default;

    const lineClampStyle: React.CSSProperties | undefined =
      lines && lines > 0
        ? {
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: lines,
            overflow: "hidden",
          }
        : undefined;

    return (
      <Tag
        ref={ref}
        className={cn(
          v.style,
          colorClass,
          align && ALIGNS[align],
          weight && WEIGHTS[weight],
          truncate && !lines && "truncate",
          className,
        )}
        style={lineClampStyle ? { ...lineClampStyle, ...style } : style}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);

Typography.displayName = "Typography";
