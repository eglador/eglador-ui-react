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

interface HoverCardContextValue {
  open: boolean;
  scheduleOpen: () => void;
  scheduleClose: () => void;
  cancelTimers: () => void;
  setOpen: (v: boolean) => void;
  anchorRef: React.MutableRefObject<HTMLElement | null>;
  floatingRef: React.MutableRefObject<HTMLElement | null>;
  position: { top: number; left: number } | null;
  resolvedSide: FloatingSide;
  baseId: string;
}

const HoverCardContext = React.createContext<HoverCardContextValue | null>(null);

function useHoverCard() {
  const ctx = React.useContext(HoverCardContext);
  if (!ctx) throw new Error("HoverCard subcomponents must be used within <HoverCard>");
  return ctx;
}

export interface HoverCardProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: FloatingSide;
  align?: FloatingAlign;
  sideOffset?: number;
  alignOffset?: number;
  openDelay?: number;
  closeDelay?: number;
  children: React.ReactNode;
}

export function HoverCard({
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  side = "bottom",
  align = "center",
  sideOffset = 8,
  alignOffset = 0,
  openDelay = 400,
  closeDelay = 200,
  children,
}: HoverCardProps) {
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
    openTimer.current = setTimeout(() => setOpen(true), openDelay);
  }, [cancelTimers, openDelay, setOpen]);

  const scheduleClose = React.useCallback(() => {
    cancelTimers();
    closeTimer.current = setTimeout(() => setOpen(false), closeDelay);
  }, [cancelTimers, closeDelay, setOpen]);

  React.useEffect(() => () => cancelTimers(), [cancelTimers]);

  const { anchorRef, floatingRef, position, resolvedSide } = useFloating({
    open,
    side,
    align,
    sideOffset,
    alignOffset,
  });

  return (
    <HoverCardContext.Provider
      value={{
        open,
        scheduleOpen,
        scheduleClose,
        cancelTimers,
        setOpen,
        anchorRef,
        floatingRef,
        position,
        resolvedSide,
        baseId,
      }}
    >
      {children}
    </HoverCardContext.Provider>
  );
}

export interface HoverCardTriggerProps
  extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
}

export const HoverCardTrigger = React.forwardRef<
  HTMLElement,
  HoverCardTriggerProps
>(function HoverCardTrigger(
  { asChild = false, onMouseEnter, onMouseLeave, onFocus, onBlur, children, ...rest },
  ref,
) {
  const ctx = useHoverCard();
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
      ctx.scheduleOpen();
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      onBlur?.(e);
      ctx.scheduleClose();
    },
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    return React.cloneElement(child, {
      ...rest,
      ...handlers,
      "data-slot": "hover-card-trigger",
      "data-state": ctx.open ? "open" : "closed",
      ref: composedRef,
    } as Record<string, unknown>);
  }

  return (
    <span
      ref={composedRef as React.Ref<HTMLSpanElement>}
      data-slot="hover-card-trigger"
      data-state={ctx.open ? "open" : "closed"}
      className="inline-flex"
      {...(rest as React.HTMLAttributes<HTMLSpanElement>)}
      {...handlers}
    >
      {children}
    </span>
  );
});

HoverCardTrigger.displayName = "HoverCardTrigger";

export interface HoverCardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const HoverCardContent = React.forwardRef<
  HTMLDivElement,
  HoverCardContentProps
>(function HoverCardContent({ className, children, ...rest }, ref) {
  const ctx = useHoverCard();
  const composedRef = composeRefs<HTMLDivElement>(ref, (n) => {
    ctx.floatingRef.current = n;
  });

  if (!ctx.open) return null;
  if (typeof document === "undefined") return null;

  return ReactDOM.createPortal(
    <div
      ref={composedRef}
      id={`${ctx.baseId}-content`}
      role="tooltip"
      data-slot="hover-card-content"
      data-state="open"
      data-side={ctx.resolvedSide}
      onMouseEnter={() => ctx.cancelTimers()}
      onMouseLeave={() => ctx.scheduleClose()}
      className={cn(
        "fixed z-[9999] w-64 rounded-md border border-zinc-200 bg-white p-4 text-sm text-zinc-700 shadow-md",
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
    </div>,
    document.body,
  );
});

HoverCardContent.displayName = "HoverCardContent";
