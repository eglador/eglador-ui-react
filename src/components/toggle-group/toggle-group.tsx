"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import {
  Toggle,
  type ToggleShape,
  type ToggleSize,
  type ToggleVariant,
} from "../toggle";
import { sameList, useControlledSync } from "../../lib/use-controlled-sync";

export type ToggleGroupOrientation = "horizontal" | "vertical";

type SingleContextValue = {
  type: "single";
  value: string | undefined;
  onItemSelect: (value: string) => void;
};

type MultipleContextValue = {
  type: "multiple";
  value: string[];
  onItemSelect: (value: string) => void;
};

type ToggleGroupContextValue = (SingleContextValue | MultipleContextValue) & {
  size: ToggleSize;
  variant: ToggleVariant;
  shape: ToggleShape;
  disabled: boolean;
};

const ToggleGroupContext =
  React.createContext<ToggleGroupContextValue | null>(null);

export type ToggleGroupSingleProps = {
  type: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export type ToggleGroupMultipleProps = {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

type SharedProps = {
  orientation?: ToggleGroupOrientation;
  size?: ToggleSize;
  variant?: ToggleVariant;
  shape?: ToggleShape;
  disabled?: boolean;
  spacing?: number;
  className?: string;
  children?: React.ReactNode;
};

export type ToggleGroupProps = (
  | ToggleGroupSingleProps
  | ToggleGroupMultipleProps
) &
  SharedProps &
  Omit<
    React.HTMLAttributes<HTMLDivElement>,
    keyof SharedProps | "defaultValue" | "onChange"
  >;

export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  function ToggleGroup(props, ref) {
    const {
      orientation = "horizontal",
      size = "md",
      variant = "ghost",
      shape = "rounded",
      disabled = false,
      spacing = 2,
      className,
      children,
      ...rest
    } = props;

    const [internalSingle, setInternalSingle] = React.useState<
      string | undefined
    >(props.type === "single" ? props.defaultValue : undefined);
    const [internalMulti, setInternalMulti] = React.useState<string[]>(
      props.type === "multiple" ? (props.defaultValue ?? []) : [],
    );

    useControlledSync(
      props.type === "single" ? props.value : undefined,
      setInternalSingle,
    );
    useControlledSync(
      props.type === "multiple" ? props.value : undefined,
      (v) => setInternalMulti((prev) => (sameList(prev, v) ? prev : v)),
    );

    const ctxValue = React.useMemo<ToggleGroupContextValue>(() => {
      if (props.type === "single") {
        const isControlled = props.value !== undefined;
        const currentValue = isControlled ? props.value : internalSingle;
        return {
          type: "single",
          value: currentValue,
          size,
          variant,
          shape,
          disabled,
          onItemSelect: (v: string) => {
            const next = currentValue === v ? undefined : v;
            setInternalSingle(next);
            props.onValueChange?.(next ?? "");
          },
        };
      }

      const isControlled = props.value !== undefined;
      const currentValue = isControlled ? props.value! : internalMulti;
      return {
        type: "multiple",
        value: currentValue,
        size,
        variant,
        shape,
        disabled,
        onItemSelect: (v: string) => {
          const next = currentValue.includes(v)
            ? currentValue.filter((x) => x !== v)
            : [...currentValue, v];
          setInternalMulti(next);
          props.onValueChange?.(next);
        },
      };
    }, [
      props.type,
      props.value,
      props.onValueChange,
      internalSingle,
      internalMulti,
      size,
      variant,
      shape,
      disabled,
    ]);

    const {
      type: _type,
      value: _value,
      defaultValue: _defaultValue,
      onValueChange: _onValueChange,
      ...divProps
    } = rest as Record<string, unknown>;

    void _type;
    void _value;
    void _defaultValue;
    void _onValueChange;

    return (
      <ToggleGroupContext.Provider value={ctxValue}>
        <div
          ref={ref}
          role="group"
          data-slot="toggle-group"
          data-orientation={orientation}
          aria-disabled={disabled || undefined}
          className={cn(
            "inline-flex",
            orientation === "horizontal" ? "flex-row" : "flex-col",
            className,
          )}
          style={{ gap: spacing }}
          {...(divProps as React.HTMLAttributes<HTMLDivElement>)}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    );
  },
);

ToggleGroup.displayName = "ToggleGroup";

export interface ToggleGroupItemProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "type" | "onChange" | "value"
  > {
  value: string;
  icon?: React.ReactNode;
}

export const ToggleGroupItem = React.forwardRef<
  HTMLButtonElement,
  ToggleGroupItemProps
>(function ToggleGroupItem(
  { value, icon, disabled: itemDisabled, children, ...rest },
  ref,
) {
  const ctx = React.useContext(ToggleGroupContext);
  if (!ctx) {
    throw new Error("ToggleGroupItem must be rendered inside <ToggleGroup>.");
  }

  const pressed =
    ctx.type === "single" ? ctx.value === value : ctx.value.includes(value);

  const disabled = ctx.disabled || !!itemDisabled;

  return (
    <Toggle
      ref={ref}
      size={ctx.size}
      variant={ctx.variant}
      shape={ctx.shape}
      pressed={pressed}
      disabled={disabled}
      icon={icon}
      data-slot="toggle-group-item"
      onPressedChange={() => ctx.onItemSelect(value)}
      {...rest}
    >
      {children}
    </Toggle>
  );
});

ToggleGroupItem.displayName = "ToggleGroupItem";
