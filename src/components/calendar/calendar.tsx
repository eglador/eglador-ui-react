"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "../../lib/icons";

export type CalendarMode = "single" | "range";

export interface CalendarRange {
  from?: Date;
  to?: Date;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function isInRange(date: Date, from?: Date, to?: Date): boolean {
  if (!from || !to) return false;
  const t = date.getTime();
  return t >= from.getTime() && t <= to.getTime();
}

interface CalendarSingleProps {
  mode?: "single";
  value?: Date | undefined;
  defaultValue?: Date;
  onValueChange?: (value: Date | undefined) => void;
}

interface CalendarRangeProps {
  mode: "range";
  value?: CalendarRange;
  defaultValue?: CalendarRange;
  onValueChange?: (value: CalendarRange) => void;
}

export type CalendarProps = (CalendarSingleProps | CalendarRangeProps) & {
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: (date: Date) => boolean;
  className?: string;
};

export function Calendar(props: CalendarProps) {
  const {
    mode = "single",
    month: controlledMonth,
    defaultMonth,
    onMonthChange,
    minDate,
    maxDate,
    disabledDates,
    className,
  } = props as CalendarProps & { mode?: CalendarMode };

  const isMonthControlled = controlledMonth !== undefined;
  const [internalMonth, setInternalMonth] = React.useState<Date>(
    () => startOfMonth(defaultMonth ?? new Date()),
  );
  const month = isMonthControlled ? controlledMonth : internalMonth;

  const setMonth = (next: Date) => {
    const m = startOfMonth(next);
    if (!isMonthControlled) setInternalMonth(m);
    onMonthChange?.(m);
  };

  const isSingle = mode !== "range";

  const [singleInternal, setSingleInternal] = React.useState<Date | undefined>(
    () => (props as CalendarSingleProps).defaultValue,
  );
  const [rangeInternal, setRangeInternal] = React.useState<CalendarRange>(
    () => (props as CalendarRangeProps).defaultValue ?? {},
  );

  const isControlled = (props as CalendarProps & { value?: unknown }).value !== undefined;
  const singleValue: Date | undefined = isSingle
    ? isControlled
      ? (props as CalendarSingleProps).value
      : singleInternal
    : undefined;
  const rangeValue: CalendarRange = !isSingle
    ? isControlled
      ? ((props as CalendarRangeProps).value ?? {})
      : rangeInternal
    : {};

  const monthStart = startOfMonth(month);
  const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const startWeekday = monthStart.getDay();
  const daysInMonth = monthEnd.getDate();

  const cells: Array<Date | null> = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++)
    cells.push(new Date(month.getFullYear(), month.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);

  const isDisabled = (d: Date): boolean => {
    if (minDate && d < startOfDay(minDate)) return true;
    if (maxDate && d > endOfDay(maxDate)) return true;
    if (disabledDates?.(d)) return true;
    return false;
  };

  const handleSelect = (d: Date) => {
    if (isDisabled(d)) return;
    if (isSingle) {
      const next = singleValue && isSameDay(singleValue, d) ? undefined : d;
      if (!isControlled) setSingleInternal(next);
      (props as CalendarSingleProps).onValueChange?.(next);
    } else {
      const { from, to } = rangeValue;
      let nextRange: CalendarRange;
      if (!from || (from && to)) {
        nextRange = { from: d };
      } else if (d < from) {
        nextRange = { from: d, to: from };
      } else {
        nextRange = { from, to: d };
      }
      if (!isControlled) setRangeInternal(nextRange);
      (props as CalendarRangeProps).onValueChange?.(nextRange);
    }
  };

  return (
    <div
      data-slot="calendar"
      data-mode={mode}
      className={cn(
        "inline-flex flex-col rounded-md border border-zinc-200 bg-white p-3",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setMonth(addMonths(month, -1))}
          className="inline-flex h-7 w-7 items-center justify-center rounded-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
        >
          <ChevronLeftIcon className="size-4" />
        </button>
        <div
          aria-live="polite"
          className="text-sm font-semibold text-zinc-900"
        >
          {MONTH_NAMES[month.getMonth()]} {month.getFullYear()}
        </div>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setMonth(addMonths(month, 1))}
          className="inline-flex h-7 w-7 items-center justify-center rounded-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>
      <div
        role="grid"
        aria-label={`${MONTH_NAMES[month.getMonth()]} ${month.getFullYear()}`}
        className="grid grid-cols-7 gap-1"
      >
        {WEEKDAYS.map((wd, i) => (
          <div
            key={i}
            role="columnheader"
            className="text-center text-[10px] font-medium uppercase text-zinc-400 mb-1"
          >
            {wd}
          </div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={i} role="gridcell" />;
          const today = isSameDay(d, new Date());
          const disabled = isDisabled(d);
          const selectedSingle = isSingle && singleValue && isSameDay(d, singleValue);
          const isFrom = !isSingle && rangeValue.from && isSameDay(d, rangeValue.from);
          const isTo = !isSingle && rangeValue.to && isSameDay(d, rangeValue.to);
          const inRange = !isSingle && isInRange(d, rangeValue.from, rangeValue.to);
          const isSelected = selectedSingle || isFrom || isTo;

          return (
            <button
              key={i}
              type="button"
              role="gridcell"
              disabled={disabled}
              aria-selected={isSelected || undefined}
              aria-current={today ? "date" : undefined}
              onClick={() => handleSelect(d)}
              data-today={today || undefined}
              data-selected={isSelected || undefined}
              data-in-range={inRange && !isSelected || undefined}
              className={cn(
                "relative inline-flex h-8 w-8 items-center justify-center rounded-sm text-sm transition-colors outline-none cursor-pointer",
                "hover:bg-zinc-100",
                "focus-visible:ring-2 focus-visible:ring-zinc-900/20",
                today && "font-semibold",
                isSelected && "bg-zinc-900 text-white hover:bg-zinc-800",
                !isSelected && inRange && "bg-zinc-100",
                disabled && "opacity-40 cursor-not-allowed pointer-events-none",
                !isSelected && !inRange && "text-zinc-700",
              )}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function endOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}
