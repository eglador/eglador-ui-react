import * as React from "react";
import { cn } from "../../lib/utils";
import { ensureSkeletonStyles } from "./styles";

export type SkeletonVariant = "text" | "circular" | "rectangular" | "rounded";
export type SkeletonAnimation = "pulse" | "wave" | "none";

export interface SkeletonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "style"> {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  width?: string | number;
  height?: string | number;
  lines?: number;
  lineGap?: string;
  style?: React.CSSProperties;
}

const VARIANTS: Record<SkeletonVariant, string> = {
  text: "rounded-sm",
  circular: "rounded-full",
  rectangular: "",
  rounded: "rounded-sm",
};

function resolveSize(value: string | number | undefined): string | undefined {
  if (value == null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton(
    {
      variant = "text",
      animation = "pulse",
      width,
      height,
      lines,
      lineGap = "0.75rem",
      className,
      style,
      ...rest
    },
    ref,
  ) {
    React.useEffect(() => {
      if (animation === "wave") ensureSkeletonStyles();
    }, [animation]);

    const resolvedWidth = resolveSize(width);
    const resolvedHeight = resolveSize(height);

    let finalWidth = resolvedWidth;
    let finalHeight = resolvedHeight;

    if (!finalHeight) {
      if (variant === "text") finalHeight = "1em";
      else if (variant === "circular") finalHeight = finalWidth ?? "2.5rem";
      else finalHeight = "8rem";
    }
    if (variant === "circular" && !finalWidth) {
      finalWidth = finalHeight;
    }
    if (!finalWidth && variant !== "circular") {
      finalWidth = "100%";
    }

    const baseClass = cn(
      animation === "wave" ? "eglador-skeleton-wave" : "bg-zinc-200",
      VARIANTS[variant],
      animation === "pulse" && "animate-pulse",
      className,
    );

    if (lines && lines > 1) {
      return (
        <div
          ref={ref}
          className="flex flex-col"
          style={{ gap: lineGap, ...style }}
          {...rest}
        >
          {Array.from({ length: lines }, (_, i) => {
            const isLast = i === lines - 1;
            return (
              <div
                key={i}
                className={baseClass}
                style={{
                  width: isLast ? "60%" : finalWidth,
                  height: finalHeight,
                }}
              />
            );
          })}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={baseClass}
        style={{ width: finalWidth, height: finalHeight, ...style }}
        {...rest}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";
