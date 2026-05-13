"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { cn } from "../../lib/utils";
import { XIcon } from "../../lib/icons";

export type NotificationVariant = "soft" | "outline" | "solid";
export type NotificationSize = "xs" | "sm" | "md" | "lg" | "xl";
export type NotificationShape = "square" | "rounded";
export type NotificationShadow = "none" | "xs" | "sm" | "md" | "lg" | "xl";
export type NotificationPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

interface NotificationContextValue {
  size: NotificationSize;
  variant: NotificationVariant;
}

const NotificationContext = React.createContext<NotificationContextValue>({
  size: "md",
  variant: "outline",
});

const SIZES: Record<
  NotificationSize,
  {
    width: string;
    padding: string;
    gapX: string;
    iconSize: string;
    titleFont: string;
    descFont: string;
    descMt: string;
    actionsGap: string;
    actionsMt: string;
    closeSize: string;
    closeIcon: string;
    timestampFont: string;
  }
> = {
  xs: {
    width: "w-64",
    padding: "p-2.5",
    gapX: "gap-x-2",
    iconSize: "size-3.5 mt-0.5",
    titleFont: "text-xs font-semibold",
    descFont: "text-[11px]",
    descMt: "mt-0",
    actionsGap: "gap-2",
    actionsMt: "mt-1.5",
    closeSize: "size-4",
    closeIcon: "size-3",
    timestampFont: "text-[10px]",
  },
  sm: {
    width: "w-72",
    padding: "p-3",
    gapX: "gap-x-2.5",
    iconSize: "size-4 mt-0.5",
    titleFont: "text-sm font-semibold",
    descFont: "text-xs",
    descMt: "mt-0.5",
    actionsGap: "gap-2.5",
    actionsMt: "mt-2",
    closeSize: "size-5",
    closeIcon: "size-3.5",
    timestampFont: "text-[10px]",
  },
  md: {
    width: "w-80",
    padding: "p-4",
    gapX: "gap-x-3",
    iconSize: "size-5 mt-0.5",
    titleFont: "text-sm font-semibold",
    descFont: "text-xs",
    descMt: "mt-0.5",
    actionsGap: "gap-3",
    actionsMt: "mt-2.5",
    closeSize: "size-5",
    closeIcon: "size-3.5",
    timestampFont: "text-[10px]",
  },
  lg: {
    width: "w-96",
    padding: "p-5",
    gapX: "gap-x-3.5",
    iconSize: "size-6 mt-0.5",
    titleFont: "text-base font-semibold",
    descFont: "text-sm",
    descMt: "mt-1",
    actionsGap: "gap-3",
    actionsMt: "mt-3",
    closeSize: "size-6",
    closeIcon: "size-4",
    timestampFont: "text-xs",
  },
  xl: {
    width: "w-[28rem]",
    padding: "p-6",
    gapX: "gap-x-4",
    iconSize: "size-7 mt-1",
    titleFont: "text-lg font-semibold",
    descFont: "text-base",
    descMt: "mt-1.5",
    actionsGap: "gap-3",
    actionsMt: "mt-3.5",
    closeSize: "size-7",
    closeIcon: "size-4",
    timestampFont: "text-xs",
  },
};

const SHADOWS: Record<NotificationShadow, string> = {
  none: "shadow-none",
  xs: "shadow-xs",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
};

const SHAPES: Record<NotificationShape, string> = {
  square: "rounded-none",
  rounded: "rounded-md",
};

const VARIANTS: Record<
  NotificationVariant,
  {
    container: string;
    iconColor: string;
    titleColor: string;
    descColor: string;
    timestampColor: string;
    close: string;
    progressTrack: string;
    progressBar: string;
  }
> = {
  soft: {
    container: "bg-zinc-50 border border-zinc-200",
    iconColor: "text-zinc-600",
    titleColor: "text-zinc-900",
    descColor: "text-zinc-600",
    timestampColor: "text-zinc-400",
    close: "text-zinc-400 hover:bg-zinc-200 hover:text-zinc-900",
    progressTrack: "bg-zinc-200",
    progressBar: "bg-zinc-500",
  },
  outline: {
    container: "bg-white border border-zinc-200",
    iconColor: "text-zinc-600",
    titleColor: "text-zinc-900",
    descColor: "text-zinc-500",
    timestampColor: "text-zinc-400",
    close: "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900",
    progressTrack: "bg-zinc-100",
    progressBar: "bg-zinc-500",
  },
  solid: {
    container: "bg-zinc-900 border border-zinc-900",
    iconColor: "text-zinc-300",
    titleColor: "text-white",
    descColor: "text-zinc-300",
    timestampColor: "text-zinc-400",
    close: "text-zinc-400 hover:bg-zinc-700 hover:text-white",
    progressTrack: "bg-zinc-700",
    progressBar: "bg-zinc-300",
  },
};

const POSITIONS: Record<NotificationPosition, string> = {
  "top-right": "top-4 end-4 items-end",
  "top-left": "top-4 start-4 items-start",
  "bottom-right": "bottom-4 end-4 items-end",
  "bottom-left": "bottom-4 start-4 items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
};

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export interface NotificationProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onAnimationEnd"> {
  variant?: NotificationVariant;
  size?: NotificationSize;
  shape?: NotificationShape;
  shadow?: NotificationShadow;
  onDismiss?: () => void;
  dismissLabel?: string;
  duration?: number;
  showProgress?: boolean;
  pauseOnHover?: boolean;
  timestamp?: Date;
}

export const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  function Notification(
    {
      variant = "outline",
      size = "md",
      shape = "rounded",
      shadow = "md",
      onDismiss,
      dismissLabel = "Dismiss",
      duration = 0,
      showProgress = false,
      pauseOnHover = true,
      timestamp,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const s = SIZES[size];
    const v = VARIANTS[variant];

    const [paused, setPaused] = React.useState(false);
    const [progress, setProgress] = React.useState(100);
    const [timeLabel, setTimeLabel] = React.useState(
      timestamp ? timeAgo(timestamp) : "",
    );
    const remainingRef = React.useRef(duration);

    React.useEffect(() => {
      if (!onDismiss || duration <= 0) return;
      if (paused) return;

      const start = Date.now();
      const remaining = remainingRef.current;

      const timer = setTimeout(() => {
        onDismiss();
      }, remaining);

      let progressInterval: ReturnType<typeof setInterval> | undefined;
      if (showProgress) {
        progressInterval = setInterval(() => {
          const elapsed = Date.now() - start;
          const next = Math.max(0, ((remaining - elapsed) / duration) * 100);
          setProgress(next);
        }, 50);
      }

      return () => {
        clearTimeout(timer);
        if (progressInterval) clearInterval(progressInterval);
        remainingRef.current = Math.max(0, remaining - (Date.now() - start));
      };
    }, [duration, paused, showProgress, onDismiss]);

    React.useEffect(() => {
      if (!timestamp) return;
      const interval = setInterval(
        () => setTimeLabel(timeAgo(timestamp)),
        10000,
      );
      return () => clearInterval(interval);
    }, [timestamp]);

    const handleMouseEnter = () => {
      if (pauseOnHover && duration > 0 && onDismiss) setPaused(true);
    };
    const handleMouseLeave = () => {
      if (pauseOnHover && duration > 0 && onDismiss) setPaused(false);
    };

    const hasTopAffordance = !!(timestamp || onDismiss);

    return (
      <NotificationContext.Provider value={{ size, variant }}>
        <div
          ref={ref}
          role="status"
          aria-live="polite"
          data-slot="notification"
          data-variant={variant}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "relative flex flex-col overflow-hidden",
            s.width,
            SHAPES[shape],
            SHADOWS[shadow],
            v.container,
            className,
          )}
          {...rest}
        >
          <div className={cn("flex", s.gapX, s.padding)}>
            <div
              className={cn(
                "flex-1 min-w-0 grid items-start",
                "grid-cols-[0_1fr]",
                "has-[[data-slot=notification-icon]]:grid-cols-[auto_1fr]",
                "[&>[data-slot=notification-icon]]:col-start-1",
                "[&>[data-slot=notification-icon]]:row-start-1",
                "[&>[data-slot=notification-icon]]:row-span-full",
                "[&>[data-slot=notification-icon]]:self-start",
                "[&>*:not([data-slot=notification-icon])]:col-start-2",
                s.gapX,
              )}
            >
              {children}
            </div>
            {hasTopAffordance && (
              <div className="flex items-start gap-1 shrink-0">
                {timestamp && (
                  <span
                    data-slot="notification-timestamp"
                    className={cn(s.timestampFont, v.timestampColor, "mt-1")}
                  >
                    {timeLabel}
                  </span>
                )}
                {onDismiss && (
                  <button
                    type="button"
                    aria-label={dismissLabel}
                    data-slot="notification-close"
                    onClick={onDismiss}
                    className={cn(
                      "inline-flex items-center justify-center rounded-sm transition-colors cursor-pointer",
                      s.closeSize,
                      v.close,
                    )}
                  >
                    <XIcon className={s.closeIcon} />
                  </button>
                )}
              </div>
            )}
          </div>
          {showProgress && duration > 0 && onDismiss && (
            <div className={cn("h-0.5 w-full", v.progressTrack)}>
              <div
                data-slot="notification-progress"
                className={cn("h-full transition-all duration-100 ease-linear", v.progressBar)}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </NotificationContext.Provider>
    );
  },
);

Notification.displayName = "Notification";

export interface NotificationIconProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export const NotificationIcon = React.forwardRef<
  HTMLSpanElement,
  NotificationIconProps
>(function NotificationIcon({ className, children, ...rest }, ref) {
  const { size, variant } = React.useContext(NotificationContext);
  const s = SIZES[size];
  const v = VARIANTS[variant];
  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-slot="notification-icon"
      className={cn(
        "inline-flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full",
        s.iconSize,
        v.iconColor,
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
});

NotificationIcon.displayName = "NotificationIcon";

export interface NotificationTitleProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const NotificationTitle = React.forwardRef<
  HTMLDivElement,
  NotificationTitleProps
>(function NotificationTitle({ className, ...rest }, ref) {
  const { size, variant } = React.useContext(NotificationContext);
  const s = SIZES[size];
  const v = VARIANTS[variant];
  return (
    <div
      ref={ref}
      data-slot="notification-title"
      className={cn("leading-snug", s.titleFont, v.titleColor, className)}
      {...rest}
    />
  );
});

NotificationTitle.displayName = "NotificationTitle";

export interface NotificationDescriptionProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const NotificationDescription = React.forwardRef<
  HTMLDivElement,
  NotificationDescriptionProps
>(function NotificationDescription({ className, ...rest }, ref) {
  const { size, variant } = React.useContext(NotificationContext);
  const s = SIZES[size];
  const v = VARIANTS[variant];
  return (
    <div
      ref={ref}
      data-slot="notification-description"
      className={cn("leading-relaxed", s.descMt, s.descFont, v.descColor, className)}
      {...rest}
    />
  );
});

NotificationDescription.displayName = "NotificationDescription";

export interface NotificationActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const NotificationActions = React.forwardRef<
  HTMLDivElement,
  NotificationActionsProps
>(function NotificationActions({ className, ...rest }, ref) {
  const { size } = React.useContext(NotificationContext);
  const s = SIZES[size];
  return (
    <div
      ref={ref}
      data-slot="notification-actions"
      className={cn("flex flex-wrap", s.actionsGap, s.actionsMt, className)}
      {...rest}
    />
  );
});

NotificationActions.displayName = "NotificationActions";

export interface NotificationContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  position?: NotificationPosition;
  maxVisible?: number;
}

export const NotificationContainer = React.forwardRef<
  HTMLDivElement,
  NotificationContainerProps
>(function NotificationContainer(
  { position = "top-right", maxVisible = 5, className, children, ...rest },
  ref,
) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const childArray = React.Children.toArray(children);
  const visibleChildren = childArray.slice(-maxVisible);
  const hiddenCount = childArray.length - visibleChildren.length;

  if (!mounted || typeof document === "undefined") return null;

  return ReactDOM.createPortal(
    <div
      ref={ref}
      data-slot="notification-container"
      data-position={position}
      className={cn(
        "fixed z-[9999] flex flex-col gap-3 pointer-events-none",
        POSITIONS[position],
        className,
      )}
      {...rest}
    >
      <div className="flex flex-col gap-3 pointer-events-auto">
        {hiddenCount > 0 && (
          <div className="text-[10px] text-zinc-400 text-center font-medium">
            +{hiddenCount} more
          </div>
        )}
        {visibleChildren}
      </div>
    </div>,
    document.body,
  );
});

NotificationContainer.displayName = "NotificationContainer";

export interface NotificationItem {
  id: string;
  variant?: NotificationVariant;
  size?: NotificationSize;
  shape?: NotificationShape;
  shadow?: NotificationShadow;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  duration?: number;
  showProgress?: boolean;
  pauseOnHover?: boolean;
  timestamp?: Date;
  dismissible?: boolean;
  onDismiss?: () => void;
}

let notificationCounter = 0;

export function useNotification() {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(
    [],
  );

  const push = React.useCallback(
    (item: Omit<NotificationItem, "id"> & { id?: string }) => {
      const id = item.id || `notification-${++notificationCounter}`;
      setNotifications((prev) => [...prev, { ...item, id }]);
      return id;
    },
    [],
  );

  const dismiss = React.useCallback((id: string) => {
    setNotifications((prev) => {
      const found = prev.find((n) => n.id === id);
      found?.onDismiss?.();
      return prev.filter((n) => n.id !== id);
    });
  }, []);

  const dismissAll = React.useCallback(() => {
    setNotifications([]);
  }, []);

  const update = React.useCallback(
    (id: string, updates: Partial<Omit<NotificationItem, "id">>) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, ...updates } : n)),
      );
    },
    [],
  );

  return { notifications, push, dismiss, dismissAll, update };
}

export interface RenderNotificationProps {
  item: NotificationItem;
  onDismiss: (id: string) => void;
}

export function renderNotification({ item, onDismiss }: RenderNotificationProps) {
  const dismissible = item.dismissible !== false;
  return (
    <Notification
      key={item.id}
      variant={item.variant}
      size={item.size}
      shape={item.shape}
      shadow={item.shadow}
      duration={item.duration ?? 5000}
      showProgress={item.showProgress}
      pauseOnHover={item.pauseOnHover}
      timestamp={item.timestamp}
      onDismiss={dismissible ? () => onDismiss(item.id) : undefined}
    >
      {item.icon && <NotificationIcon>{item.icon}</NotificationIcon>}
      {item.title && <NotificationTitle>{item.title}</NotificationTitle>}
      {item.description && (
        <NotificationDescription>{item.description}</NotificationDescription>
      )}
      {item.actions && (
        <NotificationActions>{item.actions}</NotificationActions>
      )}
    </Notification>
  );
}
