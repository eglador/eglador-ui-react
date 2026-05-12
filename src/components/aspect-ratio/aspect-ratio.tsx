import * as React from "react";
import { cn } from "../../lib/utils";

export type AspectRatioPreset =
  | "1:1"
  | "16:9"
  | "4:3"
  | "21:9"
  | "3:2"
  | "2:3"
  | "9:16";

export interface AspectRatioProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "style"> {
  ratio?: AspectRatioPreset | number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const PRESETS: Record<AspectRatioPreset, string> = {
  "1:1": "aspect-square",
  "16:9": "aspect-video",
  "4:3": "aspect-[4/3]",
  "21:9": "aspect-[21/9]",
  "3:2": "aspect-[3/2]",
  "2:3": "aspect-[2/3]",
  "9:16": "aspect-[9/16]",
};

export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  function AspectRatio({ ratio = "16:9", className, style, children, ...rest }, ref) {
    const isPreset = typeof ratio === "string" && ratio in PRESETS;
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          isPreset && PRESETS[ratio as AspectRatioPreset],
          className,
        )}
        style={
          !isPreset && typeof ratio === "number"
            ? { aspectRatio: ratio, ...style }
            : style
        }
        {...rest}
      >
        {children}
      </div>
    );
  },
);

AspectRatio.displayName = "AspectRatio";
