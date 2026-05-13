"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { ChevronDownIcon } from "../../lib/icons";

interface NavigationMenuContextValue {
  openItem: string | null;
  setOpenItem: (v: string | null) => void;
}

const NavigationMenuContext = React.createContext<NavigationMenuContextValue | null>(
  null,
);

function useNavigationMenu() {
  const ctx = React.useContext(NavigationMenuContext);
  if (!ctx)
    throw new Error("NavigationMenu subcomponents must be used within <NavigationMenu>");
  return ctx;
}

export interface NavigationMenuProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const NavigationMenu = React.forwardRef<
  HTMLDivElement,
  NavigationMenuProps
>(function NavigationMenu({ className, children, ...rest }, ref) {
  const [openItem, setOpenItem] = React.useState<string | null>(null);
  return (
    <NavigationMenuContext.Provider value={{ openItem, setOpenItem }}>
      <div
        ref={ref}
        data-slot="navigation-menu"
        className={cn("relative flex justify-center", className)}
        {...rest}
      >
        {children}
      </div>
    </NavigationMenuContext.Provider>
  );
});

NavigationMenu.displayName = "NavigationMenu";

export interface NavigationMenuListProps
  extends React.HTMLAttributes<HTMLUListElement> {}

export const NavigationMenuList = React.forwardRef<
  HTMLUListElement,
  NavigationMenuListProps
>(function NavigationMenuList({ className, ...rest }, ref) {
  return (
    <ul
      ref={ref}
      data-slot="navigation-menu-list"
      className={cn(
        "flex flex-row items-center gap-1 rounded-md bg-zinc-50 p-1",
        className,
      )}
      {...rest}
    />
  );
});

NavigationMenuList.displayName = "NavigationMenuList";

interface NavigationMenuItemContextValue {
  id: string;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const NavigationMenuItemContext =
  React.createContext<NavigationMenuItemContextValue | null>(null);

function useNavigationMenuItem() {
  const ctx = React.useContext(NavigationMenuItemContext);
  if (!ctx)
    throw new Error(
      "NavigationMenuTrigger/Content must be used within <NavigationMenuItem>",
    );
  return ctx;
}

export interface NavigationMenuItemProps
  extends React.LiHTMLAttributes<HTMLLIElement> {}

export const NavigationMenuItem = React.forwardRef<
  HTMLLIElement,
  NavigationMenuItemProps
>(function NavigationMenuItem({ className, children, ...rest }, ref) {
  const id = React.useId();
  const root = useNavigationMenu();
  const open = root.openItem === id;
  const setOpen = (v: boolean) => root.setOpenItem(v ? id : null);
  return (
    <NavigationMenuItemContext.Provider value={{ id, open, setOpen }}>
      <li
        ref={ref}
        data-slot="navigation-menu-item"
        className={cn("relative", className)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...rest}
      >
        {children}
      </li>
    </NavigationMenuItemContext.Provider>
  );
});

NavigationMenuItem.displayName = "NavigationMenuItem";

export interface NavigationMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const NavigationMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  NavigationMenuTriggerProps
>(function NavigationMenuTrigger({ className, children, ...rest }, ref) {
  const ctx = useNavigationMenuItem();
  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={ctx.open}
      data-slot="navigation-menu-trigger"
      data-state={ctx.open ? "open" : "closed"}
      onClick={() => ctx.setOpen(!ctx.open)}
      className={cn(
        "inline-flex items-center gap-1 rounded-sm px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors cursor-pointer outline-none",
        "hover:bg-white hover:text-zinc-900 focus-visible:bg-white focus-visible:text-zinc-900",
        "data-[state=open]:bg-white data-[state=open]:text-zinc-900",
        className,
      )}
      {...rest}
    >
      {children}
      <ChevronDownIcon
        aria-hidden="true"
        className={cn(
          "size-3.5 text-zinc-500 transition-transform",
          ctx.open && "rotate-180",
        )}
      />
    </button>
  );
});

NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

export interface NavigationMenuLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
}

export const NavigationMenuLink = React.forwardRef<
  HTMLAnchorElement,
  NavigationMenuLinkProps
>(function NavigationMenuLink({ active, className, ...rest }, ref) {
  return (
    <a
      ref={ref}
      data-slot="navigation-menu-link"
      data-active={active || undefined}
      className={cn(
        "block select-none rounded-sm px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors cursor-pointer no-underline",
        "hover:bg-zinc-100 hover:text-zinc-900",
        "focus-visible:bg-zinc-100 focus-visible:text-zinc-900 focus-visible:outline-none",
        "data-[active]:bg-zinc-100 data-[active]:text-zinc-900",
        className,
      )}
      {...rest}
    />
  );
});

NavigationMenuLink.displayName = "NavigationMenuLink";

export interface NavigationMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const NavigationMenuContent = React.forwardRef<
  HTMLDivElement,
  NavigationMenuContentProps
>(function NavigationMenuContent({ className, ...rest }, ref) {
  const ctx = useNavigationMenuItem();
  if (!ctx.open) return null;
  return (
    <div
      ref={ref}
      data-slot="navigation-menu-content"
      data-state="open"
      className={cn(
        "absolute start-0 top-full z-50 mt-1 min-w-[20rem] rounded-md border border-zinc-200 bg-white p-4 shadow-md",
        "animate-in fade-in-0 zoom-in-95",
        className,
      )}
      {...rest}
    />
  );
});

NavigationMenuContent.displayName = "NavigationMenuContent";

export interface NavigationMenuIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const NavigationMenuIndicator = NavigationMenuContent;
