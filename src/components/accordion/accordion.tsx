"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { ChevronDownIcon, PlusIcon, MinusIcon } from "../../lib/icons";

export type AccordionType = "single" | "multiple";
export type AccordionVariant = "underline" | "outline" | "soft";
export type AccordionSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AccordionShape = "square" | "rounded";
export type AccordionIconPosition = "start" | "end";
export type AccordionIndicator = "chevron" | "plus-minus" | "none";

interface AccordionContextValue {
  type: AccordionType;
  collapsible: boolean;
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
  variant: AccordionVariant;
  size: AccordionSize;
  shape: AccordionShape;
  iconPosition: AccordionIconPosition;
  indicator: AccordionIndicator;
  disabled: boolean;
  baseId: string;
  registerTrigger: (el: HTMLButtonElement | null, value: string) => void;
  focusSibling: (current: string, dir: 1 | -1 | "first" | "last") => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(
  null,
);

function useAccordion(): AccordionContextValue {
  const ctx = React.useContext(AccordionContext);
  if (!ctx)
    throw new Error("Accordion subcomponents must be used within <Accordion>");
  return ctx;
}

interface AccordionItemContextValue {
  value: string;
  disabled: boolean;
  isOpen: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionItemContext =
  React.createContext<AccordionItemContextValue | null>(null);

function useAccordionItem(): AccordionItemContextValue {
  const ctx = React.useContext(AccordionItemContext);
  if (!ctx)
    throw new Error(
      "AccordionTrigger and AccordionContent must be used within <AccordionItem>",
    );
  return ctx;
}

const SIZES: Record<
  AccordionSize,
  {
    trigger: string;
    triggerFont: string;
    chevronSize: string;
    contentPadX: string;
    contentPadBottom: string;
    contentFont: string;
    gap: string;
    iconSize: string;
  }
> = {
  xs: {
    trigger: "py-2",
    triggerFont: "text-xs",
    chevronSize: "size-3.5",
    contentPadX: "px-0",
    contentPadBottom: "pb-2",
    contentFont: "text-xs",
    gap: "gap-2",
    iconSize: "size-3.5",
  },
  sm: {
    trigger: "py-2.5",
    triggerFont: "text-sm",
    chevronSize: "size-4",
    contentPadX: "px-0",
    contentPadBottom: "pb-2.5",
    contentFont: "text-sm",
    gap: "gap-2.5",
    iconSize: "size-4",
  },
  md: {
    trigger: "py-3",
    triggerFont: "text-sm",
    chevronSize: "size-4",
    contentPadX: "px-0",
    contentPadBottom: "pb-3",
    contentFont: "text-sm",
    gap: "gap-3",
    iconSize: "size-4",
  },
  lg: {
    trigger: "py-3.5",
    triggerFont: "text-base",
    chevronSize: "size-5",
    contentPadX: "px-0",
    contentPadBottom: "pb-4",
    contentFont: "text-base",
    gap: "gap-3",
    iconSize: "size-5",
  },
  xl: {
    trigger: "py-4",
    triggerFont: "text-lg",
    chevronSize: "size-6",
    contentPadX: "px-0",
    contentPadBottom: "pb-5",
    contentFont: "text-lg",
    gap: "gap-4",
    iconSize: "size-6",
  },
};

const SHAPES: Record<AccordionShape, string> = {
  square: "rounded-none",
  rounded: "rounded-md",
};

type AccordionSingleProps = {
  type?: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  collapsible?: boolean;
};

type AccordionMultipleProps = {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  collapsible?: never;
};

export type AccordionProps = (AccordionSingleProps | AccordionMultipleProps) &
  Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "defaultValue" | "onChange"
  > & {
    variant?: AccordionVariant;
    size?: AccordionSize;
    shape?: AccordionShape;
    iconPosition?: AccordionIconPosition;
    indicator?: AccordionIndicator;
    disabled?: boolean;
  };

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  function Accordion(props, ref) {
    const {
      variant = "underline",
      size = "md",
      shape = "rounded",
      iconPosition = "end",
      indicator = "chevron",
      disabled: rootDisabled = false,
      className,
      children,
      ...rest
    } = props as AccordionProps & {
      className?: string;
      children?: React.ReactNode;
    };

    const type = (props.type ?? "single") as AccordionType;
    const collapsible =
      type === "single" ? !!(props as AccordionSingleProps).collapsible : true;

    const baseId = React.useId();
    const triggersRef = React.useRef<Map<string, HTMLButtonElement>>(new Map());

    const [internalSingle, setInternalSingle] = React.useState<string>(
      () => (props as AccordionSingleProps).defaultValue ?? "",
    );
    const [internalMultiple, setInternalMultiple] = React.useState<string[]>(
      () => (props as AccordionMultipleProps).defaultValue ?? [],
    );

    const isControlled = props.value !== undefined;

    const openValues: string[] = isControlled
      ? type === "single"
        ? (props.value as string) === ""
          ? []
          : [(props.value as string) ?? ""]
        : ((props.value as string[]) ?? [])
      : type === "single"
        ? internalSingle === ""
          ? []
          : [internalSingle]
        : internalMultiple;

    const isOpen = React.useCallback(
      (val: string) => openValues.includes(val),
      [openValues],
    );

    const toggle = React.useCallback(
      (val: string) => {
        if (type === "single") {
          const current = isControlled
            ? ((props.value as string) ?? "")
            : internalSingle;
          const next = current === val ? (collapsible ? "" : current) : val;
          if (!isControlled) setInternalSingle(next);
          (
            (props as AccordionSingleProps).onValueChange as
              | ((v: string) => void)
              | undefined
          )?.(next);
        } else {
          const current = isControlled
            ? ((props.value as string[]) ?? [])
            : internalMultiple;
          const next = current.includes(val)
            ? current.filter((v) => v !== val)
            : [...current, val];
          if (!isControlled) setInternalMultiple(next);
          (
            (props as AccordionMultipleProps).onValueChange as
              | ((v: string[]) => void)
              | undefined
          )?.(next);
        }
      },
      [type, collapsible, isControlled, internalSingle, internalMultiple, props],
    );

    const registerTrigger = React.useCallback(
      (el: HTMLButtonElement | null, val: string) => {
        if (el) triggersRef.current.set(val, el);
        else triggersRef.current.delete(val);
      },
      [],
    );

    const focusSibling = React.useCallback(
      (current: string, dir: 1 | -1 | "first" | "last") => {
        const entries = Array.from(triggersRef.current.entries()).filter(
          ([, el]) => !el.disabled,
        );
        if (entries.length === 0) return;
        let next = -1;
        if (dir === "first") next = 0;
        else if (dir === "last") next = entries.length - 1;
        else {
          const idx = entries.findIndex(([k]) => k === current);
          if (idx === -1) return;
          next = (idx + dir + entries.length) % entries.length;
        }
        entries[next][1].focus();
      },
      [],
    );

    return (
      <AccordionContext.Provider
        value={{
          type,
          collapsible,
          isOpen,
          toggle,
          variant,
          size,
          shape,
          iconPosition,
          indicator,
          disabled: rootDisabled,
          baseId,
          registerTrigger,
          focusSibling,
        }}
      >
        <div
          ref={ref}
          data-slot="accordion"
          data-variant={variant}
          className={cn(
            "flex flex-col",
            variant === "outline" &&
              cn("border border-zinc-200 overflow-hidden", SHAPES[shape]),
            variant === "soft" && "gap-2",
            className,
          )}
          {...rest}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);

Accordion.displayName = "Accordion";

export interface AccordionItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export const AccordionItem = React.forwardRef<
  HTMLDivElement,
  AccordionItemProps
>(function AccordionItem(
  { value, disabled = false, className, children, ...rest },
  ref,
) {
  const { isOpen, variant, shape, baseId, disabled: rootDisabled } = useAccordion();
  const open = isOpen(value);
  const effectiveDisabled = disabled || rootDisabled;
  const triggerId = `${baseId}-trigger-${value}`;
  const contentId = `${baseId}-content-${value}`;

  return (
    <AccordionItemContext.Provider
      value={{
        value,
        disabled: effectiveDisabled,
        isOpen: open,
        triggerId,
        contentId,
      }}
    >
      <div
        ref={ref}
        data-slot="accordion-item"
        data-state={open ? "open" : "closed"}
        data-disabled={effectiveDisabled || undefined}
        className={cn(
          variant === "underline" && "border-b border-zinc-200 last:border-b-0",
          variant === "outline" &&
            "border-b border-zinc-200 last:border-b-0",
          variant === "soft" &&
            cn("bg-zinc-50 border border-zinc-100", SHAPES[shape]),
          effectiveDisabled && "opacity-50",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
});

AccordionItem.displayName = "AccordionItem";

export interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  hideChevron?: boolean;
  extra?: React.ReactNode;
  indicator?: AccordionIndicator | React.ReactNode;
}

export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(function AccordionTrigger(
  {
    icon,
    hideChevron,
    extra,
    indicator: localIndicator,
    className,
    children,
    onKeyDown,
    ...rest
  },
  forwardedRef,
) {
  const {
    toggle,
    size,
    variant,
    iconPosition,
    indicator: rootIndicator,
    registerTrigger,
    focusSibling,
  } = useAccordion();
  const { value, disabled, isOpen, triggerId, contentId } = useAccordionItem();
  const s = SIZES[size];

  const resolvedIndicator: AccordionIndicator | React.ReactNode = hideChevron
    ? "none"
    : (localIndicator ?? rootIndicator);

  const innerRef = React.useRef<HTMLButtonElement | null>(null);
  const setRefs = React.useCallback(
    (node: HTMLButtonElement | null) => {
      innerRef.current = node;
      registerTrigger(node, value);
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef)
        (
          forwardedRef as React.MutableRefObject<HTMLButtonElement | null>
        ).current = node;
    },
    [registerTrigger, value, forwardedRef],
  );

  React.useEffect(() => {
    return () => registerTrigger(null, value);
  }, [registerTrigger, value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusSibling(value, 1);
    } else if (e.key === "ArrowUp") {
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

  const trimPadX =
    variant === "outline" ? "px-4" : variant === "soft" ? "px-4" : "px-0";

  const indicatorEl = renderIndicator(resolvedIndicator, isOpen, s.chevronSize);

  return (
    <h3 className="m-0">
      <button
        ref={setRefs}
        id={triggerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        disabled={disabled}
        data-slot="accordion-trigger"
        data-state={isOpen ? "open" : "closed"}
        onClick={() => !disabled && toggle(value)}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex w-full items-center text-left font-medium text-zinc-900 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20",
          "disabled:cursor-not-allowed cursor-pointer",
          s.gap,
          s.trigger,
          s.triggerFont,
          trimPadX,
          variant === "outline" && !disabled && "hover:bg-zinc-50",
          variant === "soft" && !disabled && "hover:bg-zinc-100",
          className,
        )}
        {...rest}
      >
        {iconPosition === "start" && indicatorEl}
        {icon && (
          <span
            aria-hidden="true"
            data-slot="accordion-icon"
            className={cn(
              "inline-flex items-center justify-center shrink-0 text-zinc-500 [&>svg]:w-full [&>svg]:h-full",
              s.iconSize,
            )}
          >
            {icon}
          </span>
        )}
        <span className="flex-1 min-w-0">{children}</span>
        {extra && (
          <span data-slot="accordion-extra" className="shrink-0 text-zinc-500">
            {extra}
          </span>
        )}
        {iconPosition === "end" && indicatorEl}
      </button>
    </h3>
  );
});

function renderIndicator(
  indicator: AccordionIndicator | React.ReactNode,
  isOpen: boolean,
  chevronSize: string,
): React.ReactNode {
  if (indicator === "none") return null;
  if (indicator === "chevron") {
    return (
      <ChevronDownIcon
        aria-hidden="true"
        data-slot="accordion-indicator"
        className={cn(
          "shrink-0 text-zinc-500 transition-transform duration-200",
          chevronSize,
          isOpen && "rotate-180",
        )}
      />
    );
  }
  if (indicator === "plus-minus") {
    const Icon = isOpen ? MinusIcon : PlusIcon;
    return (
      <Icon
        aria-hidden="true"
        data-slot="accordion-indicator"
        className={cn(
          "shrink-0 text-zinc-500 transition-transform duration-200",
          chevronSize,
        )}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      data-slot="accordion-indicator"
      className={cn("shrink-0 inline-flex items-center", chevronSize)}
    >
      {indicator}
    </span>
  );
}

AccordionTrigger.displayName = "AccordionTrigger";

export interface AccordionContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  forceMount?: boolean;
}

export const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(function AccordionContent(
  { forceMount, className, children, ...rest },
  ref,
) {
  const { size, variant } = useAccordion();
  const { isOpen, contentId, triggerId } = useAccordionItem();
  const s = SIZES[size];

  const trimPadX =
    variant === "outline" ? "px-4" : variant === "soft" ? "px-4" : "px-0";

  return (
    <div
      data-slot="accordion-content-wrapper"
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-200 ease-in-out",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      )}
      hidden={!isOpen && !forceMount}
      aria-hidden={!isOpen}
    >
      <div className="overflow-hidden min-h-0">
        <div
          ref={ref}
          id={contentId}
          role="region"
          aria-labelledby={triggerId}
          data-slot="accordion-content"
          className={cn(
            "text-zinc-600 leading-relaxed",
            trimPadX,
            s.contentPadBottom,
            s.contentFont,
            className,
          )}
          {...rest}
        >
          {children}
        </div>
      </div>
    </div>
  );
});

AccordionContent.displayName = "AccordionContent";
