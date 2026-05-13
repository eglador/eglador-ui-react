"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { ChevronRightIcon } from "../../lib/icons";

export type TreeViewSize = "xs" | "sm" | "md" | "lg" | "xl";

interface TreeViewContextValue {
  expanded: Set<string>;
  toggle: (id: string) => void;
  selected: Set<string>;
  select: (id: string, e?: React.MouseEvent | React.KeyboardEvent) => void;
  size: TreeViewSize;
  indentGuides: boolean;
  selectable: boolean;
  multiSelect: boolean;
  disabled: boolean;
  registerExpandable: (id: string) => void;
}

const TreeViewContext = React.createContext<TreeViewContextValue | null>(null);

function useTreeView() {
  const ctx = React.useContext(TreeViewContext);
  if (!ctx) throw new Error("Tree subcomponents must be used within <TreeView>");
  return ctx;
}

const SIZES: Record<
  TreeViewSize,
  { font: string; row: string; icon: string }
> = {
  xs: { font: "text-xs", row: "h-6 px-1.5 gap-1", icon: "size-3" },
  sm: { font: "text-sm", row: "h-7 px-2 gap-1.5", icon: "size-3.5" },
  md: { font: "text-sm", row: "h-8 px-2.5 gap-2", icon: "size-4" },
  lg: { font: "text-base", row: "h-9 px-3 gap-2", icon: "size-5" },
  xl: { font: "text-lg", row: "h-11 px-3.5 gap-2.5", icon: "size-6" },
};

export interface TreeViewProps extends React.HTMLAttributes<HTMLUListElement> {
  defaultExpanded?: string[];
  expanded?: string[];
  onExpandedChange?: (expanded: string[]) => void;
  defaultExpandAll?: boolean;
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (selected: string[]) => void;
  selectable?: boolean;
  multiSelect?: boolean;
  disabled?: boolean;
  size?: TreeViewSize;
  indentGuides?: boolean;
}

export const TreeView = React.forwardRef<HTMLUListElement, TreeViewProps>(
  function TreeView(
    {
      defaultExpanded = [],
      expanded: controlled,
      onExpandedChange,
      defaultExpandAll = false,
      selected: controlledSelected,
      defaultSelected = [],
      onSelectedChange,
      selectable = true,
      multiSelect = false,
      disabled = false,
      size = "sm",
      indentGuides = true,
      className,
      ...rest
    },
    ref,
  ) {
    const expandableIdsRef = React.useRef<Set<string>>(new Set());
    const hasInitializedExpandAllRef = React.useRef(false);

    const [internalExpanded, setInternalExpanded] = React.useState<Set<string>>(
      () => new Set(defaultExpanded),
    );
    const isControlled = controlled !== undefined;
    const expanded = isControlled ? new Set(controlled) : internalExpanded;

    const registerExpandable = React.useCallback((id: string) => {
      expandableIdsRef.current.add(id);
      if (defaultExpandAll && !hasInitializedExpandAllRef.current) {
        Promise.resolve().then(() => {
          if (hasInitializedExpandAllRef.current) return;
          hasInitializedExpandAllRef.current = true;
          if (!isControlled) {
            setInternalExpanded(new Set(expandableIdsRef.current));
          }
          onExpandedChange?.(Array.from(expandableIdsRef.current));
        });
      }
    }, [defaultExpandAll, isControlled, onExpandedChange]);

    const [internalSelected, setInternalSelected] = React.useState<Set<string>>(
      () => new Set(defaultSelected),
    );
    const isSelectedControlled = controlledSelected !== undefined;
    const selected = isSelectedControlled
      ? new Set(controlledSelected)
      : internalSelected;

    const toggle = React.useCallback(
      (id: string) => {
        const next = new Set(isControlled ? controlled : internalExpanded);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        if (!isControlled) setInternalExpanded(next);
        onExpandedChange?.(Array.from(next));
      },
      [isControlled, controlled, internalExpanded, onExpandedChange],
    );

    const select = React.useCallback(
      (id: string, e?: React.MouseEvent | React.KeyboardEvent) => {
        if (!selectable || disabled) return;
        const current = new Set(
          isSelectedControlled ? controlledSelected : internalSelected,
        );
        let next: Set<string>;
        const isModifier =
          !!e && (("metaKey" in e && e.metaKey) || ("ctrlKey" in e && e.ctrlKey));

        if (multiSelect && isModifier) {
          next = new Set(current);
          if (next.has(id)) next.delete(id);
          else next.add(id);
        } else if (multiSelect) {
          next = new Set([id]);
        } else {
          next = new Set([id]);
        }

        if (!isSelectedControlled) setInternalSelected(next);
        onSelectedChange?.(Array.from(next));
      },
      [
        selectable,
        disabled,
        multiSelect,
        isSelectedControlled,
        controlledSelected,
        internalSelected,
        onSelectedChange,
      ],
    );

    return (
      <TreeViewContext.Provider
        value={{
          expanded,
          toggle,
          selected,
          select,
          size,
          indentGuides,
          selectable,
          multiSelect,
          disabled,
          registerExpandable,
        }}
      >
        <ul
          ref={ref}
          role="tree"
          aria-multiselectable={multiSelect || undefined}
          data-slot="tree-view"
          data-disabled={disabled || undefined}
          className={cn(
            "flex flex-col",
            disabled && "opacity-50 pointer-events-none",
            className,
          )}
          {...rest}
        />
      </TreeViewContext.Provider>
    );
  },
);

TreeView.displayName = "TreeView";

export interface TreeItemProps
  extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "id"> {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  level?: number;
}

export const TreeItem = React.forwardRef<HTMLLIElement, TreeItemProps>(
  function TreeItem(
    {
      id,
      label,
      icon,
      level = 0,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const ctx = useTreeView();
    const s = SIZES[ctx.size];
    const hasChildren = !!children;
    const isExpanded = ctx.expanded.has(id);
    const isSelected = ctx.selected.has(id);

    React.useEffect(() => {
      if (hasChildren) ctx.registerExpandable(id);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, hasChildren]);

    const padStart = level * 16;

    const handleSelect = (e: React.MouseEvent | React.KeyboardEvent) => {
      if (ctx.selectable) ctx.select(id, e);
      if (hasChildren) ctx.toggle(id);
    };

    return (
      <li
        ref={ref}
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={ctx.selectable ? isSelected : undefined}
        data-slot="tree-item"
        data-state={isExpanded ? "expanded" : "collapsed"}
        data-selected={isSelected || undefined}
        className={cn("list-none", className)}
        {...rest}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => handleSelect(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleSelect(e);
            } else if (e.key === "ArrowRight" && hasChildren && !isExpanded) {
              e.preventDefault();
              ctx.toggle(id);
            } else if (e.key === "ArrowLeft" && hasChildren && isExpanded) {
              e.preventDefault();
              ctx.toggle(id);
            }
          }}
          style={{ paddingInlineStart: padStart + 8 }}
          className={cn(
            "flex w-full items-center rounded-sm transition-colors outline-none",
            ctx.disabled ? "cursor-not-allowed" : "cursor-pointer",
            "hover:bg-zinc-100 focus-visible:bg-zinc-100",
            isSelected && "bg-zinc-100 text-zinc-900 font-medium",
            s.row,
            s.font,
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "inline-flex items-center justify-center text-zinc-500 transition-transform shrink-0",
              s.icon,
              hasChildren && isExpanded && "rotate-90",
              !hasChildren && "invisible",
            )}
          >
            <ChevronRightIcon />
          </span>
          {icon && (
            <span
              aria-hidden="true"
              className={cn(
                "inline-flex items-center justify-center shrink-0 text-zinc-500 [&>svg]:w-full [&>svg]:h-full",
                s.icon,
              )}
            >
              {icon}
            </span>
          )}
          <span className="truncate">{label}</span>
        </div>
        {hasChildren && isExpanded && (
          <ul
            role="group"
            className={cn(
              ctx.indentGuides && "relative",
            )}
          >
            {ctx.indentGuides && (
              <span
                aria-hidden="true"
                className="absolute top-0 bottom-0 w-px bg-zinc-200"
                style={{ insetInlineStart: padStart + 18 }}
              />
            )}
            {React.Children.map(children, (child) => {
              if (React.isValidElement<TreeItemProps>(child)) {
                return React.cloneElement(child, { level: level + 1 });
              }
              return child;
            })}
          </ul>
        )}
      </li>
    );
  },
);

TreeItem.displayName = "TreeItem";
