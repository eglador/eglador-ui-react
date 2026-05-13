"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { XIcon } from "../../lib/icons";

export type AlertVariant = "soft" | "outline" | "solid";
export type AlertSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AlertShape = "square" | "rounded";

interface AlertContextValue {
  size: AlertSize;
  variant: AlertVariant;
}

const AlertContext = React.createContext<AlertContextValue>({
  size: "md",
  variant: "soft",
});

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  size?: AlertSize;
  shape?: AlertShape;
  onDismiss?: () => void;
  dismissLabel?: string;
}

const SIZES: Record<
  AlertSize,
  {
    padding: string;
    paddingWithClose: string;
    gap: string;
    iconSize: string;
    titleFont: string;
    descFont: string;
    closeOffset: string;
    closeSize: string;
  }
> = {
  xs: {
    padding: "p-2.5",
    paddingWithClose: "pe-8 p-2.5",
    gap: "gap-x-2 gap-y-0.5",
    iconSize: "[&>svg]:size-3.5",
    titleFont: "text-xs",
    descFont: "text-[11px]",
    closeOffset: "top-2 end-2",
    closeSize: "size-4",
  },
  sm: {
    padding: "p-3",
    paddingWithClose: "pe-9 p-3",
    gap: "gap-x-2.5 gap-y-1",
    iconSize: "[&>svg]:size-4",
    titleFont: "text-sm",
    descFont: "text-xs",
    closeOffset: "top-2.5 end-2.5",
    closeSize: "size-5",
  },
  md: {
    padding: "p-4",
    paddingWithClose: "pe-10 p-4",
    gap: "gap-x-3 gap-y-1",
    iconSize: "[&>svg]:size-5",
    titleFont: "text-base",
    descFont: "text-sm",
    closeOffset: "top-3 end-3",
    closeSize: "size-5",
  },
  lg: {
    padding: "p-5",
    paddingWithClose: "pe-12 p-5",
    gap: "gap-x-3 gap-y-1.5",
    iconSize: "[&>svg]:size-6",
    titleFont: "text-lg",
    descFont: "text-base",
    closeOffset: "top-4 end-4",
    closeSize: "size-6",
  },
  xl: {
    padding: "p-6",
    paddingWithClose: "pe-14 p-6",
    gap: "gap-x-4 gap-y-2",
    iconSize: "[&>svg]:size-7",
    titleFont: "text-xl",
    descFont: "text-lg",
    closeOffset: "top-5 end-5",
    closeSize: "size-7",
  },
};

const SHAPES: Record<AlertShape, string> = {
  square: "rounded-none",
  rounded: "rounded-sm",
};

const VARIANTS: Record<
  AlertVariant,
  { container: string; close: string; iconColor: string }
> = {
  soft: {
    container: "bg-zinc-50 text-zinc-700 border border-zinc-200",
    close: "hover:bg-zinc-200 hover:text-zinc-900",
    iconColor: "[&>svg]:text-zinc-500",
  },
  outline: {
    container: "bg-white text-zinc-700 border border-zinc-300",
    close: "hover:bg-zinc-100 hover:text-zinc-900",
    iconColor: "[&>svg]:text-zinc-500",
  },
  solid: {
    container: "bg-zinc-900 text-white border border-zinc-900",
    close: "hover:bg-zinc-700 hover:text-white",
    iconColor: "[&>svg]:text-zinc-300",
  },
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(
    {
      variant = "soft",
      size = "md",
      shape = "rounded",
      onDismiss,
      dismissLabel = "Dismiss",
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const s = SIZES[size];
    const v = VARIANTS[variant];
    return (
      <AlertContext.Provider value={{ size, variant }}>
        <div
          ref={ref}
          role="alert"
          data-slot="alert"
          data-variant={variant}
          className={cn(
            "relative grid items-start",
            "grid-cols-[0_1fr]",
            "has-[>svg]:grid-cols-[auto_1fr]",
            "has-[[data-slot=alert-icon]]:grid-cols-[auto_1fr]",
            "[&>svg]:col-start-1 [&>svg]:row-start-1 [&>svg]:row-span-full",
            "[&>svg]:self-start",
            "[&>[data-slot=alert-icon]]:col-start-1",
            "[&>[data-slot=alert-icon]]:row-start-1",
            "[&>[data-slot=alert-icon]]:row-span-full",
            "[&>[data-slot=alert-icon]]:self-start",
            "[&>*:not(svg):not([data-slot=alert-icon]):not([data-slot=alert-close])]:col-start-2",
            SHAPES[shape],
            onDismiss ? s.paddingWithClose : s.padding,
            s.gap,
            s.iconSize,
            v.container,
            v.iconColor,
            className,
          )}
          {...rest}
        >
          {children}
          {onDismiss && (
            <button
              type="button"
              aria-label={dismissLabel}
              data-slot="alert-close"
              onClick={onDismiss}
              className={cn(
                "absolute inline-flex items-center justify-center rounded-sm transition-colors cursor-pointer",
                s.closeOffset,
                s.closeSize,
                v.close,
              )}
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>
      </AlertContext.Provider>
    );
  },
);

Alert.displayName = "Alert";

export interface AlertIconProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const AlertIcon = React.forwardRef<HTMLSpanElement, AlertIconProps>(
  function AlertIcon({ className, children, ...rest }, ref) {
    const { size } = React.useContext(AlertContext);
    const s = SIZES[size];
    return (
      <span
        ref={ref}
        aria-hidden="true"
        data-slot="alert-icon"
        className={cn(
          "inline-flex items-center justify-center self-start [&>svg]:w-full [&>svg]:h-full",
          s.iconSize.replace("[&>svg]:", ""),
          className,
        )}
        {...rest}
      >
        {children}
      </span>
    );
  },
);

AlertIcon.displayName = "AlertIcon";

export interface AlertTitleProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AlertTitle = React.forwardRef<HTMLDivElement, AlertTitleProps>(
  function AlertTitle({ className, ...rest }, ref) {
    const { size } = React.useContext(AlertContext);
    const s = SIZES[size];
    return (
      <div
        ref={ref}
        data-slot="alert-title"
        className={cn(
          "font-semibold leading-snug col-start-auto",
          s.titleFont,
          className,
        )}
        {...rest}
      />
    );
  },
);

AlertTitle.displayName = "AlertTitle";

export interface AlertDescriptionProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const AlertDescription = React.forwardRef<
  HTMLDivElement,
  AlertDescriptionProps
>(function AlertDescription({ className, ...rest }, ref) {
  const { size } = React.useContext(AlertContext);
  const s = SIZES[size];
  return (
    <div
      ref={ref}
      data-slot="alert-description"
      className={cn("leading-relaxed opacity-90", s.descFont, className)}
      {...rest}
    />
  );
});

AlertDescription.displayName = "AlertDescription";
