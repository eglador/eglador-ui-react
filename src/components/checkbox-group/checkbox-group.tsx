"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { Checkbox, type CheckboxSize } from "../checkbox";

export type CheckboxGroupOrientation = "horizontal" | "vertical";

interface CheckboxGroupContextValue {
  value: string[];
  toggle: (v: string) => void;
  size: CheckboxSize;
  disabled: boolean;
  name?: string;
  invalid?: boolean;
}

const CheckboxGroupContext =
  React.createContext<CheckboxGroupContextValue | null>(null);

export interface CheckboxGroupProps
  extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange"> {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  orientation?: CheckboxGroupOrientation;
  size?: CheckboxSize;
  name?: string;
  invalid?: boolean;
  legend?: React.ReactNode;
  description?: React.ReactNode;
}

export const CheckboxGroup = React.forwardRef<
  HTMLFieldSetElement,
  CheckboxGroupProps
>(function CheckboxGroup(
  {
    value: controlled,
    defaultValue = [],
    onValueChange,
    orientation = "vertical",
    size = "md",
    disabled = false,
    name,
    invalid,
    legend,
    description,
    className,
    children,
    ...rest
  },
  ref,
) {
  const isControlled = controlled !== undefined;
  const [internal, setInternal] = React.useState<string[]>(defaultValue);
  const value = isControlled ? controlled : internal;

  const toggle = React.useCallback(
    (v: string) => {
      const next = value.includes(v)
        ? value.filter((x) => x !== v)
        : [...value, v];
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [value, isControlled, onValueChange],
  );

  const ctxValue = React.useMemo<CheckboxGroupContextValue>(
    () => ({ value, toggle, size, disabled, name, invalid }),
    [value, toggle, size, disabled, name, invalid],
  );

  return (
    <CheckboxGroupContext.Provider value={ctxValue}>
      <fieldset
        ref={ref}
        data-slot="checkbox-group"
        data-orientation={orientation}
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
    </CheckboxGroupContext.Provider>
  );
});

CheckboxGroup.displayName = "CheckboxGroup";

export interface CheckboxGroupItemProps
  extends Omit<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    "onChange" | "htmlFor"
  > {
  value: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

export const CheckboxGroupItem = React.forwardRef<
  HTMLLabelElement,
  CheckboxGroupItemProps
>(function CheckboxGroupItem(
  { value, label, description, disabled: itemDisabled, className, ...rest },
  ref,
) {
  const ctx = React.useContext(CheckboxGroupContext);
  if (!ctx) {
    throw new Error("CheckboxGroupItem must be rendered inside <CheckboxGroup>.");
  }
  const autoId = React.useId();
  const isChecked = ctx.value.includes(value);
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
      <Checkbox
        id={autoId}
        value={value}
        name={ctx.name}
        size={ctx.size}
        disabled={disabled}
        checked={isChecked}
        onCheckedChange={() => ctx.toggle(value)}
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

CheckboxGroupItem.displayName = "CheckboxGroupItem";
