"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface CropResult {
  x: number;
  y: number;
  width: number;
  height: number;
  zoom: number;
}

export interface ImageCropperProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  src: string;
  aspect?: number;
  minZoom?: number;
  maxZoom?: number;
  defaultZoom?: number;
  defaultOffset?: { x: number; y: number };
  onChange?: (crop: CropResult) => void;
  cropShape?: "rect" | "circle";
}

export function ImageCropper({
  src,
  aspect = 1,
  minZoom = 1,
  maxZoom = 3,
  defaultZoom = 1,
  defaultOffset = { x: 0, y: 0 },
  onChange,
  cropShape = "rect",
  className,
  ...rest
}: ImageCropperProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const [zoom, setZoom] = React.useState(defaultZoom);
  const [offset, setOffset] = React.useState(defaultOffset);
  const [dragging, setDragging] = React.useState(false);
  const start = React.useRef<{ x: number; y: number; ox: number; oy: number } | null>(
    null,
  );
  const [imgDim, setImgDim] = React.useState<{ w: number; h: number } | null>(
    null,
  );

  const emit = React.useCallback(
    (z: number, o: { x: number; y: number }) => {
      if (!containerRef.current || !imgDim) return;
      const box = containerRef.current.getBoundingClientRect();
      const scaledW = imgDim.w * z;
      const scaledH = imgDim.h * z;
      const cropX = (box.width / 2 - o.x) / scaledW;
      const cropY = (box.height / 2 - o.y) / scaledH;
      onChange?.({
        x: Math.max(0, Math.min(1, cropX)),
        y: Math.max(0, Math.min(1, cropY)),
        width: box.width / scaledW,
        height: box.height / scaledH,
        zoom: z,
      });
    },
    [imgDim, onChange],
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    start.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || !start.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    const next = { x: start.current.ox + dx, y: start.current.oy + dy };
    setOffset(next);
    emit(zoom, next);
  };
  const onPointerUp = () => {
    setDragging(false);
    start.current = null;
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.002;
    const next = Math.max(minZoom, Math.min(maxZoom, zoom + delta));
    setZoom(next);
    emit(next, offset);
  };

  const onLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImgDim({ w: img.naturalWidth, h: img.naturalHeight });
  };

  const onZoomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const z = parseFloat(e.target.value);
    setZoom(z);
    emit(z, offset);
  };

  return (
    <div
      data-slot="image-cropper"
      className={cn(
        "inline-flex flex-col gap-3 rounded-md border border-zinc-200 bg-white p-3",
        className,
      )}
      {...rest}
    >
      <div
        ref={containerRef}
        role="region"
        aria-label="Image cropper viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        className={cn(
          "relative overflow-hidden select-none cursor-grab bg-zinc-900",
          dragging && "cursor-grabbing",
          cropShape === "circle" && "rounded-full",
          cropShape === "rect" && "rounded-md",
        )}
        style={{ aspectRatio: aspect, width: 320 }}
      >
        <img
          ref={imgRef}
          src={src}
          alt=""
          draggable={false}
          onLoad={onLoad}
          className="absolute pointer-events-none select-none origin-center"
          style={{
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            maxWidth: "none",
          }}
        />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-500">Zoom</span>
        <input
          type="range"
          min={minZoom}
          max={maxZoom}
          step={0.01}
          value={zoom}
          onChange={onZoomInput}
          className="flex-1 accent-zinc-900"
        />
        <span className="text-xs tabular-nums text-zinc-500 w-10 text-end">
          {zoom.toFixed(2)}x
        </span>
      </div>
    </div>
  );
}

ImageCropper.displayName = "ImageCropper";
