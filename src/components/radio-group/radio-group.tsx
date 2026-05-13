"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { Radio, type RadioSize } from "../radio";

export type RadioGroupOrientation = "horizontal" | "vertical";

interface RadioGroupContextValue {
  value: string | null;
  setValue: (v: string) => void;
  size: RadioSize;
  disabled: boolean;
  name: string;
  invalid?: boolean;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null,
);

export interface RadioGroupProps
  extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: RadioGroupOrientation;
  size?: RadioSize;
  name?: string;
  invalid?: boolean;
  legend?: React.ReactNode;
  description?: React.ReactNode;
}

export const RadioGroup = React.forwardRef<
  HTMLFieldSetElement,
  RadioGroupProps
>(function RadioGroup(
  {
    value: controlled,
    defaultValue,
    onValueChange,
    orientation = "vertical",
    size = "md",
    disabled = false,
    name: nameProp,
    invalid,
    legend,
    description,
    className,
    children,
    ...rest
  },
  ref,
) {
  const autoName = React.useId();
  const name = nameProp ?? autoName;
  const isControlled = controlled !== undefined;
  const [internal, setInternal] = React.useState<string | null>(
    defaultValue ?? null,
  );
  const value = isControlled ? controlled : internal;

  const setValue = React.useCallback(
    (v: string) => {
      if (!isControlled) setInternal(v);
      onValueChange?.(v);
    },
    [isControlled, onValueChange],
  );

  const ctxValue = React.useMemo<RadioGroupContextValue>(
    () => ({ value: value ?? null, setValue, size, disabled, name, invalid }),
    [value, setValue, size, disabled, name, invalid],
  );

  return (
    <RadioGroupContext.Provider value={ctxValue}>
      <fieldset
        ref={ref}
        data-slot="radio-group"
        data-orientation={orientation}
        role="radiogroup"
        aria-invalid={invalid || undefined}
        disabled={disabled}
        className={cn("flex flex-col gap-2 min-w-0", className)}
        {...rest}
      >
        {legend && (
          <legend className="text-sm font-medium text-zinc-700 mb-1">
            {legend}
          </legend>
        )}
        {description && (
          <p className="text-xs text-zinc-500 -mt-1 mb-1">{description}</p>
        )}
        <div
          className={cn(
            "flex",
            orientation === "vertical"
              ? "flex-col gap-2"
              : "flex-row gap-4 flex-wrap",
          )}
        >
          {children}
        </div>
      </fieldset>
    </RadioGroupContext.Provider>
  );
});

RadioGroup.displayName = "RadioGroup";

export interface RadioGroupItemProps
  extends Omit<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    "onChange" | "htmlFor"
  > {
  value: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

export const RadioGroupItem = React.forwardRef<
  HTMLLabelElement,
  RadioGroupItemProps
>(function RadioGroupItem(
  { value, label, description, disabled: itemDisabled, className, ...rest },
  ref,
) {
  const ctx = React.useContext(RadioGroupContext);
  if (!ctx) {
    throw new Error("RadioGroupItem must be rendered inside <RadioGroup>.");
  }
  const autoId = React.useId();
  const isSelected = ctx.value === value;
  const disabled = ctx.disabled || !!itemDisabled;

  return (
    <label
      ref={ref}
      htmlFor={autoId}
      className={cn(
        "inline-flex items-start gap-2.5 select-none",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className,
      )}
      {...rest}
    >
      <Radio
        id={autoId}
        value={value}
        name={ctx.name}
        size={ctx.size}
        disabled={disabled}
        checked={isSelected}
        onChange={() => ctx.setValue(value)}
        aria-invalid={ctx.invalid || undefined}
        className="mt-0.5"
      />
      {(label || description) && (
        <div className="flex flex-col gap-0.5 min-w-0">
          {label && (
            <span className="text-sm font-medium text-zinc-700">{label}</span>
          )}
          {description && (
            <span className="text-xs text-zinc-500">{description}</span>
          )}
        </div>
      )}
    </label>
  );
});

RadioGroupItem.displayName = "RadioGroupItem";
