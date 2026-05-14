"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../lib/utils";
import { CheckIcon, DotIcon, ChevronRightIcon } from "../../lib/icons";

interface ContextMenuContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  position: { top: number; left: number } | null;
  setPosition: (p: { top: number; left: number } | null) => void;
  floatingRef: React.MutableRefObject<HTMLElement | null>;
  baseId: string;
  registerItem: (el: HTMLElement | null, value: string) => void;
  focusItem: (dir: 1 | -1 | "first" | "last") => void;
}

const ContextMenuContext = React.createContext<ContextMenuContextValue | null>(
  null,
);

function useContextMenu() {
  const ctx = React.useContext(ContextMenuContext);
  if (!ctx)
    throw new Error(
      "ContextMenu subcomponents must be used within <ContextMenu>",
    );
  return ctx;
}

interface MenuLevelContextValue {
  activeSubId: string | null;
  setActiveSubId: (id: string | null) => void;
}

const MenuLevelContext = React.createContext<MenuLevelContextValue | null>(null);

function MenuLevelProvider({ children }: { children: React.ReactNode }) {
  const [activeSubId, setActiveSubId] = React.useState<string | null>(null);
  const value = React.useMemo(
    () => ({ activeSubId, setActiveSubId }),
    [activeSubId],
  );
  return (
    <MenuLevelContext.Provider value={value}>
      {children}
    </MenuLevelContext.Provider>
  );
}

export interface ContextMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function ContextMenu({
  open: controlled,
  onOpenChange,
  children,
}: ContextMenuProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlled !== undefined;
  const open = isControlled ? controlled : internalOpen;
  const [position, setPosition] = React.useState<
    { top: number; left: number } | null
  >(null);
  const baseId = React.useId();
  const floatingRef = React.useRef<HTMLElement | null>(null);

  const setOpen = React.useCallback(
    (v: boolean) => {
      if (!isControlled) setInternalOpen(v);
      onOpenChange?.(v);
      if (!v) setPosition(null);
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

  const activeItemRef = React.useRef<string | null>(null);

  const focusItem = React.useCallback(
    (dir: 1 | -1 | "first" | "last") => {
      const entries = Array.from(itemsRef.current.entries()).filter(
        ([, el]) => !el.hasAttribute("data-disabled"),
      );
      if (entries.length === 0) return;
      let next = -1;
      if (dir === "first") next = 0;
      else if (dir === "last") next = entries.length - 1;
      else {
        const cur = activeItemRef.current
          ? entries.findIndex(([k]) => k === activeItemRef.current)
          : -1;
        next =
          cur === -1
            ? dir === 1
              ? 0
              : entries.length - 1
            : (cur + dir + entries.length) % entries.length;
      }
      const [key, el] = entries[next];
      el.focus();
      activeItemRef.current = key;
    },
    [],
  );

  return (
    <ContextMenuContext.Provider
      value={{
        open,
        setOpen,
        position,
        setPosition,
        floatingRef,
        baseId,
        registerItem,
        focusItem,
      }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
}

export interface ContextMenuTriggerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  disabled?: boolean;
}

export const ContextMenuTrigger = React.forwardRef<
  HTMLDivElement,
  ContextMenuTriggerProps
>(function ContextMenuTrigger(
  { asChild = false, disabled = false, onContextMenu, className, children, ...rest },
  ref,
) {
  const ctx = useContextMenu();

  const open = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    const pad = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let top = e.clientY;
    let left = e.clientX;
    if (top > vh - 200) top = vh - 200 - pad;
    if (left > vw - 200) left = vw - 200 - pad;
    ctx.setPosition({ top, left });
    ctx.setOpen(true);
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    const childOnContextMenu = child.props.onContextMenu as
      | ((e: React.MouseEvent) => void)
      | undefined;
    return React.cloneElement(child, {
      ...rest,
      "data-slot": "context-menu-trigger",
      onContextMenu: (e: React.MouseEvent) => {
        childOnContextMenu?.(e);
        open(e);
      },
      ref,
    } as Record<string, unknown>);
  }

  return (
    <div
      ref={ref}
      data-slot="context-menu-trigger"
      className={cn(className)}
      onContextMenu={(e) => {
        onContextMenu?.(e);
        open(e);
      }}
      {...rest}
    >
      {children}
    </div>
  );
});

ContextMenuTrigger.displayName = "ContextMenuTrigger";

export interface ContextMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const ContextMenuContent = React.forwardRef<
  HTMLDivElement,
  ContextMenuContentProps
>(function ContextMenuContent({ className, children, ...rest }, ref) {
  const ctx = useContextMenu();
  const setRefs = React.useCallback(
    (n: HTMLDivElement | null) => {
      ctx.floatingRef.current = n;
      if (typeof ref === "function") ref(n);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = n;
    },
    [ctx, ref],
  );

  React.useLayoutEffect(() => {
    if (!ctx.open || !ctx.position) return;
    const el = ctx.floatingRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pad = 8;
    let { top, left } = ctx.position;
    if (left + r.width > window.innerWidth - pad)
      left = window.innerWidth - r.width - pad;
    if (top + r.height > window.innerHeight - pad)
      top = window.innerHeight - r.height - pad;
    if (top !== ctx.position.top || left !== ctx.position.left)
      ctx.setPosition({ top, left });
  }, [ctx]);

  React.useEffect(() => {
    if (!ctx.open) return;
    const onDown = (e: MouseEvent) => {
      const f = ctx.floatingRef.current;
      if (f && f.contains(e.target as Node)) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-slot='context-menu-sub-content']")) return;
      ctx.setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        ctx.setOpen(false);
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

  if (!ctx.open || !ctx.position) return null;
  if (typeof document === "undefined") return null;

  return ReactDOM.createPortal(
    <div
      ref={setRefs}
      id={`${ctx.baseId}-menu`}
      role="menu"
      data-slot="context-menu-content"
      data-state="open"
      className={cn(
        "fixed z-[9999] outline-none",
        "min-w-44 rounded-md border border-zinc-200 bg-white p-1 text-sm text-zinc-700 shadow-md",
        "animate-in fade-in-0 zoom-in-95",
        className,
      )}
      style={{ top: ctx.position.top, left: ctx.position.left }}
      {...rest}
    >
      <MenuLevelProvider>{children}</MenuLevelProvider>
    </div>,
    document.body,
  );
});

ContextMenuContent.displayName = "ContextMenuContent";

export type ContextMenuItemVariant = "default" | "destructive";

export interface ContextMenuItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  disabled?: boolean;
  inset?: boolean;
  variant?: ContextMenuItemVariant;
  onSelect?: (e: Event) => void;
}

export const ContextMenuItem = React.forwardRef<
  HTMLDivElement,
  ContextMenuItemProps
>(function ContextMenuItem(
  {
    disabled = false,
    inset = false,
    variant = "default",
    onSelect,
    className,
    children,
    onClick,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const ctx = useContextMenu();
  const id = React.useId();

  const setRefs = React.useCallback(
    (n: HTMLDivElement | null) => {
      ctx.registerItem(n, id);
      if (typeof ref === "function") ref(n);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = n;
    },
    [ctx, id, ref],
  );

  const select = (origin: Event | React.SyntheticEvent) => {
    if (disabled) return;
    const ev = (origin as Event) ?? new Event("select");
    onSelect?.(ev);
    if (!ev.defaultPrevented) ctx.setOpen(false);
  };

  return (
    <div
      ref={setRefs}
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      data-disabled={disabled || undefined}
      data-variant={variant}
      data-slot="context-menu-item"
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
        variant === "destructive" &&
          "text-red-600 focus:bg-red-50 focus:text-red-700 hover:bg-red-50 hover:text-red-700",
        inset && "ps-8",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

ContextMenuItem.displayName = "ContextMenuItem";

export interface ContextMenuCheckboxItemProps
  extends Omit<ContextMenuItemProps, "inset"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const ContextMenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  ContextMenuCheckboxItemProps
>(function ContextMenuCheckboxItem(
  { checked = false, onCheckedChange, onSelect, className, children, ...rest },
  ref,
) {
  return (
    <ContextMenuItem
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
    </ContextMenuItem>
  );
});

ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

interface ContextMenuRadioGroupContextValue {
  value: string;
  setValue: (v: string) => void;
}

const ContextMenuRadioGroupContext =
  React.createContext<ContextMenuRadioGroupContextValue | null>(null);

export interface ContextMenuRadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export function ContextMenuRadioGroup({
  value: controlled,
  defaultValue = "",
  onValueChange,
  children,
}: ContextMenuRadioGroupProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : internal;
  const setValue = (v: string) => {
    if (!isControlled) setInternal(v);
    onValueChange?.(v);
  };
  return (
    <ContextMenuRadioGroupContext.Provider value={{ value, setValue }}>
      <div role="group">{children}</div>
    </ContextMenuRadioGroupContext.Provider>
  );
}

export interface ContextMenuRadioItemProps
  extends Omit<ContextMenuItemProps, "inset"> {
  value: string;
}

export const ContextMenuRadioItem = React.forwardRef<
  HTMLDivElement,
  ContextMenuRadioItemProps
>(function ContextMenuRadioItem(
  { value, className, children, onSelect, ...rest },
  ref,
) {
  const group = React.useContext(ContextMenuRadioGroupContext);
  const checked = group?.value === value;
  return (
    <ContextMenuItem
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
    </ContextMenuItem>
  );
});

ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

export interface ContextMenuGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const ContextMenuGroup = React.forwardRef<
  HTMLDivElement,
  ContextMenuGroupProps
>(function ContextMenuGroup({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      role="group"
      data-slot="context-menu-group"
      className={cn(className)}
      {...rest}
    />
  );
});

ContextMenuGroup.displayName = "ContextMenuGroup";

export interface ContextMenuLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
}

export const ContextMenuLabel = React.forwardRef<
  HTMLDivElement,
  ContextMenuLabelProps
>(function ContextMenuLabel({ inset, className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      data-slot="context-menu-label"
      className={cn(
        "px-2 py-1.5 text-xs font-semibold text-zinc-500",
        inset && "ps-8",
        className,
      )}
      {...rest}
    />
  );
});

ContextMenuLabel.displayName = "ContextMenuLabel";

export interface ContextMenuSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const ContextMenuSeparator = React.forwardRef<
  HTMLDivElement,
  ContextMenuSeparatorProps
>(function ContextMenuSeparator({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      role="separator"
      data-slot="context-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-zinc-200", className)}
      {...rest}
    />
  );
});

ContextMenuSeparator.displayName = "ContextMenuSeparator";

export interface ContextMenuShortcutProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export const ContextMenuShortcut = React.forwardRef<
  HTMLSpanElement,
  ContextMenuShortcutProps
>(function ContextMenuShortcut({ className, ...rest }, ref) {
  return (
    <span
      ref={ref}
      data-slot="context-menu-shortcut"
      className={cn(
        "ms-auto text-xs tracking-widest text-zinc-400",
        className,
      )}
      {...rest}
    />
  );
});

ContextMenuShortcut.displayName = "ContextMenuShortcut";

export type ContextMenuSubSide = "right" | "left";

interface ContextMenuSubContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerRef: React.MutableRefObject<HTMLDivElement | null>;
  cancelClose: () => void;
  scheduleClose: () => void;
}

const ContextMenuSubContext =
  React.createContext<ContextMenuSubContextValue | null>(null);

function useContextMenuSub() {
  const ctx = React.useContext(ContextMenuSubContext);
  if (!ctx)
    throw new Error(
      "ContextMenuSub subcomponents must be used within <ContextMenuSub>",
    );
  return ctx;
}

export interface ContextMenuSubProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const SUB_CLOSE_DELAY = 120;

export function ContextMenuSub({
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  children,
}: ContextMenuSubProps) {
  const id = React.useId();
  const level = React.useContext(MenuLevelContext);
  const triggerRef = React.useRef<HTMLDivElement | null>(null);
  const closeTimerRef = React.useRef<number | null>(null);
  const open = level ? level.activeSubId === id : false;
  const isControlled = controlled !== undefined;

  const setOpen = React.useCallback(
    (v: boolean) => {
      if (!level) return;
      if (v) {
        if (level.activeSubId !== id) level.setActiveSubId(id);
      } else if (level.activeSubId === id) {
        level.setActiveSubId(null);
      }
    },
    [level, id],
  );

  const initRef = React.useRef(false);
  React.useEffect(() => {
    if (initRef.current || !level) return;
    initRef.current = true;
    if (defaultOpen && level.activeSubId === null) level.setActiveSubId(id);
  }, [defaultOpen, level, id]);

  React.useEffect(() => {
    if (!isControlled || !level) return;
    if (controlled && level.activeSubId !== id) level.setActiveSubId(id);
    else if (!controlled && level.activeSubId === id) level.setActiveSubId(null);
  }, [isControlled, controlled, level, id]);

  const prevOpenRef = React.useRef(open);
  React.useEffect(() => {
    if (prevOpenRef.current !== open) {
      prevOpenRef.current = open;
      onOpenChange?.(open);
    }
  }, [open, onOpenChange]);

  const cancelClose = React.useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = React.useCallback(() => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false);
      closeTimerRef.current = null;
    }, SUB_CLOSE_DELAY);
  }, [cancelClose, setOpen]);

  React.useEffect(() => () => cancelClose(), [cancelClose]);

  const value = React.useMemo(
    () => ({ open, setOpen, triggerRef, cancelClose, scheduleClose }),
    [open, setOpen, cancelClose, scheduleClose],
  );

  return (
    <ContextMenuSubContext.Provider value={value}>
      {children}
    </ContextMenuSubContext.Provider>
  );
}

export interface ContextMenuSubTriggerProps
  extends Omit<ContextMenuItemProps, "onSelect"> {}

export const ContextMenuSubTrigger = React.forwardRef<
  HTMLDivElement,
  ContextMenuSubTriggerProps
>(function ContextMenuSubTrigger(
  { children, className, onKeyDown, onMouseEnter, onMouseLeave, ...rest },
  ref,
) {
  const sub = useContextMenuSub();

  const setRefs = React.useCallback(
    (n: HTMLDivElement | null) => {
      sub.triggerRef.current = n;
      if (typeof ref === "function") ref(n);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = n;
    },
    [sub, ref],
  );

  return (
    <ContextMenuItem
      ref={setRefs}
      data-slot="context-menu-sub-trigger"
      data-state={sub.open ? "open" : "closed"}
      onSelect={(e) => {
        sub.setOpen(true);
        e.preventDefault();
      }}
      onMouseEnter={(e) => {
        onMouseEnter?.(e);
        sub.cancelClose();
        sub.setOpen(true);
      }}
      onMouseLeave={(e) => {
        onMouseLeave?.(e);
        sub.scheduleClose();
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        if (e.key === "ArrowRight") {
          e.preventDefault();
          sub.setOpen(true);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          sub.setOpen(false);
        }
      }}
      className={cn("data-[state=open]:bg-zinc-100", className)}
      {...rest}
    >
      {children}
      <ChevronRightIcon className="ms-auto size-4 rtl:rotate-180" />
    </ContextMenuItem>
  );
});

ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

export interface ContextMenuSubContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  side?: ContextMenuSubSide;
  sideOffset?: number;
}

export const ContextMenuSubContent = React.forwardRef<
  HTMLDivElement,
  ContextMenuSubContentProps
>(function ContextMenuSubContent(
  {
    side = "right",
    sideOffset = 4,
    className,
    children,
    onMouseEnter,
    onMouseLeave,
    ...rest
  },
  ref,
) {
  const sub = useContextMenuSub();
  const root = useContextMenu();
  const localRef = React.useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(
    null,
  );

  const setRefs = React.useCallback(
    (n: HTMLDivElement | null) => {
      localRef.current = n;
      if (typeof ref === "function") ref(n);
      else if (ref)
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = n;
    },
    [ref],
  );

  React.useLayoutEffect(() => {
    if (!sub.open) {
      setPos(null);
      return;
    }
    const trigger = sub.triggerRef.current;
    const content = localRef.current;
    if (!trigger || !content) return;
    const t = trigger.getBoundingClientRect();
    const c = content.getBoundingClientRect();
    const pad = 8;
    let top = t.top;
    let left =
      side === "right" ? t.right + sideOffset : t.left - c.width - sideOffset;

    if (side === "right" && left + c.width > window.innerWidth - pad) {
      left = t.left - c.width - sideOffset;
    } else if (side === "left" && left < pad) {
      left = t.right + sideOffset;
    }
    if (top + c.height > window.innerHeight - pad) {
      top = Math.max(pad, window.innerHeight - c.height - pad);
    }
    setPos({ top, left });
  }, [sub.open, side, sideOffset]);

  React.useEffect(() => {
    if (!sub.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        sub.setOpen(false);
        sub.triggerRef.current?.focus();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        sub.setOpen(false);
        sub.triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sub]);

  if (!sub.open || !root.open) return null;
  if (typeof document === "undefined") return null;

  return ReactDOM.createPortal(
    <div
      ref={setRefs}
      role="menu"
      data-slot="context-menu-sub-content"
      data-state="open"
      className={cn(
        "fixed z-[9999] outline-none",
        "min-w-44 rounded-md border border-zinc-200 bg-white p-1 text-sm text-zinc-700 shadow-md",
        "animate-in fade-in-0 zoom-in-95",
        className,
      )}
      style={{
        top: pos?.top,
        left: pos?.left,
        opacity: pos ? 1 : 0,
        pointerEvents: pos ? "auto" : "none",
      }}
      onMouseEnter={(e) => {
        onMouseEnter?.(e);
        sub.cancelClose();
      }}
      onMouseLeave={(e) => {
        onMouseLeave?.(e);
        sub.scheduleClose();
      }}
      {...rest}
    >
      <MenuLevelProvider>{children}</MenuLevelProvider>
    </div>,
    document.body,
  );
});

ContextMenuSubContent.displayName = "ContextMenuSubContent";
