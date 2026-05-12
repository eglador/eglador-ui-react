"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { UserIcon } from "../../lib/icons";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "rounded" | "square";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  icon?: React.ReactNode;
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: AvatarSize;
  children: React.ReactNode;
}

const SIZES: Record<
  AvatarSize,
  { container: string; font: string; iconSize: string }
> = {
  xs: { container: "size-6", font: "text-[10px]", iconSize: "size-3" },
  sm: { container: "size-8", font: "text-xs", iconSize: "size-3.5" },
  md: { container: "size-10", font: "text-sm", iconSize: "size-4" },
  lg: { container: "size-12", font: "text-base", iconSize: "size-5" },
  xl: { container: "size-16", font: "text-lg", iconSize: "size-6" },
};

const SHAPES: Record<AvatarShape, string> = {
  circle: "rounded-full",
  rounded: "rounded-sm",
  square: "",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  function Avatar(
    { src, alt, name, size = "md", shape = "circle", icon, className, ...rest },
    ref,
  ) {
    const [hasError, setHasError] = React.useState(false);
    const s = SIZES[size];
    const showImage = src && !hasError;
    const initials = name ? getInitials(name) : null;

    React.useEffect(() => {
      setHasError(false);
    }, [src]);

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex shrink-0", className)}
        {...rest}
      >
        <div
          className={cn(
            "flex items-center justify-center overflow-hidden font-semibold",
            s.container,
            SHAPES[shape],
            !showImage && "bg-zinc-200 text-zinc-600",
          )}
        >
          {showImage ? (
            <img
              src={src}
              alt={alt || name || "Avatar"}
              className="w-full h-full object-cover"
              onError={() => setHasError(true)}
            />
          ) : icon ? (
            <span
              className={cn(
                "flex items-center justify-center [&>svg]:w-full [&>svg]:h-full",
                s.iconSize,
              )}
            >
              {icon}
            </span>
          ) : initials ? (
            <span className={s.font}>{initials}</span>
          ) : (
            <UserIcon className={s.iconSize} />
          )}
        </div>
      </div>
    );
  },
);

Avatar.displayName = "Avatar";

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  function AvatarGroup({ max, size = "md", className, children, ...rest }, ref) {
    const items = React.Children.toArray(children).filter(React.isValidElement);
    const visible = max ? items.slice(0, max) : items;
    const overflow = max ? items.length - max : 0;
    const s = SIZES[size];
    return (
      <div
        ref={ref}
        className={cn("flex -space-x-2", className)}
        {...rest}
      >
        {visible.map((child, index) => (
          <div key={index} className="ring-2 ring-white rounded-full">
            {React.cloneElement(child as React.ReactElement<AvatarProps>, { size })}
          </div>
        ))}
        {overflow > 0 && (
          <div
            className={cn(
              "flex items-center justify-center rounded-full ring-2 ring-white bg-zinc-200 text-zinc-600 font-semibold",
              s.container,
              s.font,
            )}
          >
            +{overflow}
          </div>
        )}
      </div>
    );
  },
);

AvatarGroup.displayName = "AvatarGroup";
