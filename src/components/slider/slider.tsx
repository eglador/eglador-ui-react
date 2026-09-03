"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { sameList, useControlledSync } from "../../lib/use-controlled-sync";

export type SliderSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SliderOrientation = "horizontal" | "vertical";

export interface SliderMarkObject {
  value: number;
  label?: React.ReactNode;
}

export type SliderMark = number | SliderMarkObject;

export interface SliderProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "defaultValue" | "onChange"
  > {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: SliderSize;
  orientation?: SliderOrientation;
  disabled?: boolean;
  marks?: SliderMark[];
  showMarkLabels?: boolean;
  name?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  minStepsBetweenThumbs?: number;
}

interface SizeSpec {
  trackThickness: number;
  thumb: string;
  containerCross: number;
}

const SIZES: Record<SliderSize, SizeSpec> = {
  xs: { trackThickness: 4, thumb: "size-3", containerCross: 12 },
  sm: { trackThickness: 6, thumb: "size-3.5", containerCross: 14 },
  md: { trackThickness: 8, thumb: "size-4", containerCross: 16 },
  lg: { trackThickness: 10, thumb: "size-5", containerCross: 20 },
  xl: { trackThickness: 12, thumb: "size-6", containerCross: 24 },
};

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

function snapToStep(n: number, min: number, step: number): number {
  const offset = n - min;
  const snapped = Math.round(offset / step) * step;
  return min + snapped;
}

function normalizeMark(m: SliderMark): SliderMarkObject {
  return typeof m === "number" ? { value: m } : m;
}

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  function Slider(
    {
      value: controlled,
      defaultValue = [0],
      onValueChange,
      onValueCommit,
      min = 0,
      max = 100,
      step = 1,
      size = "md",
      orientation = "horizontal",
      disabled = false,
      marks,
      showMarkLabels = false,
      name,
      minStepsBetweenThumbs = 0,
      className,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      ...rest
    },
    ref,
  ) {
    const isControlled = controlled !== undefined;
    const [internal, setInternal] = React.useState<number[]>(
      controlled !== undefined ? controlled : defaultValue,
    );
    const value = isControlled ? controlled! : internal;
    useControlledSync(controlled, (v) =>
      setInternal((prev) => (sameList(prev, v) ? prev : v)),
    );

    const containerRef = React.useRef<HTMLDivElement>(null);
    const dragIndexRef = React.useRef<number | null>(null);

    const isVertical = orientation === "vertical";
    const spec = SIZES[size];
    const range = max - min;

    const sorted = React.useMemo(() => {
      return value
        .map((v, i) => ({ v, i }))
        .sort((a, b) => a.v - b.v);
    }, [value]);

    const lowPct = ((sorted[0].v - min) / range) * 100;
    const highPct =
      ((sorted[sorted.length - 1].v - min) / range) * 100;
    const fillStart = value.length === 1 ? 0 : lowPct;
    const fillEnd = value.length === 1 ? lowPct : highPct;

    const commitValue = React.useCallback(
      (next: number[]) => {
        setInternal(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const updateThumb = React.useCallback(
      (index: number, rawValue: number) => {
        const snapped = clamp(snapToStep(rawValue, min, step), min, max);
        const minGap = minStepsBetweenThumbs * step;
        const next = [...value];
        const lower = index > 0 ? next[index - 1] + minGap : min;
        const upper =
          index < next.length - 1 ? next[index + 1] - minGap : max;
        next[index] = clamp(snapped, lower, upper);
        if (next[index] === value[index]) return;
        commitValue(next);
      },
      [value, min, max, step, minStepsBetweenThumbs, commitValue],
    );

    const positionFromClientCoord = React.useCallback(
      (clientX: number, clientY: number): number => {
        const el = containerRef.current;
        if (!el) return min;
        const rect = el.getBoundingClientRect();
        if (isVertical) {
          const ratio = clamp(
            1 - (clientY - rect.top) / rect.height,
            0,
            1,
          );
          return min + ratio * range;
        }
        const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
        return min + ratio * range;
      },
      [isVertical, min, range],
    );

    const nearestThumbIndex = React.useCallback(
      (rawValue: number): number => {
        let best = 0;
        let bestDist = Math.abs(value[0] - rawValue);
        for (let i = 1; i < value.length; i++) {
          const d = Math.abs(value[i] - rawValue);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        }
        return best;
      },
      [value],
    );

    const handleThumbPointerDown = (
      e: React.PointerEvent<HTMLSpanElement>,
      index: number,
    ) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      dragIndexRef.current = index;
    };

    const handleThumbPointerMove = (
      e: React.PointerEvent<HTMLSpanElement>,
    ) => {
      const idx = dragIndexRef.current;
      if (idx === null) return;
      const raw = positionFromClientCoord(e.clientX, e.clientY);
      updateThumb(idx, raw);
    };

    const handleThumbPointerUp = (
      e: React.PointerEvent<HTMLSpanElement>,
    ) => {
      const target = e.target as HTMLElement;
      if (target.hasPointerCapture(e.pointerId)) {
        target.releasePointerCapture(e.pointerId);
      }
      if (dragIndexRef.current !== null) {
        dragIndexRef.current = null;
        onValueCommit?.(value);
      }
    };

    const handleTrackPointerDown = (
      e: React.PointerEvent<HTMLDivElement>,
    ) => {
      if (disabled) return;
      const raw = positionFromClientCoord(e.clientX, e.clientY);
      const idx = nearestThumbIndex(raw);
      updateThumb(idx, raw);
    };

    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLSpanElement>,
      index: number,
    ) => {
      if (disabled) return;
      const pageStep = Math.max(step, range / 10);
      const decreaseKeys = isVertical
        ? ["ArrowDown", "ArrowLeft"]
        : ["ArrowLeft", "ArrowDown"];
      const increaseKeys = isVertical
        ? ["ArrowUp", "ArrowRight"]
        : ["ArrowRight", "ArrowUp"];
      let delta = 0;
      if (decreaseKeys.includes(e.key)) delta = -step;
      else if (increaseKeys.includes(e.key)) delta = step;
      else if (e.key === "PageDown") delta = -pageStep;
      else if (e.key === "PageUp") delta = pageStep;
      else if (e.key === "Home") {
        e.preventDefault();
        updateThumb(index, min);
        onValueCommit?.(value);
        return;
      } else if (e.key === "End") {
        e.preventDefault();
        updateThumb(index, max);
        onValueCommit?.(value);
        return;
      } else {
        return;
      }
      e.preventDefault();
      updateThumb(index, value[index] + delta);
      onValueCommit?.(value);
    };

    const horizontalContainerStyle: React.CSSProperties = {
      height: spec.containerCross,
    };
    const verticalContainerStyle: React.CSSProperties = {
      width: spec.containerCross,
    };

    const trackStyle: React.CSSProperties = isVertical
      ? {
          width: spec.trackThickness,
          left: "50%",
          top: 0,
          bottom: 0,
          transform: "translateX(-50%)",
        }
      : {
          height: spec.trackThickness,
          top: "50%",
          left: 0,
          right: 0,
          transform: "translateY(-50%)",
        };

    const rangeFillStyle: React.CSSProperties = isVertical
      ? {
          bottom: `${fillStart}%`,
          top: `${100 - fillEnd}%`,
          left: 0,
          right: 0,
        }
      : {
          left: `${fillStart}%`,
          right: `${100 - fillEnd}%`,
          top: 0,
          bottom: 0,
        };

    return (
      <div
        ref={(node) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        data-slot="slider"
        data-orientation={orientation}
        data-disabled={disabled || undefined}
        className={cn(
          "relative select-none",
          isVertical ? "inline-block h-48" : "w-full",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
        style={isVertical ? verticalContainerStyle : horizontalContainerStyle}
        {...rest}
      >
        <div
          aria-hidden="true"
          className={cn(
            "absolute rounded-full bg-zinc-200",
            !disabled && "cursor-pointer",
          )}
          style={{ ...trackStyle, touchAction: "none" }}
          onPointerDown={handleTrackPointerDown}
        >
          <div
            className="absolute rounded-full bg-zinc-900"
            style={rangeFillStyle}
          />
          {marks?.map((raw) => {
            const m = normalizeMark(raw);
            const pct = ((m.value - min) / range) * 100;
            const markStyle: React.CSSProperties = isVertical
              ? { bottom: `${pct}%`, left: "50%", transform: "translate(-50%, 50%)" }
              : { left: `${pct}%`, top: "50%", transform: "translate(-50%, -50%)" };
            const inRange = m.value >= sorted[0].v && m.value <= sorted[sorted.length - 1].v;
            return (
              <span
                key={m.value}
                aria-hidden="true"
                className={cn(
                  "absolute block size-1 rounded-full",
                  inRange ? "bg-white" : "bg-zinc-400",
                )}
                style={markStyle}
              />
            );
          })}
        </div>

        {value.map((v, index) => {
          const pct = ((v - min) / range) * 100;
          const thumbStyle: React.CSSProperties = isVertical
            ? {
                bottom: `${pct}%`,
                left: "50%",
                transform: "translate(-50%, 50%)",
              }
            : {
                left: `${pct}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
              };
          return (
            <span
              key={index}
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={v}
              aria-orientation={orientation}
              aria-disabled={disabled || undefined}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledby}
              data-slot="slider-thumb"
              data-index={index}
              className={cn(
                "absolute z-10 block rounded-full border-2 border-zinc-900 bg-white shadow-sm",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 focus-visible:ring-offset-2",
                !disabled && "cursor-grab active:cursor-grabbing",
                disabled && "cursor-not-allowed",
                spec.thumb,
              )}
              style={{ ...thumbStyle, touchAction: "none" }}
              onPointerDown={(e) => handleThumbPointerDown(e, index)}
              onPointerMove={handleThumbPointerMove}
              onPointerUp={handleThumbPointerUp}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          );
        })}

        {showMarkLabels && marks && (
          <div
            aria-hidden="true"
            className={cn(
              "absolute pointer-events-none text-xs text-zinc-500",
              isVertical
                ? "left-full ml-2 top-0 bottom-0"
                : "left-0 right-0 top-full mt-2",
            )}
          >
            {marks.map((raw) => {
              const m = normalizeMark(raw);
              if (m.label == null) return null;
              const pct = ((m.value - min) / range) * 100;
              const labelStyle: React.CSSProperties = isVertical
                ? { position: "absolute", bottom: `${pct}%`, transform: "translateY(50%)" }
                : { position: "absolute", left: `${pct}%`, transform: "translateX(-50%)" };
              return (
                <span key={m.value} style={labelStyle}>
                  {m.label}
                </span>
              );
            })}
          </div>
        )}

        {name && value.map((v, i) => (
          <input
            key={i}
            type="hidden"
            name={value.length > 1 ? `${name}[${i}]` : name}
            value={v}
          />
        ))}
      </div>
    );
  },
);

Slider.displayName = "Slider";
