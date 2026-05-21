"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export type DropzoneSize = "xs" | "sm" | "md" | "lg" | "xl";
export type DropzoneVariant = "outline" | "soft" | "ghost";

export type DropzoneRejectionCode =
  | "file-too-large"
  | "file-too-small"
  | "file-invalid-type"
  | "too-many-files";

export interface DropzoneRejectionError {
  code: DropzoneRejectionCode;
  message: string;
}

export interface DropzoneRejection {
  file: File;
  errors: DropzoneRejectionError[];
}

export interface DropzoneProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onDrop" | "onDragEnter" | "onDragOver" | "onDragLeave"
  > {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  minSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  size?: DropzoneSize;
  variant?: DropzoneVariant;
  onDrop?: (
    acceptedFiles: File[],
    rejections: DropzoneRejection[],
  ) => void;
  onAccept?: (files: File[]) => void;
  onReject?: (rejections: DropzoneRejection[]) => void;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  name?: string;
}

const SIZES: Record<
  DropzoneSize,
  { padding: string; icon: string; text: string; hint: string; minH: string }
> = {
  xs: { padding: "p-3", icon: "size-5", text: "text-xs", hint: "text-[10px]", minH: "min-h-20" },
  sm: { padding: "p-4", icon: "size-6", text: "text-xs", hint: "text-[11px]", minH: "min-h-24" },
  md: { padding: "p-6", icon: "size-8", text: "text-sm", hint: "text-xs", minH: "min-h-32" },
  lg: { padding: "p-8", icon: "size-10", text: "text-base", hint: "text-sm", minH: "min-h-40" },
  xl: { padding: "p-10", icon: "size-12", text: "text-lg", hint: "text-sm", minH: "min-h-48" },
};

const VARIANTS: Record<DropzoneVariant, string> = {
  outline: "border-zinc-300 bg-white",
  soft: "border-zinc-200 bg-zinc-50",
  ghost: "border-zinc-200 bg-transparent",
};

const DefaultIcon = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

function matchesMimeType(file: File, accept: string): boolean {
  const accepted = accept
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (accepted.length === 0) return true;

  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  return accepted.some((entry) => {
    if (entry.startsWith(".")) return fileName.endsWith(entry);
    if (entry.endsWith("/*")) {
      const prefix = entry.slice(0, -1);
      return fileType.startsWith(prefix);
    }
    return fileType === entry;
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(bytes < 10 * 1024 * 1024 ? 1 : 0)} MB`;
}

function buildFormatLabel(accept: string | undefined): string | null {
  if (!accept) return null;
  const formats = accept
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (formats.length === 0) return null;
  if (formats.length <= 6) return formats.join(", ");
  return `${formats.slice(0, 4).join(", ")} +${formats.length - 4} daha`;
}

function buildAutoHint(opts: {
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
}): string | null {
  const parts: string[] = [];
  const formats = buildFormatLabel(opts.accept);
  if (formats) parts.push(formats);
  if (opts.maxSize !== undefined) parts.push(`max ${formatBytes(opts.maxSize)}`);
  if (opts.multiple === false) {
    parts.push("tek dosya");
  } else if (opts.maxFiles !== undefined) {
    parts.push(`en fazla ${opts.maxFiles} dosya`);
  }
  return parts.length > 0 ? parts.join(" · ") : null;
}

function validateFile(
  file: File,
  opts: { accept?: string; maxSize?: number; minSize?: number },
): DropzoneRejectionError[] {
  const errors: DropzoneRejectionError[] = [];
  if (opts.accept && !matchesMimeType(file, opts.accept)) {
    errors.push({
      code: "file-invalid-type",
      message: `File type not accepted: ${file.type || "unknown"}`,
    });
  }
  if (opts.maxSize !== undefined && file.size > opts.maxSize) {
    errors.push({
      code: "file-too-large",
      message: `File is larger than ${opts.maxSize} bytes`,
    });
  }
  if (opts.minSize !== undefined && file.size < opts.minSize) {
    errors.push({
      code: "file-too-small",
      message: `File is smaller than ${opts.minSize} bytes`,
    });
  }
  return errors;
}

export const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
  function Dropzone(
    {
      accept,
      multiple = true,
      maxSize,
      minSize,
      maxFiles,
      disabled = false,
      size = "md",
      variant = "outline",
      onDrop,
      onAccept,
      onReject,
      label,
      hint,
      icon,
      name,
      className,
      children,
      onClick,
      onKeyDown,
      ...rest
    },
    ref,
  ) {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const dragCounterRef = React.useRef(0);
    const [isDragActive, setIsDragActive] = React.useState(false);
    const [isDragReject, setIsDragReject] = React.useState(false);

    const processFiles = (incoming: FileList | File[]) => {
      const files = Array.from(incoming);
      const accepted: File[] = [];
      const rejections: DropzoneRejection[] = [];

      for (const file of files) {
        const errors = validateFile(file, { accept, maxSize, minSize });
        if (errors.length > 0) {
          rejections.push({ file, errors });
        } else {
          accepted.push(file);
        }
      }

      if (
        maxFiles !== undefined &&
        accepted.length > maxFiles
      ) {
        const overflow = accepted.splice(maxFiles);
        for (const f of overflow) {
          rejections.push({
            file: f,
            errors: [
              {
                code: "too-many-files",
                message: `Max ${maxFiles} files allowed`,
              },
            ],
          });
        }
      }

      onDrop?.(accepted, rejections);
      if (accepted.length > 0) onAccept?.(accepted);
      if (rejections.length > 0) onReject?.(rejections);
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      dragCounterRef.current += 1;
      if (dragCounterRef.current === 1) {
        setIsDragActive(true);
        const items = e.dataTransfer.items;
        if (accept && items && items.length > 0) {
          const acceptedList = accept
            .split(",")
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean);
          const hasExtensionEntry = acceptedList.some((entry) =>
            entry.startsWith("."),
          );
          if (hasExtensionEntry) {
            setIsDragReject(false);
            return;
          }
          let anyRejected = false;
          for (let i = 0; i < items.length; i++) {
            const t = items[i].type.toLowerCase();
            if (!t) continue;
            const ok = acceptedList.some((entry) => {
              if (entry.endsWith("/*")) {
                return t.startsWith(entry.slice(0, -1));
              }
              return t === entry;
            });
            if (!ok) {
              anyRejected = true;
              break;
            }
          }
          setIsDragReject(anyRejected);
        }
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      e.dataTransfer.dropEffect = isDragReject ? "none" : "copy";
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      dragCounterRef.current = Math.max(0, dragCounterRef.current - 1);
      if (dragCounterRef.current === 0) {
        setIsDragActive(false);
        setIsDragReject(false);
      }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      dragCounterRef.current = 0;
      setIsDragActive(false);
      setIsDragReject(false);
      const files = e.dataTransfer.files;
      if (files && files.length > 0) processFiles(files);
    };

    const open = React.useCallback(() => {
      if (disabled) return;
      inputRef.current?.click();
    }, [disabled]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      open();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) processFiles(files);
      e.target.value = "";
    };

    const s = SIZES[size];
    const isDragAccept = isDragActive && !isDragReject;

    const autoHint = React.useMemo(
      () => buildAutoHint({ accept, maxSize, maxFiles, multiple }),
      [accept, maxSize, maxFiles, multiple],
    );
    const displayHint = hint || autoHint;

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        data-slot="dropzone"
        data-state={
          disabled
            ? "disabled"
            : isDragReject
              ? "drag-reject"
              : isDragAccept
                ? "drag-accept"
                : "idle"
        }
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-center transition-colors outline-none cursor-pointer select-none",
          "focus-visible:ring-2 focus-visible:ring-zinc-900/20 focus-visible:ring-offset-2",
          s.padding,
          s.minH,
          VARIANTS[variant],
          isDragAccept && "border-zinc-900 bg-zinc-50",
          isDragReject && "border-red-500 bg-red-50",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
        {...rest}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleInputChange}
          className="sr-only"
          tabIndex={-1}
        />
        {children ?? (
          <>
            <span
              aria-hidden="true"
              data-slot="dropzone-icon"
              className={cn(
                s.icon,
                "text-zinc-400 [&>svg]:size-full",
                isDragAccept && "text-zinc-700",
                isDragReject && "text-red-500",
              )}
            >
              {icon ?? DefaultIcon}
            </span>
            <div className="flex flex-col gap-0.5">
              <p
                data-slot="dropzone-label"
                className={cn(
                  "font-medium text-zinc-700",
                  s.text,
                  isDragAccept && "text-zinc-900",
                  isDragReject && "text-red-600",
                )}
              >
                {label ??
                  (isDragReject
                    ? "Bu dosya turune izin verilmiyor"
                    : isDragAccept
                      ? "Birakmak icin firlat"
                      : "Dosyalari buraya birak veya tikla")}
              </p>
              {displayHint && !isDragActive && (
                <p
                  data-slot="dropzone-hint"
                  className={cn("text-zinc-500", s.hint)}
                >
                  {displayHint}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    );
  },
);

Dropzone.displayName = "Dropzone";
