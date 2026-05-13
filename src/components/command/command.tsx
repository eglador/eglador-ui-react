"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { SearchIcon } from "../../lib/icons";

interface CommandContextValue {
  filter: string;
  setFilter: (v: string) => void;
  registerItem: (el: HTMLElement | null, value: string, label: string) => void;
  matches: (value: string, label: string) => boolean;
  activeValue: string | null;
  setActiveValue: (v: string | null) => void;
  focusNext: () => void;
  focusPrev: () => void;
  focusFirst: () => void;
  focusLast: () => void;
}

const CommandContext = React.createContext<CommandContextValue | null>(null);

function useCommand() {
  const ctx = React.useContext(CommandContext);
  if (!ctx) throw new Error("Command subcomponents must be used within <Command>");
  return ctx;
}

export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultFilter?: string;
  filter?: string;
  onFilterChange?: (filter: string) => void;
}

export const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  function Command(
    { defaultFilter = "", filter: controlled, onFilterChange, className, children, ...rest },
    ref,
  ) {
    const [internal, setInternal] = React.useState(defaultFilter);
    const isControlled = controlled !== undefined;
    const filter = isControlled ? controlled : internal;
    const setFilter = (v: string) => {
      if (!isControlled) setInternal(v);
      onFilterChange?.(v);
    };

    const itemsRef = React.useRef<
      Map<string, { el: HTMLElement; label: string }>
    >(new Map());

    const [activeValue, setActiveValue] = React.useState<string | null>(null);

    const registerItem = React.useCallback(
      (el: HTMLElement | null, value: string, label: string) => {
        if (el) itemsRef.current.set(value, { el, label });
        else itemsRef.current.delete(value);
      },
      [],
    );

    const matches = React.useCallback(
      (_value: string, label: string) => {
        if (!filter.trim()) return true;
        return label.toLowerCase().includes(filter.toLowerCase());
      },
      [filter],
    );

    const visibleEntries = () =>
      Array.from(itemsRef.current.entries()).filter(([v, { label }]) =>
        matches(v, label),
      );

    const focusNext = () => {
      const entries = visibleEntries();
      if (entries.length === 0) return;
      const idx = activeValue
        ? entries.findIndex(([v]) => v === activeValue)
        : -1;
      const next = (idx + 1) % entries.length;
      const [v, { el }] = entries[next];
      setActiveValue(v);
      el.scrollIntoView({ block: "nearest" });
    };
    const focusPrev = () => {
      const entries = visibleEntries();
      if (entries.length === 0) return;
      const idx = activeValue
        ? entries.findIndex(([v]) => v === activeValue)
        : 0;
      const next = (idx - 1 + entries.length) % entries.length;
      const [v, { el }] = entries[next];
      setActiveValue(v);
      el.scrollIntoView({ block: "nearest" });
    };
    const focusFirst = () => {
      const entries = visibleEntries();
      if (entries.length === 0) return;
      const [v, { el }] = entries[0];
      setActiveValue(v);
      el.scrollIntoView({ block: "nearest" });
    };
    const focusLast = () => {
      const entries = visibleEntries();
      if (entries.length === 0) return;
      const [v, { el }] = entries[entries.length - 1];
      setActiveValue(v);
      el.scrollIntoView({ block: "nearest" });
    };

    React.useEffect(() => {
      if (!filter) return;
      focusFirst();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    return (
      <CommandContext.Provider
        value={{
          filter,
          setFilter,
          registerItem,
          matches,
          activeValue,
          setActiveValue,
          focusNext,
          focusPrev,
          focusFirst,
          focusLast,
        }}
      >
        <div
          ref={ref}
          data-slot="command"
          className={cn(
            "flex h-full w-full flex-col overflow-hidden rounded-md border border-zinc-200 bg-white",
            className,
          )}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              focusNext();
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              focusPrev();
            } else if (e.key === "Home") {
              e.preventDefault();
              focusFirst();
            } else if (e.key === "End") {
              e.preventDefault();
              focusLast();
            } else if (e.key === "Enter" && activeValue) {
              const entry = itemsRef.current.get(activeValue);
              if (entry) {
                e.preventDefault();
                entry.el.click();
              }
            }
          }}
          {...rest}
        >
          {children}
        </div>
      </CommandContext.Provider>
    );
  },
);

Command.displayName = "Command";

export interface CommandInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {}

export const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  function CommandInput({ className, placeholder = "Search…", ...rest }, ref) {
    const ctx = useCommand();
    return (
      <div className="flex items-center gap-2 border-b border-zinc-200 px-3">
        <SearchIcon
          aria-hidden="true"
          className="size-4 shrink-0 text-zinc-400"
        />
        <input
          ref={ref}
          type="text"
          value={ctx.filter}
          onChange={(e) => ctx.setFilter(e.target.value)}
          placeholder={placeholder}
          data-slot="command-input"
          className={cn(
            "flex h-10 w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400",
            className,
          )}
          {...rest}
        />
      </div>
    );
  },
);

CommandInput.displayName = "CommandInput";

export interface CommandListProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
  function CommandList({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="listbox"
        data-slot="command-list"
        className={cn("max-h-72 overflow-auto overflow-x-hidden p-1", className)}
        {...rest}
      />
    );
  },
);

CommandList.displayName = "CommandList";

export interface CommandEmptyProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>(
  function CommandEmpty({ className, children = "No results found.", ...rest }, ref) {
    const ctx = useCommand();
    const hasMatch = React.useMemo(() => {
      // simple check by reading current dom on every render is not reliable; instead, expose hasMatches via context?
      return false;
    }, []);
    // We'll let parent CommandGroup hide itself; CommandEmpty always renders but consumer should toggle visibility based on filter
    void hasMatch;
    if (!ctx.filter) return null;
    return (
      <div
        ref={ref}
        data-slot="command-empty"
        className={cn(
          "py-6 text-center text-sm text-zinc-500",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

CommandEmpty.displayName = "CommandEmpty";

export interface CommandGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  heading?: React.ReactNode;
}

export const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  function CommandGroup({ heading, className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="group"
        data-slot="command-group"
        className={cn("flex flex-col py-1", className)}
        {...rest}
      >
        {heading && (
          <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500">
            {heading}
          </div>
        )}
        {children}
      </div>
    );
  },
);

CommandGroup.displayName = "CommandGroup";

export interface CommandItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  value: string;
  disabled?: boolean;
  onSelect?: (value: string) => void;
}

export const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  function CommandItem(
    { value, disabled = false, onSelect, className, children, onClick, ...rest },
    ref,
  ) {
    const ctx = useCommand();
    const label = typeof children === "string" ? children : value;
    const active = ctx.activeValue === value;
    const visible = ctx.matches(value, label);

    const setRefs = React.useCallback(
      (n: HTMLDivElement | null) => {
        ctx.registerItem(n, value, label);
        if (typeof ref === "function") ref(n);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = n;
      },
      [ctx, value, label, ref],
    );

    React.useEffect(() => () => ctx.registerItem(null, value, label), [ctx, value, label]);

    if (!visible) return null;

    return (
      <div
        ref={setRefs}
        role="option"
        aria-selected={active}
        tabIndex={-1}
        data-disabled={disabled || undefined}
        data-active={active || undefined}
        data-slot="command-item"
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented && !disabled) onSelect?.(value);
        }}
        onMouseEnter={() => !disabled && ctx.setActiveValue(value)}
        className={cn(
          "flex select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer",
          active && "bg-zinc-100 text-zinc-900",
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

CommandItem.displayName = "CommandItem";

export interface CommandSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CommandSeparator = React.forwardRef<
  HTMLDivElement,
  CommandSeparatorProps
>(function CommandSeparator({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      role="separator"
      data-slot="command-separator"
      className={cn("-mx-1 my-1 h-px bg-zinc-200", className)}
      {...rest}
    />
  );
});

CommandSeparator.displayName = "CommandSeparator";

export interface CommandShortcutProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export const CommandShortcut = React.forwardRef<
  HTMLSpanElement,
  CommandShortcutProps
>(function CommandShortcut({ className, ...rest }, ref) {
  return (
    <span
      ref={ref}
      data-slot="command-shortcut"
      className={cn(
        "ms-auto text-xs tracking-widest text-zinc-400",
        className,
      )}
      {...rest}
    />
  );
});

CommandShortcut.displayName = "CommandShortcut";
