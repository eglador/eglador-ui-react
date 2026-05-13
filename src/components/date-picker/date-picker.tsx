"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Calendar } from "../calendar";

function formatDate(d: Date | undefined): string {
  if (!d) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export interface DatePickerProps {
  value?: Date | undefined;
  defaultValue?: Date;
  onValueChange?: (value: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  format?: (d: Date | undefined) => string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({
  value: controlled,
  defaultValue,
  onValueChange,
  placeholder = "Pick a date",
  disabled = false,
  format = formatDate,
  className,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [internal, setInternal] = React.useState<Date | undefined>(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : internal;
  const [open, setOpen] = React.useState(false);

  const setValue = (next: Date | undefined) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
    if (next) setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} side="bottom" align="start">
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          data-slot="date-picker-trigger"
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
        <Calendar
          mode="single"
          value={value}
          onValueChange={setValue}
          minDate={minDate}
          maxDate={maxDate}
        />
      </PopoverContent>
    </Popover>
  );
}
