"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../lib/utils";
import {
  useFloating,
  composeRefs,
  type FloatingSide,
  type FloatingAlign,
} from "../../lib/use-floating";

export type TooltipSize = "xs" | "sm" | "md" | "lg" | "xl";
export type TooltipVariant = "solid" | "soft" | "outline";
export type TooltipShape = "square" | "rounded";
export type TooltipShadow = "none" | "xs" | "sm" | "md" | "lg" | "xl";

interface TooltipContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  scheduleOpen: () => void;
  scheduleClose: () => void;
  cancelTimers: () => void;
  anchorRef: React.MutableRefObject<HTMLElement | null>;
  floatingRef: React.MutableRefObject<HTMLElement | null>;
  position: { top: number; left: number } | null;
  side: FloatingSide;
  align: FloatingAlign;
  resolvedSide: FloatingSide;
  baseId: string;
  size: TooltipSize;
  variant: TooltipVariant;
  shape: TooltipShape;
  shadow: TooltipShadow;
  disabled: boolean;
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

function useTooltip() {
  const ctx = React.useContext(TooltipContext);
  if (!ctx)
    throw new Error("Tooltip subcomponents must be used within <Tooltip>");
  return ctx;
}

const SIZES: Record<TooltipSize, string> = {
  xs: "text-[10px] px-1.5 py-0.5",
  sm: "text-xs px-2 py-0.5",
  md: "text-xs px-2 py-1",
  lg: "text-sm px-2.5 py-1.5",
  xl: "text-base px-3 py-2",
};

const VARIANTS: Record<
  TooltipVariant,
  { content: string; arrowColor: Record<FloatingSide, string> }
> = {
  solid: {
    content: "bg-zinc-900 text-white",
    arrowColor: {
      top: "border-t-zinc-900",
      bottom: "border-b-zinc-900",
      left: "border-l-zinc-900",
      right: "border-r-zinc-900",
    },
  },
  soft: {
    content: "bg-zinc-100 text-zinc-900",
    arrowColor: {
      top: "border-t-zinc-100",
      bottom: "border-b-zinc-100",
      left: "border-l-zinc-100",
      right: "border-r-zinc-100",
    },
  },
  outline: {
    content: "bg-white text-zinc-700 border border-zinc-200",
    arrowColor: {
      top: "border-t-white",
      bottom: "border-b-white",
      left: "border-l-white",
      right: "border-r-white",
    },
  },
};

const SHAPES: Record<TooltipShape, string> = {
  square: "rounded-none",
  rounded: "rounded-md",
};

const SHADOWS: Record<TooltipShadow, string> = {
  none: "shadow-none",
  xs: "shadow-xs",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
};

export interface TooltipProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: FloatingSide;
  align?: FloatingAlign;
  sideOffset?: number;
  alignOffset?: number;
  delayDuration?: number;
  closeDelay?: number;
  size?: TooltipSize;
  variant?: TooltipVariant;
  shape?: TooltipShape;
  shadow?: TooltipShadow;
  disabled?: boolean;
  children: React.ReactNode;
}

export function Tooltip({
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  side = "top",
  align = "center",
  sideOffset = 6,
  alignOffset = 0,
  delayDuration = 300,
  closeDelay = 100,
  size = "md",
  variant = "solid",
  shape = "rounded",
  shadow = "md",
  disabled = false,
  children,
}: TooltipProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = controlled !== undefined;
  const open = (isControlled ? controlled : internalOpen) && !disabled;
  const baseId = React.useId();

  const openTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelTimers = React.useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  }, []);

  const setOpen = React.useCallback(
    (v: boolean) => {
      cancelTimers();
      if (disabled && v) return;
      if (!isControlled) setInternalOpen(v);
      onOpenChange?.(v);
    },
    [cancelTimers, disabled, isControlled, onOpenChange],
  );

  const scheduleOpen = React.useCallback(() => {
    if (disabled) return;
    cancelTimers();
    openTimer.current = setTimeout(() => setOpen(true), delayDuration);
  }, [cancelTimers, delayDuration, disabled, setOpen]);

  const scheduleClose = React.useCallback(() => {
    cancelTimers();
    closeTimer.current = setTimeout(() => setOpen(false), closeDelay);
  }, [cancelTimers, closeDelay, setOpen]);

  const { anchorRef, floatingRef, position, resolvedSide } = useFloating({
    open,
    side,
    align,
    sideOffset,
    alignOffset,
  });

  React.useEffect(() => () => cancelTimers(), [cancelTimers]);

  return (
    <TooltipContext.Provider
      value={{
        open,
        setOpen,
        scheduleOpen,
        scheduleClose,
        cancelTimers,
        anchorRef,
        floatingRef,
        position,
        side,
        align,
        resolvedSide,
        baseId,
        size,
        variant,
        shape,
        shadow,
        disabled,
      }}
    >
      {children}
    </TooltipContext.Provider>
  );
}

export interface TooltipTriggerProps
  extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export const TooltipTrigger = React.forwardRef<
  HTMLElement,
  TooltipTriggerProps
>(function TooltipTrigger(
  {
    asChild = false,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    children,
    ...rest
  },
  ref,
) {
  const ctx = useTooltip();
  const composedRef = composeRefs<HTMLElement>(ref, (n) => {
    ctx.anchorRef.current = n;
  });

  const handlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      onMouseEnter?.(e);
      if (!ctx.disabled) ctx.scheduleOpen();
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      onMouseLeave?.(e);
      ctx.scheduleClose();
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      onFocus?.(e);
      if (!ctx.disabled) ctx.setOpen(true);
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      onBlur?.(e);
      ctx.setOpen(false);
    },
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    return React.cloneElement(child, {
      ...rest,
      ...handlers,
      "aria-describedby": ctx.open ? `${ctx.baseId}-content` : undefined,
      "data-slot": "tooltip-trigger",
      "data-state": ctx.open ? "open" : "closed",
      ref: composedRef,
    } as Record<string, unknown>);
  }

  return (
    <button
      ref={composedRef as React.Ref<HTMLButtonElement>}
      type="button"
      aria-describedby={ctx.open ? `${ctx.baseId}-content` : undefined}
      data-slot="tooltip-trigger"
      data-state={ctx.open ? "open" : "closed"}
      className="inline-flex cursor-default"
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      {...handlers}
    >
      {children}
    </button>
  );
});

TooltipTrigger.displayName = "TooltipTrigger";

export interface TooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  arrow?: boolean;
}

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  TooltipContentProps
>(function TooltipContent(
  { arrow = false, className, children, ...rest },
  ref,
) {
  const ctx = useTooltip();
  const composedRef = composeRefs<HTMLDivElement>(ref, (n) => {
    ctx.floatingRef.current = n;
  });

  if (!ctx.open) return null;
  if (typeof document === "undefined") return null;

  const v = VARIANTS[ctx.variant];
  const arrowSide = ctx.resolvedSide;
  const arrowPositionMap: Record<FloatingSide, string> = {
    top: "top-full left-1/2 -translate-x-1/2 border-x-transparent border-b-transparent",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-x-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-y-transparent border-r-transparent",
    right:
      "right-full top-1/2 -translate-y-1/2 border-y-transparent border-l-transparent",
  };

  return ReactDOM.createPortal(
    <div
      ref={composedRef}
      id={`${ctx.baseId}-content`}
      role="tooltip"
      data-slot="tooltip-content"
      data-state="open"
      data-side={arrowSide}
      data-variant={ctx.variant}
      data-size={ctx.size}
      onMouseEnter={() => ctx.cancelTimers()}
      onMouseLeave={() => ctx.scheduleClose()}
      className={cn(
        "fixed z-[9999] pointer-events-auto font-medium whitespace-nowrap",
        "animate-in fade-in-0 zoom-in-95",
        SIZES[ctx.size],
        SHAPES[ctx.shape],
        SHADOWS[ctx.shadow],
        v.content,
        className,
      )}
      style={{
        top: ctx.position?.top ?? 0,
        left: ctx.position?.left ?? 0,
        visibility: ctx.position ? "visible" : "hidden",
      }}
      {...rest}
    >
      {children}
      {arrow && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute w-0 h-0 border-4",
            arrowPositionMap[arrowSide],
            v.arrowColor[arrowSide],
          )}
        />
      )}
    </div>,
    document.body,
  );
});

TooltipContent.displayName = "TooltipContent";
