"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../lib/utils";
import { CheckIcon, DotIcon } from "../../lib/icons";
import { useFloating } from "../../lib/use-floating";

interface MenubarContextValue {
  openMenu: string | null;
  setOpenMenu: (v: string | null) => void;
  baseId: string;
}

const MenubarContext = React.createContext<MenubarContextValue | null>(null);

function useMenubar() {
  const ctx = React.useContext(MenubarContext);
  if (!ctx) throw new Error("Menubar subcomponents must be used within <Menubar>");
  return ctx;
}

export interface MenubarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Menubar = React.forwardRef<HTMLDivElement, MenubarProps>(
  function Menubar({ className, ...rest }, ref) {
    const [openMenu, setOpenMenu] = React.useState<string | null>(null);
    const baseId = React.useId();
    return (
      <MenubarContext.Provider value={{ openMenu, setOpenMenu, baseId }}>
        <div
          ref={ref}
          role="menubar"
          data-slot="menubar"
          className={cn(
            "inline-flex items-center gap-0.5 rounded-md border border-zinc-200 bg-white p-1",
            className,
          )}
          {...rest}
        />
      </MenubarContext.Provider>
    );
  },
);

Menubar.displayName = "Menubar";

interface MenubarMenuContextValue {
  id: string;
  open: boolean;
  setOpen: (v: boolean) => void;
  anchorRef: React.MutableRefObject<HTMLElement | null>;
  floatingRef: React.MutableRefObject<HTMLElement | null>;
  position: { top: number; left: number } | null;
}

const MenubarMenuContext = React.createContext<MenubarMenuContextValue | null>(
  null,
);

function useMenubarMenu() {
  const ctx = React.useContext(MenubarMenuContext);
  if (!ctx)
    throw new Error("Menubar subcomponents must be used within <MenubarMenu>");
  return ctx;
}

export interface MenubarMenuProps {
  children: React.ReactNode;
}

export function MenubarMenu({ children }: MenubarMenuProps) {
  const id = React.useId();
  const root = useMenubar();
  const open = root.openMenu === id;
  const setOpen = (v: boolean) => root.setOpenMenu(v ? id : null);
  const { anchorRef, floatingRef, position } = useFloating({
    open,
    side: "bottom",
    align: "start",
    sideOffset: 4,
  });
  return (
    <MenubarMenuContext.Provider
      value={{ id, open, setOpen, anchorRef, floatingRef, position }}
    >
      {children}
    </MenubarMenuContext.Provider>
  );
}

export interface MenubarTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const MenubarTrigger = React.forwardRef<
  HTMLButtonElement,
  MenubarTriggerProps
>(function MenubarTrigger({ className, ...rest }, ref) {
  const ctx = useMenubarMenu();
  const root = useMenubar();
  const setRefs = (n: HTMLButtonElement | null) => {
    ctx.anchorRef.current = n;
    if (typeof ref === "function") ref(n);
    else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = n;
  };
  return (
    <button
      ref={setRefs}
      type="button"
      role="menuitem"
      aria-haspopup="menu"
      aria-expanded={ctx.open}
      data-slot="menubar-trigger"
      data-state={ctx.open ? "open" : "closed"}
      onClick={() => ctx.setOpen(!ctx.open)}
      onMouseEnter={() => {
        if (root.openMenu && root.openMenu !== ctx.id) ctx.setOpen(true);
      }}
      className={cn(
        "inline-flex items-center rounded-sm px-3 py-1.5 text-sm font-medium text-zinc-700 cursor-pointer outline-none",
        "hover:bg-zinc-100 focus:bg-zinc-100",
        "data-[state=open]:bg-zinc-100 data-[state=open]:text-zinc-900",
        className,
      )}
      {...rest}
    />
  );
});

MenubarTrigger.displayName = "MenubarTrigger";

export interface MenubarContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const MenubarContent = React.forwardRef<
  HTMLDivElement,
  MenubarContentProps
>(function MenubarContent({ className, children, ...rest }, ref) {
  const ctx = useMenubarMenu();
  const setRefs = (n: HTMLDivElement | null) => {
    ctx.floatingRef.current = n;
    if (typeof ref === "function") ref(n);
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = n;
  };

  React.useEffect(() => {
    if (!ctx.open) return;
    const onDown = (e: MouseEvent) => {
      const f = ctx.floatingRef.current;
      const a = ctx.anchorRef.current;
      const t = e.target as Node;
      if (f?.contains(t) || a?.contains(t)) return;
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
      ref={setRefs}
      role="menu"
      data-slot="menubar-content"
      data-state="open"
      className={cn(
        "fixed z-[9999] min-w-44 rounded-md border border-zinc-200 bg-white p-1 text-sm text-zinc-700 shadow-md",
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

MenubarContent.displayName = "MenubarContent";

export interface MenubarItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  inset?: boolean;
}

export const MenubarItem = React.forwardRef<HTMLDivElement, MenubarItemProps>(
  function MenubarItem(
    { disabled = false, inset = false, className, onClick, children, ...rest },
    ref,
  ) {
    const ctx = useMenubarMenu();
    return (
      <div
        ref={ref}
        role="menuitem"
        tabIndex={-1}
        aria-disabled={disabled || undefined}
        data-disabled={disabled || undefined}
        data-slot="menubar-item"
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented && !disabled) ctx.setOpen(false);
        }}
        className={cn(
          "relative flex select-none items-center gap-2 rounded-sm px-2 py-1.5 cursor-pointer outline-none",
          "hover:bg-zinc-100 focus:bg-zinc-100",
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

MenubarItem.displayName = "MenubarItem";

export interface MenubarCheckboxItemProps
  extends Omit<MenubarItemProps, "inset"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const MenubarCheckboxItem = React.forwardRef<
  HTMLDivElement,
  MenubarCheckboxItemProps
>(function MenubarCheckboxItem(
  { checked = false, onCheckedChange, onClick, className, children, ...rest },
  ref,
) {
  return (
    <MenubarItem
      ref={ref}
      role="menuitemcheckbox"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
          onCheckedChange?.(!checked);
          e.preventDefault();
        }
      }}
      className={cn("ps-8", className)}
      {...rest}
    >
      <span className="absolute start-2 inline-flex h-4 w-4 items-center justify-center">
        {checked && <CheckIcon className="size-3.5" />}
      </span>
      {children}
    </MenubarItem>
  );
});

MenubarCheckboxItem.displayName = "MenubarCheckboxItem";

interface MenubarRadioGroupContextValue {
  value: string;
  setValue: (v: string) => void;
}

const MenubarRadioGroupContext =
  React.createContext<MenubarRadioGroupContextValue | null>(null);

export interface MenubarRadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  children: React.ReactNode;
}

export function MenubarRadioGroup({
  value: controlled,
  defaultValue = "",
  onValueChange,
  children,
}: MenubarRadioGroupProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : internal;
  const setValue = (v: string) => {
    if (!isControlled) setInternal(v);
    onValueChange?.(v);
  };
  return (
    <MenubarRadioGroupContext.Provider value={{ value, setValue }}>
      <div role="group">{children}</div>
    </MenubarRadioGroupContext.Provider>
  );
}

export interface MenubarRadioItemProps
  extends Omit<MenubarItemProps, "inset"> {
  value: string;
}

export const MenubarRadioItem = React.forwardRef<
  HTMLDivElement,
  MenubarRadioItemProps
>(function MenubarRadioItem(
  { value, onClick, className, children, ...rest },
  ref,
) {
  const group = React.useContext(MenubarRadioGroupContext);
  const checked = group?.value === value;
  return (
    <MenubarItem
      ref={ref}
      role="menuitemradio"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
          group?.setValue(value);
          e.preventDefault();
        }
      }}
      className={cn("ps-8", className)}
      {...rest}
    >
      <span className="absolute start-2 inline-flex h-4 w-4 items-center justify-center">
        {checked && <DotIcon className="size-2 fill-current" />}
      </span>
      {children}
    </MenubarItem>
  );
});

MenubarRadioItem.displayName = "MenubarRadioItem";

export interface MenubarSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const MenubarSeparator = React.forwardRef<
  HTMLDivElement,
  MenubarSeparatorProps
>(function MenubarSeparator({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      role="separator"
      data-slot="menubar-separator"
      className={cn("-mx-1 my-1 h-px bg-zinc-200", className)}
      {...rest}
    />
  );
});

MenubarSeparator.displayName = "MenubarSeparator";

export interface MenubarLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const MenubarLabel = React.forwardRef<HTMLDivElement, MenubarLabelProps>(
  function MenubarLabel({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="menubar-label"
        className={cn(
          "px-2 py-1.5 text-xs font-semibold text-zinc-500",
          className,
        )}
        {...rest}
      />
    );
  },
);

MenubarLabel.displayName = "MenubarLabel";

export interface MenubarShortcutProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export const MenubarShortcut = React.forwardRef<
  HTMLSpanElement,
  MenubarShortcutProps
>(function MenubarShortcut({ className, ...rest }, ref) {
  return (
    <span
      ref={ref}
      data-slot="menubar-shortcut"
      className={cn(
        "ms-auto text-xs tracking-widest text-zinc-400",
        className,
      )}
      {...rest}
    />
  );
});

MenubarShortcut.displayName = "MenubarShortcut";
