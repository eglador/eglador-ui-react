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
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

function useTooltip() {
  const ctx = React.useContext(TooltipContext);
  if (!ctx) throw new Error("Tooltip subcomponents must be used within <Tooltip>");
  return ctx;
}

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
  children,
}: TooltipProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = controlled !== undefined;
  const open = isControlled ? controlled : internalOpen;
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
      if (!isControlled) setInternalOpen(v);
      onOpenChange?.(v);
    },
    [cancelTimers, isControlled, onOpenChange],
  );

  const scheduleOpen = React.useCallback(() => {
    cancelTimers();
    openTimer.current = setTimeout(() => setOpen(true), delayDuration);
  }, [cancelTimers, delayDuration, setOpen]);

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
  { asChild = false, onMouseEnter, onMouseLeave, onFocus, onBlur, children, ...rest },
  ref,
) {
  const ctx = useTooltip();
  const composedRef = composeRefs<HTMLElement>(ref, (n) => {
    ctx.anchorRef.current = n;
  });

  const handlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      onMouseEnter?.(e);
      ctx.scheduleOpen();
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      onMouseLeave?.(e);
      ctx.scheduleClose();
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      onFocus?.(e);
      ctx.setOpen(true);
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

  const arrowSide = ctx.resolvedSide;
  const arrowMap: Record<FloatingSide, string> = {
    top: "top-full left-1/2 -translate-x-1/2 border-x-transparent border-b-transparent border-t-zinc-900",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-x-transparent border-t-transparent border-b-zinc-900",
    left: "left-full top-1/2 -translate-y-1/2 border-y-transparent border-r-transparent border-l-zinc-900",
    right:
      "right-full top-1/2 -translate-y-1/2 border-y-transparent border-l-transparent border-r-zinc-900",
  };

  return ReactDOM.createPortal(
    <div
      ref={composedRef}
      id={`${ctx.baseId}-content`}
      role="tooltip"
      data-slot="tooltip-content"
      data-state="open"
      data-side={arrowSide}
      onMouseEnter={() => ctx.cancelTimers()}
      onMouseLeave={() => ctx.scheduleClose()}
      className={cn(
        "fixed z-[9999] pointer-events-auto",
        "px-2 py-1 rounded-md bg-zinc-900 text-white text-xs font-medium whitespace-nowrap shadow-md",
        "animate-in fade-in-0 zoom-in-95",
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
            arrowMap[arrowSide],
          )}
        />
      )}
    </div>,
    document.body,
  );
});

TooltipContent.displayName = "TooltipContent";
