"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export type TabsVariant = "underline" | "pills" | "segmented";
export type TabsSize = "xs" | "sm" | "md" | "lg" | "xl";
export type TabsOrientation = "horizontal" | "vertical";

interface TabsContextValue {
  value: string;
  setValue: (next: string) => void;
  variant: TabsVariant;
  size: TabsSize;
  orientation: TabsOrientation;
  baseId: string;
  registerTrigger: (el: HTMLButtonElement | null, value: string) => void;
  focusSibling: (current: string, dir: 1 | -1 | "first" | "last") => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs(): TabsContextValue {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs subcomponents must be used within <Tabs>");
  return ctx;
}

const SIZES: Record<
  TabsSize,
  {
    list: string;
    listPad: string;
    listGap: string;
    trigger: string;
    triggerPad: string;
    triggerFont: string;
    iconSize: string;
  }
> = {
  xs: {
    list: "h-8",
    listPad: "p-0.5 gap-0.5",
    listGap: "gap-2",
    trigger: "gap-1",
    triggerPad: "px-2.5 py-1",
    triggerFont: "text-xs",
    iconSize: "size-3",
  },
  sm: {
    list: "h-9",
    listPad: "p-1 gap-1",
    listGap: "gap-4",
    trigger: "gap-1.5",
    triggerPad: "px-3 py-1.5",
    triggerFont: "text-xs",
    iconSize: "size-3.5",
  },
  md: {
    list: "h-10",
    listPad: "p-1 gap-1",
    listGap: "gap-4",
    trigger: "gap-2",
    triggerPad: "px-4 py-2",
    triggerFont: "text-sm",
    iconSize: "size-4",
  },
  lg: {
    list: "h-11",
    listPad: "p-1 gap-1",
    listGap: "gap-4",
    trigger: "gap-2",
    triggerPad: "px-5 py-2.5",
    triggerFont: "text-base",
    iconSize: "size-5",
  },
  xl: {
    list: "h-12",
    listPad: "p-1.5 gap-1.5",
    listGap: "gap-6",
    trigger: "gap-2.5",
    triggerPad: "px-6 py-3",
    triggerFont: "text-lg",
    iconSize: "size-6",
  },
};

const LIST_VARIANTS: Record<
  TabsVariant,
  { horizontal: string; vertical: string }
> = {
  underline: {
    horizontal: "border-b border-zinc-200",
    vertical: "border-e border-zinc-200",
  },
  pills: {
    horizontal: "",
    vertical: "",
  },
  segmented: {
    horizontal: "bg-zinc-100 rounded-md",
    vertical: "bg-zinc-100 rounded-md",
  },
};

const TRIGGER_VARIANTS: Record<
  TabsVariant,
  {
    base: string;
    horizontal: string;
    vertical: string;
    inactive: string;
    active: string;
  }
> = {
  underline: {
    base: "rounded-none",
    horizontal: "border-b-2 border-transparent -mb-px",
    vertical: "border-e-2 border-transparent -me-px w-full",
    inactive: "text-zinc-500 hover:text-zinc-900",
    active: "text-zinc-900 border-zinc-900",
  },
  pills: {
    base: "rounded-md",
    horizontal: "",
    vertical: "w-full",
    inactive: "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100",
    active: "bg-zinc-900 text-white shadow-sm",
  },
  segmented: {
    base: "rounded-sm",
    horizontal: "",
    vertical: "w-full",
    inactive: "text-zinc-500 hover:text-zinc-900",
    active: "bg-white text-zinc-900 shadow-sm",
  },
};

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  orientation?: TabsOrientation;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    value: controlled,
    defaultValue = "",
    onValueChange,
    variant = "underline",
    size = "md",
    orientation = "horizontal",
    className,
    children,
    ...rest
  },
  ref,
) {
  const baseId = React.useId();
  const [internal, setInternal] = React.useState(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : internal;

  const triggersRef = React.useRef<Map<string, HTMLButtonElement>>(new Map());

  const setValue = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const registerTrigger = React.useCallback(
    (el: HTMLButtonElement | null, key: string) => {
      if (el) triggersRef.current.set(key, el);
      else triggersRef.current.delete(key);
    },
    [],
  );

  const focusSibling = React.useCallback(
    (current: string, dir: 1 | -1 | "first" | "last") => {
      const entries = Array.from(triggersRef.current.entries()).filter(
        ([, el]) => !el.disabled,
      );
      if (entries.length === 0) return;
      let nextIndex = -1;
      if (dir === "first") nextIndex = 0;
      else if (dir === "last") nextIndex = entries.length - 1;
      else {
        const idx = entries.findIndex(([k]) => k === current);
        if (idx === -1) return;
        nextIndex = (idx + dir + entries.length) % entries.length;
      }
      const [nextKey, nextEl] = entries[nextIndex];
      nextEl.focus();
      setValue(nextKey);
    },
    [setValue],
  );

  return (
    <TabsContext.Provider
      value={{
        value,
        setValue,
        variant,
        size,
        orientation,
        baseId,
        registerTrigger,
        focusSibling,
      }}
    >
      <div
        ref={ref}
        data-slot="tabs"
        data-orientation={orientation}
        className={cn(
          "flex",
          orientation === "horizontal" ? "flex-col gap-3" : "flex-row gap-4",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
});

Tabs.displayName = "Tabs";

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  scrollable?: boolean;
}

const SCROLLBAR_STYLES = cn(
  "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5",
  "[&::-webkit-scrollbar-track]:bg-transparent",
  "[&::-webkit-scrollbar-thumb]:rounded-full",
  "[&::-webkit-scrollbar-corner]:bg-transparent",
  "[&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-thumb:hover]:bg-zinc-400",
);

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  function TabsList({ className, scrollable = false, ...rest }, ref) {
    const { variant, size, orientation } = useTabs();
    const s = SIZES[size];
    const v = LIST_VARIANTS[variant];
    const isUnderline = variant === "underline";
    const isHorizontal = orientation === "horizontal";

    return (
      <div
        ref={ref}
        role="tablist"
        aria-orientation={orientation}
        data-slot="tabs-list"
        className={cn(
          "shrink-0 inline-flex items-stretch",
          isHorizontal ? "flex-row" : "flex-col",
          !isUnderline && isHorizontal && s.list,
          !isUnderline && s.listPad,
          isUnderline && s.listGap,
          isHorizontal ? v.horizontal : v.vertical,
          scrollable && [
            "max-w-full",
            isHorizontal
              ? "overflow-x-auto overflow-y-hidden"
              : "overflow-y-auto overflow-x-hidden",
            SCROLLBAR_STYLES,
          ],
          className,
        )}
        {...rest}
      />
    );
  },
);

TabsList.displayName = "TabsList";

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  icon?: React.ReactNode;
}

export const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  TabsTriggerProps
>(function TabsTrigger(
  { value, icon, className, children, disabled, onKeyDown, ...rest },
  forwardedRef,
) {
  const {
    value: activeValue,
    setValue,
    variant,
    size,
    orientation,
    baseId,
    registerTrigger,
    focusSibling,
  } = useTabs();
  const isActive = activeValue === value;
  const s = SIZES[size];
  const v = TRIGGER_VARIANTS[variant];

  const innerRef = React.useRef<HTMLButtonElement | null>(null);
  const setRefs = React.useCallback(
    (node: HTMLButtonElement | null) => {
      innerRef.current = node;
      registerTrigger(node, value);
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef)
        (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    },
    [registerTrigger, value, forwardedRef],
  );

  React.useEffect(() => {
    return () => registerTrigger(null, value);
  }, [registerTrigger, value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const isHorizontal = orientation === "horizontal";
    const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
    const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
    if (e.key === nextKey) {
      e.preventDefault();
      focusSibling(value, 1);
    } else if (e.key === prevKey) {
      e.preventDefault();
      focusSibling(value, -1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusSibling(value, "first");
    } else if (e.key === "End") {
      e.preventDefault();
      focusSibling(value, "last");
    }
  };

  return (
    <button
      ref={setRefs}
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`${baseId}-panel-${value}`}
      id={`${baseId}-tab-${value}`}
      data-slot="tabs-trigger"
      data-state={isActive ? "active" : "inactive"}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => !disabled && setValue(value)}
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex items-center font-medium transition-colors cursor-pointer",
        orientation === "horizontal" ? "justify-center" : "justify-start",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        s.trigger,
        variant !== "underline" && s.triggerPad,
        s.triggerFont,
        orientation === "horizontal" && (variant === "underline" ? s.list : "h-full"),
        v.base,
        orientation === "horizontal" ? v.horizontal : v.vertical,
        isActive ? v.active : v.inactive,
        className,
      )}
      {...rest}
    >
      {icon && (
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full",
            s.iconSize,
          )}
        >
          {icon}
        </span>
      )}
      {children}
    </button>
  );
});

TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  forceMount?: boolean;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  function TabsContent(
    { value, forceMount, className, children, ...rest },
    ref,
  ) {
    const { value: activeValue, baseId } = useTabs();
    const isActive = activeValue === value;
    if (!isActive && !forceMount) return null;
    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`${baseId}-panel-${value}`}
        aria-labelledby={`${baseId}-tab-${value}`}
        data-slot="tabs-content"
        data-state={isActive ? "active" : "inactive"}
        hidden={!isActive}
        tabIndex={0}
        className={cn(
          "flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

TabsContent.displayName = "TabsContent";
