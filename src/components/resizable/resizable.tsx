"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { GripVerticalIcon, GripHorizontalIcon } from "../../lib/icons";

export type ResizableDirection = "horizontal" | "vertical";

interface ResizableContextValue {
  direction: ResizableDirection;
  sizes: number[];
  setSizesViaHandle: (handleIndex: number, delta: number) => void;
  bumpSizesByStep: (handleIndex: number, deltaPercent: number) => void;
  panelMinSizes: number[];
  panelMaxSizes: number[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  setResizing: (v: boolean) => void;
  keyboardStep: number;
}

const ResizableContext = React.createContext<ResizableContextValue | null>(
  null,
);

function useResizable(): ResizableContextValue {
  const ctx = React.useContext(ResizableContext);
  if (!ctx)
    throw new Error(
      "Resizable subcomponents must be used within <Resizable>",
    );
  return ctx;
}

interface ResizablePanelInjectedProps {
  __panelIndex?: number;
  __style?: React.CSSProperties;
}

interface ResizableHandleInjectedProps {
  __handleIndex?: number;
}

export interface ResizableProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: ResizableDirection;
  defaultSizes?: number[];
  minSize?: number;
  maxSize?: number;
  keyboardStep?: number;
}

export const Resizable = React.forwardRef<HTMLDivElement, ResizableProps>(
  function Resizable(
    {
      direction = "horizontal",
      defaultSizes,
      minSize = 10,
      maxSize = 90,
      keyboardStep = 5,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const childArray = React.Children.toArray(children).filter(
      React.isValidElement,
    ) as React.ReactElement<{
      minSize?: number;
      maxSize?: number;
      defaultSize?: number;
    }>[];

    const isHandle = (el: React.ReactElement) =>
      (el.type as React.ComponentType & { displayName?: string }).displayName ===
      "ResizableHandle";

    const panels = childArray.filter((c) => !isHandle(c));
    const panelCount = panels.length;

    const panelMinSizes = panels.map((p) => p.props.minSize ?? minSize);
    const panelMaxSizes = panels.map((p) => p.props.maxSize ?? maxSize);

    const initialSizes = React.useMemo(() => {
      if (defaultSizes && defaultSizes.length === panelCount) return defaultSizes;
      const fromPanels = panels.map((p) => p.props.defaultSize);
      if (fromPanels.every((v) => typeof v === "number")) {
        return fromPanels as number[];
      }
      return Array(panelCount).fill(100 / panelCount);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultSizes, panelCount]);

    const [sizes, setSizes] = React.useState<number[]>(initialSizes);
    const [resizing, setResizing] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref],
    );

    const applyDelta = React.useCallback(
      (handleIndex: number, deltaPercent: number) => {
        setSizes((prev) => {
          const next = [...prev];
          const li = handleIndex;
          const ri = handleIndex + 1;
          if (li < 0 || ri >= next.length) return prev;

          let nl = next[li] + deltaPercent;
          let nr = next[ri] - deltaPercent;
          const lMin = panelMinSizes[li];
          const lMax = panelMaxSizes[li];
          const rMin = panelMinSizes[ri];
          const rMax = panelMaxSizes[ri];

          if (nl < lMin) {
            nr += nl - lMin;
            nl = lMin;
          }
          if (nr < rMin) {
            nl += nr - rMin;
            nr = rMin;
          }
          if (nl > lMax) {
            nr += nl - lMax;
            nl = lMax;
          }
          if (nr > rMax) {
            nl += nr - rMax;
            nr = rMax;
          }
          nl = Math.max(lMin, Math.min(lMax, nl));
          nr = Math.max(rMin, Math.min(rMax, nr));

          next[li] = nl;
          next[ri] = nr;
          return next;
        });
      },
      [panelMinSizes, panelMaxSizes],
    );

    const setSizesViaHandle = React.useCallback(
      (handleIndex: number, pxDelta: number) => {
        if (!containerRef.current) return;
        const total =
          direction === "horizontal"
            ? containerRef.current.offsetWidth
            : containerRef.current.offsetHeight;
        if (total <= 0) return;
        applyDelta(handleIndex, (pxDelta / total) * 100);
      },
      [direction, applyDelta],
    );

    const bumpSizesByStep = React.useCallback(
      (handleIndex: number, deltaPercent: number) => {
        applyDelta(handleIndex, deltaPercent);
      },
      [applyDelta],
    );

    let panelIndex = 0;
    let handleIndex = 0;
    const renderedChildren = childArray.map((child) => {
      if (isHandle(child)) {
        const hIdx = handleIndex++;
        return React.cloneElement(
          child as React.ReactElement<ResizableHandleInjectedProps>,
          { __handleIndex: hIdx, key: `handle-${hIdx}` },
        );
      }
      const pIdx = panelIndex++;
      const sizeVal = sizes[pIdx] ?? 100 / panelCount;
      const style: React.CSSProperties =
        direction === "horizontal"
          ? { width: `${sizeVal}%`, flexShrink: 0 }
          : { height: `${sizeVal}%`, flexShrink: 0 };
      return React.cloneElement(
        child as React.ReactElement<ResizablePanelInjectedProps>,
        {
          __panelIndex: pIdx,
          __style: style,
          key: `panel-${pIdx}`,
        },
      );
    });

    return (
      <ResizableContext.Provider
        value={{
          direction,
          sizes,
          setSizesViaHandle,
          bumpSizesByStep,
          panelMinSizes,
          panelMaxSizes,
          containerRef,
          setResizing,
          keyboardStep,
        }}
      >
        <div
          ref={setRefs}
          data-slot="resizable"
          data-direction={direction}
          className={cn(
            "flex overflow-hidden h-full w-full",
            direction === "horizontal" ? "flex-row" : "flex-col",
            resizing && "select-none cursor-grabbing",
            className,
          )}
          {...rest}
        >
          {renderedChildren}
        </div>
      </ResizableContext.Provider>
    );

    // hint to suppress unused warning for the step (used in handle keyboard)
  },
);

Resizable.displayName = "Resizable";

export interface ResizablePanelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  minSize?: number;
  maxSize?: number;
  defaultSize?: number;
}

export const ResizablePanel = React.forwardRef<
  HTMLDivElement,
  ResizablePanelProps
>(function ResizablePanel(rawProps, ref) {
  const {
    minSize: _minSize,
    maxSize: _maxSize,
    defaultSize: _defaultSize,
    className,
    style,
    children,
    __style,
    ...rest
  } = rawProps as ResizablePanelProps & ResizablePanelInjectedProps;
  return (
    <div
      ref={ref}
      data-slot="resizable-panel"
      className={cn("overflow-hidden", className)}
      style={{ ...__style, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
});

ResizablePanel.displayName = "ResizablePanel";

export interface ResizableHandleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  withHandle?: boolean;
}

export const ResizableHandle = React.forwardRef<
  HTMLDivElement,
  ResizableHandleProps
>(function ResizableHandle(rawProps, ref) {
  const {
    withHandle = false,
    className,
    __handleIndex,
    ...rest
  } = rawProps as ResizableHandleProps & ResizableHandleInjectedProps;
  const handleIndex = __handleIndex ?? 0;
  const ctx = useResizable();

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    ctx.setResizing(true);

    let lastPos = ctx.direction === "horizontal" ? e.clientX : e.clientY;

    const move = (ev: PointerEvent) => {
      const pos = ctx.direction === "horizontal" ? ev.clientX : ev.clientY;
      const delta = pos - lastPos;
      lastPos = pos;
      ctx.setSizesViaHandle(handleIndex, delta);
    };

    const up = () => {
      ctx.setResizing(false);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up, { once: true });
    window.addEventListener("pointercancel", up, { once: true });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isHorizontal = ctx.direction === "horizontal";
    const step = ctx.keyboardStep;
    if (e.key === (isHorizontal ? "ArrowRight" : "ArrowDown")) {
      e.preventDefault();
      ctx.bumpSizesByStep(handleIndex, step);
    } else if (e.key === (isHorizontal ? "ArrowLeft" : "ArrowUp")) {
      e.preventDefault();
      ctx.bumpSizesByStep(handleIndex, -step);
    } else if (e.key === "Home") {
      e.preventDefault();
      ctx.bumpSizesByStep(handleIndex, -100);
    } else if (e.key === "End") {
      e.preventDefault();
      ctx.bumpSizesByStep(handleIndex, 100);
    }
  };

  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={ctx.direction === "horizontal" ? "vertical" : "horizontal"}
      tabIndex={0}
      data-slot="resizable-handle"
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      className={cn(
        "relative flex items-center justify-center shrink-0 bg-zinc-200 transition-colors hover:bg-zinc-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20",
        ctx.direction === "horizontal"
          ? "w-px cursor-col-resize"
          : "h-px cursor-row-resize",
        className,
      )}
      {...rest}
    >
      {withHandle && (
        <div
          className={cn(
            "absolute z-10 inline-flex items-center justify-center rounded-sm bg-zinc-200 border border-zinc-300 text-zinc-500",
            ctx.direction === "horizontal" ? "h-6 w-3" : "h-3 w-6",
          )}
        >
          {ctx.direction === "horizontal" ? (
            <GripVerticalIcon className="size-2.5" />
          ) : (
            <GripHorizontalIcon className="size-2.5" />
          )}
        </div>
      )}
    </div>
  );
});

ResizableHandle.displayName = "ResizableHandle";
