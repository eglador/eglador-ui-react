"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

interface CollapsibleContextValue {
  isOpen: boolean;
  toggle: () => void;
  disabled: boolean;
  triggerId: string;
  contentId: string;
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(
  null,
);

function useCollapsible(): CollapsibleContextValue {
  const ctx = React.useContext(CollapsibleContext);
  if (!ctx)
    throw new Error(
      "Collapsible subcomponents must be used within <Collapsible>",
    );
  return ctx;
}

export interface CollapsibleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

export const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  function Collapsible(
    {
      open: controlled,
      defaultOpen = false,
      onOpenChange,
      disabled = false,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const [internal, setInternal] = React.useState(defaultOpen);
    const isControlled = controlled !== undefined;
    const isOpen = isControlled ? controlled : internal;

    const baseId = React.useId();
    const triggerId = `${baseId}-trigger`;
    const contentId = `${baseId}-content`;

    const toggle = React.useCallback(() => {
      if (disabled) return;
      const next = !isOpen;
      if (!isControlled) setInternal(next);
      onOpenChange?.(next);
    }, [disabled, isOpen, isControlled, onOpenChange]);

    return (
      <CollapsibleContext.Provider
        value={{ isOpen, toggle, disabled, triggerId, contentId }}
      >
        <div
          ref={ref}
          data-slot="collapsible"
          data-state={isOpen ? "open" : "closed"}
          data-disabled={disabled || undefined}
          className={cn(disabled && "opacity-50", className)}
          {...rest}
        >
          {children}
        </div>
      </CollapsibleContext.Provider>
    );
  },
);

Collapsible.displayName = "Collapsible";

export interface CollapsibleTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  CollapsibleTriggerProps
>(function CollapsibleTrigger(
  { asChild = false, className, children, onClick, ...rest },
  ref,
) {
  const { isOpen, toggle, disabled, triggerId, contentId } = useCollapsible();

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<
      Record<string, unknown> & { onClick?: (e: React.MouseEvent) => void }
    >;
    const childProps = child.props;
    const childOnClick = childProps.onClick as
      | ((e: React.MouseEvent) => void)
      | undefined;

    return React.cloneElement(child, {
      ...rest,
      id: triggerId,
      "aria-expanded": isOpen,
      "aria-controls": contentId,
      "aria-disabled": disabled || undefined,
      "data-slot": "collapsible-trigger",
      "data-state": isOpen ? "open" : "closed",
      onClick: (e: React.MouseEvent) => {
        childOnClick?.(e);
        if (!e.defaultPrevented) toggle();
      },
      className: cn(childProps.className as string | undefined, className),
      ref,
    } as Record<string, unknown>);
  }

  return (
    <button
      ref={ref}
      id={triggerId}
      type="button"
      aria-expanded={isOpen}
      aria-controls={contentId}
      disabled={disabled}
      data-slot="collapsible-trigger"
      data-state={isOpen ? "open" : "closed"}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) toggle();
      }}
      className={cn(
        "cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-none",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});

CollapsibleTrigger.displayName = "CollapsibleTrigger";

export interface CollapsibleContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  forceMount?: boolean;
}

export const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  CollapsibleContentProps
>(function CollapsibleContent(
  { forceMount, className, children, ...rest },
  ref,
) {
  const { isOpen, triggerId, contentId } = useCollapsible();

  return (
    <div
      data-slot="collapsible-content-wrapper"
      data-state={isOpen ? "open" : "closed"}
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
          data-slot="collapsible-content"
          data-state={isOpen ? "open" : "closed"}
          className={className}
          {...rest}
        >
          {children}
        </div>
      </div>
    </div>
  );
});

CollapsibleContent.displayName = "CollapsibleContent";
