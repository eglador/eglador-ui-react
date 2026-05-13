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

interface PopoverContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  anchorRef: React.MutableRefObject<HTMLElement | null>;
  floatingRef: React.MutableRefObject<HTMLElement | null>;
  position: { top: number; left: number } | null;
  side: FloatingSide;
  resolvedSide: FloatingSide;
  modal: boolean;
  baseId: string;
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

function usePopover() {
  const ctx = React.useContext(PopoverContext);
  if (!ctx) throw new Error("Popover subcomponents must be used within <Popover>");
  return ctx;
}

export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: FloatingSide;
  align?: FloatingAlign;
  sideOffset?: number;
  alignOffset?: number;
  modal?: boolean;
  children: React.ReactNode;
}

export function Popover({
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  side = "bottom",
  align = "center",
  sideOffset = 6,
  alignOffset = 0,
  modal = false,
  children,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = controlled !== undefined;
  const open = isControlled ? controlled : internalOpen;
  const baseId = React.useId();

  const setOpen = React.useCallback(
    (v: boolean) => {
      if (!isControlled) setInternalOpen(v);
      onOpenChange?.(v);
    },
    [isControlled, onOpenChange],
  );

  const { anchorRef, floatingRef, position, resolvedSide } = useFloating({
    open,
    side,
    align,
    sideOffset,
    alignOffset,
  });

  return (
    <PopoverContext.Provider
      value={{
        open,
        setOpen,
        anchorRef,
        floatingRef,
        position,
        side,
        resolvedSide,
        modal,
        baseId,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
}

export interface PopoverTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(function PopoverTrigger({ asChild = false, onClick, children, ...rest }, ref) {
  const ctx = usePopover();
  const composedRef = composeRefs<HTMLElement>(
    ref as React.Ref<HTMLElement>,
    (n) => {
      ctx.anchorRef.current = n;
    },
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) ctx.setOpen(!ctx.open);
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    const childOnClick = child.props.onClick as
      | ((e: React.MouseEvent) => void)
      | undefined;
    return React.cloneElement(child, {
      ...rest,
      "aria-expanded": ctx.open,
      "aria-controls": `${ctx.baseId}-content`,
      "aria-haspopup": "dialog",
      "data-slot": "popover-trigger",
      "data-state": ctx.open ? "open" : "closed",
      onClick: (e: React.MouseEvent) => {
        childOnClick?.(e);
        if (!e.defaultPrevented) ctx.setOpen(!ctx.open);
      },
      ref: composedRef,
    } as Record<string, unknown>);
  }

  return (
    <button
      ref={composedRef as React.Ref<HTMLButtonElement>}
      type="button"
      aria-expanded={ctx.open}
      aria-controls={`${ctx.baseId}-content`}
      aria-haspopup="dialog"
      data-slot="popover-trigger"
      data-state={ctx.open ? "open" : "closed"}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
});

PopoverTrigger.displayName = "PopoverTrigger";

export interface PopoverContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  PopoverContentProps
>(function PopoverContent({ className, children, ...rest }, ref) {
  const ctx = usePopover();
  const composedRef = composeRefs<HTMLDivElement>(ref, (n) => {
    ctx.floatingRef.current = n;
  });

  React.useEffect(() => {
    if (!ctx.open) return;
    const onDown = (e: MouseEvent) => {
      const f = ctx.floatingRef.current;
      const a = ctx.anchorRef.current;
      if (!f) return;
      const target = e.target as Node;
      if (f.contains(target) || a?.contains(target)) return;
      ctx.setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        ctx.setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [ctx]);

  if (!ctx.open) return null;
  if (typeof document === "undefined") return null;

  return ReactDOM.createPortal(
    <div
      ref={composedRef}
      id={`${ctx.baseId}-content`}
      role="dialog"
      data-slot="popover-content"
      data-state="open"
      data-side={ctx.resolvedSide}
      className={cn(
        "fixed z-[9999] outline-none",
        "min-w-48 rounded-md border border-zinc-200 bg-white p-4 text-sm text-zinc-700 shadow-md",
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

PopoverContent.displayName = "PopoverContent";

export interface PopoverCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const PopoverClose = React.forwardRef<
  HTMLButtonElement,
  PopoverCloseProps
>(function PopoverClose({ asChild = false, onClick, children, ...rest }, ref) {
  const ctx = usePopover();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) ctx.setOpen(false);
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    const childOnClick = child.props.onClick as
      | ((e: React.MouseEvent) => void)
      | undefined;
    return React.cloneElement(child, {
      ...rest,
      "data-slot": "popover-close",
      onClick: (e: React.MouseEvent) => {
        childOnClick?.(e);
        if (!e.defaultPrevented) ctx.setOpen(false);
      },
      ref,
    } as Record<string, unknown>);
  }

  return (
    <button
      ref={ref}
      type="button"
      data-slot="popover-close"
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
});

PopoverClose.displayName = "PopoverClose";
