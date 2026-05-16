"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export type TextareaVariant = "outline" | "soft" | "ghost";
export type TextareaSize = "xs" | "sm" | "md" | "lg" | "xl";
export type TextareaShape = "square" | "rounded";
export type TextareaResize = "none" | "vertical" | "horizontal" | "both";

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  variant?: TextareaVariant;
  size?: TextareaSize;
  shape?: TextareaShape;
  resize?: TextareaResize;
  autoGrow?: boolean;
  maxRows?: number;
}

const SIZES: Record<TextareaSize, { padding: string; font: string }> = {
  xs: { padding: "px-2 py-1.5", font: "text-xs" },
  sm: { padding: "px-2.5 py-1.5", font: "text-sm" },
  md: { padding: "px-3 py-2", font: "text-sm" },
  lg: { padding: "px-3.5 py-2.5", font: "text-base" },
  xl: { padding: "px-4 py-3", font: "text-lg" },
};

const SHAPES: Record<TextareaShape, string> = {
  square: "rounded-none",
  rounded: "rounded-sm",
};

const VARIANTS: Record<TextareaVariant, string> = {
  outline: "bg-white border border-zinc-300",
  soft: "bg-zinc-50 border border-zinc-200",
  ghost:
    "bg-transparent border border-transparent focus-visible:border-zinc-300",
};

const RESIZE_MAP: Record<TextareaResize, string> = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  both: "resize",
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      variant = "outline",
      size = "md",
      shape = "rounded",
      resize = "vertical",
      autoGrow = false,
      maxRows,
      className,
      onChange,
      rows = 3,
      ...rest
    },
    ref,
  ) {
    const internalRef = React.useRef<HTMLTextAreaElement | null>(null);
    const s = SIZES[size];

    const adjustHeight = React.useCallback(() => {
      const el = internalRef.current;
      if (!el || !autoGrow) return;
      el.style.height = "auto";
      let next = el.scrollHeight;
      if (maxRows) {
        const lh = parseInt(getComputedStyle(el).lineHeight, 10) || 20;
        const pad =
          parseInt(getComputedStyle(el).paddingTop, 10) +
          parseInt(getComputedStyle(el).paddingBottom, 10);
        next = Math.min(next, lh * maxRows + pad);
      }
      el.style.height = `${next}px`;
    }, [autoGrow, maxRows]);

    React.useEffect(() => {
      if (autoGrow) adjustHeight();
    }, [adjustHeight, autoGrow]);

    const mergedRef = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      },
      [ref],
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e);
      if (autoGrow) adjustHeight();
    };

    return (
      <textarea
        ref={mergedRef}
        rows={rows}
        data-slot="textarea"
        onChange={handleChange}
        className={cn(
          "w-full transition-colors",
          "text-zinc-900 placeholder:text-zinc-400",
          "focus-visible:outline-none focus-visible:border-zinc-400 focus-visible:ring-[3px] focus-visible:ring-zinc-900/[0.06]",
          "aria-invalid:border-red-500 aria-invalid:ring-[3px] aria-invalid:ring-red-500/10",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-50",
          "read-only:bg-zinc-50 read-only:text-zinc-600",
          VARIANTS[variant],
          SHAPES[shape],
          s.padding,
          s.font,
          autoGrow ? "resize-none overflow-hidden" : RESIZE_MAP[resize],
          className,
        )}
        {...rest}
      />
    );
  },
);

Textarea.displayName = "Textarea";
