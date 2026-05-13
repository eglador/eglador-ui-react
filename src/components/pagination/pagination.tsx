"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  EllipsisIcon,
} from "../../lib/icons";

export type PaginationVariant = "solid" | "outline" | "ghost";
export type PaginationSize = "xs" | "sm" | "md" | "lg" | "xl";
export type PaginationShape = "square" | "rounded" | "pill";

interface PaginationContextValue {
  size: PaginationSize;
  variant: PaginationVariant;
  shape: PaginationShape;
}

const PaginationContext = React.createContext<PaginationContextValue>({
  size: "md",
  variant: "ghost",
  shape: "rounded",
});

const SIZES: Record<
  PaginationSize,
  { button: string; icon: string; font: string; gap: string }
> = {
  xs: { button: "size-7 min-w-7 px-1.5", icon: "size-3", font: "text-xs", gap: "gap-0.5" },
  sm: { button: "size-8 min-w-8 px-2", icon: "size-3.5", font: "text-xs", gap: "gap-1" },
  md: { button: "size-9 min-w-9 px-2.5", icon: "size-4", font: "text-sm", gap: "gap-1" },
  lg: { button: "size-10 min-w-10 px-3", icon: "size-4", font: "text-sm", gap: "gap-1.5" },
  xl: { button: "size-11 min-w-11 px-3.5", icon: "size-5", font: "text-base", gap: "gap-1.5" },
};

const SHAPES: Record<PaginationShape, string> = {
  square: "rounded-none",
  rounded: "rounded-md",
  pill: "rounded-full",
};

const VARIANTS: Record<
  PaginationVariant,
  { active: string; inactive: string }
> = {
  solid: {
    active: "bg-zinc-900 text-white hover:bg-zinc-800",
    inactive: "text-zinc-700 hover:bg-zinc-100",
  },
  outline: {
    active: "border border-zinc-900 bg-zinc-900 text-white",
    inactive:
      "border border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50",
  },
  ghost: {
    active: "bg-zinc-100 text-zinc-900 font-semibold",
    inactive: "text-zinc-700 hover:bg-zinc-100",
  },
};

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  size?: PaginationSize;
  variant?: PaginationVariant;
  shape?: PaginationShape;
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  function Pagination(
    {
      size = "md",
      variant = "ghost",
      shape = "rounded",
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <PaginationContext.Provider value={{ size, variant, shape }}>
        <nav
          ref={ref}
          role="navigation"
          aria-label="Pagination"
          data-slot="pagination"
          className={cn("flex w-full items-center", className)}
          {...rest}
        />
      </PaginationContext.Provider>
    );
  },
);

Pagination.displayName = "Pagination";

export interface PaginationContentProps
  extends React.HTMLAttributes<HTMLUListElement> {}

export const PaginationContent = React.forwardRef<
  HTMLUListElement,
  PaginationContentProps
>(function PaginationContent({ className, ...rest }, ref) {
  const { size } = React.useContext(PaginationContext);
  const s = SIZES[size];
  return (
    <ul
      ref={ref}
      data-slot="pagination-content"
      className={cn("flex flex-row items-center", s.gap, className)}
      {...rest}
    />
  );
});

PaginationContent.displayName = "PaginationContent";

export interface PaginationItemProps
  extends React.LiHTMLAttributes<HTMLLIElement> {}

export const PaginationItem = React.forwardRef<
  HTMLLIElement,
  PaginationItemProps
>(function PaginationItem({ className, ...rest }, ref) {
  return (
    <li
      ref={ref}
      data-slot="pagination-item"
      className={cn(className)}
      {...rest}
    />
  );
});

PaginationItem.displayName = "PaginationItem";

interface PaginationButtonBaseProps {
  size?: PaginationSize;
  variant?: PaginationVariant;
  shape?: PaginationShape;
  isActive?: boolean;
  asChild?: boolean;
}

export interface PaginationLinkProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    PaginationButtonBaseProps {}

export const PaginationLink = React.forwardRef<
  HTMLButtonElement,
  PaginationLinkProps
>(function PaginationLink(
  {
    size: sizeOverride,
    variant: variantOverride,
    shape: shapeOverride,
    isActive,
    asChild = false,
    className,
    children,
    disabled,
    ...rest
  },
  ref,
) {
  const ctx = React.useContext(PaginationContext);
  const size = sizeOverride ?? ctx.size;
  const variant = variantOverride ?? ctx.variant;
  const shape = shapeOverride ?? ctx.shape;
  const s = SIZES[size];
  const v = VARIANTS[variant];

  const baseClass = cn(
    "inline-flex items-center justify-center transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
    "cursor-pointer",
    s.button,
    s.font,
    SHAPES[shape],
    isActive ? v.active : v.inactive,
    className,
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    const childProps = child.props;
    return React.cloneElement(child, {
      ...rest,
      "data-slot": "pagination-link",
      "data-active": isActive || undefined,
      "aria-current": isActive ? "page" : undefined,
      className: cn(childProps.className as string | undefined, baseClass),
      ref,
    } as Record<string, unknown>);
  }

  return (
    <button
      ref={ref}
      type="button"
      data-slot="pagination-link"
      data-active={isActive || undefined}
      aria-current={isActive ? "page" : undefined}
      disabled={disabled}
      className={baseClass}
      {...rest}
    >
      {children}
    </button>
  );
});

PaginationLink.displayName = "PaginationLink";

export interface PaginationPreviousProps extends PaginationLinkProps {
  label?: React.ReactNode;
}

export const PaginationPrevious = React.forwardRef<
  HTMLButtonElement,
  PaginationPreviousProps
>(function PaginationPrevious({ label, className, children, ...rest }, ref) {
  const { size } = React.useContext(PaginationContext);
  const s = SIZES[size];
  return (
    <PaginationLink
      ref={ref}
      aria-label="Previous page"
      className={cn(label ? "gap-1.5 ps-2.5 w-auto" : "", className)}
      {...rest}
    >
      <ChevronLeftIcon className={s.icon} />
      {label && <span>{label}</span>}
      {children}
    </PaginationLink>
  );
});

PaginationPrevious.displayName = "PaginationPrevious";

export interface PaginationNextProps extends PaginationLinkProps {
  label?: React.ReactNode;
}

export const PaginationNext = React.forwardRef<
  HTMLButtonElement,
  PaginationNextProps
>(function PaginationNext({ label, className, children, ...rest }, ref) {
  const { size } = React.useContext(PaginationContext);
  const s = SIZES[size];
  return (
    <PaginationLink
      ref={ref}
      aria-label="Next page"
      className={cn(label ? "gap-1.5 pe-2.5 w-auto" : "", className)}
      {...rest}
    >
      {label && <span>{label}</span>}
      {children}
      <ChevronRightIcon className={s.icon} />
    </PaginationLink>
  );
});

PaginationNext.displayName = "PaginationNext";

export interface PaginationFirstProps extends PaginationLinkProps {}

export const PaginationFirst = React.forwardRef<
  HTMLButtonElement,
  PaginationFirstProps
>(function PaginationFirst({ children, ...rest }, ref) {
  const { size } = React.useContext(PaginationContext);
  const s = SIZES[size];
  return (
    <PaginationLink ref={ref} aria-label="First page" {...rest}>
      <ChevronsLeftIcon className={s.icon} />
      {children}
    </PaginationLink>
  );
});

PaginationFirst.displayName = "PaginationFirst";

export interface PaginationLastProps extends PaginationLinkProps {}

export const PaginationLast = React.forwardRef<
  HTMLButtonElement,
  PaginationLastProps
>(function PaginationLast({ children, ...rest }, ref) {
  const { size } = React.useContext(PaginationContext);
  const s = SIZES[size];
  return (
    <PaginationLink ref={ref} aria-label="Last page" {...rest}>
      <ChevronsRightIcon className={s.icon} />
      {children}
    </PaginationLink>
  );
});

PaginationLast.displayName = "PaginationLast";

export interface PaginationEllipsisProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  PaginationEllipsisProps
>(function PaginationEllipsis({ className, ...rest }, ref) {
  const { size } = React.useContext(PaginationContext);
  const s = SIZES[size];
  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-slot="pagination-ellipsis"
      className={cn(
        "inline-flex items-center justify-center text-zinc-400",
        s.button,
        s.font,
        className,
      )}
      {...rest}
    >
      <EllipsisIcon className={s.icon} />
      <span className="sr-only">More pages</span>
    </span>
  );
});

PaginationEllipsis.displayName = "PaginationEllipsis";

export interface UsePaginationRangeOptions {
  totalPages: number;
  currentPage: number;
  siblingCount?: number;
  boundaryCount?: number;
}

export type PaginationRangeItem = number | "ellipsis-start" | "ellipsis-end";

export function usePaginationRange({
  totalPages,
  currentPage,
  siblingCount = 1,
  boundaryCount = 1,
}: UsePaginationRangeOptions): PaginationRangeItem[] {
  return React.useMemo(() => {
    if (totalPages <= 0) return [];
    const range: PaginationRangeItem[] = [];

    const leftBoundary = Math.min(boundaryCount, totalPages);
    const rightBoundary = Math.max(
      totalPages - boundaryCount + 1,
      leftBoundary + 1,
    );
    const leftSibling = Math.max(currentPage - siblingCount, leftBoundary + 1);
    const rightSibling = Math.min(
      currentPage + siblingCount,
      rightBoundary - 1,
    );

    for (let i = 1; i <= leftBoundary; i++) range.push(i);
    if (leftSibling > leftBoundary + 1) range.push("ellipsis-start");
    for (let i = leftSibling; i <= rightSibling; i++) {
      if (!range.includes(i)) range.push(i);
    }
    if (rightSibling < rightBoundary - 1) range.push("ellipsis-end");
    for (let i = rightBoundary; i <= totalPages; i++) {
      if (!range.includes(i)) range.push(i);
    }

    return range;
  }, [totalPages, currentPage, siblingCount, boundaryCount]);
}
