"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { ChevronRightIcon, EllipsisIcon } from "../../lib/icons";

export type BreadcrumbSize = "xs" | "sm" | "md" | "lg" | "xl";

interface BreadcrumbContextValue {
  size: BreadcrumbSize;
}

const BreadcrumbContext = React.createContext<BreadcrumbContextValue>({
  size: "md",
});

const SIZES: Record<
  BreadcrumbSize,
  { font: string; gap: string; icon: string; ellipsis: string }
> = {
  xs: { font: "text-xs", gap: "gap-1", icon: "size-3", ellipsis: "size-5" },
  sm: { font: "text-xs", gap: "gap-1.5", icon: "size-3.5", ellipsis: "size-6" },
  md: { font: "text-sm", gap: "gap-1.5", icon: "size-3.5", ellipsis: "size-6" },
  lg: { font: "text-base", gap: "gap-2", icon: "size-4", ellipsis: "size-7" },
  xl: { font: "text-lg", gap: "gap-2.5", icon: "size-5", ellipsis: "size-8" },
};

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  size?: BreadcrumbSize;
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  function Breadcrumb({ size = "md", className, ...rest }, ref) {
    return (
      <BreadcrumbContext.Provider value={{ size }}>
        <nav
          ref={ref}
          aria-label="Breadcrumb"
          data-slot="breadcrumb"
          className={cn("flex", className)}
          {...rest}
        />
      </BreadcrumbContext.Provider>
    );
  },
);

Breadcrumb.displayName = "Breadcrumb";

export interface BreadcrumbListProps
  extends React.OlHTMLAttributes<HTMLOListElement> {}

export const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  BreadcrumbListProps
>(function BreadcrumbList({ className, ...rest }, ref) {
  const { size } = React.useContext(BreadcrumbContext);
  const s = SIZES[size];
  return (
    <ol
      ref={ref}
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center text-zinc-500",
        s.font,
        s.gap,
        className,
      )}
      {...rest}
    />
  );
});

BreadcrumbList.displayName = "BreadcrumbList";

export interface BreadcrumbItemProps
  extends React.LiHTMLAttributes<HTMLLIElement> {}

export const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  BreadcrumbItemProps
>(function BreadcrumbItem({ className, ...rest }, ref) {
  const { size } = React.useContext(BreadcrumbContext);
  const s = SIZES[size];
  return (
    <li
      ref={ref}
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center", s.gap, className)}
      {...rest}
    />
  );
});

BreadcrumbItem.displayName = "BreadcrumbItem";

export interface BreadcrumbLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
}

export const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  BreadcrumbLinkProps
>(function BreadcrumbLink(
  { asChild = false, className, children, ...rest },
  ref,
) {
  const baseClass = cn(
    "inline-flex items-center gap-1.5 transition-colors text-zinc-500 hover:text-zinc-900",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 rounded-sm",
    className,
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    const childProps = child.props;
    return React.cloneElement(child, {
      ...rest,
      "data-slot": "breadcrumb-link",
      className: cn(childProps.className as string | undefined, baseClass),
      ref,
    } as Record<string, unknown>);
  }

  return (
    <a
      ref={ref}
      data-slot="breadcrumb-link"
      className={baseClass}
      {...rest}
    >
      {children}
    </a>
  );
});

BreadcrumbLink.displayName = "BreadcrumbLink";

export interface BreadcrumbPageProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  BreadcrumbPageProps
>(function BreadcrumbPage({ className, ...rest }, ref) {
  return (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      data-slot="breadcrumb-page"
      className={cn(
        "inline-flex items-center gap-1.5 font-medium text-zinc-900",
        className,
      )}
      {...rest}
    />
  );
});

BreadcrumbPage.displayName = "BreadcrumbPage";

export interface BreadcrumbSeparatorProps
  extends React.LiHTMLAttributes<HTMLLIElement> {}

export const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  BreadcrumbSeparatorProps
>(function BreadcrumbSeparator({ className, children, ...rest }, ref) {
  const { size } = React.useContext(BreadcrumbContext);
  const s = SIZES[size];
  return (
    <li
      ref={ref}
      role="presentation"
      aria-hidden="true"
      data-slot="breadcrumb-separator"
      className={cn(
        "inline-flex items-center justify-center text-zinc-400 [&>svg]:w-full [&>svg]:h-full",
        s.icon,
        className,
      )}
      {...rest}
    >
      {children ?? <ChevronRightIcon />}
    </li>
  );
});

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export interface BreadcrumbEllipsisProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const BreadcrumbEllipsis = React.forwardRef<
  HTMLButtonElement,
  BreadcrumbEllipsisProps
>(function BreadcrumbEllipsis(
  { asChild = false, className, children, ...rest },
  ref,
) {
  const { size } = React.useContext(BreadcrumbContext);
  const s = SIZES[size];

  const baseClass = cn(
    "inline-flex items-center justify-center rounded-sm text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20",
    "cursor-pointer disabled:cursor-not-allowed",
    s.ellipsis,
    className,
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    const childProps = child.props;
    return React.cloneElement(child, {
      ...rest,
      "aria-label": "Show more",
      "data-slot": "breadcrumb-ellipsis",
      className: cn(childProps.className as string | undefined, baseClass),
      ref,
    } as Record<string, unknown>);
  }

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Show more"
      data-slot="breadcrumb-ellipsis"
      className={baseClass}
      {...rest}
    >
      {children ?? <EllipsisIcon className={s.icon} />}
      <span className="sr-only">More</span>
    </button>
  );
});

BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";
