import * as React from "react";
import { cn } from "../../lib/utils";

export type CardVariant = "solid" | "soft" | "outline" | "ghost";
export type CardShape = "square" | "rounded";
export type CardShadow = "none" | "xs" | "sm" | "md" | "lg" | "xl";

const VARIANTS: Record<CardVariant, string> = {
  solid: "border border-zinc-200 bg-white",
  soft: "border border-zinc-200 bg-zinc-50",
  outline: "border border-zinc-200 bg-transparent",
  ghost: "border-0 bg-transparent",
};

const SHAPES: Record<CardShape, string> = {
  square: "rounded-none",
  rounded: "rounded-md",
};

const SHADOWS: Record<CardShadow, string> = {
  none: "shadow-none",
  xs: "shadow-xs",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  shape?: CardShape;
  shadow?: CardShadow;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  function Card(
    { variant = "solid", shape = "rounded", shadow = "xs", className, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        data-slot="card"
        data-variant={variant}
        data-shape={shape}
        data-shadow={shadow}
        className={cn(
          "flex flex-col gap-6 py-6 text-zinc-900",
          VARIANTS[variant],
          SHAPES[shape],
          SHADOWS[shadow],
          className,
        )}
        {...rest}
      />
    );
  },
);

Card.displayName = "Card";

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="card-header"
        className={cn(
          "grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6",
          "has-[[data-slot=card-action]]:grid-cols-[1fr_auto]",
          "[.border-b]:pb-6",
          className,
        )}
        {...rest}
      />
    );
  },
);

CardHeader.displayName = "CardHeader";

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CardTitle = React.forwardRef<HTMLDivElement, CardTitleProps>(
  function CardTitle({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="card-title"
        className={cn(
          "text-base font-semibold leading-none tracking-tight",
          className,
        )}
        {...rest}
      />
    );
  },
);

CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CardDescription = React.forwardRef<
  HTMLDivElement,
  CardDescriptionProps
>(function CardDescription({ className, ...rest }, ref) {
  return (
    <div
      ref={ref}
      data-slot="card-description"
      className={cn("text-sm text-zinc-500", className)}
      {...rest}
    />
  );
});

CardDescription.displayName = "CardDescription";

export interface CardActionProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CardAction = React.forwardRef<HTMLDivElement, CardActionProps>(
  function CardAction({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="card-action"
        className={cn(
          "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
          className,
        )}
        {...rest}
      />
    );
  },
);

CardAction.displayName = "CardAction";

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  function CardContent({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="card-content"
        className={cn("px-6", className)}
        {...rest}
      />
    );
  },
);

CardContent.displayName = "CardContent";

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="card-footer"
        className={cn(
          "flex items-center px-6",
          "[.border-t]:pt-6",
          className,
        )}
        {...rest}
      />
    );
  },
);

CardFooter.displayName = "CardFooter";
