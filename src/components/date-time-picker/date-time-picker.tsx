"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Calendar } from "../calendar";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatDT(d: Date | undefined): string {
  if (!d) return "";
  const date = d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return `${date}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export interface DateTimePickerProps {
  value?: Date | undefined;
  defaultValue?: Date;
  onValueChange?: (value: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  format?: (d: Date | undefined) => string;
  className?: string;
  step?: number;
  showSeconds?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export function DateTimePicker({
  value: controlled,
  defaultValue,
  onValueChange,
  placeholder = "Pick date & time",
  disabled = false,
  format = formatDT,
  className,
  showSeconds = false,
  minDate,
  maxDate,
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

  return (
    <Popover open={open} onOpenChange={setOpen} side="bottom" align="start">
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          data-slot="date-time-picker-trigger"
          data-state={open ? "open" : "closed"}
          className={cn(
            "inline-flex h-9 w-full items-center justify-between rounded-md border border-zinc-300 bg-white px-3 text-sm transition-colors hover:border-zinc-400 cursor-pointer outline-none",
            "focus-visible:ring-2 focus-visible:ring-zinc-900/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            !value && "text-zinc-400",
            value && "text-zinc-900",
            className,
          )}
        >
          {value ? format(value) : placeholder}
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
          />
          <div className="border-t border-zinc-200 p-3 flex items-center justify-between gap-2">
            <span className="text-xs text-zinc-500">Time</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={23}
                value={value ? pad(value.getHours()) : "00"}
                onChange={(e) => setTimePart("hours", e.target.value)}
                className="h-7 w-10 rounded-sm border border-zinc-200 bg-white px-1 text-center text-sm tabular-nums text-zinc-900 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
              />
              <span className="text-zinc-400">:</span>
              <input
                type="number"
                min={0}
                max={59}
                value={value ? pad(value.getMinutes()) : "00"}
                onChange={(e) => setTimePart("minutes", e.target.value)}
                className="h-7 w-10 rounded-sm border border-zinc-200 bg-white px-1 text-center text-sm tabular-nums text-zinc-900 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
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
                    className="h-7 w-10 rounded-sm border border-zinc-200 bg-white px-1 text-center text-sm tabular-nums text-zinc-900 outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
