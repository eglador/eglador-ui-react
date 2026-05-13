"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export type SidebarSide = "left" | "right";
export type SidebarVariant = "sidebar" | "floating" | "inset";

interface SidebarContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  collapsed: boolean;
  toggleCollapsed: () => void;
  side: SidebarSide;
  variant: SidebarVariant;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx)
    throw new Error("Sidebar subcomponents must be used within <SidebarProvider>");
  return ctx;
}

export interface SidebarProviderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  side?: SidebarSide;
  variant?: SidebarVariant;
}

export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  SidebarProviderProps
>(function SidebarProvider(
  {
    open: controlledOpen,
    defaultOpen = true,
    onOpenChange,
    collapsed: controlledCollapsed,
    defaultCollapsed = false,
    onCollapsedChange,
    side = "left",
    variant = "sidebar",
    className,
    children,
    ...rest
  },
  ref,
) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpenControlled = controlledOpen !== undefined;
  const open = isOpenControlled ? controlledOpen : internalOpen;
  const setOpen = (v: boolean) => {
    if (!isOpenControlled) setInternalOpen(v);
    onOpenChange?.(v);
  };

  const [internalCollapsed, setInternalCollapsed] =
    React.useState(defaultCollapsed);
  const isCollapsedControlled = controlledCollapsed !== undefined;
  const collapsed = isCollapsedControlled
    ? controlledCollapsed
    : internalCollapsed;
  const toggleCollapsed = () => {
    const next = !collapsed;
    if (!isCollapsedControlled) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  };

  return (
    <SidebarContext.Provider
      value={{ open, setOpen, collapsed, toggleCollapsed, side, variant }}
    >
      <div
        ref={ref}
        data-slot="sidebar-provider"
        data-side={side}
        data-variant={variant}
        data-state={open ? "open" : "closed"}
        data-collapsed={collapsed || undefined}
        className={cn("flex min-h-screen w-full", className)}
        {...rest}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
});

SidebarProvider.displayName = "SidebarProvider";

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {}

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  function Sidebar({ className, children, ...rest }, ref) {
    const ctx = useSidebar();
    if (!ctx.open) return null;
    return (
      <aside
        ref={ref}
        data-slot="sidebar"
        data-side={ctx.side}
        data-collapsed={ctx.collapsed || undefined}
        className={cn(
          "flex flex-col bg-white border-zinc-200 transition-[width] duration-200 shrink-0",
          ctx.variant === "floating" && "m-2 rounded-md border shadow-sm",
          ctx.variant === "inset" && "m-2 rounded-md",
          ctx.variant === "sidebar" &&
            (ctx.side === "left" ? "border-e" : "border-s"),
          ctx.side === "right" && "order-last",
          ctx.collapsed ? "w-14" : "w-64",
          className,
        )}
        {...rest}
      >
        {children}
      </aside>
    );
  },
);

Sidebar.displayName = "Sidebar";

export interface SidebarHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  SidebarHeaderProps
>(function SidebarHeader({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      data-slot="sidebar-header"
      className={cn("flex items-center gap-2 p-3 border-b border-zinc-200", className)}
      {...rest}
    />
  );
});

SidebarHeader.displayName = "SidebarHeader";

export interface SidebarContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  SidebarContentProps
>(function SidebarContent({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      data-slot="sidebar-content"
      className={cn(
        "flex flex-1 flex-col gap-2 overflow-auto p-2",
        className,
      )}
      {...rest}
    />
  );
});

SidebarContent.displayName = "SidebarContent";

export interface SidebarFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  SidebarFooterProps
>(function SidebarFooter({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      data-slot="sidebar-footer"
      className={cn("flex items-center gap-2 p-3 border-t border-zinc-200", className)}
      {...rest}
    />
  );
});

SidebarFooter.displayName = "SidebarFooter";

export interface SidebarGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
}

export const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  function SidebarGroup({ label, className, children, ...rest }, ref) {
    const ctx = useSidebar();
    return (
      <div
        ref={ref}
        data-slot="sidebar-group"
        className={cn("flex flex-col gap-1", className)}
        {...rest}
      >
        {label && !ctx.collapsed && (
          <div className="px-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            {label}
          </div>
        )}
        {children}
      </div>
    );
  },
);

SidebarGroup.displayName = "SidebarGroup";

export interface SidebarMenuProps
  extends React.HTMLAttributes<HTMLUListElement> {}

export const SidebarMenu = React.forwardRef<HTMLUListElement, SidebarMenuProps>(
  function SidebarMenu({ className, ...rest }, ref) {
    return (
      <ul
        ref={ref}
        data-slot="sidebar-menu"
        className={cn("flex flex-col gap-0.5", className)}
        {...rest}
      />
    );
  },
);

SidebarMenu.displayName = "SidebarMenu";

export interface SidebarMenuItemProps
  extends React.LiHTMLAttributes<HTMLLIElement> {}

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  SidebarMenuItemProps
>(function SidebarMenuItem({ className, ...rest }, ref) {
  return (
    <li
      ref={ref}
      data-slot="sidebar-menu-item"
      className={cn(className)}
      {...rest}
    />
  );
});

SidebarMenuItem.displayName = "SidebarMenuItem";

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  active?: boolean;
  icon?: React.ReactNode;
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(function SidebarMenuButton(
  { asChild = false, active = false, icon, className, children, ...rest },
  ref,
) {
  const ctx = useSidebar();
  const baseClass = cn(
    "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-zinc-700 transition-colors cursor-pointer outline-none",
    "hover:bg-zinc-100 hover:text-zinc-900",
    "focus-visible:ring-2 focus-visible:ring-zinc-900/20",
    active && "bg-zinc-100 text-zinc-900 font-medium",
    ctx.collapsed && "justify-center px-0",
    className,
  );

  const content = (
    <>
      {icon && (
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center shrink-0 size-4 [&>svg]:w-full [&>svg]:h-full"
        >
          {icon}
        </span>
      )}
      {!ctx.collapsed && <span className="flex-1 truncate text-start">{children}</span>}
    </>
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    return React.cloneElement(child, {
      ...rest,
      "data-slot": "sidebar-menu-button",
      "data-active": active || undefined,
      className: cn(child.props.className as string | undefined, baseClass),
      ref,
    } as Record<string, unknown>);
  }

  return (
    <button
      ref={ref}
      type="button"
      data-slot="sidebar-menu-button"
      data-active={active || undefined}
      className={baseClass}
      {...rest}
    >
      {content}
    </button>
  );
});

SidebarMenuButton.displayName = "SidebarMenuButton";

export interface SidebarTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  SidebarTriggerProps
>(function SidebarTrigger({ className, onClick, ...rest }, ref) {
  const ctx = useSidebar();
  return (
    <button
      ref={ref}
      type="button"
      aria-label="Toggle sidebar"
      aria-pressed={!ctx.open}
      data-slot="sidebar-trigger"
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) ctx.setOpen(!ctx.open);
      }}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer",
        className,
      )}
      {...rest}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18" />
      </svg>
    </button>
  );
});

SidebarTrigger.displayName = "SidebarTrigger";

export interface SidebarInsetProps
  extends React.HTMLAttributes<HTMLElement> {}

export const SidebarInset = React.forwardRef<HTMLElement, SidebarInsetProps>(
  function SidebarInset({ className, ...rest }, ref) {
    return (
      <main
        ref={ref}
        data-slot="sidebar-inset"
        className={cn("flex flex-1 flex-col overflow-hidden", className)}
        {...rest}
      />
    );
  },
);

SidebarInset.displayName = "SidebarInset";
