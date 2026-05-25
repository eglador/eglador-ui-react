"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  SearchIcon,
} from "../../lib/icons";

export type TransferListSize = "xs" | "sm" | "md" | "lg" | "xl";
export type TransferListVariant = "outline" | "soft" | "ghost";
export type TransferListShape = "square" | "rounded" | "pill";
export type TransferListSide = "source" | "target";

export interface TransferListOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SidePresence {
  hasSearch: boolean;
  hasFooter: boolean;
}

interface TransferListContextValue {
  options: TransferListOption[];
  optionsById: Map<string, TransferListOption>;
  sourceIds: string[];
  targetIds: string[];
  filteredSourceIds: string[];
  filteredTargetIds: string[];
  checkedSource: Set<string>;
  checkedTarget: Set<string>;
  toggleCheck: (side: TransferListSide, id: string) => void;
  setRangeCheck: (
    side: TransferListSide,
    anchorIdx: number,
    targetIdx: number,
    value: boolean,
  ) => void;
  selectAll: (side: TransferListSide, value: boolean) => void;
  filter: Record<TransferListSide, string>;
  setFilter: (side: TransferListSide, value: string) => void;
  moveSelectedToTarget: () => void;
  moveSelectedToSource: () => void;
  moveAllToTarget: () => void;
  moveAllToSource: () => void;
  moveItemUp: (id: string) => void;
  moveItemDown: (id: string) => void;
  canMoveSelectedToTarget: boolean;
  canMoveSelectedToSource: boolean;
  canMoveAllToTarget: boolean;
  canMoveAllToSource: boolean;
  size: TransferListSize;
  variant: TransferListVariant;
  shape: TransferListShape;
  disabled: boolean;
  searchable: boolean;
  reorderable: boolean;
  baseId: string;
  registerSide: (side: TransferListSide, presence: Partial<SidePresence>) => void;
  presence: Record<TransferListSide, SidePresence>;
  anchorRef: React.MutableRefObject<Record<TransferListSide, number | null>>;
  renderItem?: (option: TransferListOption, ctx: { side: TransferListSide; checked: boolean; disabled: boolean }) => React.ReactNode;
}

const TransferListContext = React.createContext<TransferListContextValue | null>(null);

function useTransferList() {
  const ctx = React.useContext(TransferListContext);
  if (!ctx) throw new Error("TransferList subcomponents must be used within <TransferList>");
  return ctx;
}

function useColumn() {
  const ctx = React.useContext(ColumnContext);
  if (!ctx) throw new Error("This subcomponent must be used within <TransferList.Column>");
  return ctx;
}

const ColumnContext = React.createContext<{ side: TransferListSide } | null>(null);

const SIZES: Record<
  TransferListSize,
  {
    font: string;
    row: string;
    icon: string;
    iconBtn: string;
    headerFont: string;
    pad: string;
    columnMinH: string;
    countFont: string;
    inputH: string;
  }
> = {
  xs: {
    font: "text-xs",
    row: "h-7 px-2 gap-1.5",
    icon: "size-3",
    iconBtn: "size-6",
    headerFont: "text-xs",
    pad: "p-1",
    columnMinH: "min-h-40",
    countFont: "text-[10px]",
    inputH: "h-7",
  },
  sm: {
    font: "text-xs",
    row: "h-8 px-2 gap-2",
    icon: "size-3.5",
    iconBtn: "size-7",
    headerFont: "text-sm",
    pad: "p-1.5",
    columnMinH: "min-h-48",
    countFont: "text-xs",
    inputH: "h-8",
  },
  md: {
    font: "text-sm",
    row: "h-9 px-2.5 gap-2",
    icon: "size-4",
    iconBtn: "size-8",
    headerFont: "text-sm",
    pad: "p-2",
    columnMinH: "min-h-56",
    countFont: "text-xs",
    inputH: "h-9",
  },
  lg: {
    font: "text-base",
    row: "h-10 px-3 gap-2.5",
    icon: "size-4",
    iconBtn: "size-9",
    headerFont: "text-base",
    pad: "p-2.5",
    columnMinH: "min-h-64",
    countFont: "text-sm",
    inputH: "h-10",
  },
  xl: {
    font: "text-base",
    row: "h-11 px-3 gap-3",
    icon: "size-5",
    iconBtn: "size-10",
    headerFont: "text-lg",
    pad: "p-3",
    columnMinH: "min-h-72",
    countFont: "text-sm",
    inputH: "h-11",
  },
};

const SHAPES: Record<TransferListShape, string> = {
  square: "rounded-none",
  rounded: "rounded-md",
  pill: "rounded-xl",
};

const VARIANTS: Record<TransferListVariant, string> = {
  outline: "border border-zinc-300 bg-white",
  soft: "border border-transparent bg-zinc-100",
  ghost: "border border-transparent bg-transparent",
};

export interface TransferListProps {
  options: TransferListOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  size?: TransferListSize;
  variant?: TransferListVariant;
  shape?: TransferListShape;
  disabled?: boolean;
  searchable?: boolean;
  reorderable?: boolean;
  renderItem?: TransferListContextValue["renderItem"];
  className?: string;
  children?: React.ReactNode;
  "aria-label"?: string;
}

export function TransferList({
  options,
  value: controlled,
  defaultValue = [],
  onValueChange,
  size = "md",
  variant = "outline",
  shape = "rounded",
  disabled = false,
  searchable = false,
  reorderable = false,
  renderItem,
  className,
  children,
  "aria-label": ariaLabel = "Transfer list",
}: TransferListProps) {
  const baseId = React.useId();
  const isControlled = controlled !== undefined;
  const [internal, setInternal] = React.useState<string[]>(defaultValue);
  const targetIds = isControlled ? controlled : internal;
  const targetSet = React.useMemo(() => new Set(targetIds), [targetIds]);

  const optionsById = React.useMemo(
    () => new Map(options.map((o) => [o.value, o])),
    [options],
  );

  const sourceIds = React.useMemo(
    () => options.filter((o) => !targetSet.has(o.value)).map((o) => o.value),
    [options, targetSet],
  );

  const [checkedSource, setCheckedSource] = React.useState<Set<string>>(new Set());
  const [checkedTarget, setCheckedTarget] = React.useState<Set<string>>(new Set());
  const [filter, setFilterState] = React.useState<Record<TransferListSide, string>>({
    source: "",
    target: "",
  });
  const [presence, setPresence] = React.useState<Record<TransferListSide, SidePresence>>({
    source: { hasSearch: false, hasFooter: false },
    target: { hasSearch: false, hasFooter: false },
  });

  const anchorRef = React.useRef<Record<TransferListSide, number | null>>({
    source: null,
    target: null,
  });

  const registerSide = React.useCallback(
    (side: TransferListSide, p: Partial<SidePresence>) => {
      setPresence((prev) => {
        const cur = prev[side];
        const next = { ...cur, ...p };
        if (next.hasSearch === cur.hasSearch && next.hasFooter === cur.hasFooter) return prev;
        return { ...prev, [side]: next };
      });
    },
    [],
  );

  React.useEffect(() => {
    setCheckedSource((prev) => {
      const next = new Set<string>();
      for (const id of prev) if (!targetSet.has(id) && optionsById.has(id)) next.add(id);
      return next.size === prev.size ? prev : next;
    });
    setCheckedTarget((prev) => {
      const next = new Set<string>();
      for (const id of prev) if (targetSet.has(id) && optionsById.has(id)) next.add(id);
      return next.size === prev.size ? prev : next;
    });
  }, [targetSet, optionsById]);

  const setValues = React.useCallback(
    (next: string[]) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const setFilter = React.useCallback((side: TransferListSide, v: string) => {
    setFilterState((p) => ({ ...p, [side]: v }));
  }, []);

  const filterIds = React.useCallback(
    (ids: string[], q: string) => {
      if (!q.trim()) return ids;
      const needle = q.toLowerCase();
      return ids.filter((id) => {
        const o = optionsById.get(id);
        return o ? o.label.toLowerCase().includes(needle) : false;
      });
    },
    [optionsById],
  );

  const filteredSourceIds = React.useMemo(
    () => filterIds(sourceIds, filter.source),
    [filterIds, sourceIds, filter.source],
  );
  const filteredTargetIds = React.useMemo(
    () => filterIds(targetIds, filter.target),
    [filterIds, targetIds, filter.target],
  );

  const toggleCheck = React.useCallback(
    (side: TransferListSide, id: string) => {
      const o = optionsById.get(id);
      if (!o || o.disabled || disabled) return;
      const setter = side === "source" ? setCheckedSource : setCheckedTarget;
      setter((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    [optionsById, disabled],
  );

  const setRangeCheck = React.useCallback(
    (side: TransferListSide, anchorIdx: number, targetIdx: number, value: boolean) => {
      if (disabled) return;
      const ids = side === "source" ? filteredSourceIds : filteredTargetIds;
      const setter = side === "source" ? setCheckedSource : setCheckedTarget;
      const [from, to] = anchorIdx <= targetIdx ? [anchorIdx, targetIdx] : [targetIdx, anchorIdx];
      setter((prev) => {
        const next = new Set(prev);
        for (let i = from; i <= to; i++) {
          const id = ids[i];
          if (!id) continue;
          const o = optionsById.get(id);
          if (!o || o.disabled) continue;
          if (value) next.add(id);
          else next.delete(id);
        }
        return next;
      });
    },
    [disabled, filteredSourceIds, filteredTargetIds, optionsById],
  );

  const selectAll = React.useCallback(
    (side: TransferListSide, value: boolean) => {
      if (disabled) return;
      const ids = side === "source" ? filteredSourceIds : filteredTargetIds;
      const setter = side === "source" ? setCheckedSource : setCheckedTarget;
      setter((prev) => {
        const next = new Set(prev);
        for (const id of ids) {
          const o = optionsById.get(id);
          if (!o || o.disabled) continue;
          if (value) next.add(id);
          else next.delete(id);
        }
        return next;
      });
    },
    [disabled, filteredSourceIds, filteredTargetIds, optionsById],
  );

  const isTransferable = React.useCallback(
    (id: string) => {
      const o = optionsById.get(id);
      return !!o && !o.disabled;
    },
    [optionsById],
  );

  const moveSelectedToTarget = React.useCallback(() => {
    if (disabled) return;
    const moving = filteredSourceIds.filter((id) => checkedSource.has(id) && isTransferable(id));
    if (moving.length === 0) return;
    setValues([...targetIds, ...moving]);
    setCheckedSource((prev) => {
      const next = new Set(prev);
      for (const id of moving) next.delete(id);
      return next;
    });
  }, [disabled, filteredSourceIds, checkedSource, isTransferable, targetIds, setValues]);

  const moveSelectedToSource = React.useCallback(() => {
    if (disabled) return;
    const moving = new Set(
      filteredTargetIds.filter((id) => checkedTarget.has(id) && isTransferable(id)),
    );
    if (moving.size === 0) return;
    setValues(targetIds.filter((id) => !moving.has(id)));
    setCheckedTarget((prev) => {
      const next = new Set(prev);
      for (const id of moving) next.delete(id);
      return next;
    });
  }, [disabled, filteredTargetIds, checkedTarget, isTransferable, targetIds, setValues]);

  const moveAllToTarget = React.useCallback(() => {
    if (disabled) return;
    const moving = filteredSourceIds.filter(isTransferable);
    if (moving.length === 0) return;
    setValues([...targetIds, ...moving]);
    setCheckedSource(new Set());
  }, [disabled, filteredSourceIds, isTransferable, targetIds, setValues]);

  const moveAllToSource = React.useCallback(() => {
    if (disabled) return;
    const movingSet = new Set(filteredTargetIds.filter(isTransferable));
    if (movingSet.size === 0) return;
    setValues(targetIds.filter((id) => !movingSet.has(id)));
    setCheckedTarget(new Set());
  }, [disabled, filteredTargetIds, isTransferable, targetIds, setValues]);

  const moveItemUp = React.useCallback(
    (id: string) => {
      if (disabled || !reorderable) return;
      const idx = targetIds.indexOf(id);
      if (idx <= 0) return;
      const next = targetIds.slice();
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      setValues(next);
    },
    [disabled, reorderable, targetIds, setValues],
  );

  const moveItemDown = React.useCallback(
    (id: string) => {
      if (disabled || !reorderable) return;
      const idx = targetIds.indexOf(id);
      if (idx < 0 || idx >= targetIds.length - 1) return;
      const next = targetIds.slice();
      [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
      setValues(next);
    },
    [disabled, reorderable, targetIds, setValues],
  );

  const canMoveSelectedToTarget = !disabled && filteredSourceIds.some(
    (id) => checkedSource.has(id) && isTransferable(id),
  );
  const canMoveSelectedToSource = !disabled && filteredTargetIds.some(
    (id) => checkedTarget.has(id) && isTransferable(id),
  );
  const canMoveAllToTarget = !disabled && filteredSourceIds.some(isTransferable);
  const canMoveAllToSource = !disabled && filteredTargetIds.some(isTransferable);

  const ctx: TransferListContextValue = {
    options,
    optionsById,
    sourceIds,
    targetIds,
    filteredSourceIds,
    filteredTargetIds,
    checkedSource,
    checkedTarget,
    toggleCheck,
    setRangeCheck,
    selectAll,
    filter,
    setFilter,
    moveSelectedToTarget,
    moveSelectedToSource,
    moveAllToTarget,
    moveAllToSource,
    moveItemUp,
    moveItemDown,
    canMoveSelectedToTarget,
    canMoveSelectedToSource,
    canMoveAllToTarget,
    canMoveAllToSource,
    size,
    variant,
    shape,
    disabled,
    searchable,
    reorderable,
    baseId,
    registerSide,
    presence,
    anchorRef,
    renderItem,
  };

  const hasChildren = React.Children.count(children) > 0;

  return (
    <TransferListContext.Provider value={ctx}>
      <div
        role="group"
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        data-slot="transfer-list"
        data-disabled={disabled || undefined}
        className={cn(
          "flex w-full flex-col items-stretch gap-3 md:flex-row",
          disabled && "opacity-50",
          className,
        )}
      >
        {hasChildren ? children : (
          <>
            <TransferListColumn side="source">
              {searchable && <TransferListSearch />}
              <TransferListItems />
            </TransferListColumn>
            <TransferListControls />
            <TransferListColumn side="target">
              {searchable && <TransferListSearch />}
              <TransferListItems />
            </TransferListColumn>
          </>
        )}
      </div>
    </TransferListContext.Provider>
  );
}
TransferList.displayName = "TransferList";

export interface TransferListColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  side: TransferListSide;
}

export function TransferListColumn({
  side,
  className,
  children,
  ...rest
}: TransferListColumnProps) {
  const { size, variant, shape } = useTransferList();
  const s = SIZES[size];
  return (
    <ColumnContext.Provider value={{ side }}>
      <div
        data-slot="transfer-list-column"
        data-side={side}
        className={cn(
          "flex w-full min-w-0 flex-col overflow-hidden md:w-auto md:flex-1",
          s.columnMinH,
          SHAPES[shape],
          VARIANTS[variant],
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    </ColumnContext.Provider>
  );
}
TransferListColumn.displayName = "TransferListColumn";

export interface TransferListHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TransferListHeader({
  className,
  children,
  ...rest
}: TransferListHeaderProps) {
  const { size } = useTransferList();
  const s = SIZES[size];
  return (
    <div
      data-slot="transfer-list-header"
      className={cn(
        "flex items-center justify-between gap-2 border-b border-zinc-200 bg-zinc-50/50 px-2.5",
        s.font,
        s.inputH,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
TransferListHeader.displayName = "TransferListHeader";

export interface TransferListTitleProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function TransferListTitle({
  className,
  children,
  ...rest
}: TransferListTitleProps) {
  const { size } = useTransferList();
  const s = SIZES[size];
  return (
    <span
      data-slot="transfer-list-title"
      className={cn("font-medium text-zinc-900", s.headerFont, className)}
      {...rest}
    >
      {children}
    </span>
  );
}
TransferListTitle.displayName = "TransferListTitle";

export interface TransferListCountProps extends React.HTMLAttributes<HTMLSpanElement> {
  format?: (selected: number, total: number) => React.ReactNode;
}

export function TransferListCount({
  className,
  format,
  ...rest
}: TransferListCountProps) {
  const ctx = useTransferList();
  const { side } = useColumn();
  const s = SIZES[ctx.size];
  const ids = side === "source" ? ctx.filteredSourceIds : ctx.filteredTargetIds;
  const checked = side === "source" ? ctx.checkedSource : ctx.checkedTarget;
  const selected = ids.reduce((acc, id) => acc + (checked.has(id) ? 1 : 0), 0);
  const total = ids.length;
  return (
    <span
      data-slot="transfer-list-count"
      className={cn(
        "inline-flex items-center rounded-full bg-zinc-200 px-2 py-0.5 font-medium text-zinc-700 tabular-nums",
        s.countFont,
        className,
      )}
      {...rest}
    >
      {format ? format(selected, total) : `${selected}/${total}`}
    </span>
  );
}
TransferListCount.displayName = "TransferListCount";

export interface TransferListSearchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  placeholder?: string;
}

export function TransferListSearch({
  className,
  placeholder = "Search…",
  ...rest
}: TransferListSearchProps) {
  const ctx = useTransferList();
  const { side } = useColumn();
  const s = SIZES[ctx.size];

  React.useEffect(() => {
    ctx.registerSide(side, { hasSearch: true });
    return () => ctx.registerSide(side, { hasSearch: false });
  }, [ctx, side]);

  return (
    <div
      data-slot="transfer-list-search"
      className={cn(
        "flex items-center gap-2 border-b border-zinc-200 px-2.5 text-zinc-500",
        s.inputH,
        className,
      )}
    >
      <SearchIcon className={cn("shrink-0", s.icon)} />
      <input
        type="text"
        role="searchbox"
        value={ctx.filter[side]}
        onChange={(e) => ctx.setFilter(side, e.target.value)}
        disabled={ctx.disabled}
        placeholder={placeholder}
        className={cn(
          "w-full bg-transparent text-zinc-900 outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed",
          s.font,
        )}
        {...rest}
      />
    </div>
  );
}
TransferListSearch.displayName = "TransferListSearch";

export interface TransferListItemsProps extends React.HTMLAttributes<HTMLDivElement> {
  emptyMessage?: React.ReactNode;
}

export function TransferListItems({
  className,
  emptyMessage = "No items",
  ...rest
}: TransferListItemsProps) {
  const ctx = useTransferList();
  const { side } = useColumn();
  const s = SIZES[ctx.size];
  const ids = side === "source" ? ctx.filteredSourceIds : ctx.filteredTargetIds;
  const checked = side === "source" ? ctx.checkedSource : ctx.checkedTarget;
  const [focusIdx, setFocusIdx] = React.useState(0);
  const listRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (focusIdx >= ids.length) setFocusIdx(Math.max(0, ids.length - 1));
  }, [ids.length, focusIdx]);

  const focusItem = (idx: number) => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-slot="transfer-list-item"][data-index="${idx}"]`,
    );
    el?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (ctx.disabled || ids.length === 0) return;
    const cur = focusIdx;
    let next = cur;
    if (e.key === "ArrowDown") {
      next = Math.min(ids.length - 1, cur + 1);
    } else if (e.key === "ArrowUp") {
      next = Math.max(0, cur - 1);
    } else if (e.key === "Home") {
      next = 0;
    } else if (e.key === "End") {
      next = ids.length - 1;
    } else if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      const id = ids[cur];
      if (id) {
        if (e.shiftKey && ctx.anchorRef.current[side] !== null) {
          const a = ctx.anchorRef.current[side]!;
          const target = !checked.has(id);
          ctx.setRangeCheck(side, a, cur, target);
        } else {
          ctx.toggleCheck(side, id);
          ctx.anchorRef.current[side] = cur;
        }
      }
      return;
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (side === "source") ctx.moveSelectedToTarget();
      else ctx.moveSelectedToSource();
      return;
    } else {
      return;
    }
    e.preventDefault();
    setFocusIdx(next);
    focusItem(next);
  };

  return (
    <div
      ref={listRef}
      role="listbox"
      aria-multiselectable="true"
      aria-orientation="vertical"
      aria-disabled={ctx.disabled || undefined}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      data-slot="transfer-list-items"
      data-side={side}
      className={cn(
        "flex-1 overflow-y-auto outline-none",
        s.pad,
        className,
      )}
      {...rest}
    >
      {ids.length === 0 ? (
        <div
          role="presentation"
          className={cn(
            "flex h-full min-h-24 items-center justify-center text-center text-zinc-500",
            s.font,
          )}
        >
          {emptyMessage}
        </div>
      ) : (
        ids.map((id, idx) => {
          const opt = ctx.optionsById.get(id);
          if (!opt) return null;
          return (
            <TransferListItem
              key={id}
              option={opt}
              side={side}
              index={idx}
              tabIndex={idx === focusIdx ? 0 : -1}
              onFocus={() => setFocusIdx(idx)}
            />
          );
        })
      )}
    </div>
  );
}
TransferListItems.displayName = "TransferListItems";

interface TransferListItemProps {
  option: TransferListOption;
  side: TransferListSide;
  index: number;
  tabIndex: number;
  onFocus: () => void;
}

function TransferListItem({
  option,
  side,
  index,
  tabIndex,
  onFocus,
}: TransferListItemProps) {
  const ctx = useTransferList();
  const s = SIZES[ctx.size];
  const checkedSet = side === "source" ? ctx.checkedSource : ctx.checkedTarget;
  const isChecked = checkedSet.has(option.value);
  const isDisabled = !!option.disabled || ctx.disabled;

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDisabled) return;
    if (e.shiftKey && ctx.anchorRef.current[side] !== null) {
      const a = ctx.anchorRef.current[side]!;
      ctx.setRangeCheck(side, a, index, !isChecked);
    } else {
      ctx.toggleCheck(side, option.value);
      ctx.anchorRef.current[side] = index;
    }
  };

  const onDoubleClick = () => {
    if (isDisabled) return;
    const id = option.value;
    if (side === "source") {
      ctx.toggleCheck("source", id);
      ctx.moveSelectedToTarget();
    } else {
      ctx.toggleCheck("target", id);
      ctx.moveSelectedToSource();
    }
  };

  const canReorder = ctx.reorderable && side === "target" && !isDisabled;

  if (ctx.renderItem) {
    return (
      <div
        role="option"
        aria-selected={isChecked}
        aria-disabled={isDisabled || undefined}
        data-slot="transfer-list-item"
        data-side={side}
        data-index={index}
        data-state={isChecked ? "checked" : "unchecked"}
        data-disabled={isDisabled || undefined}
        tabIndex={tabIndex}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onFocus={onFocus}
        className="outline-none"
      >
        {ctx.renderItem(option, { side, checked: isChecked, disabled: isDisabled })}
      </div>
    );
  }

  return (
    <div
      role="option"
      aria-selected={isChecked}
      aria-disabled={isDisabled || undefined}
      data-slot="transfer-list-item"
      data-side={side}
      data-index={index}
      data-state={isChecked ? "checked" : "unchecked"}
      data-disabled={isDisabled || undefined}
      tabIndex={tabIndex}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onFocus={onFocus}
      className={cn(
        "group relative flex select-none items-center rounded-sm text-zinc-800 outline-none",
        "hover:bg-zinc-100 focus-visible:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-900/10",
        s.row,
        s.font,
        isDisabled && "pointer-events-none opacity-50",
        isChecked && "bg-zinc-100",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-sm border transition-colors",
          "size-4",
          isChecked
            ? "border-zinc-900 bg-zinc-900 text-white"
            : "border-zinc-300 bg-white",
        )}
      >
        {isChecked && <CheckIcon className="size-3" />}
      </span>
      <span className="min-w-0 flex-1 truncate">{option.label}</span>
      {canReorder && (
        <span className="ms-auto inline-flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            type="button"
            aria-label={`Move ${option.label} up`}
            disabled={ctx.targetIds.indexOf(option.value) === 0}
            onClick={(e) => {
              e.stopPropagation();
              ctx.moveItemUp(option.value);
            }}
            className={cn(
              "inline-flex items-center justify-center rounded-sm text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 disabled:opacity-40 disabled:hover:bg-transparent",
              "size-6",
            )}
          >
            <ChevronUpIcon className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label={`Move ${option.label} down`}
            disabled={ctx.targetIds.indexOf(option.value) === ctx.targetIds.length - 1}
            onClick={(e) => {
              e.stopPropagation();
              ctx.moveItemDown(option.value);
            }}
            className={cn(
              "inline-flex items-center justify-center rounded-sm text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 disabled:opacity-40 disabled:hover:bg-transparent",
              "size-6",
            )}
          >
            <ChevronDownIcon className="size-3.5" />
          </button>
        </span>
      )}
    </div>
  );
}

export interface TransferListControlsProps extends React.HTMLAttributes<HTMLDivElement> {
  showAll?: boolean;
  labels?: {
    moveAllToTarget?: string;
    moveSelectedToTarget?: string;
    moveSelectedToSource?: string;
    moveAllToSource?: string;
  };
}

export function TransferListControls({
  showAll = true,
  labels,
  className,
  ...rest
}: TransferListControlsProps) {
  const ctx = useTransferList();
  const s = SIZES[ctx.size];
  const btn = cn(
    "inline-flex items-center justify-center border border-zinc-300 bg-white text-zinc-700 transition-colors",
    "hover:bg-zinc-50 hover:text-zinc-900",
    "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-zinc-700",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10",
    SHAPES[ctx.shape],
    s.iconBtn,
  );

  const arrowCls = cn(s.icon, "rotate-90 md:rotate-0");

  return (
    <div
      role="group"
      aria-label="Transfer controls"
      data-slot="transfer-list-controls"
      className={cn(
        "flex flex-row items-center justify-center gap-1.5 self-stretch md:flex-col md:self-center",
        className,
      )}
      {...rest}
    >
      {showAll && (
        <button
          type="button"
          aria-label={labels?.moveAllToTarget ?? "Move all to selected"}
          disabled={!ctx.canMoveAllToTarget}
          onClick={ctx.moveAllToTarget}
          className={btn}
        >
          <ChevronsRightIcon className={arrowCls} />
        </button>
      )}
      <button
        type="button"
        aria-label={labels?.moveSelectedToTarget ?? "Move selected to selected"}
        disabled={!ctx.canMoveSelectedToTarget}
        onClick={ctx.moveSelectedToTarget}
        className={btn}
      >
        <ChevronRightIcon className={arrowCls} />
      </button>
      <button
        type="button"
        aria-label={labels?.moveSelectedToSource ?? "Move selected to available"}
        disabled={!ctx.canMoveSelectedToSource}
        onClick={ctx.moveSelectedToSource}
        className={btn}
      >
        <ChevronLeftIcon className={arrowCls} />
      </button>
      {showAll && (
        <button
          type="button"
          aria-label={labels?.moveAllToSource ?? "Move all to available"}
          disabled={!ctx.canMoveAllToSource}
          onClick={ctx.moveAllToSource}
          className={btn}
        >
          <ChevronsLeftIcon className={arrowCls} />
        </button>
      )}
    </div>
  );
}
TransferListControls.displayName = "TransferListControls";

export interface TransferListFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TransferListFooter({
  className,
  children,
  ...rest
}: TransferListFooterProps) {
  const { size } = useTransferList();
  const { side } = useColumn();
  const ctx = useTransferList();
  const s = SIZES[size];

  React.useEffect(() => {
    ctx.registerSide(side, { hasFooter: true });
    return () => ctx.registerSide(side, { hasFooter: false });
  }, [ctx, side]);

  return (
    <div
      data-slot="transfer-list-footer"
      className={cn(
        "flex items-center justify-between gap-2 border-t border-zinc-200 bg-zinc-50/50 px-2.5",
        s.font,
        s.inputH,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
TransferListFooter.displayName = "TransferListFooter";

export interface TransferListSelectAllProps
  extends React.HTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
}

export function TransferListSelectAll({
  className,
  children = "Select all",
  ...rest
}: TransferListSelectAllProps) {
  const ctx = useTransferList();
  const { side } = useColumn();
  const s = SIZES[ctx.size];
  const ids = side === "source" ? ctx.filteredSourceIds : ctx.filteredTargetIds;
  const checked = side === "source" ? ctx.checkedSource : ctx.checkedTarget;

  const transferableIds = ids.filter((id) => !ctx.optionsById.get(id)?.disabled);
  const selectedCount = transferableIds.reduce(
    (acc, id) => acc + (checked.has(id) ? 1 : 0),
    0,
  );
  const total = transferableIds.length;
  const allSelected = total > 0 && selectedCount === total;
  const someSelected = selectedCount > 0 && selectedCount < total;

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = someSelected;
  }, [someSelected]);

  const onChange = () => {
    ctx.selectAll(side, !allSelected);
  };

  const isDisabled = ctx.disabled || total === 0;

  return (
    <label
      data-slot="transfer-list-select-all"
      data-state={allSelected ? "checked" : someSelected ? "indeterminate" : "unchecked"}
      data-disabled={isDisabled || undefined}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 text-zinc-700",
        s.font,
        isDisabled && "pointer-events-none opacity-50",
        className,
      )}
      {...rest}
    >
      <input
        ref={inputRef}
        type="checkbox"
        className="sr-only"
        checked={allSelected}
        disabled={isDisabled}
        onChange={onChange}
      />
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-sm border transition-colors",
          "size-4",
          allSelected || someSelected
            ? "border-zinc-900 bg-zinc-900 text-white"
            : "border-zinc-300 bg-white",
        )}
      >
        {allSelected && <CheckIcon className="size-3" />}
        {someSelected && !allSelected && (
          <span className="size-2 rounded-[1px] bg-white" />
        )}
      </span>
      <span>{children}</span>
    </label>
  );
}
TransferListSelectAll.displayName = "TransferListSelectAll";
