import * as React from "react";
import { cn } from "../../lib/utils";
import { ExternalLinkIcon } from "../../lib/icons";

export type LinkUnderline = "hover" | "always" | "none";
export type LinkSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: LinkSize;
  underline?: LinkUnderline;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  external?: boolean;
  disabled?: boolean;
}

const SIZES: Record<LinkSize, { font: string; iconSize: string; gap: string }> = {
  xs: { font: "text-xs", iconSize: "size-3", gap: "gap-1" },
  sm: { font: "text-sm", iconSize: "size-3.5", gap: "gap-1.5" },
  md: { font: "text-base", iconSize: "size-4", gap: "gap-1.5" },
  lg: { font: "text-lg", iconSize: "size-4", gap: "gap-2" },
  xl: { font: "text-xl", iconSize: "size-5", gap: "gap-2" },
};

const UNDERLINES: Record<LinkUnderline, string> = {
  hover: "no-underline hover:underline underline-offset-4",
  always: "underline underline-offset-4",
  none: "no-underline",
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(
    {
      size = "sm",
      underline = "hover",
      icon,
      iconRight,
      external = false,
      disabled = false,
      className,
      children,
      target,
      rel,
      ...rest
    },
    ref,
  ) {
    const s = SIZES[size];
    const externalTarget = external ? "_blank" : target;
    const externalRel = external
      ? rel
        ? `${rel} noopener noreferrer`
        : "noopener noreferrer"
      : rel;
    return (
      <a
        ref={ref}
        target={externalTarget}
        rel={externalRel}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : rest.tabIndex}
        className={cn(
          "inline-flex items-center font-medium transition-colors",
          "text-zinc-900 hover:text-zinc-700",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-1 rounded-sm",
          "cursor-pointer",
          s.font,
          s.gap,
          UNDERLINES[underline],
          disabled && "opacity-50 pointer-events-none cursor-not-allowed",
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

        {iconRight ? (
          <span
            className={cn(
              "shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full",
              s.iconSize,
            )}
          >
            {iconRight}
          </span>
        ) : external ? (
          <ExternalLinkIcon className={s.iconSize} />
        ) : null}
      </a>
    );
  },
);

Link.displayName = "Link";
