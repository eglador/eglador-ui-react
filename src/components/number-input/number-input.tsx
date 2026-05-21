"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export type NumberInputSize = "xs" | "sm" | "md" | "lg" | "xl";
export type NumberInputVariant = "outline" | "soft" | "ghost";
export type NumberInputShape = "square" | "rounded" | "pill";
export type NumberInputStepperPosition = "inline" | "stacked" | "none";

export interface NumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "size" | "type" | "min" | "max" | "step" | "prefix"
  > {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  size?: NumberInputSize;
  variant?: NumberInputVariant;
  shape?: NumberInputShape;
  stepper?: NumberInputStepperPosition;
  allowMouseWheel?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  formatOptions?: Intl.NumberFormatOptions;
  locale?: string;
  clampOnBlur?: boolean;
}

const SIZES: Record<
  NumberInputSize,
  { control: string; font: string; stepper: string; icon: string; px: string }
> = {
  xs: { control: "h-7", font: "text-xs", stepper: "w-5", icon: "size-3", px: "px-2" },
  sm: { control: "h-8", font: "text-xs", stepper: "w-6", icon: "size-3", px: "px-2.5" },
  md: { control: "h-9", font: "text-sm", stepper: "w-7", icon: "size-3.5", px: "px-3" },
  lg: { control: "h-10", font: "text-base", stepper: "w-8", icon: "size-4", px: "px-3.5" },
  xl: { control: "h-11", font: "text-base", stepper: "w-9", icon: "size-4", px: "px-4" },
};

const SHAPES: Record<NumberInputShape, string> = {
  square: "rounded-none",
  rounded: "rounded-md",
  pill: "rounded-full",
};

const VARIANTS: Record<NumberInputVariant, string> = {
  outline: "border border-zinc-300 bg-white focus-within:border-zinc-400",
  soft: "border border-transparent bg-zinc-100 focus-within:bg-zinc-200",
  ghost: "border border-transparent bg-transparent focus-within:bg-zinc-100",
};

function clamp(n: number, min?: number, max?: number): number {
  let v = n;
  if (min !== undefined) v = Math.max(v, min);
  if (max !== undefined) v = Math.min(v, max);
  return v;
}

function snapToStep(n: number, step: number, min?: number): number {
  if (step <= 0) return n;
  const base = min ?? 0;
  const offset = n - base;
  const snapped = Math.round(offset / step) * step;
  return base + snapped;
}

function applyPrecision(n: number, precision?: number): number {
  if (precision === undefined) return n;
  const factor = 10 ** precision;
  return Math.round(n * factor) / factor;
}

function parseNumeric(input: string): number | null {
  if (input === "" || input === "-") return null;
  const cleaned = input.replace(/,/g, ".").replace(/\s/g, "");
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  return n;
}

const ChevronUpIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const ChevronDownIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput(
    {
      value: controlled,
      defaultValue = null,
      onValueChange,
      min,
      max,
      step = 1,
      precision,
      size = "md",
      variant = "outline",
      shape = "rounded",
      stepper = "inline",
      allowMouseWheel = false,
      prefix,
      suffix,
      formatOptions,
      locale,
      clampOnBlur = true,
      disabled = false,
      readOnly = false,
      className,
      onBlur,
      onKeyDown,
      onWheel,
      onFocus,
      ...rest
    },
    ref,
  ) {
    const isControlled = controlled !== undefined;
    const [internal, setInternal] = React.useState<number | null>(defaultValue);
    const value = isControlled ? controlled : internal;
    const [draft, setDraft] = React.useState<string | null>(null);
    const [focused, setFocused] = React.useState(false);

    const formatter = React.useMemo(() => {
      if (!formatOptions && !locale) return null;
      return new Intl.NumberFormat(locale, formatOptions);
    }, [formatOptions, locale]);

    const displayValue = React.useMemo(() => {
      if (draft !== null) return draft;
      if (value === null || value === undefined) return "";
      if (focused || !formatter) return String(value);
      return formatter.format(value);
    }, [draft, value, focused, formatter]);

    const commit = (next: number | null) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setDraft(raw);
      const parsed = parseNumeric(raw);
      if (parsed === null) {
        if (raw === "" || raw === "-") commit(null);
        return;
      }
      const final = applyPrecision(parsed, precision);
      commit(final);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      setDraft(null);
      if (clampOnBlur && value !== null && value !== undefined) {
        const clamped = applyPrecision(clamp(value, min, max), precision);
        if (clamped !== value) commit(clamped);
      }
      onBlur?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    };

    const adjust = (direction: 1 | -1) => {
      if (disabled || readOnly) return;
      const base = value ?? min ?? 0;
      const stepped = snapToStep(base + direction * step, step, min);
      const next = applyPrecision(clamp(stepped, min, max), precision);
      commit(next);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      if (disabled || readOnly) return;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        adjust(1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        adjust(-1);
      } else if (e.key === "PageUp") {
        e.preventDefault();
        const base = value ?? min ?? 0;
        const next = applyPrecision(clamp(base + step * 10, min, max), precision);
        commit(next);
      } else if (e.key === "PageDown") {
        e.preventDefault();
        const base = value ?? min ?? 0;
        const next = applyPrecision(clamp(base - step * 10, min, max), precision);
        commit(next);
      } else if (e.key === "Home" && min !== undefined) {
        e.preventDefault();
        commit(min);
      } else if (e.key === "End" && max !== undefined) {
        e.preventDefault();
        commit(max);
      }
    };

    const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
      onWheel?.(e);
      if (e.defaultPrevented || !allowMouseWheel || !focused) return;
      if (disabled || readOnly) return;
      e.preventDefault();
      adjust(e.deltaY < 0 ? 1 : -1);
    };

    const canIncrement =
      !disabled && !readOnly && (max === undefined || (value ?? min ?? 0) < max);
    const canDecrement =
      !disabled && !readOnly && (min === undefined || (value ?? max ?? 0) > min);

    const s = SIZES[size];

    const StepperButton = ({
      direction,
      icon,
      ariaLabel,
      className: btnClass,
    }: {
      direction: 1 | -1;
      icon: React.ReactNode;
      ariaLabel: string;
      className?: string;
    }) => {
      const allowed = direction === 1 ? canIncrement : canDecrement;
      return (
        <button
          type="button"
          tabIndex={-1}
          disabled={!allowed}
          aria-label={ariaLabel}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => adjust(direction)}
          className={cn(
            "inline-flex items-center justify-center text-zinc-500 transition-colors",
            "hover:text-zinc-900 hover:bg-zinc-100",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-zinc-500",
            "focus-visible:outline-none cursor-pointer",
            btnClass,
          )}
        >
          <span className={cn("[&>svg]:size-full", s.icon)}>{icon}</span>
        </button>
      );
    };

    return (
      <div
        data-slot="number-input"
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        className={cn(
          "inline-flex w-full items-stretch transition-colors overflow-hidden",
          "focus-within:ring-[3px] focus-within:ring-zinc-900/[0.06]",
          s.control,
          s.font,
          SHAPES[shape],
          VARIANTS[variant],
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        {prefix && (
          <span
            aria-hidden="true"
            data-slot="number-input-prefix"
            className={cn(
              "inline-flex items-center text-zinc-500 select-none shrink-0",
              s.px,
            )}
          >
            {prefix}
          </span>
        )}

        <input
          ref={ref}
          type="text"
          inputMode="decimal"
          role="spinbutton"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value ?? undefined}
          data-slot="number-input-field"
          value={displayValue}
          disabled={disabled}
          readOnly={readOnly}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onWheel={handleWheel}
          className={cn(
            "w-full min-w-0 bg-transparent outline-none text-zinc-900 placeholder:text-zinc-400",
            "disabled:cursor-not-allowed",
            !prefix && s.px,
            !suffix && stepper === "none" && s.px,
            (suffix || stepper !== "none") && "pr-0",
          )}
          {...rest}
        />

        {suffix && (
          <span
            aria-hidden="true"
            data-slot="number-input-suffix"
            className={cn(
              "inline-flex items-center text-zinc-500 select-none shrink-0",
              s.px,
            )}
          >
            {suffix}
          </span>
        )}

        {stepper === "inline" && (
          <span
            data-slot="number-input-stepper"
            className={cn("flex items-center", s.px)}
          >
            <StepperButton
              direction={-1}
              icon={ChevronDownIcon}
              ariaLabel="Decrement"
              className={cn("rounded-sm h-full", s.stepper)}
            />
            <StepperButton
              direction={1}
              icon={ChevronUpIcon}
              ariaLabel="Increment"
              className={cn("rounded-sm h-full", s.stepper)}
            />
          </span>
        )}

        {stepper === "stacked" && (
          <span
            data-slot="number-input-stepper"
            className={cn(
              "flex flex-col border-l border-zinc-200 shrink-0",
              s.stepper,
            )}
          >
            <StepperButton
              direction={1}
              icon={ChevronUpIcon}
              ariaLabel="Increment"
              className="flex-1 border-b border-zinc-200"
            />
            <StepperButton
              direction={-1}
              icon={ChevronDownIcon}
              ariaLabel="Decrement"
              className="flex-1"
            />
          </span>
        )}
      </div>
    );
  },
);

NumberInput.displayName = "NumberInput";
