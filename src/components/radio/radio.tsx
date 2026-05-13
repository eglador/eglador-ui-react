"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export type RadioSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface RadioProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "type" | "onChange"
  > {
  size?: RadioSize;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const SIZES: Record<RadioSize, { box: string; dot: string }> = {
  xs: { box: "size-3.5", dot: "size-1.5" },
  sm: { box: "size-4", dot: "size-2" },
  md: { box: "size-5", dot: "size-2.5" },
  lg: { box: "size-6", dot: "size-3" },
  xl: { box: "size-7", dot: "size-3.5" },
};

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  function Radio(
    {
      size = "md",
      checked: controlled,
      defaultChecked,
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
    const [internal, setInternal] = React.useState(!!defaultChecked);
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
          "relative inline-flex shrink-0 items-center justify-center",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <input
          ref={ref}
          id={id}
          type="radio"
          data-slot="radio"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="peer sr-only"
          {...rest}
        />
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex items-center justify-center rounded-full transition-colors border",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
            checked
              ? "bg-white border-zinc-900"
              : "bg-white border-zinc-300 peer-hover:border-zinc-400",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-zinc-900 peer-focus-visible:ring-offset-1",
            "peer-aria-invalid:border-zinc-900 peer-aria-invalid:ring-2 peer-aria-invalid:ring-zinc-200",
            s.box,
          )}
        >
          {checked && (
            <span className={cn("rounded-full bg-zinc-900", s.dot)} />
          )}
        </span>
      </span>
    );
  },
);

Radio.displayName = "Radio";
