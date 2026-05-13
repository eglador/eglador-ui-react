import * as React from "react";
import { cn } from "../../lib/utils";

export type ButtonGroupOrientation = "horizontal" | "vertical";

const ButtonGroupContext = React.createContext<ButtonGroupOrientation>("horizontal");

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: ButtonGroupOrientation;
}

const HORIZONTAL_FUSE =
  "[&>*:not(:first-child):not(:last-child)]:rounded-none " +
  "[&>*:first-child:not(:last-child)]:rounded-e-none " +
  "[&>*:last-child:not(:first-child)]:rounded-s-none " +
  "[&>*:not(:first-child)]:-ms-px " +
  "[&>*:focus-visible]:z-10 [&>*:focus-visible]:relative";

const VERTICAL_FUSE =
  "[&>*:not(:first-child):not(:last-child)]:rounded-none " +
  "[&>*:first-child:not(:last-child)]:rounded-b-none " +
  "[&>*:last-child:not(:first-child)]:rounded-t-none " +
  "[&>*:not(:first-child)]:-mt-px " +
  "[&>*:focus-visible]:z-10 [&>*:focus-visible]:relative";

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup(
    { orientation = "horizontal", className, children, ...rest },
    ref,
  ) {
    return (
      <ButtonGroupContext.Provider value={orientation}>
        <div
          ref={ref}
          role="group"
          data-orientation={orientation}
          className={cn(
            "inline-flex isolate",
            orientation === "horizontal" ? "flex-row" : "flex-col",
            orientation === "horizontal" ? HORIZONTAL_FUSE : VERTICAL_FUSE,
            className,
          )}
          {...rest}
        >
          {children}
        </div>
      </ButtonGroupContext.Provider>
    );
  },
);

ButtonGroup.displayName = "ButtonGroup";

export interface ButtonGroupSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: ButtonGroupOrientation;
}

export const ButtonGroupSeparator = React.forwardRef<
  HTMLDivElement,
  ButtonGroupSeparatorProps
>(function ButtonGroupSeparator({ orientation, className, ...rest }, ref) {
  const groupOrientation = React.useContext(ButtonGroupContext);
  const sep =
    orientation ??
    (groupOrientation === "horizontal" ? "vertical" : "horizontal");
  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={sep}
      data-orientation={sep}
      className={cn(
        "bg-zinc-300 shrink-0 self-stretch z-[1] relative",
        sep === "vertical" ? "w-px" : "h-px",
        className,
      )}
      {...rest}
    />
  );
});

ButtonGroupSeparator.displayName = "ButtonGroupSeparator";

export type ButtonGroupTextSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonGroupTextProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size?: ButtonGroupTextSize;
}

const TEXT_SIZES: Record<
  ButtonGroupTextSize,
  { height: string; padding: string; font: string }
> = {
  xs: { height: "h-7", padding: "px-2", font: "text-xs" },
  sm: { height: "h-8", padding: "px-2.5", font: "text-sm" },
  md: { height: "h-9", padding: "px-3", font: "text-sm" },
  lg: { height: "h-10", padding: "px-4", font: "text-base" },
  xl: { height: "h-12", padding: "px-5", font: "text-lg" },
};

export const ButtonGroupText = React.forwardRef<
  HTMLDivElement,
  ButtonGroupTextProps
>(function ButtonGroupText({ size = "md", className, ...rest }, ref) {
  const s = TEXT_SIZES[size];
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center font-medium text-zinc-700",
        "bg-zinc-50 border border-zinc-200 rounded-sm select-none",
        s.height,
        s.padding,
        s.font,
        className,
      )}
      {...rest}
    />
  );
});

ButtonGroupText.displayName = "ButtonGroupText";
