"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../lib/utils";
import { PanelLeftIcon } from "../../lib/icons";
import { Tooltip, TooltipTrigger, TooltipContent } from "../tooltip";

export type SidebarSide = "left" | "right";
export type SidebarVariant = "sidebar" | "floating" | "inset";
export type SidebarCollapsible = "offcanvas" | "icon" | "none";
export type SidebarState = "expanded" | "collapsed";

const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const MOBILE_BREAKPOINT = 768;

interface SidebarContextValue {
  state: SidebarState;
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
  activeId: string | undefined;
  setActiveId: (id: string | undefined) => void;
}

interface SidebarConfigValue {
  side: SidebarSide;
  variant: SidebarVariant;
  collapsible: SidebarCollapsible;
}

const SidebarConfigContext = React.createContext<SidebarConfigValue>({
  side: "left",
  variant: "sidebar",
  collapsible: "offcanvas",
});

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const ctx = React.useContext(SidebarContext);
  if (!ctx)
    throw new Error("useSidebar must be used within a <SidebarProvider />");
  return ctx;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return isMobile;
}

export interface SidebarProviderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultActiveId?: string;
  activeId?: string;
  onActiveIdChange?: (id: string | undefined) => void;
  /** When set, the open state is persisted to localStorage under this key. */
  persistKey?: string;
}

export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  SidebarProviderProps
>(function SidebarProvider(
  {
    defaultOpen = true,
    open: controlled,
    onOpenChange,
    defaultActiveId,
    activeId: controlledActiveId,
    onActiveIdChange,
    persistKey,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const isMobile = useIsMobile();

  const readPersisted = React.useCallback((): boolean | null => {
    if (typeof window === "undefined" || !persistKey) return null;
    try {
      const v = window.localStorage.getItem(persistKey);
      if (v === null) return null;
      return v === "true";
    } catch {
      return null;
    }
  }, [persistKey]);

  const [internalOpen, setInternalOpen] = React.useState(() => {
    const persisted = readPersisted();
    return persisted ?? defaultOpen;
  });
  const [openMobile, setOpenMobile] = React.useState(false);

  const isOpenControlled = controlled !== undefined;
  const open = isOpenControlled ? controlled : internalOpen;
  const setOpen = React.useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      const value = typeof next === "function" ? next(open) : next;
      if (!isOpenControlled) setInternalOpen(value);
      onOpenChange?.(value);
    },
    [open, isOpenControlled, onOpenChange],
  );

  React.useEffect(() => {
    if (typeof window === "undefined" || !persistKey) return;
    try {
      window.localStorage.setItem(persistKey, String(open));
    } catch {
      /* ignore quota / privacy errors */
    }
  }, [open, persistKey]);

  const [internalActiveId, setInternalActiveId] = React.useState<
    string | undefined
  >(defaultActiveId);
  const isActiveIdControlled = controlledActiveId !== undefined;
  const activeId = isActiveIdControlled ? controlledActiveId : internalActiveId;
  const setActiveId = React.useCallback(
    (id: string | undefined) => {
      if (!isActiveIdControlled) setInternalActiveId(id);
      onActiveIdChange?.(id);
    },
    [isActiveIdControlled, onActiveIdChange],
  );

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) setOpenMobile((v) => !v);
    else setOpen((v) => !v);
  }, [isMobile, setOpen]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (e.metaKey || e.ctrlKey) &&
        !e.shiftKey &&
        !e.altKey
      ) {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleSidebar]);

  const state: SidebarState = open ? "expanded" : "collapsed";

  const ctxValue = React.useMemo<SidebarContextValue>(
    () => ({
      state,
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
      activeId,
      setActiveId,
    }),
    [
      state,
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
      activeId,
      setActiveId,
    ],
  );

  return (
    <SidebarContext.Provider value={ctxValue}>
      <div
        ref={ref}
        data-slot="sidebar-wrapper"
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          "group/sidebar-wrapper flex min-h-svh w-full",
          "has-[[data-variant=inset]]:bg-zinc-100",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
});

SidebarProvider.displayName = "SidebarProvider";

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: SidebarSide;
  variant?: SidebarVariant;
  collapsible?: SidebarCollapsible;
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  function Sidebar(props, ref) {
    const {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
    } = props;
    return (
      <SidebarConfigContext.Provider value={{ side, variant, collapsible }}>
        <SidebarInner {...props} ref={ref} />
      </SidebarConfigContext.Provider>
    );
  },
);

const SidebarInner = React.forwardRef<HTMLDivElement, SidebarProps>(
  function SidebarInner(
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

    if (collapsible === "none") {
      return (
        <div
          ref={ref}
          data-slot="sidebar"
          data-side={side}
          data-variant={variant}
          data-collapsible="none"
          className={cn(
            "flex h-full w-(--sidebar-width) flex-col bg-white border-zinc-200",
            variant === "sidebar" &&
              (side === "left" ? "border-e" : "border-s"),
            variant === "floating" && "m-2 rounded-md border shadow-sm",
            className,
          )}
          {...rest}
        >
          {children}
        </div>
      );
    }

    if (isMobile) {
      if (typeof document === "undefined") return null;
      return (
        <>
          {openMobile && (
            <div
              data-slot="sidebar-mobile-overlay"
              onClick={() => setOpenMobile(false)}
              className="fixed inset-0 z-[9999] bg-zinc-900/50 backdrop-blur-sm animate-in fade-in-0"
            />
          )}
          {openMobile &&
            ReactDOM.createPortal(
              <aside
                ref={ref}
                role="dialog"
                aria-modal="true"
                data-slot="sidebar"
                data-mobile="true"
                data-side={side}
                data-variant={variant}
                data-state="expanded"
                className={cn(
                  "fixed inset-y-0 z-[10000] flex h-svh w-(--sidebar-width-mobile) flex-col bg-white shadow-lg outline-none",
                  side === "left"
                    ? "start-0 border-e border-zinc-200 animate-in slide-in-from-left duration-200"
                    : "end-0 border-s border-zinc-200 animate-in slide-in-from-right duration-200",
                  className,
                )}
                {...rest}
              >
                {children}
              </aside>,
              document.body,
            )}
        </>
      );
    }

    const isPanelVariant = variant === "floating" || variant === "inset";

    return (
      <div
        ref={ref}
        data-slot="sidebar"
        data-side={side}
        data-variant={variant}
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        className={cn(
          "group/sidebar peer hidden md:block text-zinc-700",
          // gap-handler that reserves layout space; expands/contracts with state
          "relative h-svh transition-[width] duration-200 ease-linear",
          "w-(--sidebar-width)",
          "data-[state=collapsed]:data-[collapsible=offcanvas]:w-0",
          // collapsed icon width: panel variants add 1rem to account for the p-2 padding
          !isPanelVariant &&
            "data-[state=collapsed]:data-[collapsible=icon]:w-(--sidebar-width-icon)",
          isPanelVariant &&
            "data-[state=collapsed]:data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem)]",
          side === "right" && "order-last",
          className,
        )}
      >
        <div
          data-slot="sidebar-container"
          data-side={side}
          className={cn(
            "fixed inset-y-0 z-10 hidden h-svh transition-[width,inset-inline] duration-200 ease-linear md:flex flex-col",
            "w-(--sidebar-width)",
            // anchor positioning
            "data-[side=left]:start-0 data-[side=right]:end-0",
            // offcanvas: slide entirely off-screen
            "group-data-[state=collapsed]/sidebar:data-[side=left]:group-data-[collapsible=offcanvas]/sidebar:start-[calc(var(--sidebar-width)*-1)]",
            "group-data-[state=collapsed]/sidebar:data-[side=right]:group-data-[collapsible=offcanvas]/sidebar:end-[calc(var(--sidebar-width)*-1)]",
            // icon collapsed: shrink width (panel variants keep their padding)
            !isPanelVariant &&
              "group-data-[state=collapsed]/sidebar:group-data-[collapsible=icon]/sidebar:w-(--sidebar-width-icon)",
            isPanelVariant &&
              "group-data-[state=collapsed]/sidebar:group-data-[collapsible=icon]/sidebar:w-[calc(var(--sidebar-width-icon)+1rem)]",
            // panel variants: padding around the inner panel (NOT margin — must not exceed w-(--sidebar-width))
            isPanelVariant && "p-2",
          )}
        >
          <div
            data-slot="sidebar-inner"
            className={cn(
              "flex h-full w-full flex-col overflow-hidden bg-white",
              // sidebar variant: edge border
              variant === "sidebar" &&
                (side === "left"
                  ? "border-e border-zinc-200"
                  : "border-s border-zinc-200"),
              // floating / inset: panel with rounded corners + border + shadow
              variant === "floating" &&
                "rounded-md border border-zinc-200 shadow-sm",
              variant === "inset" && "rounded-md border border-zinc-200",
            )}
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);

Sidebar.displayName = "Sidebar";

export interface SidebarTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  SidebarTriggerProps
>(function SidebarTrigger({ className, onClick, ...rest }, ref) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      ref={ref}
      type="button"
      aria-label="Toggle sidebar"
      data-slot="sidebar-trigger"
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) toggleSidebar();
      }}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20",
        className,
      )}
      {...rest}
    >
      <PanelLeftIcon className="size-4 rtl:rotate-180" />
    </button>
  );
});

SidebarTrigger.displayName = "SidebarTrigger";

export interface SidebarRailProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  SidebarRailProps
>(function SidebarRail({ className, onClick, ...rest }, ref) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      ref={ref}
      type="button"
      aria-label="Toggle sidebar"
      tabIndex={-1}
      data-slot="sidebar-rail"
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) toggleSidebar();
      }}
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear sm:flex",
        "group-data-[side=left]/sidebar:-end-4 group-data-[side=right]/sidebar:start-0",
        "after:absolute after:inset-y-0 after:start-1/2 after:w-px after:bg-transparent hover:after:bg-zinc-300",
        "cursor-col-resize",
        className,
      )}
      {...rest}
    />
  );
});

SidebarRail.displayName = "SidebarRail";

export interface SidebarInsetProps extends React.HTMLAttributes<HTMLElement> {}

export const SidebarInset = React.forwardRef<HTMLElement, SidebarInsetProps>(
  function SidebarInset({ className, ...rest }, ref) {
    return (
      <main
        ref={ref}
        data-slot="sidebar-inset"
        className={cn(
          "relative flex min-h-svh flex-1 flex-col bg-white",
          "peer-data-[variant=inset]:min-h-[calc(100svh-1rem)]",
          "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ms-0 md:peer-data-[variant=inset]:rounded-md md:peer-data-[variant=inset]:shadow-sm",
          className,
        )}
        {...rest}
      />
    );
  },
);

SidebarInset.displayName = "SidebarInset";

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
      className={cn("flex flex-col gap-2 p-2", className)}
      {...rest}
    />
  );
});

SidebarHeader.displayName = "SidebarHeader";

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
      className={cn("flex flex-col gap-2 p-2", className)}
      {...rest}
    />
  );
});

SidebarFooter.displayName = "SidebarFooter";

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
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto",
        "group-data-[collapsible=icon]/sidebar:overflow-hidden",
        className,
      )}
      {...rest}
    />
  );
});

SidebarContent.displayName = "SidebarContent";

export interface SidebarSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarSeparator = React.forwardRef<
  HTMLDivElement,
  SidebarSeparatorProps
>(function SidebarSeparator({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      role="separator"
      data-slot="sidebar-separator"
      className={cn("mx-2 my-1 h-px bg-zinc-200", className)}
      {...rest}
    />
  );
});

SidebarSeparator.displayName = "SidebarSeparator";

export interface SidebarGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  function SidebarGroup({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="sidebar-group"
        className={cn(
          "relative flex w-full min-w-0 flex-col p-2",
          className,
        )}
        {...rest}
      />
    );
  },
);

SidebarGroup.displayName = "SidebarGroup";

export interface SidebarGroupLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  SidebarGroupLabelProps
>(function SidebarGroupLabel(
  { asChild = false, className, children, ...rest },
  ref,
) {
  const baseClass = cn(
    "flex h-8 shrink-0 items-center px-2 text-xs font-medium text-zinc-500 outline-none transition-[margin,opacity] duration-200 ease-linear",
    "group-data-[collapsible=icon]/sidebar:-mt-8 group-data-[collapsible=icon]/sidebar:opacity-0",
    className,
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    return React.cloneElement(child, {
      ...rest,
      "data-slot": "sidebar-group-label",
      className: cn(child.props.className as string | undefined, baseClass),
      ref,
    } as Record<string, unknown>);
  }

  return (
    <div
      ref={ref}
      data-slot="sidebar-group-label"
      className={baseClass}
      {...rest}
    >
      {children}
    </div>
  );
});

SidebarGroupLabel.displayName = "SidebarGroupLabel";

export interface SidebarGroupActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  SidebarGroupActionProps
>(function SidebarGroupAction(
  { asChild = false, className, children, ...rest },
  ref,
) {
  const baseClass = cn(
    "absolute end-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-sm p-0 text-zinc-500 outline-none transition-transform cursor-pointer",
    "hover:bg-zinc-100 hover:text-zinc-900",
    "focus-visible:ring-2 focus-visible:ring-zinc-900/20",
    "group-data-[collapsible=icon]/sidebar:hidden",
    className,
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    return React.cloneElement(child, {
      ...rest,
      "data-slot": "sidebar-group-action",
      className: cn(child.props.className as string | undefined, baseClass),
      ref,
    } as Record<string, unknown>);
  }

  return (
    <button
      ref={ref}
      type="button"
      data-slot="sidebar-group-action"
      className={baseClass}
      {...rest}
    >
      {children}
    </button>
  );
});

SidebarGroupAction.displayName = "SidebarGroupAction";

export interface SidebarGroupContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  SidebarGroupContentProps
>(function SidebarGroupContent({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      data-slot="sidebar-group-content"
      className={cn("w-full text-sm", className)}
      {...rest}
    />
  );
});

SidebarGroupContent.displayName = "SidebarGroupContent";

export interface SidebarMenuProps
  extends React.HTMLAttributes<HTMLUListElement> {}

export const SidebarMenu = React.forwardRef<HTMLUListElement, SidebarMenuProps>(
  function SidebarMenu({ className, ...rest }, ref) {
    return (
      <ul
        ref={ref}
        data-slot="sidebar-menu"
        className={cn("flex w-full min-w-0 flex-col gap-0.5", className)}
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
      className={cn("group/menu-item relative", className)}
      {...rest}
    />
  );
});

SidebarMenuItem.displayName = "SidebarMenuItem";

export type SidebarMenuButtonSize = "sm" | "md" | "lg";

const MENU_BUTTON_SIZES: Record<SidebarMenuButtonSize, string> = {
  sm: "h-7 text-xs",
  md: "h-8 text-sm",
  lg: "h-12 text-sm",
};

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isActive?: boolean;
  size?: SidebarMenuButtonSize;
  /** When set, the button auto-marks itself active if the Provider's `activeId` matches. */
  value?: string;
  /**
   * Label shown as a tooltip when the sidebar is collapsed to icon mode.
   * Pass `false` to suppress the tooltip even in icon mode.
   */
  tooltip?: React.ReactNode | false;
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(function SidebarMenuButton(
  {
    asChild = false,
    isActive,
    size = "md",
    value,
    tooltip,
    className,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  const { activeId, setActiveId, state, isMobile } = useSidebar();
  const { side, collapsible } = React.useContext(SidebarConfigContext);

  const computedActive =
    isActive ?? (value !== undefined && activeId === value);

  const baseClass = cn(
    "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-sm px-2 text-start text-zinc-700 outline-none transition-colors cursor-pointer",
    "hover:bg-zinc-100 hover:text-zinc-900",
    "focus-visible:ring-2 focus-visible:ring-zinc-900/20",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    "data-[active=true]:bg-zinc-100 data-[active=true]:text-zinc-900 data-[active=true]:font-medium",
    "[&>svg]:size-4 [&>svg]:shrink-0",
    // icon-collapsed mode: square button, center its remaining child, hide span labels
    "group-data-[collapsible=icon]/sidebar:!size-8 group-data-[collapsible=icon]/sidebar:!p-2",
    "group-data-[collapsible=icon]/sidebar:!justify-center",
    "group-data-[collapsible=icon]/sidebar:[&>span]:hidden",
    MENU_BUTTON_SIZES[size],
    className,
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented && value !== undefined) setActiveId(value);
  };

  const sharedProps = {
    "data-slot": "sidebar-menu-button",
    "data-active": computedActive || undefined,
    "data-size": size,
    "aria-current": computedActive ? ("page" as const) : undefined,
  };

  let buttonNode: React.ReactNode;
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    const childOnClick = child.props.onClick as
      | ((e: React.MouseEvent) => void)
      | undefined;
    buttonNode = React.cloneElement(child, {
      ...rest,
      ...sharedProps,
      onClick: (e: React.MouseEvent) => {
        childOnClick?.(e);
        if (!e.defaultPrevented && value !== undefined) setActiveId(value);
      },
      className: cn(child.props.className as string | undefined, baseClass),
      ref,
    } as Record<string, unknown>);
  } else {
    buttonNode = (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        className={baseClass}
        {...sharedProps}
        {...rest}
      >
        {children}
      </button>
    );
  }

  const tooltipContent =
    tooltip === false
      ? null
      : tooltip ?? (typeof children === "string" ? children : null);

  const shouldShowTooltip =
    tooltipContent !== null &&
    collapsible === "icon" &&
    state === "collapsed" &&
    !isMobile;

  if (!shouldShowTooltip) return buttonNode;

  return (
    <Tooltip
      side={side === "left" ? "right" : "left"}
      align="center"
      sideOffset={8}
    >
      <TooltipTrigger asChild>{buttonNode}</TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  );
});

SidebarMenuButton.displayName = "SidebarMenuButton";

export interface SidebarMenuActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  showOnHover?: boolean;
}

export const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuActionProps
>(function SidebarMenuAction(
  { asChild = false, showOnHover = false, className, children, ...rest },
  ref,
) {
  const baseClass = cn(
    "absolute end-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-sm p-0 text-zinc-500 outline-none transition-colors cursor-pointer",
    "hover:bg-zinc-200 hover:text-zinc-900",
    "focus-visible:ring-2 focus-visible:ring-zinc-900/20",
    "peer-data-[size=sm]/menu-button:top-1",
    "peer-data-[size=md]/menu-button:top-1.5",
    "peer-data-[size=lg]/menu-button:top-2.5",
    "group-data-[collapsible=icon]/sidebar:hidden",
    showOnHover &&
      "opacity-0 group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:opacity-100",
    className,
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    return React.cloneElement(child, {
      ...rest,
      "data-slot": "sidebar-menu-action",
      className: cn(child.props.className as string | undefined, baseClass),
      ref,
    } as Record<string, unknown>);
  }

  return (
    <button
      ref={ref}
      type="button"
      data-slot="sidebar-menu-action"
      className={baseClass}
      {...rest}
    >
      {children}
    </button>
  );
});

SidebarMenuAction.displayName = "SidebarMenuAction";

export interface SidebarMenuBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  SidebarMenuBadgeProps
>(function SidebarMenuBadge({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      data-slot="sidebar-menu-badge"
      className={cn(
        "absolute end-1 flex h-5 min-w-5 items-center justify-center rounded-sm px-1 text-xs font-medium tabular-nums text-zinc-700 select-none pointer-events-none",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=md]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-3",
        "peer-data-[active=true]/menu-button:text-zinc-900",
        "group-data-[collapsible=icon]/sidebar:hidden",
        className,
      )}
      {...rest}
    />
  );
});

SidebarMenuBadge.displayName = "SidebarMenuBadge";

export interface SidebarMenuSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  showIcon?: boolean;
}

export const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  SidebarMenuSkeletonProps
>(function SidebarMenuSkeleton({ showIcon = false, className, ...rest }, ref) {
  const width = React.useMemo(
    () => `${Math.floor(Math.random() * 40) + 50}%`,
    [],
  );
  return (
    <div
      ref={ref}
      data-slot="sidebar-menu-skeleton"
      className={cn(
        "flex h-8 items-center gap-2 rounded-sm px-2",
        className,
      )}
      {...rest}
    >
      {showIcon && (
        <div className="size-4 rounded-sm bg-zinc-200 animate-pulse shrink-0" />
      )}
      <div
        className="h-4 max-w-[--skeleton-width] flex-1 bg-zinc-200 rounded-sm animate-pulse"
        style={{ "--skeleton-width": width } as React.CSSProperties}
      />
    </div>
  );
});

SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

export interface SidebarMenuSubProps
  extends React.HTMLAttributes<HTMLUListElement> {}

export const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  SidebarMenuSubProps
>(function SidebarMenuSub({ className, ...rest }, ref) {
  return (
    <ul
      ref={ref}
      data-slot="sidebar-menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-0.5 border-s border-zinc-200 ps-2.5 py-0.5",
        "group-data-[collapsible=icon]/sidebar:hidden",
        className,
      )}
      {...rest}
    />
  );
});

SidebarMenuSub.displayName = "SidebarMenuSub";

export interface SidebarMenuSubItemProps
  extends React.LiHTMLAttributes<HTMLLIElement> {}

export const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  SidebarMenuSubItemProps
>(function SidebarMenuSubItem({ className, ...rest }, ref) {
  return (
    <li
      ref={ref}
      data-slot="sidebar-menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...rest}
    />
  );
});

SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

export interface SidebarMenuSubButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
  isActive?: boolean;
  size?: "sm" | "md";
  value?: string;
}

export const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  SidebarMenuSubButtonProps
>(function SidebarMenuSubButton(
  {
    asChild = false,
    isActive,
    size = "md",
    value,
    className,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  const { activeId, setActiveId } = useSidebar();
  const computedActive =
    isActive ?? (value !== undefined && activeId === value);

  const baseClass = cn(
    "flex min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-sm px-2 text-zinc-700 outline-none cursor-pointer no-underline",
    "hover:bg-zinc-100 hover:text-zinc-900",
    "focus-visible:ring-2 focus-visible:ring-zinc-900/20",
    "data-[active=true]:bg-zinc-100 data-[active=true]:text-zinc-900 data-[active=true]:font-medium",
    "[&>svg]:size-3.5 [&>svg]:shrink-0 [&>svg]:text-zinc-500",
    size === "sm" && "h-6 text-xs",
    size === "md" && "h-7 text-sm",
    "group-data-[collapsible=icon]/sidebar:hidden",
    className,
  );

  const sharedProps = {
    "data-slot": "sidebar-menu-sub-button",
    "data-active": computedActive || undefined,
    "data-size": size,
    "aria-current": computedActive ? ("page" as const) : undefined,
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    const childOnClick = child.props.onClick as
      | ((e: React.MouseEvent) => void)
      | undefined;
    return React.cloneElement(child, {
      ...rest,
      ...sharedProps,
      onClick: (e: React.MouseEvent) => {
        childOnClick?.(e);
        if (!e.defaultPrevented && value !== undefined) setActiveId(value);
      },
      className: cn(child.props.className as string | undefined, baseClass),
      ref,
    } as Record<string, unknown>);
  }

  return (
    <a
      ref={ref}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented && value !== undefined) setActiveId(value);
      }}
      className={baseClass}
      {...sharedProps}
      {...rest}
    >
      {children}
    </a>
  );
});

SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

export interface SidebarInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const SidebarInput = React.forwardRef<HTMLInputElement, SidebarInputProps>(
  function SidebarInput({ className, ...rest }, ref) {
    return (
      <input
        ref={ref}
        data-slot="sidebar-input"
        className={cn(
          "flex h-8 w-full rounded-sm border border-zinc-200 bg-white px-2 text-sm text-zinc-900 outline-none transition-colors",
          "placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10",
          className,
        )}
        {...rest}
      />
    );
  },
);

SidebarInput.displayName = "SidebarInput";
