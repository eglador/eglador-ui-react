import type { Meta, StoryObj } from "@storybook/react-vite";

type Status = "shipped" | "review" | "planned";

interface ComponentInfo {
  name: string;
  status: Status;
}

const COMPONENTS: ComponentInfo[] = [
  { name: "Accordion", status: "shipped" },
  { name: "Alert", status: "shipped" },
  { name: "AlertDialog", status: "shipped" },
  { name: "AspectRatio", status: "shipped" },
  { name: "Avatar", status: "shipped" },
  { name: "Badge", status: "shipped" },
  { name: "Breadcrumb", status: "shipped" },
  { name: "Button", status: "shipped" },
  { name: "ButtonGroup", status: "shipped" },
  { name: "Calendar", status: "shipped" },
  { name: "Checkbox", status: "shipped" },
  { name: "CheckboxGroup", status: "shipped" },
  { name: "Collapsible", status: "shipped" },
  { name: "Command", status: "shipped" },
  { name: "ContextMenu", status: "shipped" },
  { name: "DatePicker", status: "shipped" },
  { name: "DateTimePicker", status: "shipped" },
  { name: "Dialog", status: "shipped" },
  { name: "Drawer", status: "shipped" },
  { name: "Dropdown", status: "shipped" },
  { name: "Empty", status: "shipped" },
  { name: "HoverCard", status: "shipped" },
  { name: "ImageCropper", status: "shipped" },
  { name: "Input", status: "shipped" },
  { name: "InputGroup", status: "shipped" },
  { name: "InputOTP", status: "shipped" },
  { name: "InputTag", status: "shipped" },
  { name: "Kbd", status: "shipped" },
  { name: "Label", status: "shipped" },
  { name: "Link", status: "shipped" },
  { name: "Menubar", status: "shipped" },
  { name: "MultiSelect", status: "shipped" },
  { name: "NativeSelect", status: "shipped" },
  { name: "NavigationMenu", status: "shipped" },
  { name: "Notification", status: "shipped" },
  { name: "Pagination", status: "shipped" },
  { name: "Popover", status: "shipped" },
  { name: "Progress", status: "shipped" },
  { name: "Radio", status: "shipped" },
  { name: "RadioGroup", status: "shipped" },
  { name: "Resizable", status: "shipped" },
  { name: "ScrollArea", status: "shipped" },
  { name: "Select", status: "shipped" },
  { name: "Separator", status: "shipped" },
  { name: "Sidebar", status: "shipped" },
  { name: "Skeleton", status: "shipped" },
  { name: "SpeedDial", status: "shipped" },
  { name: "Spinner", status: "shipped" },
  { name: "Stepper", status: "shipped" },
  { name: "Switch", status: "shipped" },
  { name: "Table", status: "shipped" },
  { name: "Tabs", status: "shipped" },
  { name: "Textarea", status: "shipped" },
  { name: "Tooltip", status: "shipped" },
  { name: "TreeView", status: "shipped" },
  { name: "Typography", status: "shipped" },
];

const STATUS_STYLES: Record<
  Status,
  { chip: string; dot: string; label: string }
> = {
  shipped: {
    chip: "border-zinc-300 bg-zinc-900 text-white",
    dot: "bg-white",
    label: "Shipped",
  },
  review: {
    chip: "border-amber-200 bg-amber-50 text-amber-900",
    dot: "bg-amber-500",
    label: "Needs review",
  },
  planned: {
    chip: "border-zinc-200 bg-zinc-50 text-zinc-700",
    dot: "bg-zinc-300",
    label: "Planned",
  },
};

function Overview() {
  const total = COMPONENTS.length;
  const shippedCount = COMPONENTS.filter((c) => c.status === "shipped").length;
  const reviewCount = COMPONENTS.filter((c) => c.status === "review").length;
  const plannedCount = COMPONENTS.filter((c) => c.status === "planned").length;
  const percent = Math.round((shippedCount / total) * 100);

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <img
            src="/eglador-logo.svg"
            alt="eglador-ui-react"
            width={120}
            className="mx-auto mb-6 opacity-90"
          />
          <h1 className="text-2xl font-semibold text-zinc-900 mb-2">
            eglador-ui-react
          </h1>
          <p className="text-sm text-zinc-500 max-w-xl mx-auto mb-4">
            Headless, accessible component library for React. Tailwind v4, zero
            runtime dependencies, TypeScript-first.
          </p>
          <div className="inline-flex items-center gap-2 px-3 h-7 text-xs rounded-sm border border-zinc-200 bg-white text-zinc-600">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Alpha — {shippedCount}/{total} components shipped ({percent}%)
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-sm p-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-900">Components</h2>
            <span className="text-xs text-zinc-500 tabular-nums">
              {shippedCount}/{total}
            </span>
          </div>

          <div className="h-1 bg-zinc-100 rounded-full overflow-hidden mb-5">
            <div
              className="h-full bg-zinc-900 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5">
            {COMPONENTS.map(({ name, status }) => {
              const s = STATUS_STYLES[status];
              return (
                <div
                  key={name}
                  className={`inline-flex items-center gap-2 px-2.5 h-8 text-xs rounded-sm border ${s.chip}`}
                >
                  <span
                    className={`size-1.5 rounded-full shrink-0 ${s.dot}`}
                  />
                  <span className="truncate">{name}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
            <div className="inline-flex items-center gap-1.5">
              <span className="inline-block size-2.5 rounded-sm bg-zinc-900" />
              Shipped ({shippedCount})
            </div>
            <div className="inline-flex items-center gap-1.5">
              <span className="inline-block size-2.5 rounded-sm bg-amber-50 border border-amber-200" />
              Needs review ({reviewCount})
            </div>
            <div className="inline-flex items-center gap-1.5">
              <span className="inline-block size-2.5 rounded-sm bg-zinc-50 border border-zinc-200" />
              Planned ({plannedCount})
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-500">
          <div className="bg-white border border-zinc-200 rounded-sm p-4">
            <div className="font-medium text-zinc-900 mb-1">
              Status — Alpha (v1.0.0-alpha.4)
            </div>
            All 56 primitives shipped: Layout (7), Display (7), Navigation (7),
            Forms (16), Date & Time (3), Overlays (10), Data (1), Misc (5).
            Shared vocabulary: variants solid / soft / outline / ghost / link;
            sizes xs / sm / md / lg / xl; shapes square / rounded / pill /
            circle; shadows none / xs / sm / md / lg / xl.
          </div>
          <div className="bg-white border border-zinc-200 rounded-sm p-4">
            <div className="font-medium text-zinc-900 mb-1">
              Next phase — Polish & QA
            </div>
            Reviewing each component for UI bugs, missing props, a11y gaps,
            keyboard-nav edge cases, and Storybook controls completeness.
            Components are reclassified as <strong>Needs review</strong> while
            being audited and back to <strong>Shipped</strong> once fixes land.
          </div>
        </div>
      </div>
    </div>
  );
}

const meta: Meta<typeof Overview> = {
  title: "Default",
  component: Overview,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Overview>;

export const Roadmap: Story = {};
