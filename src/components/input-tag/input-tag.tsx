"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { XIcon } from "../../lib/icons";

export type InputTagSize = "xs" | "sm" | "md" | "lg" | "xl";
export type InputTagVariant = "outline" | "soft" | "ghost";
export type InputTagShape = "square" | "rounded" | "pill";

export interface InputTagRenderTagHelpers {
  remove: () => void;
  index: number;
}

export interface InputTagProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "size" | "onClick"
  > {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (tags: string[]) => void;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  size?: InputTagSize;
  variant?: InputTagVariant;
  shape?: InputTagShape;
  /** Extra characters that commit the draft as a tag. Enter is always active. */
  delimiters?: string[];
  /** Whether the same value may appear more than once. */
  allowDuplicates?: boolean;
  /** Upper bound on total tags. Further commits are rejected. */
  maxTags?: number;
  /** Normalize the draft before commit. Defaults to trim. */
  transform?: (raw: string) => string;
  /** Return false / string to block a commit. */
  validate?: (tag: string, current: string[]) => boolean | string;
  /** Auto-split pasted content using newline + delimiters. */
  splitOnPaste?: boolean;
  /** Custom chip renderer. */
  renderTag?: (tag: string, helpers: InputTagRenderTagHelpers) => React.ReactNode;
}

const SIZES: Record<
  InputTagSize,
  {
    control: string;
    font: string;
    chip: string;
    chipIconBtn: string;
    chipIcon: string;
    pad: string;
    gap: string;
    inputH: string;
  }
> = {
  xs: {
    control: "min-h-7",
    font: "text-xs",
    chip: "h-5 text-[10px] px-1.5",
    chipIconBtn: "size-3.5",
    chipIcon: "size-2.5",
    pad: "px-1 py-0.5",
    gap: "gap-1",
    inputH: "h-5",
  },
  sm: {
    control: "min-h-8",
    font: "text-xs",
    chip: "h-6 text-xs px-2",
    chipIconBtn: "size-4",
    chipIcon: "size-3",
    pad: "px-1.5 py-1",
    gap: "gap-1",
    inputH: "h-6",
  },
  md: {
    control: "min-h-9",
    font: "text-sm",
    chip: "h-6 text-xs px-2",
    chipIconBtn: "size-4",
    chipIcon: "size-3",
    pad: "px-2 py-1",
    gap: "gap-1.5",
    inputH: "h-7",
  },
  lg: {
    control: "min-h-10",
    font: "text-base",
    chip: "h-7 text-sm px-2.5",
    chipIconBtn: "size-4",
    chipIcon: "size-3.5",
    pad: "px-2 py-1.5",
    gap: "gap-1.5",
    inputH: "h-8",
  },
  xl: {
    control: "min-h-11",
    font: "text-base",
    chip: "h-8 text-sm px-3",
    chipIconBtn: "size-5",
    chipIcon: "size-4",
    pad: "px-2.5 py-1.5",
    gap: "gap-2",
    inputH: "h-9",
  },
};

const SHAPES: Record<InputTagShape, string> = {
  square: "rounded-none",
  rounded: "rounded-md",
  pill: "rounded-full",
};

const CHIP_SHAPES: Record<InputTagShape, string> = {
  square: "rounded-none",
  rounded: "rounded-sm",
  pill: "rounded-full",
};

const VARIANTS: Record<InputTagVariant, string> = {
  outline: "border border-zinc-300 bg-white hover:border-zinc-400",
  soft: "border border-transparent bg-zinc-100",
  ghost: "border border-transparent bg-transparent",
};

const defaultTransform = (raw: string) => raw.trim();

export const InputTag = React.forwardRef<HTMLInputElement, InputTagProps>(
  function InputTag(
    {
      value: controlled,
      defaultValue = [],
      onValueChange,
      size = "md",
      variant = "outline",
      shape = "rounded",
      delimiters,
      allowDuplicates = false,
      maxTags,
      transform = defaultTransform,
      validate,
      splitOnPaste = true,
      renderTag,
      placeholder,
      disabled,
      readOnly,
      className,
      onKeyDown,
      onPaste,
      onFocus,
      onBlur,
      onClick,
      "aria-invalid": ariaInvalid,
      "aria-label": ariaLabel,
      ...rest
    },
    forwardedRef,
  ) {
    const [internal, setInternal] = React.useState<string[]>(defaultValue);
    const isControlled = controlled !== undefined;
    const tags = isControlled ? controlled : internal;

    const [draft, setDraft] = React.useState("");
    const [focusedChip, setFocusedChip] = React.useState<number | null>(null);

    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef)
          (
            forwardedRef as React.MutableRefObject<HTMLInputElement | null>
          ).current = node;
      },
      [forwardedRef],
    );

    const setTags = React.useCallback(
      (next: string[]) => {
        if (!isControlled) setInternal(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const canAccept = React.useCallback(
      (raw: string, current: string[]) => {
        const next = transform(raw);
        if (!next) return null;
        if (!allowDuplicates && current.includes(next)) return null;
        if (maxTags !== undefined && current.length >= maxTags) return null;
        if (validate) {
          const result = validate(next, current);
          if (result === false || typeof result === "string") return null;
        }
        return next;
      },
      [transform, allowDuplicates, maxTags, validate],
    );

    const commit = (raw: string): boolean => {
      const accepted = canAccept(raw, tags);
      if (!accepted) return false;
      setTags([...tags, accepted]);
      return true;
    };

    const removeAt = (index: number) => {
      const next = tags.filter((_, i) => i !== index);
      setTags(next);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      if (readOnly || disabled) return;

      const isDelimiter = delimiters?.includes(e.key) ?? false;

      if (e.key === "Enter" || isDelimiter) {
        if (draft.length > 0) {
          e.preventDefault();
          if (commit(draft)) setDraft("");
          return;
        }
      }

      if (draft.length === 0) {
        if (e.key === "Backspace") {
          if (focusedChip !== null) {
            e.preventDefault();
            const idx = focusedChip;
            removeAt(idx);
            setFocusedChip(idx > 0 ? idx - 1 : tags.length - 1 > 0 ? 0 : null);
            return;
          }
          if (tags.length > 0) {
            e.preventDefault();
            setFocusedChip(tags.length - 1);
            return;
          }
        }
        if (e.key === "ArrowLeft") {
          if (tags.length === 0) return;
          e.preventDefault();
          if (focusedChip === null) setFocusedChip(tags.length - 1);
          else setFocusedChip(Math.max(0, focusedChip - 1));
          return;
        }
        if (e.key === "ArrowRight") {
          if (focusedChip === null) return;
          e.preventDefault();
          if (focusedChip >= tags.length - 1) setFocusedChip(null);
          else setFocusedChip(focusedChip + 1);
          return;
        }
        if (e.key === "Delete" && focusedChip !== null) {
          e.preventDefault();
          const idx = focusedChip;
          removeAt(idx);
          setFocusedChip(idx >= tags.length - 1 ? null : idx);
          return;
        }
      }

      if (focusedChip !== null) setFocusedChip(null);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      onPaste?.(e);
      if (e.defaultPrevented) return;
      if (!splitOnPaste || readOnly || disabled) return;
      const text = e.clipboardData.getData("text");
      const splitters = ["\n", "\r", ...(delimiters ?? [])];
      if (!splitters.some((s) => text.includes(s))) return;
      e.preventDefault();
      let parts = [text];
      for (const s of splitters) {
        parts = parts.flatMap((p) => p.split(s));
      }
      const acc = [...tags];
      for (const raw of parts) {
        const accepted = canAccept(raw, acc);
        if (accepted) acc.push(accepted);
      }
      if (acc.length !== tags.length) {
        setTags(acc);
        setDraft("");
      }
    };

    const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      if ((e.target as HTMLElement).closest("button")) return;
      if (!disabled && !readOnly) inputRef.current?.focus();
    };

    const showPlaceholder = tags.length === 0 && draft.length === 0;

    return (
      <div
        role="group"
        data-slot="input-tag"
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        aria-invalid={ariaInvalid}
        aria-label={ariaLabel}
        onClick={handleWrapperClick}
        className={cn(
          "flex w-full flex-wrap items-center transition-colors text-zinc-900 cursor-text",
          "focus-within:border-zinc-400 focus-within:ring-[3px] focus-within:ring-zinc-900/[0.06]",
          "aria-invalid:border-red-500 aria-invalid:ring-[3px] aria-invalid:ring-red-500/10",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          readOnly && "bg-zinc-50",
          SHAPES[shape],
          VARIANTS[variant],
          SIZES[size].control,
          SIZES[size].pad,
          SIZES[size].gap,
          SIZES[size].font,
          className,
        )}
      >
        {tags.map((tag, i) => {
          const isChipFocused = focusedChip === i;
          const remove = () => removeAt(i);
          if (renderTag) {
            return (
              <React.Fragment key={`${tag}-${i}`}>
                {renderTag(tag, { remove, index: i })}
              </React.Fragment>
            );
          }
          return (
            <span
              key={`${tag}-${i}`}
              data-slot="input-tag-chip"
              data-state={isChipFocused ? "focused" : "default"}
              className={cn(
                "inline-flex items-center gap-1 bg-zinc-100 text-zinc-800 font-medium select-none",
                CHIP_SHAPES[shape],
                SIZES[size].chip,
                isChipFocused && "ring-2 ring-zinc-900/30",
              )}
            >
              <span className="truncate max-w-[16rem]">{tag}</span>
              {!readOnly && !disabled && (
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={`Remove ${tag}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    remove();
                  }}
                  className={cn(
                    "inline-flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 cursor-pointer",
                    CHIP_SHAPES[shape],
                    SIZES[size].chipIconBtn,
                  )}
                >
                  <XIcon className={SIZES[size].chipIcon} />
                </button>
              )}
            </span>
          );
        })}
        <input
          ref={setRefs}
          type="text"
          value={draft}
          placeholder={showPlaceholder ? placeholder : undefined}
          disabled={disabled}
          readOnly={readOnly}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={(e) => {
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocusedChip(null);
            onBlur?.(e);
          }}
          className={cn(
            "flex-1 min-w-[60px] bg-transparent outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed",
            SIZES[size].inputH,
          )}
          {...rest}
        />
      </div>
    );
  },
);

InputTag.displayName = "InputTag";
