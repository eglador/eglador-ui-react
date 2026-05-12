import * as React from "react";
import { cn } from "../../lib/utils";

export type LabelSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  size?: LabelSize;
  required?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const SIZES: Record<LabelSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  function Label(
    { size = "sm", required = false, disabled = false, className, children, ...rest },
    ref,
  ) {
    return (
      <label
        ref={ref}
        className={cn(
          "font-medium text-zinc-700 leading-none",
          SIZES[size],
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-default",
          className,
        )}
        {...rest}
      >
        {children}
        {required && (
          <span
            aria-hidden="true"
            className="text-zinc-900 ms-0.5 font-semibold"
          >
            *
          </span>
        )}
      </label>
    );
  },
);

Label.displayName = "Label";
