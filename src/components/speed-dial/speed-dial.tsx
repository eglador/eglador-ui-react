"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { PlusIcon, XIcon } from "../../lib/icons";

export type SpeedDialDirection = "up" | "down" | "left" | "right";
export type SpeedDialSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SpeedDialShape = "circle" | "rounded" | "square";
export type SpeedDialShadow = "none" | "xs" | "sm" | "md" | "lg" | "xl";
export type SpeedDialPosition =
  | "inline"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

interface SpeedDialContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  direction: SpeedDialDirection;
  size: SpeedDialSize;
  shape: SpeedDialShape;
  shadow: SpeedDialShadow;
  disabled: boolean;
}

const SpeedDialContext = React.createContext<SpeedDialContextValue | null>(
  null,
);

function useSpeedDial() {
  const ctx = React.useContext(SpeedDialContext);
  if (!ctx)
    throw new Error("SpeedDial subcomponents must be used within <SpeedDial>");
  return ctx;
}

const SIZES: Record<
  SpeedDialSize,
  { trigger: string; action: string; icon: string; gap: string }
> = {
  xs: { trigger: "size-8", action: "size-6", icon: "size-3.5", gap: "gap-1.5" },
  sm: { trigger: "size-10", action: "size-8", icon: "size-4", gap: "gap-2" },
  md: { trigger: "size-12", action: "size-10", icon: "size-5", gap: "gap-2.5" },
  lg: { trigger: "size-14", action: "size-12", icon: "size-6", gap: "gap-3" },
  xl: { trigger: "size-16", action: "size-14", icon: "size-7", gap: "gap-3.5" },
};

const DIR_LAYOUT: Record<SpeedDialDirection, string> = {
  up: "flex-col-reverse",
  down: "flex-col",
  left: "flex-row-reverse",
  right: "flex-row",
};

const SHAPES: Record<SpeedDialShape, string> = {
  circle: "rounded-full",
  rounded: "rounded-md",
  square: "rounded-none",
};

const SHADOWS: Record<SpeedDialShadow, string> = {
  none: "shadow-none",
  xs: "shadow-xs",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
};

const POSITION_STYLES: Record<SpeedDialPosition, string> = {
  inline: "relative z-50",
  "top-left": "fixed top-4 start-4 z-50",
  "top-right": "fixed top-4 end-4 z-50",
  "bottom-left": "fixed bottom-4 start-4 z-50",
  "bottom-right": "fixed bottom-4 end-4 z-50",
};

function defaultDirectionFor(
  position: SpeedDialPosition,
): SpeedDialDirection {
  if (position === "bottom-left" || position === "bottom-right") return "up";
  if (position === "top-left" || position === "top-right") return "down";
  return "up";
}

export interface SpeedDialProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  direction?: SpeedDialDirection;
  size?: SpeedDialSize;
  shape?: SpeedDialShape;
  shadow?: SpeedDialShadow;
  position?: SpeedDialPosition;
  disabled?: boolean;
  backdrop?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
}

export const SpeedDial = React.forwardRef<HTMLDivElement, SpeedDialProps>(
  function SpeedDial(
    {
      open: controlled,
      defaultOpen = false,
      onOpenChange,
      direction,
      size = "md",
      shape = "circle",
      shadow = "lg",
      position = "inline",
      disabled = false,
      backdrop = false,
      closeOnOutsideClick = true,
      closeOnEscape = true,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const [internal, setInternal] = React.useState(defaultOpen);
    const isControlled = controlled !== undefined;
    const open = isControlled ? controlled : internal;
    const setOpen = React.useCallback(
      (v: boolean) => {
        if (disabled && v) return;
        if (!isControlled) setInternal(v);
        onOpenChange?.(v);
      },
      [disabled, isControlled, onOpenChange],
    );

    const resolvedDirection: SpeedDialDirection =
      direction ?? defaultDirectionFor(position);

    const innerRef = React.useRef<HTMLDivElement | null>(null);
    const setRefs = React.useCallback(
      (n: HTMLDivElement | null) => {
        innerRef.current = n;
        if (typeof ref === "function") ref(n);
        else if (ref)
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = n;
      },
      [ref],
    );

    React.useEffect(() => {
      if (!open) return;
      const onDown = (e: MouseEvent) => {
        if (!closeOnOutsideClick) return;
        const root = innerRef.current;
        if (!root) return;
        if (root.contains(e.target as Node)) return;
        setOpen(false);
      };
      const onKey = (e: KeyboardEvent) => {
        if (!closeOnEscape) return;
        if (e.key === "Escape") {
          e.preventDefault();
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", onDown);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("mousedown", onDown);
        document.removeEventListener("keydown", onKey);
      };
    }, [open, closeOnOutsideClick, closeOnEscape, setOpen]);

    const s = SIZES[size];

    return (
      <SpeedDialContext.Provider
        value={{
          open,
          setOpen,
          direction: resolvedDirection,
          size,
          shape,
          shadow,
          disabled,
        }}
      >
        {backdrop && open && (
          <div
            data-slot="speed-dial-backdrop"
            onClick={() => closeOnOutsideClick && setOpen(false)}
            className="fixed inset-0 z-40 bg-zinc-900/30 backdrop-blur-[1px] animate-in fade-in-0"
          />
        )}
        <div
          ref={setRefs}
          data-slot="speed-dial"
          data-state={open ? "open" : "closed"}
          data-direction={resolvedDirection}
          data-position={position}
          data-disabled={disabled || undefined}
          className={cn(
            "inline-flex items-center",
            DIR_LAYOUT[resolvedDirection],
            s.gap,
            POSITION_STYLES[position],
            disabled && "opacity-50 pointer-events-none",
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
      disabled={ctx.disabled || rest.disabled}
      data-slot="speed-dial-trigger"
      data-state={ctx.open ? "open" : "closed"}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) ctx.setOpen(!ctx.open);
      }}
      className={cn(
        "inline-flex items-center justify-center bg-zinc-900 text-white transition-all cursor-pointer outline-none",
        "hover:bg-zinc-800",
        "focus-visible:ring-2 focus-visible:ring-zinc-900/30",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        "data-[state=open]:rotate-45",
        s.trigger,
        SHAPES[ctx.shape],
        SHADOWS[ctx.shadow],
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
      role="menu"
      aria-orientation={
        ctx.direction === "up" || ctx.direction === "down"
          ? "vertical"
          : "horizontal"
      }
      data-slot="speed-dial-actions"
      data-state={ctx.open ? "open" : "closed"}
      className={cn(
        "inline-flex transition-all duration-200",
        DIR_LAYOUT[ctx.direction],
        s.gap,
        ctx.open
          ? "opacity-100 pointer-events-auto translate-y-0 translate-x-0"
          : cn(
              "opacity-0 pointer-events-none",
              ctx.direction === "up" && "translate-y-2",
              ctx.direction === "down" && "-translate-y-2",
              ctx.direction === "left" && "translate-x-2",
              ctx.direction === "right" && "-translate-x-2",
            ),
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
>(function SpeedDialAction(
  { className, label, children, onClick, ...rest },
  ref,
) {
  const ctx = useSpeedDial();
  const s = SIZES[ctx.size];
  const isVertical = ctx.direction === "up" || ctx.direction === "down";

  return (
    <div className="relative inline-flex group/speed-dial-action">
      <button
        ref={ref}
        type="button"
        role="menuitem"
        aria-label={typeof label === "string" ? label : undefined}
        disabled={ctx.disabled || rest.disabled}
        data-slot="speed-dial-action"
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) ctx.setOpen(false);
        }}
        className={cn(
          "inline-flex items-center justify-center bg-white border border-zinc-200 text-zinc-700 transition-colors cursor-pointer outline-none",
          "hover:bg-zinc-50 hover:text-zinc-900",
          "focus-visible:ring-2 focus-visible:ring-zinc-900/20",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          s.action,
          SHAPES[ctx.shape],
          SHADOWS[ctx.shadow],
          className,
        )}
        {...rest}
      >
        {children}
      </button>
      {label && (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-xs text-white shadow-sm",
            "opacity-0 group-hover/speed-dial-action:opacity-100 transition-opacity",
            isVertical
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
