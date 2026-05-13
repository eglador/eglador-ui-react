"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export type TableSize = "xs" | "sm" | "md" | "lg" | "xl";
export type TableLayout = "auto" | "fixed";

interface TableContextValue {
  size: TableSize;
  stickyHeader: boolean;
}

const TableContext = React.createContext<TableContextValue>({
  size: "md",
  stickyHeader: false,
});

const SIZES: Record<
  TableSize,
  { cell: string; font: string }
> = {
  xs: { cell: "h-7 px-2", font: "text-xs" },
  sm: { cell: "h-8 px-2.5", font: "text-xs" },
  md: { cell: "h-10 px-3", font: "text-sm" },
  lg: { cell: "h-12 px-4", font: "text-sm" },
  xl: { cell: "h-14 px-5", font: "text-base" },
};

export interface TableProps
  extends React.TableHTMLAttributes<HTMLTableElement> {
  size?: TableSize;
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  layout?: TableLayout;
  fullWidth?: boolean;
  scrollX?: boolean;
  scrollY?: boolean;
  maxHeight?: string | number;
  stickyHeader?: boolean;
  containerClassName?: string;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  function Table(
    {
      size = "md",
      bordered = false,
      striped = false,
      hoverable = false,
      layout = "auto",
      fullWidth = true,
      scrollX = true,
      scrollY = false,
      maxHeight,
      stickyHeader = false,
      containerClassName,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const containerStyle: React.CSSProperties = {};
    if (maxHeight !== undefined) {
      containerStyle.maxHeight =
        typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
    }
    const effectiveScrollY = scrollY || maxHeight !== undefined;

    return (
      <TableContext.Provider value={{ size, stickyHeader }}>
        <div
          data-slot="table-container"
          className={cn(
            "relative",
            fullWidth && "w-full",
            scrollX && "overflow-x-auto",
            effectiveScrollY && "overflow-y-auto",
            containerClassName,
          )}
          style={containerStyle}
        >
          <table
            ref={ref}
            data-slot="table"
            data-size={size}
            data-bordered={bordered || undefined}
            data-striped={striped || undefined}
            data-hoverable={hoverable || undefined}
            data-layout={layout}
            className={cn(
              "caption-bottom border-collapse",
              fullWidth && "w-full",
              layout === "fixed" && "table-fixed",
              bordered && "border border-zinc-200",
              striped && "[&>tbody>tr:nth-child(odd)]:bg-zinc-50",
              hoverable && "[&>tbody>tr:hover]:bg-zinc-50",
              className,
            )}
            {...rest}
          >
            {children}
          </table>
        </div>
      </TableContext.Provider>
    );
  },
);

Table.displayName = "Table";

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(function TableHeader({ className, ...rest }, ref) {
  const { stickyHeader } = React.useContext(TableContext);
  return (
    <thead
      ref={ref}
      data-slot="table-header"
      className={cn(
        "border-b border-zinc-200 bg-zinc-50",
        stickyHeader && "sticky top-0 z-10 [&_th]:bg-zinc-50",
        className,
      )}
      {...rest}
    />
  );
});

TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(function TableBody({ className, ...rest }, ref) {
  return (
    <tbody
      ref={ref}
      data-slot="table-body"
      className={cn("[&>tr:last-child]:border-b-0", className)}
      {...rest}
    />
  );
});

TableBody.displayName = "TableBody";

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(function TableFooter({ className, ...rest }, ref) {
  return (
    <tfoot
      ref={ref}
      data-slot="table-footer"
      className={cn(
        "border-t border-zinc-200 bg-zinc-50/50 font-medium",
        className,
      )}
      {...rest}
    />
  );
});

TableFooter.displayName = "TableFooter";

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(function TableRow({ className, ...rest }, ref) {
  return (
    <tr
      ref={ref}
      data-slot="table-row"
      className={cn(
        "border-b border-zinc-200 transition-colors data-[state=selected]:bg-zinc-100",
        className,
      )}
      {...rest}
    />
  );
});

TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(function TableHead({ className, ...rest }, ref) {
  const { size } = React.useContext(TableContext);
  const s = SIZES[size];
  return (
    <th
      ref={ref}
      data-slot="table-head"
      className={cn(
        "text-start align-middle font-semibold text-zinc-700",
        s.cell,
        s.font,
        className,
      )}
      {...rest}
    />
  );
});

TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(function TableCell({ className, ...rest }, ref) {
  const { size } = React.useContext(TableContext);
  const s = SIZES[size];
  return (
    <td
      ref={ref}
      data-slot="table-cell"
      className={cn("align-middle text-zinc-700", s.cell, s.font, className)}
      {...rest}
    />
  );
});

TableCell.displayName = "TableCell";

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(function TableCaption({ className, ...rest }, ref) {
  return (
    <caption
      ref={ref}
      data-slot="table-caption"
      className={cn("mt-3 text-xs text-zinc-500", className)}
      {...rest}
    />
  );
});

TableCaption.displayName = "TableCaption";
