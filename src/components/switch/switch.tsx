"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export type SwitchSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface SwitchProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "type" | "onChange"
  > {
  size?: SwitchSize;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const SIZES: Record<
  SwitchSize,
  { track: string; thumb: string; translate: string }
> = {
  xs: { track: "w-8 h-4", thumb: "size-3", translate: "translate-x-4" },
  sm: { track: "w-10 h-5", thumb: "size-4", translate: "translate-x-5" },
  md: { track: "w-11 h-6", thumb: "size-5", translate: "translate-x-5" },
  lg: { track: "w-14 h-7", thumb: "size-6", translate: "translate-x-7" },
  xl: { track: "w-16 h-8", thumb: "size-7", translate: "translate-x-8" },
};

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  function Switch(
    {
      size = "md",
      checked: controlled,
      defaultChecked = false,
      onCheckedChange,
      onChange,
      disabled = false,
      className,
      id: idProp,
      ...rest
    },
    ref,
  ) {
    const autoId = React.useId();
    const id = idProp ?? autoId;
    const isControlled = controlled !== undefined;
    const [internal, setInternal] = React.useState(defaultChecked);
    const checked = isControlled ? controlled : internal;
    const s = SIZES[size];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternal(e.target.checked);
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    return (
      <span
        className={cn(
          "relative inline-flex shrink-0 items-center",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          role="switch"
          data-slot="switch"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="peer sr-only"
          {...rest}
        />
        <span
          aria-hidden="true"
          className={cn(
            "relative inline-block rounded-full transition-colors",
            "bg-zinc-200 peer-checked:bg-zinc-900",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-zinc-900/20",
            "peer-aria-invalid:ring-2 peer-aria-invalid:ring-red-500/10",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
            s.track,
          )}
        >
          <span
            className={cn(
              "absolute top-1/2 -translate-y-1/2 left-0.5 rounded-full bg-white shadow-sm transition-transform",
              s.thumb,
              checked && s.translate,
            )}
          />
        </span>
      </span>
    );
  },
);

Switch.displayName = "Switch";
