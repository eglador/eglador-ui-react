"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { CheckIcon } from "../../lib/icons";

export type StepperVariant = "solid" | "outline";
export type StepperSize = "xs" | "sm" | "md" | "lg" | "xl";
export type StepperOrientation = "horizontal" | "vertical";
export type StepStatus = "completed" | "active" | "upcoming" | "error";

interface StepperContextValue {
  activeStep: number;
  totalSteps: number;
  variant: StepperVariant;
  size: StepperSize;
  orientation: StepperOrientation;
  clickable: boolean;
  onStepClick?: (step: number) => void;
  errors: number[];
}

const StepperContext = React.createContext<StepperContextValue | null>(null);

function useStepper(): StepperContextValue {
  const ctx = React.useContext(StepperContext);
  if (!ctx) throw new Error("Step must be used within <Stepper>");
  return ctx;
}

const SIZES: Record<
  StepperSize,
  {
    indicator: string;
    indicatorFont: string;
    iconSize: string;
    checkSize: string;
    titleFont: string;
    descFont: string;
    contentFont: string;
    gap: string;
    pad: string;
  }
> = {
  xs: {
    indicator: "size-6",
    indicatorFont: "text-[10px]",
    iconSize: "size-3",
    checkSize: "size-3",
    titleFont: "text-xs",
    descFont: "text-[10px]",
    contentFont: "text-xs",
    gap: "gap-1",
    pad: "pb-4",
  },
  sm: {
    indicator: "size-7",
    indicatorFont: "text-xs",
    iconSize: "size-3.5",
    checkSize: "size-3.5",
    titleFont: "text-sm",
    descFont: "text-xs",
    contentFont: "text-sm",
    gap: "gap-1.5",
    pad: "pb-5",
  },
  md: {
    indicator: "size-8",
    indicatorFont: "text-sm",
    iconSize: "size-4",
    checkSize: "size-4",
    titleFont: "text-sm",
    descFont: "text-xs",
    contentFont: "text-sm",
    gap: "gap-2",
    pad: "pb-6",
  },
  lg: {
    indicator: "size-10",
    indicatorFont: "text-sm",
    iconSize: "size-5",
    checkSize: "size-5",
    titleFont: "text-base",
    descFont: "text-sm",
    contentFont: "text-base",
    gap: "gap-2",
    pad: "pb-8",
  },
  xl: {
    indicator: "size-12",
    indicatorFont: "text-base",
    iconSize: "size-6",
    checkSize: "size-6",
    titleFont: "text-lg",
    descFont: "text-base",
    contentFont: "text-base",
    gap: "gap-2.5",
    pad: "pb-10",
  },
};

const STATUS_STYLES: Record<
  StepperVariant,
  Record<StepStatus, { indicator: string; connector: string; title: string }>
> = {
  solid: {
    completed: {
      indicator: "bg-zinc-900 border-zinc-900 text-white",
      connector: "bg-zinc-900",
      title: "text-zinc-900",
    },
    active: {
      indicator:
        "bg-zinc-900 border-zinc-900 text-white ring-4 ring-zinc-900/10",
      connector: "bg-zinc-200",
      title: "text-zinc-900",
    },
    upcoming: {
      indicator: "bg-zinc-100 border-zinc-200 text-zinc-400",
      connector: "bg-zinc-200",
      title: "text-zinc-400",
    },
    error: {
      indicator: "bg-zinc-900 border-zinc-900 text-white",
      connector: "bg-zinc-200",
      title: "text-zinc-900",
    },
  },
  outline: {
    completed: {
      indicator: "bg-white border-zinc-900 text-zinc-900",
      connector: "bg-zinc-900",
      title: "text-zinc-900",
    },
    active: {
      indicator: "bg-white border-zinc-900 border-2 text-zinc-900",
      connector: "bg-zinc-200",
      title: "text-zinc-900",
    },
    upcoming: {
      indicator: "bg-white border-zinc-300 text-zinc-400",
      connector: "bg-zinc-200",
      title: "text-zinc-400",
    },
    error: {
      indicator: "bg-white border-zinc-900 border-2 text-zinc-900",
      connector: "bg-zinc-200",
      title: "text-zinc-900",
    },
  },
};

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep?: number;
  variant?: StepperVariant;
  size?: StepperSize;
  orientation?: StepperOrientation;
  clickable?: boolean;
  onStepClick?: (step: number) => void;
  errors?: number[];
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  function Stepper(
    {
      activeStep = 0,
      variant = "solid",
      size = "md",
      orientation = "horizontal",
      clickable = false,
      onStepClick,
      errors = [],
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const childArray = React.Children.toArray(children).filter(
      React.isValidElement,
    );
    const totalSteps = childArray.length;

    return (
      <StepperContext.Provider
        value={{
          activeStep,
          totalSteps,
          variant,
          size,
          orientation,
          clickable,
          onStepClick,
          errors,
        }}
      >
        <div
          ref={ref}
          data-slot="stepper"
          data-orientation={orientation}
          className={cn(
            "flex",
            orientation === "horizontal"
              ? "flex-row items-start"
              : "flex-col",
            className,
          )}
          {...rest}
        >
          {childArray.map((child, index) =>
            React.cloneElement(child as React.ReactElement<StepInternalProps>, {
              __stepIndex: index,
              __isLast: index === totalSteps - 1,
            }),
          )}
        </div>
      </StepperContext.Provider>
    );
  },
);

Stepper.displayName = "Stepper";

export interface StepProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  indicator?: React.ReactNode;
}

interface StepInternalProps extends StepProps {
  __stepIndex?: number;
  __isLast?: boolean;
}

export const Step = React.forwardRef<HTMLDivElement, StepProps>(function Step(
  rawProps,
  ref,
) {
  const {
    title,
    description,
    icon,
    indicator,
    className,
    children,
    __stepIndex,
    __isLast,
    ...rest
  } = rawProps as StepInternalProps;
  const ctx = useStepper();
  const index = __stepIndex ?? 0;
  const isLast = __isLast ?? index === ctx.totalSteps - 1;
  const s = SIZES[ctx.size];

  const status: StepStatus = ctx.errors.includes(index)
    ? "error"
    : index < ctx.activeStep
      ? "completed"
      : index === ctx.activeStep
        ? "active"
        : "upcoming";

  const styles = STATUS_STYLES[ctx.variant][status];
  const isClickable = ctx.clickable && !!ctx.onStepClick;

  const indicatorNode = indicator ?? (
    <div
      className={cn(
        "shrink-0 inline-flex items-center justify-center rounded-full border font-semibold transition-all",
        s.indicator,
        s.indicatorFont,
        styles.indicator,
      )}
    >
      {status === "completed" ? (
        <CheckIcon className={s.checkSize} />
      ) : icon ? (
        <span
          className={cn(
            "inline-flex items-center justify-center [&>svg]:w-full [&>svg]:h-full",
            s.iconSize,
          )}
        >
          {icon}
        </span>
      ) : (
        index + 1
      )}
    </div>
  );

  if (ctx.orientation === "vertical") {
    return (
      <div
        ref={ref}
        data-slot="step"
        data-status={status}
        className={cn("flex flex-row", isLast ? "" : s.pad, className)}
        {...rest}
      >
        <div className="flex flex-col items-center shrink-0">
          <button
            type="button"
            disabled={!isClickable}
            onClick={() => isClickable && ctx.onStepClick?.(index)}
            className={cn(
              "rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20",
              isClickable ? "cursor-pointer" : "cursor-default",
              !isClickable && "pointer-events-none",
            )}
          >
            {indicatorNode}
          </button>
          {!isLast && (
            <div
              className={cn("w-px flex-1 min-h-6 my-1.5", styles.connector)}
            />
          )}
        </div>
        <div className="flex flex-col min-w-0 ms-3 flex-1">
          {title && (
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && ctx.onStepClick?.(index)}
              className={cn(
                "text-left font-semibold leading-snug",
                s.titleFont,
                styles.title,
                isClickable ? "cursor-pointer" : "cursor-default",
                !isClickable && "pointer-events-none",
              )}
            >
              {title}
            </button>
          )}
          {description && (
            <span
              className={cn(
                "leading-relaxed text-zinc-500 mt-0.5",
                s.descFont,
              )}
            >
              {description}
            </span>
          )}
          {children && (
            <div className={cn("mt-2 text-zinc-600", s.contentFont)}>
              {children}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={ref}
        data-slot="step"
        data-status={status}
        className={cn(
          "flex flex-col items-center text-center min-w-0",
          s.gap,
          className,
        )}
        {...rest}
      >
        <button
          type="button"
          disabled={!isClickable}
          onClick={() => isClickable && ctx.onStepClick?.(index)}
          className={cn(
            "rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20",
            isClickable ? "cursor-pointer" : "cursor-default",
            !isClickable && "pointer-events-none",
          )}
        >
          {indicatorNode}
        </button>
        {(title || description) && (
          <div className="flex flex-col min-w-0">
            {title && (
              <span
                className={cn(
                  "font-semibold leading-snug",
                  s.titleFont,
                  styles.title,
                )}
              >
                {title}
              </span>
            )}
            {description && (
              <span
                className={cn("leading-relaxed text-zinc-500", s.descFont)}
              >
                {description}
              </span>
            )}
          </div>
        )}
      </div>
      {!isLast && (
        <div className="flex-1 flex items-center px-2 pt-3">
          <div className={cn("flex-1 h-px", styles.connector)} />
        </div>
      )}
    </>
  );
});

Step.displayName = "Step";
