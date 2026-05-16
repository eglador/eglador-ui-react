"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { CalendarIcon, XIcon } from "../../lib/icons";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import {
  Calendar,
  type CalendarSize,
  type CalendarCaptionLayout,
  type CalendarRange,
  type CalendarWeekdayFormat,
} from "../calendar";

function formatDate(d: Date | undefined): string {
  if (!d) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatRange(r: CalendarRange | undefined): string {
  if (!r?.from) return "";
  if (!r.to) return formatDate(r.from);
  return `${formatDate(r.from)} – ${formatDate(r.to)}`;
}

type DatePickerSingleProps = {
  mode?: "single";
  value?: Date | undefined;
  defaultValue?: Date;
  onValueChange?: (value: Date | undefined) => void;
  format?: (d: Date | undefined) => string;
};

type DatePickerRangeProps = {
  mode: "range";
  value?: CalendarRange;
  defaultValue?: CalendarRange;
  onValueChange?: (value: CalendarRange) => void;
  format?: (r: CalendarRange | undefined) => string;
};

type SharedDatePickerProps = {
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: (d: Date) => boolean;
  size?: CalendarSize;
  captionLayout?: CalendarCaptionLayout;
  numberOfMonths?: number;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  locale?: string;
  weekdayFormat?: CalendarWeekdayFormat;
  yearRange?: [number, number];
  showWeekNumber?: boolean;
  showOutsideDays?: boolean;
  fixedWeeks?: boolean;
  dir?: "ltr" | "rtl";
};

export type DatePickerProps = (
  | DatePickerSingleProps
  | DatePickerRangeProps
) &
  SharedDatePickerProps;

export function DatePicker(props: DatePickerProps) {
  const {
    placeholder,
    disabled = false,
    clearable = false,
    className,
    minDate,
    maxDate,
    disabledDates,
    size,
    captionLayout,
    numberOfMonths,
    firstDayOfWeek,
    locale,
    weekdayFormat,
    yearRange,
    showWeekNumber,
    showOutsideDays,
    fixedWeeks,
    dir,
  } = props as DatePickerProps;

  const isRange = props.mode === "range";
  const [open, setOpen] = React.useState(false);

  const [singleInternal, setSingleInternal] = React.useState<Date | undefined>(
    () => (props as DatePickerSingleProps).defaultValue,
  );
  const [rangeInternal, setRangeInternal] = React.useState<CalendarRange>(
    () => (props as DatePickerRangeProps).defaultValue ?? {},
  );

  const isControlled =
    (props as { value?: unknown }).value !== undefined;

  const singleValue: Date | undefined = !isRange
    ? isControlled
      ? (props as DatePickerSingleProps).value
      : singleInternal
    : undefined;

  const rangeValue: CalendarRange = isRange
    ? isControlled
      ? ((props as DatePickerRangeProps).value ?? {})
      : rangeInternal
    : {};

  const setSingle = (next: Date | undefined) => {
    if (!isControlled) setSingleInternal(next);
    (props as DatePickerSingleProps).onValueChange?.(next);
    if (next) setOpen(false);
  };

  const setRange = (next: CalendarRange) => {
    if (!isControlled) setRangeInternal(next);
    (props as DatePickerRangeProps).onValueChange?.(next);
    if (next.from && next.to) setOpen(false);
  };

  const hasValue = isRange ? Boolean(rangeValue.from) : Boolean(singleValue);

  const display = isRange
    ? ((props as DatePickerRangeProps).format ?? formatRange)(rangeValue)
    : ((props as DatePickerSingleProps).format ?? formatDate)(singleValue);

  const resolvedPlaceholder =
    placeholder ?? (isRange ? "Pick a date range" : "Pick a date");

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRange) setRange({});
    else setSingle(undefined);
  };

  const calendarProps = {
    minDate,
    maxDate,
    disabledDates,
    size,
    captionLayout,
    numberOfMonths: numberOfMonths ?? (isRange ? 2 : 1),
    firstDayOfWeek,
    locale,
    weekdayFormat,
    yearRange,
    showWeekNumber,
    showOutsideDays,
    fixedWeeks,
    dir,
  };

  return (
    <Popover open={open} onOpenChange={setOpen} side="bottom" align="start">
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          dir={dir}
          data-slot="date-picker-trigger"
          data-state={open ? "open" : "closed"}
          data-empty={!hasValue}
          className={cn(
            "group inline-flex h-9 w-full items-center justify-between gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm transition-colors hover:border-zinc-400 cursor-pointer outline-none",
            "focus-visible:border-zinc-400 focus-visible:ring-[3px] focus-visible:ring-zinc-900/[0.06]",
            "aria-invalid:border-red-500 aria-invalid:ring-[3px] aria-invalid:ring-red-500/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            !hasValue && "text-zinc-400",
            hasValue && "text-zinc-900",
            className,
          )}
        >
          <span className="inline-flex items-center gap-2 truncate">
            <CalendarIcon className="size-4 shrink-0 text-zinc-500" />
            <span className="truncate">{hasValue ? display : resolvedPlaceholder}</span>
          </span>
          {clearable && hasValue && !disabled && (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Clear"
              onClick={handleClear}
              className="inline-flex size-4 shrink-0 items-center justify-center rounded-sm text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
            >
              <XIcon className="size-3" />
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto">
        {isRange ? (
          <Calendar
            mode="range"
            value={rangeValue}
            onValueChange={setRange}
            {...calendarProps}
          />
        ) : (
          <Calendar
            mode="single"
            value={singleValue}
            onValueChange={setSingle}
            {...calendarProps}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

DatePicker.displayName = "DatePicker";
