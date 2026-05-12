import type { Meta, StoryObj } from "@storybook/react-vite";

interface ComponentInfo {
  name: string;
  done?: boolean;
}

const COMPONENTS: ComponentInfo[] = [
  { name: "Accordion" },
  { name: "AlertDialog" },
  { name: "Alert" },
  { name: "AspectRatio", done: true },
  { name: "Avatar", done: true },
  { name: "Badge", done: true },
  { name: "Breadcrumb" },
  { name: "ButtonGroup" },
  { name: "Button" },
  { name: "Calendar" },
  { name: "CheckboxGroup" },
  { name: "Checkbox" },
  { name: "Collapsible" },
  { name: "Command" },
  { name: "ContextMenu" },
  { name: "DatePicker" },
  { name: "DateTimePicker" },
  { name: "Dialog" },
  { name: "Drawer" },
  { name: "Dropdown" },
  { name: "Empty", done: true },
  { name: "HoverCard" },
  { name: "ImageCropper" },
  { name: "InputGroup" },
  { name: "InputOTP" },
  { name: "Input" },
  { name: "Kbd", done: true },
  { name: "Label", done: true },
  { name: "Link" },
  { name: "Menubar" },
  { name: "MultiSelect" },
  { name: "NativeSelect" },
  { name: "NavigationMenu" },
  { name: "Notification" },
  { name: "Pagination" },
  { name: "Popover" },
  { name: "Progress" },
  { name: "RadioGroup" },
  { name: "Radio" },
  { name: "Resizable" },
  { name: "ScrollArea" },
  { name: "Select" },
  { name: "Separator", done: true },
  { name: "Sidebar" },
  { name: "Skeleton", done: true },
  { name: "SpeedDial" },
  { name: "Spinner", done: true },
  { name: "Stepper" },
  { name: "Switch" },
  { name: "Table" },
  { name: "Tabs" },
  { name: "Textarea" },
  { name: "Tooltip" },
  { name: "TreeView" },
  { name: "Typography", done: true },
];

function Overview() {
  const doneCount = COMPONENTS.filter((c) => c.done).length;
  const total = COMPONENTS.length;
  const percent = Math.round((doneCount / total) * 100);

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
            Pre-alpha — {doneCount}/{total} bileşen hazır ({percent}%)
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-sm p-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-900">Bileşenler</h2>
            <span className="text-xs text-zinc-500 tabular-nums">
              {doneCount}/{total}
            </span>
          </div>

          <div className="h-1 bg-zinc-100 rounded-full overflow-hidden mb-5">
            <div
              className="h-full bg-zinc-900 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5">
            {COMPONENTS.map(({ name, done }) => (
              <div
                key={name}
                className={
                  done
                    ? "inline-flex items-center gap-2 px-2.5 h-8 text-xs rounded-sm border border-zinc-300 bg-zinc-900 text-white"
                    : "inline-flex items-center gap-2 px-2.5 h-8 text-xs rounded-sm border border-zinc-200 bg-zinc-50 text-zinc-700"
                }
              >
                <span
                  className={
                    done
                      ? "size-1.5 rounded-full bg-white shrink-0"
                      : "size-1.5 rounded-full bg-zinc-300 shrink-0"
                  }
                />
                <span className="truncate">{name}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500">
            <div className="inline-flex items-center gap-1.5">
              <span className="inline-block size-2.5 rounded-sm bg-zinc-900" />
              Hazır
            </div>
            <div className="inline-flex items-center gap-1.5">
              <span className="inline-block size-2.5 rounded-sm bg-zinc-50 border border-zinc-200" />
              Planlı
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-500">
          <div className="bg-white border border-zinc-200 rounded-sm p-4">
            <div className="font-medium text-zinc-900 mb-1">Hazır</div>
            Build pipeline (tsup), TypeScript strict, Tailwind v4 entegrasyonu,
            Storybook 10, CI / npm publish workflow, Tier 1 bileşenlerin
            tamamı.
          </div>
          <div className="bg-white border border-zinc-200 rounded-sm p-4">
            <div className="font-medium text-zinc-900 mb-1">Sıradaki</div>
            Tier 2 — basit state'li form bileşenleri (Button, Input, Switch,
            Checkbox, Radio, Progress vb.).
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
