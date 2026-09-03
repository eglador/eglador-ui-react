"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../lib/utils";
import { useFloating } from "../../lib/use-floating";
import {
  clamp,
  hexToHsv,
  hsvToCssString,
  hsvToHex,
  type HSV,
} from "./color-utils";

export type ColorPickerSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ColorPickerVariant = "outline" | "soft" | "ghost";
export type ColorPickerShape = "square" | "rounded" | "pill";

export interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onValueCommit?: (value: string) => void;
  alpha?: boolean;
  presets?: string[];
  placeholder?: string;
  size?: ColorPickerSize;
  variant?: ColorPickerVariant;
  shape?: ColorPickerShape;
  disabled?: boolean;
  showHex?: boolean;
  name?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

const SIZES: Record<
  ColorPickerSize,
  { control: string; swatch: string; font: string; icon: string }
> = {
  xs: { control: "h-7 px-2", swatch: "size-4", font: "text-xs", icon: "size-3" },
  sm: { control: "h-8 px-2.5", swatch: "size-4", font: "text-xs", icon: "size-3.5" },
  md: { control: "h-9 px-3", swatch: "size-5", font: "text-sm", icon: "size-4" },
  lg: { control: "h-10 px-4", swatch: "size-6", font: "text-base", icon: "size-4" },
  xl: { control: "h-11 px-4", swatch: "size-7", font: "text-base", icon: "size-5" },
};

const SHAPES: Record<ColorPickerShape, string> = {
  square: "rounded-none",
  rounded: "rounded-md",
  pill: "rounded-full",
};

const SWATCH_SHAPES: Record<ColorPickerShape, string> = {
  square: "rounded-none",
  rounded: "rounded-sm",
  pill: "rounded-full",
};

const VARIANTS: Record<ColorPickerVariant, string> = {
  outline: "border border-zinc-300 bg-white hover:border-zinc-400",
  soft: "border border-transparent bg-zinc-100 hover:bg-zinc-200",
  ghost: "border border-transparent bg-transparent hover:bg-zinc-100",
};

const DEFAULT_PRESETS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#71717a",
  "#000000",
  "#ffffff",
];

const CHECKERBOARD =
  "linear-gradient(45deg, #cccccc 25%, transparent 25%), linear-gradient(-45deg, #cccccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cccccc 75%), linear-gradient(-45deg, transparent 75%, #cccccc 75%)";

const CHECKERBOARD_SIZE: React.CSSProperties = {
  backgroundImage: CHECKERBOARD,
  backgroundSize: "10px 10px",
  backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px",
};

interface DragTrackerProps {
  onDrag: (e: React.PointerEvent<HTMLDivElement>) => void;
  onCommit?: () => void;
  className?: string;
  children?: React.ReactNode;
  role?: string;
  tabIndex?: number;
  ariaLabel?: string;
  ariaValueNow?: number;
  ariaValueMin?: number;
  ariaValueMax?: number;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
}

function DragTracker({
  onDrag,
  onCommit,
  className,
  children,
  role,
  tabIndex,
  ariaLabel,
  ariaValueNow,
  ariaValueMin,
  ariaValueMax,
  onKeyDown,
  style,
}: DragTrackerProps) {
  const draggingRef = React.useRef(false);

  const handleDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    draggingRef.current = true;
    onDrag(e);
  };

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    onDrag(e);
  };

  const handleUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const target = e.currentTarget as HTMLElement;
    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
    }
    onCommit?.();
  };

  return (
    <div
      role={role}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      aria-valuenow={ariaValueNow}
      aria-valuemin={ariaValueMin}
      aria-valuemax={ariaValueMax}
      className={cn("relative touch-none select-none", className)}
      style={style}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      onPointerCancel={handleUp}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}

export function ColorPicker({
  value: controlled,
  defaultValue = "#3b82f6",
  onValueChange,
  onValueCommit,
  alpha = false,
  presets = DEFAULT_PRESETS,
  placeholder = "Renk sec",
  size = "md",
  variant = "outline",
  shape = "rounded",
  disabled = false,
  showHex = true,
  name,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}: ColorPickerProps) {
  const isControlled = controlled !== undefined;
  const initial = React.useMemo<HSV>(
    () => hexToHsv(controlled ?? defaultValue) ?? { h: 0, s: 0, v: 0, a: 1 },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const [hsv, setHsvState] = React.useState<HSV>(initial);
  const [open, setOpen] = React.useState(false);
  const [hexDraft, setHexDraft] = React.useState<string | null>(null);
  const [hexInvalid, setHexInvalid] = React.useState(false);
  const baseId = React.useId();

  const eyeDropperSupported = React.useMemo(
    () => typeof window !== "undefined" && "EyeDropper" in window,
    [],
  );

  React.useEffect(() => {
    if (!isControlled) return;
    const parsed = hexToHsv(controlled!);
    if (!parsed) return;
    if (
      Math.abs(parsed.h - hsv.h) < 0.001 &&
      Math.abs(parsed.s - hsv.s) < 0.001 &&
      Math.abs(parsed.v - hsv.v) < 0.001 &&
      Math.abs(parsed.a - hsv.a) < 0.001
    ) {
      return;
    }
    setHsvState(parsed);
  }, [controlled, isControlled, hsv.h, hsv.s, hsv.v, hsv.a]);

  const hex = React.useMemo(() => hsvToHex(hsv, alpha), [hsv, alpha]);
  const cssColor = React.useMemo(() => hsvToCssString(hsv), [hsv]);
  const hueCss = React.useMemo(
    () => hsvToCssString({ h: hsv.h, s: 1, v: 1, a: 1 }),
    [hsv.h],
  );

  const updateHsv = (next: HSV) => {
    setHsvState(next);
    onValueChange?.(hsvToHex(next, alpha));
  };

  const commit = () => {
    onValueCommit?.(hex);
  };

  const { anchorRef, floatingRef, position } = useFloating({
    open,
    side: "bottom",
    align: "start",
    sideOffset: 6,
  });

  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const f = floatingRef.current;
      const a = anchorRef.current;
      const t = e.target as Node;
      if (f?.contains(t) || a?.contains(t)) return;
      setOpen(false);
      commit();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, floatingRef, anchorRef]);

  const handleSvDrag = (
    e: React.PointerEvent<HTMLDivElement>,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const y = clamp((e.clientY - rect.top) / rect.height, 0, 1);
    updateHsv({ ...hsv, s: x, v: 1 - y });
  };

  const handleHueDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    updateHsv({ ...hsv, h: x * 360 });
  };

  const handleAlphaDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    updateHsv({ ...hsv, a: x });
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setHexDraft(v);
    if (v.trim() === "") {
      setHexInvalid(true);
      return;
    }
    const parsed = hexToHsv(v.startsWith("#") ? v : `#${v}`);
    if (parsed) {
      setHexInvalid(false);
      updateHsv(parsed);
    } else {
      setHexInvalid(true);
    }
  };

  const handleHexInputBlur = () => {
    setHexDraft(null);
    setHexInvalid(false);
    commit();
  };

  const handleEyeDropper = async () => {
    if (!eyeDropperSupported) return;
    try {
      const dropper = new (window as unknown as {
        EyeDropper: new () => { open(): Promise<{ sRGBHex: string }> };
      }).EyeDropper();
      const result = await dropper.open();
      const parsed = hexToHsv(result.sRGBHex);
      if (parsed) {
        updateHsv(parsed);
        commit();
      }
    } catch {
      // user cancelled
    }
  };

  const selectPreset = (preset: string) => {
    const parsed = hexToHsv(preset);
    if (parsed) {
      updateHsv(parsed);
      commit();
    }
  };

  const handleKeySV = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const stepSV = 0.02;
    let { s, v } = hsv;
    if (e.key === "ArrowLeft") s -= stepSV;
    else if (e.key === "ArrowRight") s += stepSV;
    else if (e.key === "ArrowUp") v += stepSV;
    else if (e.key === "ArrowDown") v -= stepSV;
    else return;
    e.preventDefault();
    updateHsv({ ...hsv, s: clamp(s, 0, 1), v: clamp(v, 0, 1) });
  };

  const handleKeyHue = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let h = hsv.h;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") h -= 1;
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") h += 1;
    else if (e.key === "PageDown") h -= 10;
    else if (e.key === "PageUp") h += 10;
    else if (e.key === "Home") h = 0;
    else if (e.key === "End") h = 359;
    else return;
    e.preventDefault();
    updateHsv({ ...hsv, h: ((h % 360) + 360) % 360 });
  };

  const handleKeyAlpha = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = 0.02;
    let a = hsv.a;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") a -= step;
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") a += step;
    else if (e.key === "Home") a = 0;
    else if (e.key === "End") a = 1;
    else return;
    e.preventDefault();
    updateHsv({ ...hsv, a: clamp(a, 0, 1) });
  };

  const s = SIZES[size];

  const displayHex = hexDraft ?? hex;

  return (
    <div
      data-slot="color-picker"
      className={cn("relative inline-flex", className)}
    >
      <button
        ref={(n) => {
          triggerRef.current = n;
          anchorRef.current = n;
        }}
        type="button"
        role="combobox"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={`${baseId}-picker`}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        disabled={disabled}
        data-slot="color-picker-trigger"
        data-state={open ? "open" : "closed"}
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          "inline-flex items-center gap-2 outline-none transition-colors cursor-pointer text-zinc-900",
          "focus-visible:border-zinc-400 focus-visible:ring-[3px] focus-visible:ring-zinc-900/[0.06]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          s.control,
          s.font,
          SHAPES[shape],
          VARIANTS[variant],
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "shrink-0 overflow-hidden border border-zinc-200",
            s.swatch,
            SWATCH_SHAPES[shape],
          )}
          style={{
            ...CHECKERBOARD_SIZE,
          }}
        >
          <span
            className={cn("block size-full", SWATCH_SHAPES[shape])}
            style={{ background: cssColor }}
          />
        </span>
        {showHex && (
          <span className="font-mono tabular-nums text-zinc-700">
            {displayHex.toUpperCase()}
          </span>
        )}
        {!showHex && !hex && (
          <span className="text-zinc-400">{placeholder}</span>
        )}
      </button>

      {name && <input type="hidden" name={name} value={hex} />}

      {open && typeof document !== "undefined"
        ? ReactDOM.createPortal(
            <div
              ref={(n) => {
                floatingRef.current = n;
              }}
              id={`${baseId}-picker`}
              role="dialog"
              data-slot="color-picker-content"
              data-state="open"
              className={cn(
                "fixed z-[1100] flex flex-col gap-3 p-3 outline-none",
                "rounded-md border border-zinc-200 bg-white shadow-md",
                "w-64",
              )}
              style={{
                top: position?.top ?? 0,
                left: position?.left ?? 0,
                visibility: position ? "visible" : "hidden",
              }}
            >
              <DragTracker
                role="slider"
                tabIndex={0}
                ariaLabel="Saturation and value"
                onDrag={handleSvDrag}
                onCommit={commit}
                onKeyDown={handleKeySV}
                className="h-40 w-full rounded-md outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20"
                style={{
                  background: `
                    linear-gradient(to top, #000, transparent),
                    linear-gradient(to right, #fff, transparent),
                    ${hueCss}
                  `,
                }}
              >
                <span
                  className="pointer-events-none absolute block size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
                  style={{
                    left: `${hsv.s * 100}%`,
                    top: `${(1 - hsv.v) * 100}%`,
                    background: hsvToCssString({ ...hsv, a: 1 }),
                  }}
                />
              </DragTracker>

              <DragTracker
                role="slider"
                tabIndex={0}
                ariaLabel="Hue"
                ariaValueNow={Math.round(hsv.h)}
                ariaValueMin={0}
                ariaValueMax={360}
                onDrag={handleHueDrag}
                onCommit={commit}
                onKeyDown={handleKeyHue}
                className="h-3 w-full rounded-full outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20"
                style={{
                  background:
                    "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                }}
              >
                <span
                  className="pointer-events-none absolute top-1/2 block size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
                  style={{
                    left: `${(hsv.h / 360) * 100}%`,
                    background: hueCss,
                  }}
                />
              </DragTracker>

              {alpha && (
                <DragTracker
                  role="slider"
                  tabIndex={0}
                  ariaLabel="Alpha"
                  ariaValueNow={Math.round(hsv.a * 100)}
                  ariaValueMin={0}
                  ariaValueMax={100}
                  onDrag={handleAlphaDrag}
                  onCommit={commit}
                  onKeyDown={handleKeyAlpha}
                  className="h-3 w-full rounded-full outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20"
                  style={CHECKERBOARD_SIZE}
                >
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `linear-gradient(to right, transparent, ${hsvToCssString(
                        { ...hsv, a: 1 },
                      )})`,
                    }}
                  />
                  <span
                    className="pointer-events-none absolute top-1/2 block size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
                    style={{
                      left: `${hsv.a * 100}%`,
                      background: cssColor,
                    }}
                  />
                </DragTracker>
              )}

              <div className="flex items-center gap-2">
                <div
                  aria-hidden="true"
                  className={cn(
                    "size-7 shrink-0 overflow-hidden border border-zinc-200",
                    SWATCH_SHAPES[shape],
                  )}
                  style={CHECKERBOARD_SIZE}
                >
                  <span
                    className={cn("block size-full", SWATCH_SHAPES[shape])}
                    style={{ background: cssColor }}
                  />
                </div>
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
                    #
                  </span>
                  <input
                    type="text"
                    aria-invalid={hexInvalid || undefined}
                    value={(hexDraft ?? hex).replace(/^#/, "").toUpperCase()}
                    onChange={handleHexInputChange}
                    onBlur={handleHexInputBlur}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                    maxLength={alpha ? 8 : 6}
                    spellCheck={false}
                    className={cn(
                      "h-8 w-full rounded-md border bg-white pl-5 pr-2 font-mono text-xs tabular-nums text-zinc-900 outline-none",
                      hexInvalid
                        ? "border-red-400 ring-[3px] ring-red-500/10"
                        : "border-zinc-300 focus-visible:border-zinc-400 focus-visible:ring-[3px] focus-visible:ring-zinc-900/[0.06]",
                    )}
                  />
                </div>
                {eyeDropperSupported && (
                  <button
                    type="button"
                    onClick={handleEyeDropper}
                    aria-label="Ekrandan renk sec (eyedropper)"
                    title="Ekrandan renk sec"
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-600 outline-none transition-colors hover:bg-zinc-50 hover:text-zinc-900 focus-visible:border-zinc-400 focus-visible:ring-[3px] focus-visible:ring-zinc-900/[0.06]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.75}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4"
                    >
                      <path d="m2 22 1-1h3l9-9" />
                      <path d="M3 21v-3l9-9" />
                      <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
                    </svg>
                  </button>
                )}
              </div>

              {presets.length > 0 && (
                <div className="grid grid-cols-10 gap-1">
                  {presets.map((preset) => {
                    const selected =
                      preset.toLowerCase() === hex.slice(0, 7).toLowerCase();
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => selectPreset(preset)}
                        aria-label={`Renk ${preset}`}
                        className={cn(
                          "block size-5 rounded-sm border outline-none transition-all hover:scale-110 focus-visible:ring-2 focus-visible:ring-zinc-900/30",
                          selected
                            ? "border-zinc-900 ring-1 ring-zinc-900"
                            : "border-zinc-200",
                        )}
                        style={{ background: preset }}
                      />
                    );
                  })}
                </div>
              )}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

ColorPicker.displayName = "ColorPicker";
