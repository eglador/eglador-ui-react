"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { PlusIcon, XIcon } from "../../lib/icons";

export type SpeedDialDirection = "up" | "down" | "left" | "right";
export type SpeedDialSize = "sm" | "md" | "lg";

interface SpeedDialContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  direction: SpeedDialDirection;
  size: SpeedDialSize;
}

const SpeedDialContext = React.createContext<SpeedDialContextValue | null>(null);

function useSpeedDial() {
  const ctx = React.useContext(SpeedDialContext);
  if (!ctx) throw new Error("SpeedDial subcomponents must be used within <SpeedDial>");
  return ctx;
}

const SIZES: Record<
  SpeedDialSize,
  { trigger: string; action: string; icon: string; gap: string }
> = {
  sm: { trigger: "size-10", action: "size-8", icon: "size-4", gap: "gap-2" },
  md: { trigger: "size-12", action: "size-10", icon: "size-5", gap: "gap-2.5" },
  lg: { trigger: "size-14", action: "size-12", icon: "size-6", gap: "gap-3" },
};

const DIR_LAYOUT: Record<SpeedDialDirection, string> = {
  up: "flex-col-reverse",
  down: "flex-col",
  left: "flex-row-reverse",
  right: "flex-row",
};

export interface SpeedDialProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  direction?: SpeedDialDirection;
  size?: SpeedDialSize;
}

export const SpeedDial = React.forwardRef<HTMLDivElement, SpeedDialProps>(
  function SpeedDial(
    {
      open: controlled,
      defaultOpen = false,
      onOpenChange,
      direction = "up",
      size = "md",
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const [internal, setInternal] = React.useState(defaultOpen);
    const isControlled = controlled !== undefined;
    const open = isControlled ? controlled : internal;
    const setOpen = (v: boolean) => {
      if (!isControlled) setInternal(v);
      onOpenChange?.(v);
    };
    const s = SIZES[size];
    return (
      <SpeedDialContext.Provider value={{ open, setOpen, direction, size }}>
        <div
          ref={ref}
          data-slot="speed-dial"
          data-state={open ? "open" : "closed"}
          data-direction={direction}
          className={cn(
            "inline-flex items-center",
            DIR_LAYOUT[direction],
            s.gap,
            className,
          )}
          {...rest}
        >
          {children}
        </div>
      </SpeedDialContext.Provider>
    );
  },
);

SpeedDial.displayName = "SpeedDial";

export interface SpeedDialTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
}

export const SpeedDialTrigger = React.forwardRef<
  HTMLButtonElement,
  SpeedDialTriggerProps
>(function SpeedDialTrigger(
  { openIcon, closeIcon, className, children, onClick, ...rest },
  ref,
) {
  const ctx = useSpeedDial();
  const s = SIZES[ctx.size];
  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={ctx.open}
      aria-label="Toggle actions"
      data-slot="speed-dial-trigger"
      data-state={ctx.open ? "open" : "closed"}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) ctx.setOpen(!ctx.open);
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-zinc-900 text-white shadow-md transition-transform hover:bg-zinc-800 cursor-pointer outline-none",
        "focus-visible:ring-2 focus-visible:ring-zinc-900/30",
        s.trigger,
        className,
      )}
      {...rest}
    >
      {children ??
        (ctx.open ? (
          closeIcon ?? <XIcon className={s.icon} />
        ) : (
          openIcon ?? <PlusIcon className={s.icon} />
        ))}
    </button>
  );
});

SpeedDialTrigger.displayName = "SpeedDialTrigger";

export interface SpeedDialActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SpeedDialActions = React.forwardRef<
  HTMLDivElement,
  SpeedDialActionsProps
>(function SpeedDialActions({ className, children, ...rest }, ref) {
  const ctx = useSpeedDial();
  const s = SIZES[ctx.size];
  return (
    <div
      ref={ref}
      data-slot="speed-dial-actions"
      data-state={ctx.open ? "open" : "closed"}
      className={cn(
        "inline-flex transition-all duration-200",
        DIR_LAYOUT[ctx.direction],
        s.gap,
        ctx.open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

SpeedDialActions.displayName = "SpeedDialActions";

export interface SpeedDialActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: React.ReactNode;
}

export const SpeedDialAction = React.forwardRef<
  HTMLButtonElement,
  SpeedDialActionProps
>(function SpeedDialAction({ className, label, children, ...rest }, ref) {
  const ctx = useSpeedDial();
  const s = SIZES[ctx.size];
  return (
    <div className="relative inline-flex">
      <button
        ref={ref}
        type="button"
        aria-label={typeof label === "string" ? label : undefined}
        data-slot="speed-dial-action"
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 hover:text-zinc-900 cursor-pointer outline-none",
          "focus-visible:ring-2 focus-visible:ring-zinc-900/20",
          s.action,
          className,
        )}
        {...rest}
      >
        {children}
      </button>
      {label && (
        <span
          className={cn(
            "pointer-events-none absolute whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-xs text-white shadow-sm",
            ctx.direction === "up" || ctx.direction === "down"
              ? "end-full top-1/2 -translate-y-1/2 me-2"
              : "top-full start-1/2 -translate-x-1/2 mt-1",
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
});

SpeedDialAction.displayName = "SpeedDialAction";
