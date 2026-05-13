"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../lib/utils";
import { ChevronDownIcon, CheckIcon } from "../../lib/icons";
import { useFloating, composeRefs } from "../../lib/use-floating";

export type SelectVariant = "outline" | "soft" | "ghost";
export type SelectSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SelectShape = "square" | "rounded" | "pill";

interface SelectContextValue {
  value: string;
  setValue: (v: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  size: SelectSize;
  variant: SelectVariant;
  shape: SelectShape;
  disabled: boolean;
  registerLabel: (value: string, label: string) => void;
  getLabel: (value: string) => string | undefined;
  anchorRef: React.MutableRefObject<HTMLElement | null>;
  floatingRef: React.MutableRefObject<HTMLElement | null>;
  position: { top: number; left: number } | null;
  baseId: string;
  registerItem: (el: HTMLElement | null, value: string) => void;
  focusItem: (dir: 1 | -1 | "first" | "last") => void;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelect() {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("Select subcomponents must be used within <Select>");
  return ctx;
}

const SIZES: Record<
  SelectSize,
  { control: string; font: string; icon: string; pad: string }
> = {
  xs: { control: "h-7", font: "text-xs", icon: "size-3", pad: "px-2.5" },
  sm: { control: "h-8", font: "text-xs", icon: "size-3.5", pad: "px-3" },
  md: { control: "h-9", font: "text-sm", icon: "size-4", pad: "px-3" },
  lg: { control: "h-10", font: "text-base", icon: "size-4", pad: "px-4" },
  xl: { control: "h-11", font: "text-base", icon: "size-5", pad: "px-4" },
};

const SHAPES: Record<SelectShape, string> = {
  square: "rounded-none",
  rounded: "rounded-md",
  pill: "rounded-full",
};

const VARIANTS: Record<SelectVariant, string> = {
  outline: "border border-zinc-300 bg-white hover:border-zinc-400",
  soft: "border border-transparent bg-zinc-100 hover:bg-zinc-200",
  ghost: "border border-transparent bg-transparent hover:bg-zinc-100",
};

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: SelectSize;
  variant?: SelectVariant;
  shape?: SelectShape;
  disabled?: boolean;
  children: React.ReactNode;
}

export function Select({
  value: controlled,
  defaultValue = "",
  onValueChange,
  open: openControlled,
  defaultOpen = false,
  onOpenChange,
  size = "md",
  variant = "outline",
  shape = "rounded",
  disabled = false,
  children,
}: SelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : internalValue;

  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpenControlled = openControlled !== undefined;
  const open = isOpenControlled ? openControlled : internalOpen;

  const baseId = React.useId();
  const labelsRef = React.useRef<Map<string, string>>(new Map());
  const itemsRef = React.useRef<Map<string, HTMLElement>>(new Map());

  const setValue = (v: string) => {
    if (!isControlled) setInternalValue(v);
    onValueChange?.(v);
  };

  const setOpen = (v: boolean) => {
    if (disabled && v) return;
    if (!isOpenControlled) setInternalOpen(v);
    onOpenChange?.(v);
  };

  const registerLabel = React.useCallback((v: string, label: string) => {
    labelsRef.current.set(v, label);
  }, []);
  const getLabel = React.useCallback(
    (v: string) => labelsRef.current.get(v),
    [],
  );

  const registerItem = React.useCallback(
    (el: HTMLElement | null, v: string) => {
      if (el) itemsRef.current.set(v, el);
      else itemsRef.current.delete(v);
    },
    [],
  );

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
        const cur = value
          ? entries.findIndex(([k]) => k === value)
          : -1;
        next =
          cur === -1
            ? dir === 1
              ? 0
              : entries.length - 1
            : (cur + dir + entries.length) % entries.length;
      }
      entries[next][1].focus();
    },
    [value],
  );

  const { anchorRef, floatingRef, position } = useFloating({
    open,
    side: "bottom",
    align: "start",
    sideOffset: 4,
  });

  return (
    <SelectContext.Provider
      value={{
        value,
        setValue,
        open,
        setOpen,
        size,
        variant,
        shape,
        disabled,
        registerLabel,
        getLabel,
        anchorRef,
        floatingRef,
        position,
        baseId,
        registerItem,
        focusItem,
      }}
    >
      {children}
    </SelectContext.Provider>
  );
}

export interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  SelectTriggerProps
>(function SelectTrigger({ className, children, ...rest }, ref) {
  const ctx = useSelect();
  const s = SIZES[ctx.size];
  const composedRef = composeRefs<HTMLElement>(
    ref as React.Ref<HTMLElement>,
    (n) => {
      ctx.anchorRef.current = n;
    },
  );

  return (
    <button
      ref={composedRef as React.Ref<HTMLButtonElement>}
      type="button"
      role="combobox"
      aria-expanded={ctx.open}
      aria-controls={`${ctx.baseId}-listbox`}
      aria-haspopup="listbox"
      disabled={ctx.disabled}
      data-slot="select-trigger"
      data-state={ctx.open ? "open" : "closed"}
      onClick={() => ctx.setOpen(!ctx.open)}
      onKeyDown={(e) => {
        if (
          e.key === "ArrowDown" ||
          e.key === "Enter" ||
          e.key === " " ||
          e.key === "ArrowUp"
        ) {
          e.preventDefault();
          ctx.setOpen(true);
          requestAnimationFrame(() =>
            ctx.focusItem(e.key === "ArrowUp" ? "last" : "first"),
          );
        }
      }}
      className={cn(
        "inline-flex w-full items-center justify-between gap-2 outline-none transition-colors cursor-pointer text-zinc-900",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus-visible:ring-2 focus-visible:ring-zinc-900/20",
        s.control,
        s.font,
        s.pad,
        SHAPES[ctx.shape],
        VARIANTS[ctx.variant],
        className,
      )}
      {...rest}
    >
      <span className="flex-1 truncate text-start">{children}</span>
      <ChevronDownIcon
        aria-hidden="true"
        className={cn(
          "text-zinc-500 transition-transform",
          s.icon,
          ctx.open && "rotate-180",
        )}
      />
    </button>
  );
});

SelectTrigger.displayName = "SelectTrigger";

export interface SelectValueProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

export const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  function SelectValue({ placeholder, className, children, ...rest }, ref) {
    const ctx = useSelect();
    const label = ctx.value ? ctx.getLabel(ctx.value) : undefined;
    const displayed = children ?? label ?? placeholder;
    return (
      <span
        ref={ref}
        data-slot="select-value"
        className={cn(
          !label && placeholder && "text-zinc-400",
          className,
        )}
        {...rest}
      >
        {displayed}
      </span>
    );
  },
);

SelectValue.displayName = "SelectValue";

export interface SelectContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SelectContent = React.forwardRef<
  HTMLDivElement,
  SelectContentProps
>(function SelectContent({ className, children, ...rest }, ref) {
  const ctx = useSelect();
  const composedRef = composeRefs<HTMLDivElement>(ref, (n) => {
    ctx.floatingRef.current = n;
  });

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

  const anchorWidth = ctx.anchorRef.current?.offsetWidth;

  return ReactDOM.createPortal(
    <div
      ref={composedRef}
      id={`${ctx.baseId}-listbox`}
      role="listbox"
      data-slot="select-content"
      data-state="open"
      className={cn(
        "fixed z-[9999] outline-none",
        "rounded-md border border-zinc-200 bg-white p-1 text-sm text-zinc-700 shadow-md",
        "animate-in fade-in-0 zoom-in-95 max-h-72 overflow-auto",
        className,
      )}
      style={{
        top: ctx.position?.top ?? 0,
        left: ctx.position?.left ?? 0,
        minWidth: anchorWidth,
        visibility: ctx.position ? "visible" : "hidden",
      }}
      {...rest}
    >
      {children}
    </div>,
    document.body,
  );
});

SelectContent.displayName = "SelectContent";

export interface SelectItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  function SelectItem(
    { value, disabled = false, className, children, onClick, onKeyDown, ...rest },
    ref,
  ) {
    const ctx = useSelect();
    const selected = ctx.value === value;

    React.useEffect(() => {
      if (typeof children === "string") ctx.registerLabel(value, children);
    }, [ctx, value, children]);

    const setRefs = React.useCallback(
      (n: HTMLDivElement | null) => {
        ctx.registerItem(n, value);
        if (typeof ref === "function") ref(n);
        else if (ref)
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = n;
      },
      [ctx, value, ref],
    );

    React.useEffect(() => () => ctx.registerItem(null, value), [ctx, value]);

    const select = () => {
      if (disabled) return;
      ctx.setValue(value);
      ctx.setOpen(false);
    };

    return (
      <div
        ref={setRefs}
        role="option"
        aria-selected={selected}
        tabIndex={-1}
        data-disabled={disabled || undefined}
        data-slot="select-item"
        data-state={selected ? "checked" : "unchecked"}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) select();
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.defaultPrevented) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            select();
          }
        }}
        onMouseEnter={(e) => {
          rest.onMouseEnter?.(e);
          if (!disabled) (e.currentTarget as HTMLElement).focus();
        }}
        className={cn(
          "relative flex select-none items-center gap-2 rounded-sm ps-8 pe-2 py-1.5 cursor-pointer outline-none",
          "focus:bg-zinc-100 focus:text-zinc-900 hover:bg-zinc-100",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className,
        )}
        {...rest}
      >
        <span className="absolute start-2 inline-flex h-4 w-4 items-center justify-center">
          {selected && <CheckIcon className="size-3.5" />}
        </span>
        {children}
      </div>
    );
  },
);

SelectItem.displayName = "SelectItem";

export interface SelectGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>(
  function SelectGroup({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="group"
        data-slot="select-group"
        className={cn("py-1", className)}
        {...rest}
      />
    );
  },
);

SelectGroup.displayName = "SelectGroup";

export interface SelectLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(
  function SelectLabel({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="select-label"
        className={cn(
          "px-2 py-1.5 text-xs font-semibold text-zinc-500",
          className,
        )}
        {...rest}
      />
    );
  },
);

SelectLabel.displayName = "SelectLabel";

export interface SelectSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  SelectSeparatorProps
>(function SelectSeparator({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      role="separator"
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px bg-zinc-200", className)}
      {...rest}
    />
  );
});

SelectSeparator.displayName = "SelectSeparator";
