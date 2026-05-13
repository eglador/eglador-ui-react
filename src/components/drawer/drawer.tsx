"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../lib/utils";
import { XIcon } from "../../lib/icons";

export type DrawerSide = "top" | "right" | "bottom" | "left";
export type DrawerSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";
export type DrawerShape = "square" | "rounded";
export type DrawerShadow = "none" | "xs" | "sm" | "md" | "lg" | "xl";

interface DrawerContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  side: DrawerSide;
  size: DrawerSize;
  shape: DrawerShape;
  shadow: DrawerShadow;
  baseId: string;
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

function useDrawer() {
  const ctx = React.useContext(DrawerContext);
  if (!ctx) throw new Error("Drawer subcomponents must be used within <Drawer>");
  return ctx;
}

const SIDE_POS: Record<DrawerSide, string> = {
  top: "inset-x-0 top-0",
  right: "inset-y-0 end-0",
  bottom: "inset-x-0 bottom-0",
  left: "inset-y-0 start-0",
};

const SIDE_SIZE: Record<DrawerSide, Record<DrawerSize, string>> = {
  top: {
    xs: "h-32",
    sm: "h-48",
    md: "h-64",
    lg: "h-96",
    xl: "h-[32rem]",
    full: "h-[calc(100vh-2rem)]",
  },
  bottom: {
    xs: "h-32",
    sm: "h-48",
    md: "h-64",
    lg: "h-96",
    xl: "h-[32rem]",
    full: "h-[calc(100vh-2rem)]",
  },
  left: {
    xs: "w-64",
    sm: "w-80",
    md: "w-96",
    lg: "w-[28rem]",
    xl: "w-[32rem]",
    full: "w-[calc(100vw-2rem)]",
  },
  right: {
    xs: "w-64",
    sm: "w-80",
    md: "w-96",
    lg: "w-[28rem]",
    xl: "w-[32rem]",
    full: "w-[calc(100vw-2rem)]",
  },
};

const SIDE_ANIM: Record<DrawerSide, string> = {
  top: "animate-in slide-in-from-top duration-200",
  right: "animate-in slide-in-from-right duration-200",
  bottom: "animate-in slide-in-from-bottom duration-200",
  left: "animate-in slide-in-from-left duration-200",
};

const SHAPES: Record<DrawerShape, Record<DrawerSide, string>> = {
  square: {
    top: "rounded-none",
    right: "rounded-none",
    bottom: "rounded-none",
    left: "rounded-none",
  },
  rounded: {
    top: "rounded-b-md",
    right: "rounded-s-md",
    bottom: "rounded-t-md",
    left: "rounded-e-md",
  },
};

const SHADOWS: Record<DrawerShadow, string> = {
  none: "shadow-none",
  xs: "shadow-xs",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
};

export interface DrawerProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: DrawerSide;
  size?: DrawerSize;
  shape?: DrawerShape;
  shadow?: DrawerShadow;
  children: React.ReactNode;
}

export function Drawer({
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  side = "right",
  size = "md",
  shape = "square",
  shadow = "lg",
  children,
}: DrawerProps) {
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
    <DrawerContext.Provider
      value={{ open, setOpen, side, size, shape, shadow, baseId }}
    >
      {children}
    </DrawerContext.Provider>
  );
}

export interface DrawerTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DrawerTrigger = React.forwardRef<
  HTMLButtonElement,
  DrawerTriggerProps
>(function DrawerTrigger({ asChild = false, onClick, children, ...rest }, ref) {
  const ctx = useDrawer();
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
      "data-slot": "drawer-trigger",
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
      data-slot="drawer-trigger"
      onClick={handle}
      {...rest}
    >
      {children}
    </button>
  );
});

DrawerTrigger.displayName = "DrawerTrigger";

export interface DrawerContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  showClose?: boolean;
  closeOnOverlay?: boolean;
}

export const DrawerContent = React.forwardRef<
  HTMLDivElement,
  DrawerContentProps
>(function DrawerContent(
  { showClose = true, closeOnOverlay = true, className, children, ...rest },
  ref,
) {
  const ctx = useDrawer();
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const setRefs = (n: HTMLDivElement | null) => {
    contentRef.current = n;
    if (typeof ref === "function") ref(n);
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = n;
  };

  React.useEffect(() => {
    if (!ctx.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
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
      <div
        data-slot="drawer-overlay"
        onClick={() => closeOnOverlay && ctx.setOpen(false)}
        className="fixed inset-0 z-[9999] bg-zinc-900/50 backdrop-blur-sm animate-in fade-in-0"
      />
      <div
        ref={setRefs}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${ctx.baseId}-title`}
        aria-describedby={`${ctx.baseId}-description`}
        tabIndex={-1}
        data-slot="drawer-content"
        data-state="open"
        data-side={ctx.side}
        className={cn(
          "fixed z-[10000] bg-white outline-none flex flex-col",
          "border-zinc-200",
          ctx.side === "right" && "border-s",
          ctx.side === "left" && "border-e",
          ctx.side === "top" && "border-b",
          ctx.side === "bottom" && "border-t",
          SIDE_POS[ctx.side],
          SIDE_SIZE[ctx.side][ctx.size],
          SIDE_ANIM[ctx.side],
          SHAPES[ctx.shape][ctx.side],
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
            className="absolute end-4 top-4 inline-flex h-7 w-7 items-center justify-center rounded-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>
    </>,
    document.body,
  );
});

DrawerContent.displayName = "DrawerContent";

export interface DrawerHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const DrawerHeader = React.forwardRef<HTMLDivElement, DrawerHeaderProps>(
  function DrawerHeader({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="drawer-header"
        className={cn(
          "flex flex-col gap-1.5 p-6 pe-12 border-b border-zinc-200",
          className,
        )}
        {...rest}
      />
    );
  },
);

DrawerHeader.displayName = "DrawerHeader";

export interface DrawerFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const DrawerFooter = React.forwardRef<HTMLDivElement, DrawerFooterProps>(
  function DrawerFooter({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="drawer-footer"
        className={cn(
          "flex flex-col-reverse sm:flex-row sm:justify-end gap-2 p-6 border-t border-zinc-200 mt-auto",
          className,
        )}
        {...rest}
      />
    );
  },
);

DrawerFooter.displayName = "DrawerFooter";

export interface DrawerBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DrawerBody = React.forwardRef<HTMLDivElement, DrawerBodyProps>(
  function DrawerBody({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="drawer-body"
        className={cn("flex-1 overflow-auto p-6", className)}
        {...rest}
      />
    );
  },
);

DrawerBody.displayName = "DrawerBody";

export interface DrawerTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export const DrawerTitle = React.forwardRef<
  HTMLHeadingElement,
  DrawerTitleProps
>(function DrawerTitle({ className, ...rest }, ref) {
  const ctx = useDrawer();
  return (
    <h2
      ref={ref}
      id={`${ctx.baseId}-title`}
      data-slot="drawer-title"
      className={cn(
        "text-lg font-semibold leading-snug text-zinc-900",
        className,
      )}
      {...rest}
    />
  );
});

DrawerTitle.displayName = "DrawerTitle";

export interface DrawerDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  DrawerDescriptionProps
>(function DrawerDescription({ className, ...rest }, ref) {
  const ctx = useDrawer();
  return (
    <p
      ref={ref}
      id={`${ctx.baseId}-description`}
      data-slot="drawer-description"
      className={cn("text-sm text-zinc-500", className)}
      {...rest}
    />
  );
});

DrawerDescription.displayName = "DrawerDescription";

export interface DrawerCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DrawerClose = React.forwardRef<HTMLButtonElement, DrawerCloseProps>(
  function DrawerClose({ asChild = false, onClick, children, ...rest }, ref) {
    const ctx = useDrawer();
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
        "data-slot": "drawer-close",
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
        data-slot="drawer-close"
        onClick={handle}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

DrawerClose.displayName = "DrawerClose";
