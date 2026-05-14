"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "../../lib/icons";

export type CalendarMode = "single" | "range" | "multiple";
export type CalendarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type CalendarCaptionLayout =
  | "label"
  | "dropdown"
  | "dropdown-months"
  | "dropdown-years";
export type CalendarWeekdayFormat = "narrow" | "short" | "long";

export interface CalendarRange {
  from?: Date;
  to?: Date;
}

const CELL_SIZE: Record<CalendarSize, string> = {
  xs: "1.75rem",
  sm: "2rem",
  md: "2.25rem",
  lg: "2.5rem",
  xl: "2.75rem",
};

const FONT_SIZE: Record<CalendarSize, string> = {
  xs: "text-[11px]",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-sm",
  xl: "text-base",
};

function toDate(value: unknown): Date | undefined {
  if (value == null) return undefined;
  if (value instanceof Date) return isNaN(value.getTime()) ? undefined : value;
  if (typeof value === "number" || typeof value === "string") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function endOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
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
  const a = Math.min(from.getTime(), to.getTime());
  const b = Math.max(from.getTime(), to.getTime());
  return t >= a && t <= b;
}

function getISOWeek(d: Date): number {
  const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNum + 3);
  const firstThursday = target.valueOf();
  target.setUTCMonth(0, 1);
  if (target.getUTCDay() !== 4) {
    target.setUTCMonth(0, 1 + ((4 - target.getUTCDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

function getMonthNames(locale: string | undefined): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { month: "long" });
  return Array.from({ length: 12 }, (_, i) => fmt.format(new Date(2026, i, 1)));
}

function getWeekdayNames(
  locale: string | undefined,
  format: CalendarWeekdayFormat,
  firstDay: number,
): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: format });
  const names: string[] = [];
  // 2026-01-04 is a Sunday
  const base = new Date(2026, 0, 4);
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + ((i + firstDay) % 7));
    names.push(fmt.format(d));
  }
  return names;
}

function buildMonthCells(
  month: Date,
  firstDayOfWeek: number,
  fixedWeeks: boolean,
): Date[] {
  const monthStart = startOfMonth(month);
  const startWeekday = (monthStart.getDay() - firstDayOfWeek + 7) % 7;
  const cells: Date[] = [];

  // Leading days from previous month
  for (let i = startWeekday; i > 0; i--) {
    cells.push(
      new Date(monthStart.getFullYear(), monthStart.getMonth(), 1 - i),
    );
  }

  // Days of current month
  const daysInMonth = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth() + 1,
    0,
  ).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(monthStart.getFullYear(), monthStart.getMonth(), d));
  }

  // Trailing days from next month
  const targetLength = fixedWeeks ? 42 : Math.ceil(cells.length / 7) * 7;
  let nextDay = 1;
  while (cells.length < targetLength) {
    cells.push(
      new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, nextDay++),
    );
  }
  return cells;
}

type CalendarSingleProps = {
  mode?: "single";
  value?: Date | undefined;
  defaultValue?: Date;
  onValueChange?: (value: Date | undefined) => void;
};

type CalendarRangeProps = {
  mode: "range";
  value?: CalendarRange;
  defaultValue?: CalendarRange;
  onValueChange?: (value: CalendarRange) => void;
};

type CalendarMultipleProps = {
  mode: "multiple";
  value?: Date[];
  defaultValue?: Date[];
  onValueChange?: (value: Date[]) => void;
  max?: number;
};

type SharedCalendarProps = {
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: (date: Date) => boolean;
  size?: CalendarSize;
  captionLayout?: CalendarCaptionLayout;
  numberOfMonths?: number;
  showWeekNumber?: boolean;
  showOutsideDays?: boolean;
  fixedWeeks?: boolean;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  locale?: string;
  weekdayFormat?: CalendarWeekdayFormat;
  yearRange?: [number, number];
  footer?: React.ReactNode;
  className?: string;
  dir?: "ltr" | "rtl";
};

export type CalendarProps = (
  | CalendarSingleProps
  | CalendarRangeProps
  | CalendarMultipleProps
) &
  SharedCalendarProps;

export function Calendar(props: CalendarProps) {
  const {
    mode = "single",
    month: controlledMonthRaw,
    defaultMonth: defaultMonthRaw,
    onMonthChange,
    minDate: minDateRaw,
    maxDate: maxDateRaw,
    disabledDates,
    size = "md",
    captionLayout = "label",
    numberOfMonths = 1,
    showWeekNumber = false,
    showOutsideDays = true,
    fixedWeeks = false,
    firstDayOfWeek = 0,
    locale,
    weekdayFormat = "short",
    yearRange,
    footer,
    className,
    dir,
  } = props as CalendarProps;

  const controlledMonth = toDate(controlledMonthRaw);
  const defaultMonth = toDate(defaultMonthRaw);
  const minDate = toDate(minDateRaw);
  const maxDate = toDate(maxDateRaw);

  const isMonthControlled = controlledMonth !== undefined;
  const [internalMonth, setInternalMonth] = React.useState<Date>(() =>
    startOfMonth(defaultMonth ?? new Date()),
  );
  const month = isMonthControlled ? controlledMonth : internalMonth;

  const setMonth = (next: Date) => {
    const m = startOfMonth(next);
    if (!isMonthControlled) setInternalMonth(m);
    onMonthChange?.(m);
  };

  const isSingle = mode === "single" || !mode;
  const isRange = mode === "range";
  const isMultiple = mode === "multiple";

  const [singleInternal, setSingleInternal] = React.useState<Date | undefined>(
    () => toDate((props as CalendarSingleProps).defaultValue),
  );
  const [rangeInternal, setRangeInternal] = React.useState<CalendarRange>(
    () => {
      const r = (props as CalendarRangeProps).defaultValue;
      return r ? { from: toDate(r.from), to: toDate(r.to) } : {};
    },
  );
  const [multipleInternal, setMultipleInternal] = React.useState<Date[]>(
    () =>
      ((props as CalendarMultipleProps).defaultValue ?? [])
        .map((v) => toDate(v))
        .filter((v): v is Date => v !== undefined),
  );

  const isControlled =
    (props as { value?: unknown }).value !== undefined;
  const singleValue: Date | undefined = isSingle
    ? isControlled
      ? toDate((props as CalendarSingleProps).value)
      : singleInternal
    : undefined;
  const rangeValue: CalendarRange = isRange
    ? isControlled
      ? (() => {
          const r = (props as CalendarRangeProps).value;
          return r ? { from: toDate(r.from), to: toDate(r.to) } : {};
        })()
      : rangeInternal
    : {};
  const multipleValue: Date[] = isMultiple
    ? isControlled
      ? ((props as CalendarMultipleProps).value ?? [])
          .map((v) => toDate(v))
          .filter((v): v is Date => v !== undefined)
      : multipleInternal
    : [];

  const [hoverDate, setHoverDate] = React.useState<Date | null>(null);

  const isDisabled = React.useCallback(
    (d: Date): boolean => {
      if (minDate && d < startOfDay(minDate)) return true;
      if (maxDate && d > endOfDay(maxDate)) return true;
      if (disabledDates?.(d)) return true;
      return false;
    },
    [minDate, maxDate, disabledDates],
  );

  const handleSelect = (d: Date) => {
    if (isDisabled(d)) return;
    if (isSingle) {
      const next = singleValue && isSameDay(singleValue, d) ? undefined : d;
      if (!isControlled) setSingleInternal(next);
      (props as CalendarSingleProps).onValueChange?.(next);
    } else if (isRange) {
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
    } else if (isMultiple) {
      const exists = multipleValue.some((x) => isSameDay(x, d));
      let nextMultiple: Date[];
      if (exists) {
        nextMultiple = multipleValue.filter((x) => !isSameDay(x, d));
      } else {
        const max = (props as CalendarMultipleProps).max;
        if (max !== undefined && multipleValue.length >= max) return;
        nextMultiple = [...multipleValue, d];
      }
      if (!isControlled) setMultipleInternal(nextMultiple);
      (props as CalendarMultipleProps).onValueChange?.(nextMultiple);
    }
  };

  const monthNames = React.useMemo(() => getMonthNames(locale), [locale]);
  const weekdayNames = React.useMemo(
    () => getWeekdayNames(locale, weekdayFormat, firstDayOfWeek),
    [locale, weekdayFormat, firstDayOfWeek],
  );

  const yearOptions = React.useMemo(() => {
    if (yearRange) {
      const [start, end] = yearRange;
      const out: number[] = [];
      for (let y = start; y <= end; y++) out.push(y);
      return out;
    }
    const center = month.getFullYear();
    const out: number[] = [];
    for (let y = center - 10; y <= center + 10; y++) out.push(y);
    return out;
  }, [yearRange, month]);

  const cellSize = CELL_SIZE[size];
  const fontSize = FONT_SIZE[size];

  return (
    <div
      data-slot="calendar"
      data-mode={mode}
      data-size={size}
      dir={dir}
      className={cn(
        "inline-flex flex-col gap-3 rounded-md border border-zinc-200 bg-white p-3",
        className,
      )}
      style={{ ["--cell-size" as never]: cellSize }}
    >
      <CalendarToolbar
        month={month}
        setMonth={setMonth}
        monthNames={monthNames}
        captionLayout={captionLayout}
        yearOptions={yearOptions}
        size={size}
        numberOfMonths={numberOfMonths}
      />
      <div
        className={cn(
          "flex gap-6",
          numberOfMonths > 1 ? "flex-row" : "flex-col",
        )}
      >
        {Array.from({ length: numberOfMonths }).map((_, panelIdx) => {
          const panelMonth = addMonths(month, panelIdx);
          return (
            <CalendarMonthPanel
              key={panelIdx}
              month={panelMonth}
              size={size}
              fontSize={fontSize}
              weekdayNames={weekdayNames}
              monthNames={monthNames}
              firstDayOfWeek={firstDayOfWeek}
              fixedWeeks={fixedWeeks}
              showWeekNumber={showWeekNumber}
              showOutsideDays={showOutsideDays}
              showCaption={numberOfMonths > 1 && captionLayout === "label"}
              isDisabled={isDisabled}
              isSingle={isSingle}
              isRange={isRange}
              isMultiple={isMultiple}
              singleValue={singleValue}
              rangeValue={rangeValue}
              multipleValue={multipleValue}
              hoverDate={hoverDate}
              setHoverDate={setHoverDate}
              onSelect={handleSelect}
              locale={locale}
            />
          );
        })}
      </div>
      {footer && (
        <div
          data-slot="calendar-footer"
          className="border-t border-zinc-200 pt-3 mt-1"
        >
          {footer}
        </div>
      )}
    </div>
  );
}

interface ToolbarProps {
  month: Date;
  setMonth: (m: Date) => void;
  monthNames: string[];
  captionLayout: CalendarCaptionLayout;
  yearOptions: number[];
  size: CalendarSize;
  numberOfMonths: number;
}

function CalendarToolbar({
  month,
  setMonth,
  monthNames,
  captionLayout,
  yearOptions,
  numberOfMonths,
}: ToolbarProps) {
  const showMonthDropdown =
    captionLayout === "dropdown" || captionLayout === "dropdown-months";
  const showYearDropdown =
    captionLayout === "dropdown" || captionLayout === "dropdown-years";

  return (
    <div
      data-slot="calendar-toolbar"
      className="flex items-center justify-between gap-2"
    >
      <button
        type="button"
        aria-label="Previous month"
        onClick={() => setMonth(addMonths(month, -1))}
        className="inline-flex h-7 w-7 items-center justify-center rounded-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20"
      >
        <ChevronLeftIcon className="size-4 rtl:rotate-180" />
      </button>

      <div className="flex items-center gap-1.5">
        {captionLayout === "label" && (
          <div
            aria-live="polite"
            className="text-sm font-semibold text-zinc-900"
          >
            {monthNames[month.getMonth()]} {month.getFullYear()}
            {numberOfMonths > 1 && (
              <>
                {" – "}
                {monthNames[addMonths(month, numberOfMonths - 1).getMonth()]}{" "}
                {addMonths(month, numberOfMonths - 1).getFullYear()}
              </>
            )}
          </div>
        )}
        {showMonthDropdown && (
          <select
            aria-label="Month"
            value={month.getMonth()}
            onChange={(e) =>
              setMonth(new Date(month.getFullYear(), Number(e.target.value), 1))
            }
            className="h-7 rounded-sm border border-zinc-200 bg-white px-2 text-sm font-medium text-zinc-900 outline-none cursor-pointer hover:border-zinc-300 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          >
            {monthNames.map((name, i) => (
              <option key={i} value={i}>
                {name}
              </option>
            ))}
          </select>
        )}
        {showYearDropdown && (
          <select
            aria-label="Year"
            value={month.getFullYear()}
            onChange={(e) =>
              setMonth(new Date(Number(e.target.value), month.getMonth(), 1))
            }
            className="h-7 rounded-sm border border-zinc-200 bg-white px-2 text-sm font-medium text-zinc-900 outline-none cursor-pointer hover:border-zinc-300 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        )}
      </div>

      <button
        type="button"
        aria-label="Next month"
        onClick={() => setMonth(addMonths(month, 1))}
        className="inline-flex h-7 w-7 items-center justify-center rounded-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20"
      >
        <ChevronRightIcon className="size-4 rtl:rotate-180" />
      </button>
    </div>
  );
}

interface MonthPanelProps {
  month: Date;
  size: CalendarSize;
  fontSize: string;
  weekdayNames: string[];
  monthNames: string[];
  firstDayOfWeek: number;
  fixedWeeks: boolean;
  showWeekNumber: boolean;
  showOutsideDays: boolean;
  showCaption: boolean;
  isDisabled: (d: Date) => boolean;
  isSingle: boolean;
  isRange: boolean;
  isMultiple: boolean;
  singleValue: Date | undefined;
  rangeValue: CalendarRange;
  multipleValue: Date[];
  hoverDate: Date | null;
  setHoverDate: (d: Date | null) => void;
  onSelect: (d: Date) => void;
  locale: string | undefined;
}

function CalendarMonthPanel({
  month,
  fontSize,
  weekdayNames,
  monthNames,
  firstDayOfWeek,
  fixedWeeks,
  showWeekNumber,
  showOutsideDays,
  showCaption,
  isDisabled,
  isSingle,
  isRange,
  isMultiple,
  singleValue,
  rangeValue,
  multipleValue,
  hoverDate,
  setHoverDate,
  onSelect,
  locale,
}: MonthPanelProps) {
  const cells = buildMonthCells(month, firstDayOfWeek, fixedWeeks);
  const today = new Date();

  // Compute hover-preview range (when from is set but to is not)
  const previewRange: CalendarRange | null =
    isRange && rangeValue.from && !rangeValue.to && hoverDate
      ? hoverDate < rangeValue.from
        ? { from: hoverDate, to: rangeValue.from }
        : { from: rangeValue.from, to: hoverDate }
      : null;

  const dayFormatter = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "long" }),
    [locale],
  );

  return (
    <div data-slot="calendar-month" className="flex flex-col gap-2">
      {showCaption && (
        <div className="text-center text-sm font-semibold text-zinc-900">
          {monthNames[month.getMonth()]} {month.getFullYear()}
        </div>
      )}
      <div
        role="grid"
        aria-label={`${monthNames[month.getMonth()]} ${month.getFullYear()}`}
        className={cn(
          "grid gap-y-0.5",
          showWeekNumber
            ? "grid-cols-[auto_repeat(7,minmax(0,1fr))]"
            : "grid-cols-7",
        )}
      >
        {showWeekNumber && (
          <div
            role="columnheader"
            className="text-center text-[10px] font-medium uppercase text-zinc-300 w-(--cell-size) h-(--cell-size) flex items-center justify-center"
          >
            #
          </div>
        )}
        {weekdayNames.map((wd, i) => (
          <div
            key={i}
            role="columnheader"
            className="text-center text-[10px] font-medium uppercase text-zinc-400 w-(--cell-size) h-(--cell-size) flex items-center justify-center"
          >
            {wd}
          </div>
        ))}
        {cells.map((d, i) => {
          const isOutside = d.getMonth() !== month.getMonth();
          if (isOutside && !showOutsideDays) {
            const isStartOfRow = i % 7 === 0;
            return (
              <React.Fragment key={i}>
                {showWeekNumber && isStartOfRow && (
                  <div className="text-center text-[10px] text-zinc-300 w-(--cell-size) h-(--cell-size) flex items-center justify-center" />
                )}
                <div role="gridcell" className="w-(--cell-size) h-(--cell-size)" />
              </React.Fragment>
            );
          }

          const isToday = isSameDay(d, today);
          const disabled = isDisabled(d);
          const selectedSingle =
            isSingle && singleValue && isSameDay(d, singleValue);
          const isFrom =
            isRange && rangeValue.from && isSameDay(d, rangeValue.from);
          const isTo = isRange && rangeValue.to && isSameDay(d, rangeValue.to);
          const inRange =
            isRange && isInRange(d, rangeValue.from, rangeValue.to);
          const inPreviewRange =
            previewRange &&
            isInRange(d, previewRange.from, previewRange.to);
          const isMultiSelected =
            isMultiple && multipleValue.some((x) => isSameDay(x, d));
          const isSelected =
            selectedSingle || isFrom || isTo || isMultiSelected;

          const isStartOfRow = i % 7 === 0;
          const weekNumber = isStartOfRow ? getISOWeek(d) : null;

          return (
            <React.Fragment key={i}>
              {showWeekNumber && isStartOfRow && (
                <div
                  role="rowheader"
                  className="text-center text-[10px] text-zinc-400 tabular-nums w-(--cell-size) h-(--cell-size) flex items-center justify-center"
                >
                  {weekNumber}
                </div>
              )}
              <button
                type="button"
                role="gridcell"
                disabled={disabled}
                aria-selected={isSelected || undefined}
                aria-current={isToday ? "date" : undefined}
                aria-label={dayFormatter.format(d)}
                onClick={() => onSelect(d)}
                onMouseEnter={() => isRange && setHoverDate(d)}
                onMouseLeave={() => isRange && setHoverDate(null)}
                data-today={isToday || undefined}
                data-selected={isSelected || undefined}
                data-outside={isOutside || undefined}
                data-in-range={
                  ((inRange && !isSelected) ||
                    (inPreviewRange && !isSelected)) ||
                  undefined
                }
                data-range-start={isFrom || undefined}
                data-range-end={isTo || undefined}
                data-disabled={disabled || undefined}
                className={cn(
                  "relative inline-flex items-center justify-center rounded-sm transition-colors outline-none cursor-pointer w-(--cell-size) h-(--cell-size)",
                  fontSize,
                  "hover:bg-zinc-100",
                  "focus-visible:ring-2 focus-visible:ring-zinc-900/20",
                  isToday && "font-semibold",
                  isOutside && !isSelected && "text-zinc-300",
                  !isOutside && !isSelected && !inRange && !inPreviewRange &&
                    "text-zinc-700",
                  isSelected && "bg-zinc-900 text-white hover:bg-zinc-800",
                  !isSelected && (inRange || inPreviewRange) && "bg-zinc-100",
                  disabled && "opacity-40 cursor-not-allowed pointer-events-none line-through",
                )}
              >
                {d.getDate()}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
