"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { CheckIcon, MinusIcon } from "../../lib/icons";

export type CheckboxSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "type" | "onChange"
  > {
  size?: CheckboxSize;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const SIZES: Record<
  CheckboxSize,
  { box: string; icon: string; stroke: number }
> = {
  xs: { box: "size-3.5", icon: "size-3", stroke: 3 },
  sm: { box: "size-4", icon: "size-3", stroke: 3 },
  md: { box: "size-5", icon: "size-3.5", stroke: 2.5 },
  lg: { box: "size-6", icon: "size-4", stroke: 2.5 },
  xl: { box: "size-7", icon: "size-5", stroke: 2 },
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      size = "md",
      checked: controlled,
      defaultChecked = false,
      indeterminate = false,
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

    const internalRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = !!indeterminate;
      }
    }, [indeterminate]);

    const mergedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      },
      [ref],
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternal(e.target.checked);
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    const isActive = checked || indeterminate;

    return (
      <span
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <input
          ref={mergedRef}
          id={id}
          type="checkbox"
          data-slot="checkbox"
          data-indeterminate={indeterminate || undefined}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="peer sr-only"
          {...rest}
        />
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex items-center justify-center rounded-sm transition-colors border",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
            isActive
              ? "bg-zinc-900 border-zinc-900 text-white"
              : "bg-white border-zinc-300 peer-hover:border-zinc-400",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-zinc-900 peer-focus-visible:ring-offset-1",
            "peer-aria-invalid:border-zinc-900 peer-aria-invalid:ring-2 peer-aria-invalid:ring-zinc-200",
            s.box,
          )}
        >
          {indeterminate ? (
            <MinusIcon className={s.icon} strokeWidth={s.stroke} />
          ) : checked ? (
            <CheckIcon className={s.icon} strokeWidth={s.stroke} />
          ) : null}
        </span>
      </span>
    );
  },
);

Checkbox.displayName = "Checkbox";
