"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../lib/utils";
import { CheckIcon, ChevronRightIcon, DotIcon } from "../../lib/icons";
import {
  useFloating,
  composeRefs,
  type FloatingSide,
  type FloatingAlign,
} from "../../lib/use-floating";

interface DropdownContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  anchorRef: React.MutableRefObject<HTMLElement | null>;
  floatingRef: React.MutableRefObject<HTMLElement | null>;
  position: { top: number; left: number } | null;
  resolvedSide: FloatingSide;
  baseId: string;
  registerItem: (el: HTMLElement | null, value: string) => void;
  focusItem: (dir: 1 | -1 | "first" | "last") => void;
  activeItem: string | null;
  setActiveItem: (v: string | null) => void;
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

function useDropdown() {
  const ctx = React.useContext(DropdownContext);
  if (!ctx) throw new Error("Dropdown subcomponents must be used within <Dropdown>");
  return ctx;
}

export interface DropdownProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: FloatingSide;
  align?: FloatingAlign;
  sideOffset?: number;
  alignOffset?: number;
  children: React.ReactNode;
}

export function Dropdown({
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  side = "bottom",
  align = "start",
  sideOffset = 6,
  alignOffset = 0,
  children,
}: DropdownProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = controlled !== undefined;
  const open = isControlled ? controlled : internalOpen;
  const baseId = React.useId();
  const [activeItem, setActiveItem] = React.useState<string | null>(null);

  const setOpen = React.useCallback(
    (v: boolean) => {
      if (!isControlled) setInternalOpen(v);
      onOpenChange?.(v);
      if (!v) setActiveItem(null);
    },
    [isControlled, onOpenChange],
  );

  const itemsRef = React.useRef<Map<string, HTMLElement>>(new Map());

  const registerItem = React.useCallback(
    (el: HTMLElement | null, value: string) => {
      if (el) itemsRef.current.set(value, el);
      else itemsRef.current.delete(value);
    },
    [],
  );

  const focusItem = React.useCallback(
    (dir: 1 | -1 | "first" | "last") => {
      const entries = Array.from(itemsRef.current.entries()).filter(
        ([, el]) => !el.hasAttribute("data-disabled"),
      );
      if (entries.length === 0) return;
      let nextIndex = -1;
      if (dir === "first") nextIndex = 0;
      else if (dir === "last") nextIndex = entries.length - 1;
      else {
        const current = activeItem
          ? entries.findIndex(([k]) => k === activeItem)
          : -1;
        nextIndex =
          current === -1
            ? dir === 1
              ? 0
              : entries.length - 1
            : (current + dir + entries.length) % entries.length;
      }
      const [key, el] = entries[nextIndex];
      el.focus();
      setActiveItem(key);
    },
    [activeItem],
  );

  const { anchorRef, floatingRef, position, resolvedSide } = useFloating({
    open,
    side,
    align,
    sideOffset,
    alignOffset,
  });

  return (
    <DropdownContext.Provider
      value={{
        open,
        setOpen,
        anchorRef,
        floatingRef,
        position,
        resolvedSide,
        baseId,
        registerItem,
        focusItem,
        activeItem,
        setActiveItem,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
}

export interface DropdownTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DropdownTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownTriggerProps
>(function DropdownTrigger(
  { asChild = false, onClick, onKeyDown, children, ...rest },
  ref,
) {
  const ctx = useDropdown();
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      ctx.setOpen(true);
      requestAnimationFrame(() => ctx.focusItem("first"));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      ctx.setOpen(true);
      requestAnimationFrame(() => ctx.focusItem("last"));
    }
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    const childOnClick = child.props.onClick as
      | ((e: React.MouseEvent) => void)
      | undefined;
    const childOnKeyDown = child.props.onKeyDown as
      | ((e: React.KeyboardEvent) => void)
      | undefined;
    return React.cloneElement(child, {
      ...rest,
      "aria-expanded": ctx.open,
      "aria-controls": `${ctx.baseId}-menu`,
      "aria-haspopup": "menu",
      "data-slot": "dropdown-trigger",
      "data-state": ctx.open ? "open" : "closed",
      onClick: (e: React.MouseEvent) => {
        childOnClick?.(e);
        if (!e.defaultPrevented) ctx.setOpen(!ctx.open);
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        childOnKeyDown?.(e);
        handleKeyDown(e as React.KeyboardEvent<HTMLButtonElement>);
      },
      ref: composedRef,
    } as Record<string, unknown>);
  }

  return (
    <button
      ref={composedRef as React.Ref<HTMLButtonElement>}
      type="button"
      aria-expanded={ctx.open}
      aria-controls={`${ctx.baseId}-menu`}
      aria-haspopup="menu"
      data-slot="dropdown-trigger"
      data-state={ctx.open ? "open" : "closed"}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </button>
  );
});

DropdownTrigger.displayName = "DropdownTrigger";

export interface DropdownContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const DropdownContent = React.forwardRef<
  HTMLDivElement,
  DropdownContentProps
>(function DropdownContent({ className, children, ...rest }, ref) {
  const ctx = useDropdown();
  const composedRef = composeRefs<HTMLDivElement>(ref, (n) => {
    ctx.floatingRef.current = n;
  });

  React.useEffect(() => {
    if (!ctx.open) return;
    const onDown = (e: MouseEvent) => {
      const f = ctx.floatingRef.current;
      const a = ctx.anchorRef.current;
      const target = e.target as Node;
      if (f?.contains(target) || a?.contains(target)) return;
      ctx.setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        ctx.setOpen(false);
        ctx.anchorRef.current?.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        ctx.focusItem(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        ctx.focusItem(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        ctx.focusItem("first");
      } else if (e.key === "End") {
        e.preventDefault();
        ctx.focusItem("last");
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
      id={`${ctx.baseId}-menu`}
      role="menu"
      data-slot="dropdown-content"
      data-state="open"
      data-side={ctx.resolvedSide}
      className={cn(
        "fixed z-[9999] outline-none",
        "min-w-44 rounded-md border border-zinc-200 bg-white p-1 text-sm text-zinc-700 shadow-md",
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

DropdownContent.displayName = "DropdownContent";

export interface DropdownItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  disabled?: boolean;
  inset?: boolean;
  onSelect?: (e: Event) => void;
}

export const DropdownItem = React.forwardRef<HTMLDivElement, DropdownItemProps>(
  function DropdownItem(
    { disabled = false, inset = false, onSelect, className, children, onClick, onKeyDown, ...rest },
    ref,
  ) {
    const ctx = useDropdown();
    const id = React.useId();
    const composedRef = composeRefs<HTMLDivElement>(ref, (n) => {
      ctx.registerItem(n, id);
    });

    React.useEffect(() => () => ctx.registerItem(null, id), [ctx, id]);

    const select = (origin: Event | React.SyntheticEvent) => {
      if (disabled) return;
      const ev = (origin as Event) ?? new Event("select");
      onSelect?.(ev);
      if (!ev.defaultPrevented) ctx.setOpen(false);
    };

    return (
      <div
        ref={composedRef}
        role="menuitem"
        tabIndex={-1}
        aria-disabled={disabled || undefined}
        data-disabled={disabled || undefined}
        data-slot="dropdown-item"
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) select(e.nativeEvent);
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.defaultPrevented) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            select(e.nativeEvent);
          }
        }}
        onMouseEnter={(e) => {
          rest.onMouseEnter?.(e);
          if (!disabled) (e.currentTarget as HTMLElement).focus();
        }}
        className={cn(
          "relative flex select-none items-center gap-2 rounded-sm px-2 py-1.5 cursor-pointer outline-none",
          "focus:bg-zinc-100 focus:text-zinc-900 hover:bg-zinc-100",
          inset && "ps-8",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

DropdownItem.displayName = "DropdownItem";

export interface DropdownCheckboxItemProps
  extends Omit<DropdownItemProps, "inset"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const DropdownCheckboxItem = React.forwardRef<
  HTMLDivElement,
  DropdownCheckboxItemProps
>(function DropdownCheckboxItem(
  { checked = false, onCheckedChange, onSelect, className, children, ...rest },
  ref,
) {
  return (
    <DropdownItem
      ref={ref}
      role="menuitemcheckbox"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      onSelect={(e) => {
        onCheckedChange?.(!checked);
        onSelect?.(e);
        e.preventDefault();
      }}
      className={cn("ps-8", className)}
      {...rest}
    >
      <span className="absolute start-2 inline-flex h-4 w-4 items-center justify-center">
        {checked && <CheckIcon className="size-3.5" />}
      </span>
      {children}
    </DropdownItem>
  );
});

DropdownCheckboxItem.displayName = "DropdownCheckboxItem";

interface DropdownRadioGroupContextValue {
  value: string;
  setValue: (v: string) => void;
}

const DropdownRadioGroupContext =
  React.createContext<DropdownRadioGroupContextValue | null>(null);

export interface DropdownRadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export function DropdownRadioGroup({
  value: controlled,
  defaultValue = "",
  onValueChange,
  children,
}: DropdownRadioGroupProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : internal;
  const setValue = (v: string) => {
    if (!isControlled) setInternal(v);
    onValueChange?.(v);
  };
  return (
    <DropdownRadioGroupContext.Provider value={{ value, setValue }}>
      <div role="group">{children}</div>
    </DropdownRadioGroupContext.Provider>
  );
}

export interface DropdownRadioItemProps
  extends Omit<DropdownItemProps, "inset"> {
  value: string;
}

export const DropdownRadioItem = React.forwardRef<
  HTMLDivElement,
  DropdownRadioItemProps
>(function DropdownRadioItem(
  { value, className, children, onSelect, ...rest },
  ref,
) {
  const group = React.useContext(DropdownRadioGroupContext);
  const checked = group?.value === value;
  return (
    <DropdownItem
      ref={ref}
      role="menuitemradio"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      onSelect={(e) => {
        group?.setValue(value);
        onSelect?.(e);
        e.preventDefault();
      }}
      className={cn("ps-8", className)}
      {...rest}
    >
      <span className="absolute start-2 inline-flex h-4 w-4 items-center justify-center">
        {checked && <DotIcon className="size-2 fill-current" />}
      </span>
      {children}
    </DropdownItem>
  );
});

DropdownRadioItem.displayName = "DropdownRadioItem";

export interface DropdownLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
}

export const DropdownLabel = React.forwardRef<
  HTMLDivElement,
  DropdownLabelProps
>(function DropdownLabel({ inset, className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      data-slot="dropdown-label"
      className={cn(
        "px-2 py-1.5 text-xs font-semibold text-zinc-500",
        inset && "ps-8",
        className,
      )}
      {...rest}
    />
  );
});

DropdownLabel.displayName = "DropdownLabel";

export interface DropdownSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const DropdownSeparator = React.forwardRef<
  HTMLDivElement,
  DropdownSeparatorProps
>(function DropdownSeparator({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      role="separator"
      data-slot="dropdown-separator"
      className={cn("-mx-1 my-1 h-px bg-zinc-200", className)}
      {...rest}
    />
  );
});

DropdownSeparator.displayName = "DropdownSeparator";

export interface DropdownShortcutProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export const DropdownShortcut = React.forwardRef<
  HTMLSpanElement,
  DropdownShortcutProps
>(function DropdownShortcut({ className, ...rest }, ref) {
  return (
    <span
      ref={ref}
      data-slot="dropdown-shortcut"
      className={cn(
        "ms-auto text-xs tracking-widest text-zinc-400",
        className,
      )}
      {...rest}
    />
  );
});

DropdownShortcut.displayName = "DropdownShortcut";

export { ChevronRightIcon };
