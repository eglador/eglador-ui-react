"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../lib/utils";

export type AlertDialogSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AlertDialogShape = "square" | "rounded";
export type AlertDialogShadow = "none" | "xs" | "sm" | "md" | "lg" | "xl";

const SIZES: Record<AlertDialogSize, string> = {
  xs: "max-w-sm",
  sm: "max-w-md",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

const SHAPES: Record<AlertDialogShape, string> = {
  square: "rounded-none",
  rounded: "rounded-md",
};

const SHADOWS: Record<AlertDialogShadow, string> = {
  none: "shadow-none",
  xs: "shadow-xs",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
};

interface AlertDialogContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  baseId: string;
  size: AlertDialogSize;
  shape: AlertDialogShape;
  shadow: AlertDialogShadow;
}

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(
  null,
);

function useAlertDialog() {
  const ctx = React.useContext(AlertDialogContext);
  if (!ctx)
    throw new Error(
      "AlertDialog subcomponents must be used within <AlertDialog>",
    );
  return ctx;
}

export interface AlertDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: AlertDialogSize;
  shape?: AlertDialogShape;
  shadow?: AlertDialogShadow;
  children: React.ReactNode;
}

export function AlertDialog({
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  size = "md",
  shape = "rounded",
  shadow = "lg",
  children,
}: AlertDialogProps) {
  const [internal, setInternal] = React.useState(defaultOpen);
  const isControlled = controlled !== undefined;
  const open = isControlled ? controlled : internal;
  const baseId = React.useId();
  const setOpen = React.useCallback(
    (v: boolean) => {
      if (!isControlled) setInternal(v);
      onOpenChange?.(v);
    },
    [isControlled, onOpenChange],
  );
  return (
    <AlertDialogContext.Provider
      value={{ open, setOpen, baseId, size, shape, shadow }}
    >
      {children}
    </AlertDialogContext.Provider>
  );
}

export interface AlertDialogTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const AlertDialogTrigger = React.forwardRef<
  HTMLButtonElement,
  AlertDialogTriggerProps
>(function AlertDialogTrigger(
  { asChild = false, onClick, children, ...rest },
  ref,
) {
  const ctx = useAlertDialog();
  const handle = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) ctx.setOpen(true);
  };
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    const childOnClick = child.props.onClick as
      | ((e: React.MouseEvent) => void)
      | undefined;
    return React.cloneElement(child, {
      ...rest,
      "data-slot": "alert-dialog-trigger",
      onClick: (e: React.MouseEvent) => {
        childOnClick?.(e);
        if (!e.defaultPrevented) ctx.setOpen(true);
      },
      ref,
    } as Record<string, unknown>);
  }
  return (
    <button
      ref={ref}
      type="button"
      data-slot="alert-dialog-trigger"
      onClick={handle}
      {...rest}
    >
      {children}
    </button>
  );
});

AlertDialogTrigger.displayName = "AlertDialogTrigger";

export interface AlertDialogContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const AlertDialogContent = React.forwardRef<
  HTMLDivElement,
  AlertDialogContentProps
>(function AlertDialogContent({ className, children, ...rest }, ref) {
  const ctx = useAlertDialog();
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const setRefs = (n: HTMLDivElement | null) => {
    contentRef.current = n;
    if (typeof ref === "function") ref(n);
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = n;
  };

  React.useEffect(() => {
    if (!ctx.open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    contentRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [ctx.open]);

  if (!ctx.open) return null;
  if (typeof document === "undefined") return null;

  return ReactDOM.createPortal(
    <>
      <div
        data-slot="alert-dialog-overlay"
        className="fixed inset-0 z-[9999] bg-zinc-900/50 backdrop-blur-sm animate-in fade-in-0"
      />
      <div
        ref={setRefs}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={`${ctx.baseId}-title`}
        aria-describedby={`${ctx.baseId}-description`}
        tabIndex={-1}
        data-slot="alert-dialog-content"
        data-state="open"
        className={cn(
          "fixed left-1/2 top-1/2 z-[10000] -translate-x-1/2 -translate-y-1/2 w-full",
          "bg-white border border-zinc-200 p-6 outline-none",
          "animate-in fade-in-0 zoom-in-95",
          SIZES[ctx.size],
          SHAPES[ctx.shape],
          SHADOWS[ctx.shadow],
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    </>,
    document.body,
  );
});

AlertDialogContent.displayName = "AlertDialogContent";

export interface AlertDialogHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const AlertDialogHeader = React.forwardRef<
  HTMLDivElement,
  AlertDialogHeaderProps
>(function AlertDialogHeader({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-1.5 text-start mb-4", className)}
      {...rest}
    />
  );
});

AlertDialogHeader.displayName = "AlertDialogHeader";

export interface AlertDialogFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const AlertDialogFooter = React.forwardRef<
  HTMLDivElement,
  AlertDialogFooterProps
>(function AlertDialogFooter({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6",
        className,
      )}
      {...rest}
    />
  );
});

AlertDialogFooter.displayName = "AlertDialogFooter";

export interface AlertDialogTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export const AlertDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  AlertDialogTitleProps
>(function AlertDialogTitle({ className, ...rest }, ref) {
  const ctx = useAlertDialog();
  return (
    <h2
      ref={ref}
      id={`${ctx.baseId}-title`}
      data-slot="alert-dialog-title"
      className={cn(
        "text-lg font-semibold leading-snug text-zinc-900",
        className,
      )}
      {...rest}
    />
  );
});

AlertDialogTitle.displayName = "AlertDialogTitle";

export interface AlertDialogDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const AlertDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  AlertDialogDescriptionProps
>(function AlertDialogDescription({ className, ...rest }, ref) {
  const ctx = useAlertDialog();
  return (
    <p
      ref={ref}
      id={`${ctx.baseId}-description`}
      data-slot="alert-dialog-description"
      className={cn("text-sm text-zinc-600", className)}
      {...rest}
    />
  );
});

AlertDialogDescription.displayName = "AlertDialogDescription";

export interface AlertDialogActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  AlertDialogActionProps
>(function AlertDialogAction(
  { asChild = false, onClick, className, children, ...rest },
  ref,
) {
  const ctx = useAlertDialog();
  const handle = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) ctx.setOpen(false);
  };
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    const childOnClick = child.props.onClick as
      | ((e: React.MouseEvent) => void)
      | undefined;
    return React.cloneElement(child, {
      ...rest,
      "data-slot": "alert-dialog-action",
      onClick: (e: React.MouseEvent) => {
        childOnClick?.(e);
        if (!e.defaultPrevented) ctx.setOpen(false);
      },
      ref,
    } as Record<string, unknown>);
  }
  return (
    <button
      ref={ref}
      type="button"
      data-slot="alert-dialog-action"
      onClick={handle}
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 cursor-pointer",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});

AlertDialogAction.displayName = "AlertDialogAction";

export interface AlertDialogCancelProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  AlertDialogCancelProps
>(function AlertDialogCancel(
  { asChild = false, onClick, className, children, ...rest },
  ref,
) {
  const ctx = useAlertDialog();
  const handle = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) ctx.setOpen(false);
  };
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    const childOnClick = child.props.onClick as
      | ((e: React.MouseEvent) => void)
      | undefined;
    return React.cloneElement(child, {
      ...rest,
      "data-slot": "alert-dialog-cancel",
      onClick: (e: React.MouseEvent) => {
        childOnClick?.(e);
        if (!e.defaultPrevented) ctx.setOpen(false);
      },
      ref,
    } as Record<string, unknown>);
  }
  return (
    <button
      ref={ref}
      type="button"
      data-slot="alert-dialog-cancel"
      onClick={handle}
      className={cn(
        "inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 cursor-pointer",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});

AlertDialogCancel.displayName = "AlertDialogCancel";
