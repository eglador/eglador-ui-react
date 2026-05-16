"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { CalendarIcon, XIcon } from "../../lib/icons";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import {
  Calendar,
  type CalendarSize,
  type CalendarCaptionLayout,
  type CalendarWeekdayFormat,
} from "../calendar";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

const TIME_INPUT_CLASS =
  "h-7 w-12 rounded-sm border border-zinc-200 bg-white px-1 text-center text-sm tabular-nums text-zinc-900 outline-none focus:border-zinc-400 focus:ring-[3px] focus:ring-zinc-900/[0.06] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

function formatDT(d: Date | undefined, hour12: boolean): string {
  if (!d) return "";
  const date = d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  if (hour12) {
    const h = d.getHours();
    const period = h >= 12 ? "PM" : "AM";
    const h12 = ((h + 11) % 12) + 1;
    return `${date}, ${pad(h12)}:${pad(d.getMinutes())} ${period}`;
  }
  return `${date}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export interface DateTimePickerProps {
  value?: Date | undefined;
  defaultValue?: Date;
  onValueChange?: (value: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  format?: (d: Date | undefined) => string;
  className?: string;
  step?: number;
  showSeconds?: boolean;
  hour12?: boolean;
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
}

export function DateTimePicker({
  value: controlled,
  defaultValue,
  onValueChange,
  placeholder = "Pick date & time",
  disabled = false,
  clearable = false,
  format,
  className,
  step = 1,
  showSeconds = false,
  hour12 = false,
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
}: DateTimePickerProps) {
  const [internal, setInternal] = React.useState<Date | undefined>(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : internal;
  const [open, setOpen] = React.useState(false);

  const setValue = (next: Date | undefined) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  const setDate = (d: Date | undefined) => {
    if (!d) {
      setValue(undefined);
      return;
    }
    const base = value ?? new Date(d);
    const next = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      base.getHours(),
      base.getMinutes(),
      base.getSeconds(),
    );
    setValue(next);
  };

  const setTimePart = (
    part: "hours" | "minutes" | "seconds",
    raw: string,
  ) => {
    const num = parseInt(raw, 10);
    if (isNaN(num)) return;
    const base = value ?? new Date();
    const next = new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate(),
      part === "hours" ? num : base.getHours(),
      part === "minutes" ? num : base.getMinutes(),
      part === "seconds" ? num : base.getSeconds(),
    );
    setValue(next);
  };

  const setHour12 = (raw: string) => {
    const num = parseInt(raw, 10);
    if (isNaN(num) || num < 1 || num > 12) return;
    const base = value ?? new Date();
    const isPM = base.getHours() >= 12;
    const h24 = (num % 12) + (isPM ? 12 : 0);
    const next = new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate(),
      h24,
      base.getMinutes(),
      base.getSeconds(),
    );
    setValue(next);
  };

  const togglePeriod = () => {
    const base = value ?? new Date();
    const h = base.getHours();
    const next = new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate(),
      h >= 12 ? h - 12 : h + 12,
      base.getMinutes(),
      base.getSeconds(),
    );
    setValue(next);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(undefined);
  };

  const display = (format ?? ((d) => formatDT(d, hour12)))(value);
  const hours24 = value ? value.getHours() : 0;
  const period: "AM" | "PM" = hours24 >= 12 ? "PM" : "AM";
  const hours12 = ((hours24 + 11) % 12) + 1;

  return (
    <Popover open={open} onOpenChange={setOpen} side="bottom" align="start">
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          dir={dir}
          data-slot="date-time-picker-trigger"
          data-state={open ? "open" : "closed"}
          data-empty={!value}
          className={cn(
            "group inline-flex h-9 w-full items-center justify-between gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm transition-colors hover:border-zinc-400 cursor-pointer outline-none",
            "focus-visible:border-zinc-400 focus-visible:ring-[3px] focus-visible:ring-zinc-900/[0.06]",
            "aria-invalid:border-red-500 aria-invalid:ring-[3px] aria-invalid:ring-red-500/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            !value && "text-zinc-400",
            value && "text-zinc-900",
            className,
          )}
        >
          <span className="inline-flex items-center gap-2 truncate">
            <CalendarIcon className="size-4 shrink-0 text-zinc-500" />
            <span className="truncate">{value ? display : placeholder}</span>
          </span>
          {clearable && value && !disabled && (
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
        <div className="flex flex-col">
          <Calendar
            mode="single"
            value={value}
            onValueChange={setDate}
            minDate={minDate}
            maxDate={maxDate}
            disabledDates={disabledDates}
            size={size}
            captionLayout={captionLayout}
            numberOfMonths={numberOfMonths}
            firstDayOfWeek={firstDayOfWeek}
            locale={locale}
            weekdayFormat={weekdayFormat}
            yearRange={yearRange}
            showWeekNumber={showWeekNumber}
            showOutsideDays={showOutsideDays}
            fixedWeeks={fixedWeeks}
            dir={dir}
          />
          <div className="border-t border-zinc-200 p-3 flex items-center justify-between gap-2">
            <span className="text-xs text-zinc-500">Time</span>
            <div className="flex items-center gap-1">
              {hour12 ? (
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={value ? pad(hours12) : "12"}
                  onChange={(e) => setHour12(e.target.value)}
                  className={TIME_INPUT_CLASS}
                />
              ) : (
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={value ? pad(hours24) : "00"}
                  onChange={(e) => setTimePart("hours", e.target.value)}
                  className={TIME_INPUT_CLASS}
                />
              )}
              <span className="text-zinc-400">:</span>
              <input
                type="number"
                min={0}
                max={59}
                step={step}
                value={value ? pad(value.getMinutes()) : "00"}
                onChange={(e) => setTimePart("minutes", e.target.value)}
                className={TIME_INPUT_CLASS}
              />
              {showSeconds && (
                <>
                  <span className="text-zinc-400">:</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={value ? pad(value.getSeconds()) : "00"}
                    onChange={(e) => setTimePart("seconds", e.target.value)}
                    className={TIME_INPUT_CLASS}
                  />
                </>
              )}
              {hour12 && (
                <button
                  type="button"
                  onClick={togglePeriod}
                  className="ms-1 h-7 rounded-sm border border-zinc-200 bg-white px-2 text-xs font-medium text-zinc-900 outline-none cursor-pointer hover:bg-zinc-50 focus:border-zinc-400 focus:ring-[3px] focus:ring-zinc-900/[0.06]"
                >
                  {period}
                </button>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

DateTimePicker.displayName = "DateTimePicker";
