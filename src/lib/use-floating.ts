"use client";

import * as React from "react";

export type FloatingSide = "top" | "right" | "bottom" | "left";
export type FloatingAlign = "start" | "center" | "end";

export interface UseFloatingOptions {
  open: boolean;
  side?: FloatingSide;
  align?: FloatingAlign;
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number;
  /** Re-position on scroll / resize. Defaults to true. */
  trackElement?: boolean;
}

export interface UseFloatingResult {
  anchorRef: React.MutableRefObject<HTMLElement | null>;
  floatingRef: React.MutableRefObject<HTMLElement | null>;
  position: { top: number; left: number } | null;
  resolvedSide: FloatingSide;
  update: () => void;
}

function computePosition(
  anchor: DOMRect,
  floating: DOMRect,
  side: FloatingSide,
  align: FloatingAlign,
  sideOffset: number,
  alignOffset: number,
  pad: number,
): { top: number; left: number; resolvedSide: FloatingSide } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  function place(s: FloatingSide): { top: number; left: number } {
    let top = 0;
    let left = 0;
    if (s === "top" || s === "bottom") {
      top =
        s === "top"
          ? anchor.top - floating.height - sideOffset
          : anchor.bottom + sideOffset;
      if (align === "start") left = anchor.left + alignOffset;
      else if (align === "end")
        left = anchor.right - floating.width - alignOffset;
      else left = anchor.left + (anchor.width - floating.width) / 2 + alignOffset;
    } else {
      left =
        s === "left"
          ? anchor.left - floating.width - sideOffset
          : anchor.right + sideOffset;
      if (align === "start") top = anchor.top + alignOffset;
      else if (align === "end")
        top = anchor.bottom - floating.height - alignOffset;
      else top = anchor.top + (anchor.height - floating.height) / 2 + alignOffset;
    }
    return { top, left };
  }

  function fitsOnSide(s: FloatingSide): boolean {
    const p = place(s);
    return (
      p.top >= pad &&
      p.left >= pad &&
      p.top + floating.height <= vh - pad &&
      p.left + floating.width <= vw - pad
    );
  }

  let chosen: FloatingSide = side;
  if (!fitsOnSide(side)) {
    const opposites: Record<FloatingSide, FloatingSide> = {
      top: "bottom",
      bottom: "top",
      left: "right",
      right: "left",
    };
    const candidate = opposites[side];
    if (fitsOnSide(candidate)) chosen = candidate;
  }

  const placement = place(chosen);
  // Clamp into viewport
  let top = Math.min(
    Math.max(placement.top, pad),
    vh - floating.height - pad,
  );
  let left = Math.min(
    Math.max(placement.left, pad),
    vw - floating.width - pad,
  );
  if (top < pad) top = pad;
  if (left < pad) left = pad;
  return { top, left, resolvedSide: chosen };
}

export function useFloating({
  open,
  side = "bottom",
  align = "center",
  sideOffset = 6,
  alignOffset = 0,
  collisionPadding = 8,
  trackElement = true,
}: UseFloatingOptions): UseFloatingResult {
  const anchorRef = React.useRef<HTMLElement | null>(null);
  const floatingRef = React.useRef<HTMLElement | null>(null);
  const [position, setPosition] = React.useState<
    { top: number; left: number } | null
  >(null);
  const [resolvedSide, setResolvedSide] =
    React.useState<FloatingSide>(side);

  const update = React.useCallback(() => {
    const a = anchorRef.current;
    const f = floatingRef.current;
    if (!a || !f) return;
    const ar = a.getBoundingClientRect();
    const fr = f.getBoundingClientRect();
    const p = computePosition(
      ar,
      fr,
      side,
      align,
      sideOffset,
      alignOffset,
      collisionPadding,
    );
    setPosition({ top: p.top, left: p.left });
    setResolvedSide(p.resolvedSide);
  }, [side, align, sideOffset, alignOffset, collisionPadding]);

  React.useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    update();
  }, [open, update]);

  React.useEffect(() => {
    if (!open || !trackElement) return;
    const onResize = () => update();
    window.addEventListener("scroll", onResize, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onResize, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, trackElement, update]);

  return { anchorRef, floatingRef, position, resolvedSide, update };
}

export function composeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}
