"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../lib/utils";
import { ChevronDownIcon, XIcon, CheckIcon } from "../../lib/icons";
import { useFloating } from "../../lib/use-floating";

export type MultiSelectSize = "xs" | "sm" | "md" | "lg" | "xl";
export type MultiSelectVariant = "outline" | "soft" | "ghost";
export type MultiSelectShape = "square" | "rounded" | "pill";

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectContextValue {
  values: string[];
  toggle: (v: string) => void;
  remove: (v: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  options: MultiSelectOption[];
  filter: string;
  setFilter: (v: string) => void;
  size: MultiSelectSize;
  variant: MultiSelectVariant;
  shape: MultiSelectShape;
  disabled: boolean;
  anchorRef: React.MutableRefObject<HTMLElement | null>;
  floatingRef: React.MutableRefObject<HTMLElement | null>;
  position: { top: number; left: number } | null;
  baseId: string;
}

const MultiSelectContext = React.createContext<MultiSelectContextValue | null>(
  null,
);

function useMultiSelect() {
  const ctx = React.useContext(MultiSelectContext);
  if (!ctx)
    throw new Error("MultiSelect subcomponents must be used within <MultiSelect>");
  return ctx;
}

const SIZES: Record<
  MultiSelectSize,
  { control: string; font: string; chip: string; icon: string }
> = {
  xs: { control: "min-h-7", font: "text-xs", chip: "h-5 text-[10px] px-1.5", icon: "size-3" },
  sm: { control: "min-h-8", font: "text-xs", chip: "h-6 text-xs px-2", icon: "size-3.5" },
  md: { control: "min-h-9", font: "text-sm", chip: "h-6 text-xs px-2", icon: "size-4" },
  lg: { control: "min-h-10", font: "text-base", chip: "h-7 text-sm px-2.5", icon: "size-4" },
  xl: { control: "min-h-11", font: "text-base", chip: "h-8 text-sm px-3", icon: "size-5" },
};

const SHAPES: Record<MultiSelectShape, string> = {
  square: "rounded-none",
  rounded: "rounded-md",
  pill: "rounded-full",
};

const VARIANTS: Record<MultiSelectVariant, string> = {
  outline: "border border-zinc-300 bg-white hover:border-zinc-400",
  soft: "border border-transparent bg-zinc-100 hover:bg-zinc-200",
  ghost: "border border-transparent bg-transparent hover:bg-zinc-100",
};

export interface MultiSelectProps {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  size?: MultiSelectSize;
  variant?: MultiSelectVariant;
  shape?: MultiSelectShape;
  disabled?: boolean;
  searchable?: boolean;
  emptyMessage?: string;
  maxDisplay?: number;
  className?: string;
}

export function MultiSelect({
  value: controlled,
  defaultValue = [],
  onValueChange,
  options,
  placeholder = "Select…",
  size = "md",
  variant = "outline",
  shape = "rounded",
  disabled = false,
  searchable = true,
  emptyMessage = "No results",
  maxDisplay = 3,
  className,
}: MultiSelectProps) {
  const [internal, setInternal] = React.useState<string[]>(defaultValue);
  const isControlled = controlled !== undefined;
  const values = isControlled ? controlled : internal;
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState("");
  const baseId = React.useId();

  const setValues = (next: string[]) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  const toggle = (v: string) => {
    if (values.includes(v)) setValues(values.filter((x) => x !== v));
    else setValues([...values, v]);
  };
  const remove = (v: string) => setValues(values.filter((x) => x !== v));
  const clear = () => setValues([]);

  const { anchorRef, floatingRef, position } = useFloating({
    open,
    side: "bottom",
    align: "start",
    sideOffset: 4,
  });

  const s = SIZES[size];
  const visibleChips = values.slice(0, maxDisplay);
  const overflow = values.length - visibleChips.length;

  const labelMap = React.useMemo(
    () => new Map(options.map((o) => [o.value, o.label])),
    [options],
  );

  const filtered = React.useMemo(() => {
    if (!searchable || !filter.trim()) return options;
    const q = filter.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, filter, searchable]);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const f = floatingRef.current;
      const a = anchorRef.current;
      const t = e.target as Node;
      if (f?.contains(t) || a?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, floatingRef, anchorRef]);

  return (
    <MultiSelectContext.Provider
      value={{
        values,
        toggle,
        remove,
        clear,
        open,
        setOpen,
        options: filtered,
        filter,
        setFilter,
        size,
        variant,
        shape,
        disabled,
        anchorRef,
        floatingRef,
        position,
        baseId,
      }}
    >
      <div data-slot="multi-select" className={cn("relative w-full", className)}>
        <button
          ref={(n) => {
            anchorRef.current = n;
          }}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={`${baseId}-listbox`}
          disabled={disabled}
          data-slot="multi-select-trigger"
          data-state={open ? "open" : "closed"}
          onClick={() => !disabled && setOpen(!open)}
          className={cn(
            "inline-flex w-full flex-wrap items-center justify-between gap-1.5 px-2 py-1.5 outline-none transition-colors cursor-pointer text-zinc-900",
            "focus-visible:border-zinc-400 focus-visible:ring-[3px] focus-visible:ring-zinc-900/[0.06]",
            "aria-invalid:border-red-500 aria-invalid:ring-[3px] aria-invalid:ring-red-500/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            s.control,
            s.font,
            SHAPES[shape],
            VARIANTS[variant],
          )}
        >
          <span className="flex flex-wrap items-center gap-1 flex-1 min-w-0">
            {values.length === 0 && (
              <span className="text-zinc-400 px-1 truncate">{placeholder}</span>
            )}
            {visibleChips.map((v) => (
              <span
                key={v}
                data-slot="multi-select-chip"
                className={cn(
                  "inline-flex items-center gap-1 rounded-sm bg-zinc-200 text-zinc-700 font-medium",
                  s.chip,
                )}
              >
                {labelMap.get(v) ?? v}
                <span
                  role="button"
                  tabIndex={-1}
                  aria-label={`Remove ${labelMap.get(v) ?? v}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(v);
                  }}
                  className="inline-flex items-center justify-center rounded-sm hover:bg-zinc-300 cursor-pointer"
                >
                  <XIcon className="size-3" />
                </span>
              </span>
            ))}
            {overflow > 0 && (
              <span className="text-xs text-zinc-500 ms-1">+{overflow}</span>
            )}
          </span>
          <span className="flex items-center gap-1 shrink-0">
            {values.length > 0 && (
              <span
                role="button"
                tabIndex={-1}
                aria-label="Clear"
                onClick={(e) => {
                  e.stopPropagation();
                  clear();
                }}
                className="inline-flex items-center justify-center text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <XIcon className={s.icon} />
              </span>
            )}
            <ChevronDownIcon
              aria-hidden="true"
              className={cn(
                "text-zinc-500 transition-transform",
                s.icon,
                open && "rotate-180",
              )}
            />
          </span>
        </button>
        {open && typeof document !== "undefined"
          ? ReactDOM.createPortal(
              <div
                ref={(n) => {
                  floatingRef.current = n;
                }}
                id={`${baseId}-listbox`}
                role="listbox"
                aria-multiselectable="true"
                data-slot="multi-select-content"
                data-state="open"
                className={cn(
                  "fixed z-[9999] outline-none flex flex-col",
                  "rounded-md border border-zinc-200 bg-white text-sm text-zinc-700 shadow-md",
                  "animate-in fade-in-0 zoom-in-95 max-h-72",
                )}
                style={{
                  top: position?.top ?? 0,
                  left: position?.left ?? 0,
                  minWidth: anchorRef.current?.offsetWidth,
                  visibility: position ? "visible" : "hidden",
                }}
              >
                {searchable && (
                  <div className="p-2 border-b border-zinc-200">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search…"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                    />
                  </div>
                )}
                <div className="p-1 overflow-auto">
                  {filtered.length === 0 && (
                    <div className="px-2 py-3 text-center text-xs text-zinc-500">
                      {emptyMessage}
                    </div>
                  )}
                  {filtered.map((opt) => {
                    const selected = values.includes(opt.value);
                    return (
                      <div
                        key={opt.value}
                        role="option"
                        aria-selected={selected}
                        data-disabled={opt.disabled || undefined}
                        data-state={selected ? "checked" : "unchecked"}
                        onClick={() => !opt.disabled && toggle(opt.value)}
                        className={cn(
                          "relative flex select-none items-center gap-2 rounded-sm ps-8 pe-2 py-1.5 cursor-pointer",
                          "hover:bg-zinc-100",
                          opt.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
                        )}
                      >
                        <span className="absolute start-2 inline-flex h-4 w-4 items-center justify-center">
                          {selected && <CheckIcon className="size-3.5" />}
                        </span>
                        {opt.label}
                      </div>
                    );
                  })}
                </div>
              </div>,
              document.body,
            )
          : null}
      </div>
    </MultiSelectContext.Provider>
  );

  // suppress unused warning since hook + ctx are wired
  void useMultiSelect;
}

MultiSelect.displayName = "MultiSelect";
