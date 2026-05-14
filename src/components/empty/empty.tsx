import * as React from "react";
import { cn } from "../../lib/utils";

export interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  function Empty({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="empty"
        className={cn(
          "flex w-full flex-col items-center justify-center gap-6 p-6 text-center md:p-12",
          className,
        )}
        {...rest}
      />
    );
  },
);

Empty.displayName = "Empty";

export interface EmptyHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const EmptyHeader = React.forwardRef<HTMLDivElement, EmptyHeaderProps>(
  function EmptyHeader({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="empty-header"
        className={cn("flex flex-col items-center gap-2", className)}
        {...rest}
      />
    );
  },
);

EmptyHeader.displayName = "EmptyHeader";

export type EmptyMediaVariant = "default" | "icon";

export interface EmptyMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: EmptyMediaVariant;
}

export const EmptyMedia = React.forwardRef<HTMLDivElement, EmptyMediaProps>(
  function EmptyMedia({ variant = "default", className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="empty-media"
        data-variant={variant}
        className={cn(
          "mb-2 flex items-center justify-center",
          variant === "icon" &&
            "size-12 rounded-full bg-zinc-100 text-zinc-600 [&_svg]:size-6 [&_svg]:shrink-0",
          className,
        )}
        {...rest}
      />
    );
  },
);

EmptyMedia.displayName = "EmptyMedia";

export interface EmptyTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export const EmptyTitle = React.forwardRef<HTMLHeadingElement, EmptyTitleProps>(
  function EmptyTitle({ className, ...rest }, ref) {
    return (
      <h3
        ref={ref}
        data-slot="empty-title"
        className={cn(
          "text-base font-semibold tracking-tight text-zinc-900",
          className,
        )}
        {...rest}
      />
    );
  },
);

EmptyTitle.displayName = "EmptyTitle";

export interface EmptyDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const EmptyDescription = React.forwardRef<
  HTMLParagraphElement,
  EmptyDescriptionProps
>(function EmptyDescription({ className, ...rest }, ref) {
  return (
    <p
      ref={ref}
      data-slot="empty-description"
      className={cn(
        "max-w-sm text-sm leading-relaxed text-zinc-500",
        className,
      )}
      {...rest}
    />
  );
});

EmptyDescription.displayName = "EmptyDescription";

export interface EmptyContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const EmptyContent = React.forwardRef<HTMLDivElement, EmptyContentProps>(
  function EmptyContent({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="empty-content"
        className={cn(
          "flex w-full max-w-sm flex-col items-center gap-2",
          className,
        )}
        {...rest}
      />
    );
  },
);

EmptyContent.displayName = "EmptyContent";
