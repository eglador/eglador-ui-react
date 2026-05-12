import type { Meta, StoryObj } from "@storybook/react-vite";

const COMPONENTS = [
  "Accordion",
  "AlertDialog",
  "Alert",
  "AspectRatio",
  "Avatar",
  "Badge",
  "Breadcrumb",
  "ButtonGroup",
  "Button",
  "Calendar",
  "CheckboxGroup",
  "Checkbox",
  "Collapsible",
  "Command",
  "ContextMenu",
  "DatePicker",
  "DateTimePicker",
  "Dialog",
  "Drawer",
  "Dropdown",
  "Empty",
  "HoverCard",
  "ImageCropper",
  "InputGroup",
  "InputOTP",
  "Input",
  "Kbd",
  "Label",
  "Link",
  "Menubar",
  "MultiSelect",
  "NativeSelect",
  "NavigationMenu",
  "Notification",
  "Pagination",
  "Popover",
  "Progress",
  "RadioGroup",
  "Radio",
  "Resizable",
  "ScrollArea",
  "Select",
  "Separator",
  "Sidebar",
  "Skeleton",
  "SpeedDial",
  "Spinner",
  "Stepper",
  "Switch",
  "Table",
  "Tabs",
  "Textarea",
  "Tooltip",
  "TreeView",
  "Typography",
];

function Overview() {
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
            <span className="size-1.5 rounded-full bg-amber-500" />
            Pre-alpha — scaffold ready, components in development
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-sm p-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-900">
              Planlanan bileşenler
            </h2>
            <span className="text-xs text-zinc-500 tabular-nums">
              {COMPONENTS.length} toplam
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5">
            {COMPONENTS.map((name) => (
              <div
                key={name}
                className="inline-flex items-center gap-2 px-2.5 h-8 text-xs rounded-sm border border-zinc-200 bg-zinc-50 text-zinc-700"
              >
                <span className="size-1.5 rounded-full bg-zinc-300 shrink-0" />
                <span className="truncate">{name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-500">
          <div className="bg-white border border-zinc-200 rounded-sm p-4">
            <div className="font-medium text-zinc-900 mb-1">Hazır</div>
            Build pipeline (tsup), TypeScript strict, Tailwind v4 entegrasyonu,
            Storybook 10, CI / npm publish workflow.
          </div>
          <div className="bg-white border border-zinc-200 rounded-sm p-4">
            <div className="font-medium text-zinc-900 mb-1">Sıradaki</div>
            Bileşen API tasarımı, compound subcomponents, headless hook'lar,
            Storybook playground'lar.
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
