"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../lib/utils";
import { ChevronDownIcon, XIcon, CheckIcon } from "../../lib/icons";
import { useFloating } from "../../lib/use-floating";

export type ComboboxSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ComboboxVariant = "outline" | "soft" | "ghost";
export type ComboboxShape = "square" | "rounded" | "pill";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

const SIZES: Record<
  ComboboxSize,
  { control: string; font: string; icon: string }
> = {
  xs: { control: "h-7 px-2", font: "text-xs", icon: "size-3" },
  sm: { control: "h-8 px-2.5", font: "text-xs", icon: "size-3.5" },
  md: { control: "h-9 px-3", font: "text-sm", icon: "size-4" },
  lg: { control: "h-10 px-4", font: "text-base", icon: "size-4" },
  xl: { control: "h-11 px-4", font: "text-base", icon: "size-5" },
};

const SHAPES: Record<ComboboxShape, string> = {
  square: "rounded-none",
  rounded: "rounded-md",
  pill: "rounded-full",
};

const VARIANTS: Record<ComboboxVariant, string> = {
  outline: "border border-zinc-300 bg-white hover:border-zinc-400",
  soft: "border border-transparent bg-zinc-100 hover:bg-zinc-200",
  ghost: "border border-transparent bg-transparent hover:bg-zinc-100",
};

export interface ComboboxProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  size?: ComboboxSize;
  variant?: ComboboxVariant;
  shape?: ComboboxShape;
  disabled?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  emptyMessage?: string;
  name?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export function Combobox({
  value: controlled,
  defaultValue,
  onValueChange,
  options,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  size = "md",
  variant = "outline",
  shape = "rounded",
  disabled = false,
  clearable = true,
  searchable = true,
  emptyMessage = "No results",
  name,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}: ComboboxProps) {
  const isControlled = controlled !== undefined;
  const [internal, setInternal] = React.useState<string | undefined>(
    defaultValue,
  );
  const value = isControlled ? controlled : internal;
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState("");
  const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1);
  const baseId = React.useId();

  const setValue = (next: string | undefined) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  const { anchorRef, floatingRef, position } = useFloating({
    open,
    side: "bottom",
    align: "start",
    sideOffset: 4,
  });

  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const didFocusSearchRef = React.useRef(false);

  const filtered = React.useMemo(() => {
    if (!searchable || !filter.trim()) return options;
    const q = filter.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, filter, searchable]);

  const selectedLabel = React.useMemo(
    () => options.find((o) => o.value === value)?.label,
    [options, value],
  );

  React.useEffect(() => {
    if (!open) {
      didFocusSearchRef.current = false;
      setHighlightedIndex(-1);
      setFilter("");
      return;
    }
    if (searchable && position && !didFocusSearchRef.current) {
      didFocusSearchRef.current = true;
      searchInputRef.current?.focus();
    }
    const idx = filtered.findIndex((o) => o.value === value);
    setHighlightedIndex(idx >= 0 ? idx : filtered.length > 0 ? 0 : -1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, searchable, position]);

  React.useEffect(() => {
    if (!open) return;
    if (highlightedIndex >= filtered.length) {
      setHighlightedIndex(filtered.length > 0 ? 0 : -1);
    }
  }, [filtered.length, highlightedIndex, open]);

  React.useEffect(() => {
    if (!open || highlightedIndex < 0) return;
    const list = listRef.current;
    if (!list) return;
    const el = list.querySelector<HTMLElement>(
      `[data-index="${highlightedIndex}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, open]);

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
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, floatingRef, anchorRef]);

  const selectAtIndex = (idx: number) => {
    const opt = filtered[idx];
    if (!opt || opt.disabled) return;
    setValue(opt.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (!open) {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "Enter" ||
        e.key === " "
      ) {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      let next = highlightedIndex + 1;
      while (next < filtered.length && filtered[next].disabled) next++;
      if (next < filtered.length) setHighlightedIndex(next);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      let next = highlightedIndex - 1;
      while (next >= 0 && filtered[next].disabled) next--;
      if (next >= 0) setHighlightedIndex(next);
    } else if (e.key === "Home") {
      e.preventDefault();
      const next = filtered.findIndex((o) => !o.disabled);
      if (next >= 0) setHighlightedIndex(next);
    } else if (e.key === "End") {
      e.preventDefault();
      for (let i = filtered.length - 1; i >= 0; i--) {
        if (!filtered[i].disabled) {
          setHighlightedIndex(i);
          break;
        }
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) selectAtIndex(highlightedIndex);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  const s = SIZES[size];

  return (
    <div
      data-slot="combobox"
      className={cn("relative w-full", className)}
    >
      <button
        ref={(n) => {
          triggerRef.current = n;
          anchorRef.current = n;
        }}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={`${baseId}-listbox`}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        disabled={disabled}
        data-slot="combobox-trigger"
        data-state={open ? "open" : "closed"}
        onClick={() => !disabled && setOpen(!open)}
        onKeyDown={handleKeyDown}
        className={cn(
          "inline-flex w-full items-center justify-between gap-2 outline-none transition-colors cursor-pointer text-zinc-900",
          "focus-visible:border-zinc-400 focus-visible:ring-[3px] focus-visible:ring-zinc-900/[0.06]",
          "aria-invalid:border-red-500 aria-invalid:ring-[3px] aria-invalid:ring-red-500/10",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          s.control,
          s.font,
          SHAPES[shape],
          VARIANTS[variant],
        )}
      >
        <span
          className={cn(
            "truncate text-start flex-1 min-w-0",
            !selectedLabel && "text-zinc-400",
          )}
        >
          {selectedLabel ?? placeholder}
        </span>
        <span className="flex items-center gap-1 shrink-0">
          {clearable && value !== undefined && !disabled && (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Clear"
              onClick={(e) => {
                e.stopPropagation();
                setValue(undefined);
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

      {name && (
        <input type="hidden" name={name} value={value ?? ""} />
      )}

      {open && typeof document !== "undefined"
        ? ReactDOM.createPortal(
            <div
              ref={(n) => {
                floatingRef.current = n;
              }}
              id={`${baseId}-listbox`}
              role="listbox"
              data-slot="combobox-content"
              data-state="open"
              className={cn(
                "fixed z-[9999] outline-none flex flex-col",
                "rounded-md border border-zinc-200 bg-white text-sm text-zinc-700 shadow-md",
                "max-h-72",
              )}
              style={{
                top: position?.top ?? 0,
                left: position?.left ?? 0,
                minWidth: anchorRef.current?.offsetWidth,
                visibility: position ? "visible" : "hidden",
              }}
              onKeyDown={handleKeyDown}
            >
              {searchable && (
                <div className="p-2 border-b border-zinc-200">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={searchPlaceholder}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                  />
                </div>
              )}
              <div
                ref={listRef}
                className="p-1 overflow-auto"
              >
                {filtered.length === 0 && (
                  <div className="px-2 py-3 text-center text-xs text-zinc-500">
                    {emptyMessage}
                  </div>
                )}
                {filtered.map((opt, idx) => {
                  const selected = opt.value === value;
                  const highlighted = idx === highlightedIndex;
                  return (
                    <div
                      key={opt.value}
                      role="option"
                      aria-selected={selected}
                      data-index={idx}
                      data-disabled={opt.disabled || undefined}
                      data-state={selected ? "checked" : "unchecked"}
                      data-highlighted={highlighted || undefined}
                      onClick={() => !opt.disabled && selectAtIndex(idx)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={cn(
                        "relative flex select-none items-center gap-2 rounded-sm ps-8 pe-2 py-1.5 cursor-pointer",
                        highlighted && !opt.disabled && "bg-zinc-100",
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
  );
}

Combobox.displayName = "Combobox";
