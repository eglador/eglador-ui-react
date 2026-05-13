"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { MinusIcon } from "../../lib/icons";

export type InputOTPSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZES: Record<
  InputOTPSize,
  { slot: string; font: string; sep: string }
> = {
  xs: { slot: "h-7 w-7 text-xs", font: "text-xs", sep: "size-2.5" },
  sm: { slot: "h-8 w-8 text-sm", font: "text-sm", sep: "size-3" },
  md: { slot: "h-10 w-10 text-base", font: "text-base", sep: "size-4" },
  lg: { slot: "h-12 w-12 text-lg", font: "text-lg", sep: "size-5" },
  xl: { slot: "h-14 w-14 text-xl", font: "text-xl", sep: "size-6" },
};

interface InputOTPContextValue {
  value: string;
  length: number;
  onSlotChange: (index: number, char: string) => void;
  onSlotKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSlotPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  size: InputOTPSize;
  disabled: boolean;
  registerSlot: (index: number, el: HTMLInputElement | null) => void;
}

const InputOTPContext = React.createContext<InputOTPContextValue | null>(null);

function useInputOTP() {
  const ctx = React.useContext(InputOTPContext);
  if (!ctx)
    throw new Error("InputOTPSlot must be used within <InputOTPGroup> + <InputOTP>");
  return ctx;
}

export interface InputOTPProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  size?: InputOTPSize;
  disabled?: boolean;
  pattern?: RegExp;
  type?: "text" | "tel" | "password";
}

export function InputOTP({
  value: controlled,
  defaultValue = "",
  onChange,
  onComplete,
  length = 6,
  size = "md",
  disabled = false,
  pattern = /^[0-9]$/,
  type = "text",
  className,
  children,
  ...rest
}: InputOTPProps) {
  const [internal, setInternal] = React.useState(defaultValue.slice(0, length));
  const isControlled = controlled !== undefined;
  const value = (isControlled ? controlled : internal).slice(0, length);
  const slotsRef = React.useRef<Map<number, HTMLInputElement>>(new Map());

  const registerSlot = React.useCallback(
    (index: number, el: HTMLInputElement | null) => {
      if (el) slotsRef.current.set(index, el);
      else slotsRef.current.delete(index);
    },
    [],
  );

  const setValue = (next: string) => {
    const clamped = next.slice(0, length);
    if (!isControlled) setInternal(clamped);
    onChange?.(clamped);
    if (clamped.length === length) onComplete?.(clamped);
  };

  const focusSlot = (i: number) => {
    const el = slotsRef.current.get(i);
    el?.focus();
    el?.select();
  };

  const onSlotChange = (index: number, char: string) => {
    if (!char) return;
    const ch = char.slice(-1);
    if (!pattern.test(ch)) return;
    const arr = value.split("");
    while (arr.length < index) arr.push("");
    arr[index] = ch;
    const next = arr.join("").slice(0, length);
    setValue(next);
    if (index < length - 1) focusSlot(index + 1);
  };

  const onSlotKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const arr = value.split("");
      if (arr[index]) {
        arr[index] = "";
        setValue(arr.join(""));
      } else if (index > 0) {
        arr[index - 1] = "";
        setValue(arr.join(""));
        focusSlot(index - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusSlot(Math.max(0, index - 1));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusSlot(Math.min(length - 1, index + 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      focusSlot(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusSlot(length - 1);
    }
  };

  const onSlotPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").trim();
    const valid = text
      .split("")
      .filter((c) => pattern.test(c))
      .join("")
      .slice(0, length);
    if (!valid) return;
    setValue(valid);
    focusSlot(Math.min(valid.length, length - 1));
  };

  return (
    <InputOTPContext.Provider
      value={{
        value,
        length,
        onSlotChange,
        onSlotKeyDown,
        onSlotPaste,
        size,
        disabled,
        registerSlot,
      }}
    >
      <div
        data-slot="input-otp"
        data-disabled={disabled || undefined}
        className={cn("inline-flex items-center gap-2", className)}
        {...rest}
      >
        {children}
      </div>
    </InputOTPContext.Provider>
  );

  // type kept for future password masking
  void type;
}

export interface InputOTPGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  InputOTPGroupProps
>(function InputOTPGroup({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      data-slot="input-otp-group"
      className={cn("inline-flex items-center", className)}
      {...rest}
    />
  );
});

InputOTPGroup.displayName = "InputOTPGroup";

export interface InputOTPSlotProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  index: number;
}

export const InputOTPSlot = React.forwardRef<HTMLInputElement, InputOTPSlotProps>(
  function InputOTPSlot({ index, className, ...rest }, ref) {
    const ctx = useInputOTP();
    const s = SIZES[ctx.size];
    const char = ctx.value[index] ?? "";
    const setRefs = (n: HTMLInputElement | null) => {
      ctx.registerSlot(index, n);
      if (typeof ref === "function") ref(n);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = n;
    };

    return (
      <input
        ref={setRefs}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={1}
        disabled={ctx.disabled}
        value={char}
        data-slot="input-otp-slot"
        data-state={char ? "filled" : "empty"}
        onChange={(e) => ctx.onSlotChange(index, e.target.value)}
        onKeyDown={(e) => ctx.onSlotKeyDown(index, e)}
        onPaste={ctx.onSlotPaste}
        onFocus={(e) => e.currentTarget.select()}
        className={cn(
          "border border-zinc-300 text-center font-medium text-zinc-900 outline-none transition-colors -ms-px first:ms-0 first:rounded-s-md last:rounded-e-md",
          "focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 focus:z-10",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          s.slot,
          s.font,
          className,
        )}
        {...rest}
      />
    );
  },
);

InputOTPSlot.displayName = "InputOTPSlot";

export interface InputOTPSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const InputOTPSeparator = React.forwardRef<
  HTMLDivElement,
  InputOTPSeparatorProps
>(function InputOTPSeparator({ className, children, ...rest }, ref) {
  const ctx = useInputOTP();
  const s = SIZES[ctx.size];
  return (
    <div
      ref={ref}
      role="separator"
      aria-hidden="true"
      data-slot="input-otp-separator"
      className={cn("text-zinc-300 mx-1", className)}
      {...rest}
    >
      {children ?? <MinusIcon className={s.sep} />}
    </div>
  );
});

InputOTPSeparator.displayName = "InputOTPSeparator";
