"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../lib/utils";
import { XIcon } from "../../lib/icons";

export type DialogSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";
export type DialogShape = "square" | "rounded";
export type DialogShadow = "none" | "xs" | "sm" | "md" | "lg" | "xl";

const SIZES: Record<DialogSize, string> = {
  xs: "max-w-sm",
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
};

const SHAPES: Record<DialogShape, string> = {
  square: "rounded-none",
  rounded: "rounded-md",
};

const SHADOWS: Record<DialogShadow, string> = {
  none: "shadow-none",
  xs: "shadow-xs",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
};

interface DialogContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  baseId: string;
  size: DialogSize;
  shape: DialogShape;
  shadow: DialogShadow;
  modal: boolean;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialog() {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error("Dialog subcomponents must be used within <Dialog>");
  return ctx;
}

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: DialogSize;
  shape?: DialogShape;
  shadow?: DialogShadow;
  modal?: boolean;
  children: React.ReactNode;
}

export function Dialog({
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  size = "md",
  shape = "rounded",
  shadow = "lg",
  modal = true,
  children,
}: DialogProps) {
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
    <DialogContext.Provider
      value={{ open, setOpen, baseId, size, shape, shadow, modal }}
    >
      {children}
    </DialogContext.Provider>
  );
}

export interface DialogTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  DialogTriggerProps
>(function DialogTrigger({ asChild = false, onClick, children, ...rest }, ref) {
  const ctx = useDialog();
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
      "data-slot": "dialog-trigger",
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
      data-slot="dialog-trigger"
      onClick={handle}
      {...rest}
    >
      {children}
    </button>
  );
});

DialogTrigger.displayName = "DialogTrigger";

export interface DialogOverlayProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  DialogOverlayProps
>(function DialogOverlay({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-[9999] bg-zinc-900/50 backdrop-blur-sm animate-in fade-in-0",
        className,
      )}
      {...rest}
    />
  );
});

DialogOverlay.displayName = "DialogOverlay";

export interface DialogContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  showClose?: boolean;
  closeOnOverlay?: boolean;
}

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(function DialogContent(
  { showClose = true, closeOnOverlay = true, className, children, ...rest },
  ref,
) {
  const ctx = useDialog();
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const setRefs = (n: HTMLDivElement | null) => {
    contentRef.current = n;
    if (typeof ref === "function") ref(n);
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = n;
  };

  React.useEffect(() => {
    if (!ctx.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && ctx.modal) {
        e.preventDefault();
        ctx.setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    contentRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [ctx]);

  if (!ctx.open) return null;
  if (typeof document === "undefined") return null;

  return ReactDOM.createPortal(
    <>
      <DialogOverlay
        onClick={() => closeOnOverlay && ctx.modal && ctx.setOpen(false)}
      />
      <div
        ref={setRefs}
        role="dialog"
        aria-modal={ctx.modal}
        aria-labelledby={`${ctx.baseId}-title`}
        aria-describedby={`${ctx.baseId}-description`}
        tabIndex={-1}
        data-slot="dialog-content"
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
        {showClose && (
          <button
            type="button"
            aria-label="Close"
            onClick={() => ctx.setOpen(false)}
            className="absolute end-4 top-4 inline-flex h-7 w-7 items-center justify-center rounded-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 cursor-pointer"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>
    </>,
    document.body,
  );
});

DialogContent.displayName = "DialogContent";

export interface DialogHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  function DialogHeader({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="dialog-header"
        className={cn("flex flex-col gap-1.5 text-start mb-4 pe-8", className)}
        {...rest}
      />
    );
  },
);

DialogHeader.displayName = "DialogHeader";

export interface DialogFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  function DialogFooter({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="dialog-footer"
        className={cn(
          "flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6",
          className,
        )}
        {...rest}
      />
    );
  },
);

DialogFooter.displayName = "DialogFooter";

export interface DialogTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  DialogTitleProps
>(function DialogTitle({ className, ...rest }, ref) {
  const ctx = useDialog();
  return (
    <h2
      ref={ref}
      id={`${ctx.baseId}-title`}
      data-slot="dialog-title"
      className={cn("text-lg font-semibold leading-snug text-zinc-900", className)}
      {...rest}
    />
  );
});

DialogTitle.displayName = "DialogTitle";

export interface DialogDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>(function DialogDescription({ className, ...rest }, ref) {
  const ctx = useDialog();
  return (
    <p
      ref={ref}
      id={`${ctx.baseId}-description`}
      data-slot="dialog-description"
      className={cn("text-sm text-zinc-500", className)}
      {...rest}
    />
  );
});

DialogDescription.displayName = "DialogDescription";

export interface DialogCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  function DialogClose({ asChild = false, onClick, children, ...rest }, ref) {
    const ctx = useDialog();
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
        "data-slot": "dialog-close",
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
        data-slot="dialog-close"
        onClick={handle}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

DialogClose.displayName = "DialogClose";
