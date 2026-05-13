import * as React from "react";
import { cn } from "../../lib/utils";
import { Input, type InputProps } from "../input";
import { Textarea, type TextareaProps } from "../textarea";

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  function InputGroup({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="input-group"
        className={cn(
          "relative isolate flex items-stretch w-full",
          "bg-white border border-zinc-300 rounded-sm transition-colors",
          "has-[[data-slot=input-group-control]:focus-visible]:ring-2",
          "has-[[data-slot=input-group-control]:focus-visible]:ring-zinc-900",
          "has-[[data-slot=input-group-control]:focus-visible]:ring-offset-1",
          "has-[[data-slot=input-group-control]:focus-visible]:border-zinc-900",
          "has-[[aria-invalid=true]]:border-zinc-900",
          "has-[[aria-invalid=true]]:ring-2",
          "has-[[aria-invalid=true]]:ring-zinc-200",
          "has-[[data-align=block-start]]:flex-col",
          "has-[[data-align=block-end]]:flex-col",
          "[&_[data-slot=input-group-control]]:border-0",
          "[&_[data-slot=input-group-control]]:bg-transparent",
          "[&_[data-slot=input-group-control]]:rounded-none",
          "[&_[data-slot=input-group-control]]:shadow-none",
          "[&_[data-slot=input-group-control]]:flex-1",
          "[&_[data-slot=input-group-control]]:min-w-0",
          "[&_[data-slot=input-group-control]]:focus-visible:ring-0",
          "[&_[data-slot=input-group-control]]:focus-visible:ring-offset-0",
          "[&_[data-slot=input-group-control]]:focus-visible:border-0",
          "[&_[data-slot=input-group-control]]:aria-invalid:ring-0",
          "[&_[data-slot=input-group-control]]:aria-invalid:border-0",
          className,
        )}
        {...rest}
      />
    );
  },
);

InputGroup.displayName = "InputGroup";

export const InputGroupInput = React.forwardRef<HTMLInputElement, InputProps>(
  function InputGroupInput(props, ref) {
    return <Input ref={ref} data-slot="input-group-control" {...props} />;
  },
);

InputGroupInput.displayName = "InputGroupInput";

export const InputGroupTextarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(function InputGroupTextarea(props, ref) {
  return <Textarea ref={ref} data-slot="input-group-control" {...props} />;
});

InputGroupTextarea.displayName = "InputGroupTextarea";

export type InputGroupAddonAlign =
  | "inline-start"
  | "inline-end"
  | "block-start"
  | "block-end";

export interface InputGroupAddonProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: InputGroupAddonAlign;
}

export const InputGroupAddon = React.forwardRef<
  HTMLDivElement,
  InputGroupAddonProps
>(function InputGroupAddon({ align = "inline-start", className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      data-slot="input-group-addon"
      data-align={align}
      className={cn(
        "inline-flex items-center text-zinc-500 select-none gap-1.5 shrink-0",
        "[&>svg]:size-4",
        align === "inline-start" && "order-first ps-3",
        align === "inline-end" && "order-last pe-3",
        align === "block-start" &&
          "order-first w-full px-3 py-2 border-b border-zinc-300",
        align === "block-end" &&
          "order-last w-full px-3 py-2 border-t border-zinc-300",
        className,
      )}
      {...rest}
    />
  );
});

InputGroupAddon.displayName = "InputGroupAddon";

export type InputGroupButtonSize = "xs" | "sm" | "icon-xs" | "icon-sm";
export type InputGroupButtonVariant = "ghost" | "outline" | "soft" | "solid";

export interface InputGroupButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: InputGroupButtonSize;
  variant?: InputGroupButtonVariant;
}

const BTN_SIZES: Record<InputGroupButtonSize, string> = {
  xs: "h-6 px-2 text-xs gap-1 [&>svg]:size-3",
  "icon-xs": "size-6 [&>svg]:size-3",
  sm: "h-7 px-2.5 text-xs gap-1 [&>svg]:size-3.5",
  "icon-sm": "size-7 [&>svg]:size-3.5",
};

const BTN_VARIANTS: Record<InputGroupButtonVariant, string> = {
  ghost:
    "bg-transparent text-zinc-700 hover:bg-zinc-100 border border-transparent",
  outline:
    "bg-white text-zinc-700 hover:bg-zinc-50 border border-zinc-300",
  soft: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-200",
  solid: "bg-zinc-900 text-white hover:bg-zinc-700 border border-zinc-900",
};

export const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  InputGroupButtonProps
>(function InputGroupButton(
  { size = "xs", variant = "ghost", className, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      data-slot="input-group-button"
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-sm transition-colors cursor-pointer shrink-0 select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-1",
        "disabled:opacity-50 disabled:pointer-events-none",
        BTN_SIZES[size],
        BTN_VARIANTS[variant],
        className,
      )}
      {...rest}
    />
  );
});

InputGroupButton.displayName = "InputGroupButton";

export interface InputGroupTextProps extends React.HTMLAttributes<HTMLDivElement> {}

export const InputGroupText = React.forwardRef<
  HTMLDivElement,
  InputGroupTextProps
>(function InputGroupText({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      data-slot="input-group-text"
      className={cn(
        "inline-flex items-center whitespace-nowrap select-none text-sm text-zinc-600 font-medium",
        className,
      )}
      {...rest}
    />
  );
});

InputGroupText.displayName = "InputGroupText";
