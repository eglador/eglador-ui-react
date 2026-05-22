import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  Slider,
  type SliderSize,
  type SliderOrientation,
} from "../components/slider";

type StoryArgs = {
  size: SliderSize;
  orientation: SliderOrientation;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  defaultValue: number[];
};

const meta: Meta<StoryArgs> = {
  title: "Components/Slider",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Range input + thumb. Single (`[50]`) and range (`[20, 80]`) modes share the same interface via a value array. 5 sizes (xs/sm/md/lg/xl), 2 orientations (horizontal/vertical), pointer + keyboard navigation (Arrow/Home/End/PageUp/PageDown), optional marks (with label support), `minStepsBetweenThumbs` to enforce a minimum gap in range mode, and form integration through a native `<input type=\"hidden\">` (via the `name` prop).",
      },
    },
  },
  args: {
    size: "md",
    orientation: "horizontal",
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    defaultValue: [50],
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
    defaultValue: { control: "object" },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Default: Story = {
  render: (args) => (
    <div className={args.orientation === "vertical" ? "h-64" : "w-96"}>
      <Slider
        key={`${args.size}-${args.orientation}-${args.disabled}-${JSON.stringify(args.defaultValue)}`}
        size={args.size}
        orientation={args.orientation}
        min={args.min}
        max={args.max}
        step={args.step}
        disabled={args.disabled}
        defaultValue={args.defaultValue}
      />
    </div>
  ),
};

export const Range: Story = {
  render: () => (
    <div className="w-96">
      <Slider defaultValue={[20, 80]} />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-96">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size: SliderSize) => (
        <div key={size} className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 w-6">{size}</span>
          <div className="flex-1">
            <Slider size={size} defaultValue={[50]} />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex gap-8 h-64">
      <div className="flex flex-col items-center gap-2">
        <Slider orientation="vertical" defaultValue={[50]} />
        <span className="text-xs text-zinc-500">single</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Slider orientation="vertical" defaultValue={[20, 80]} />
        <span className="text-xs text-zinc-500">range</span>
      </div>
    </div>
  ),
};

export const WithMarks: Story = {
  render: () => (
    <div className="flex flex-col gap-10 w-96">
      <Slider
        defaultValue={[40]}
        min={0}
        max={100}
        step={10}
        marks={[0, 25, 50, 75, 100]}
      />
      <Slider
        defaultValue={[2]}
        min={1}
        max={5}
        step={1}
        marks={[
          { value: 1, label: "Cok dusuk" },
          { value: 2, label: "Dusuk" },
          { value: 3, label: "Orta" },
          { value: 4, label: "Yuksek" },
          { value: 5, label: "Cok yuksek" },
        ]}
        showMarkLabels
      />
    </div>
  ),
};

export const Steps: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-96">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-zinc-500">step = 1 (default)</span>
        <Slider defaultValue={[50]} step={1} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-zinc-500">step = 5</span>
        <Slider defaultValue={[50]} step={5} marks={[0, 25, 50, 75, 100]} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-zinc-500">step = 25</span>
        <Slider
          defaultValue={[50]}
          step={25}
          marks={[0, 25, 50, 75, 100]}
        />
      </div>
    </div>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = React.useState<number[]>([30]);
    const [committedValue, setCommittedValue] = React.useState<number[]>([30]);
    return (
      <div className="flex flex-col gap-3 w-96">
        <Slider
          value={value}
          onValueChange={setValue}
          onValueCommit={setCommittedValue}
        />
        <p className="text-sm text-zinc-600">
          Live:{" "}
          <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">
            [{value.join(", ")}]
          </code>
        </p>
        <p className="text-sm text-zinc-600">
          Commit (after release):{" "}
          <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">
            [{committedValue.join(", ")}]
          </code>
        </p>
      </div>
    );
  },
};

export const RangeWithMinDistance: Story = {
  name: "Range — minimum distance",
  render: function RangeMinStory() {
    const [value, setValue] = React.useState<number[]>([30, 60]);
    return (
      <div className="flex flex-col gap-3 w-96">
        <Slider
          value={value}
          onValueChange={setValue}
          minStepsBetweenThumbs={10}
          step={1}
        />
        <p className="text-sm text-zinc-600">
          Thumbs must be at least 10 units apart — [
          {value.join(", ")}]
        </p>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-96">
      <Slider defaultValue={[40]} disabled />
      <Slider defaultValue={[20, 80]} disabled />
    </div>
  ),
};

export const PriceFilter: Story = {
  name: "Real Use: Price Filter",
  render: function PriceStory() {
    const [range, setRange] = React.useState<number[]>([250, 750]);
    return (
      <div className="flex flex-col gap-4 w-96 rounded-lg border border-zinc-200 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-700">Fiyat Araligi</span>
          <span className="text-sm text-zinc-500">
            ₺{range[0]} — ₺{range[1]}
          </span>
        </div>
        <Slider
          value={range}
          onValueChange={setRange}
          min={0}
          max={1000}
          step={10}
          marks={[0, 250, 500, 750, 1000]}
        />
      </div>
    );
  },
};

export const VolumeControl: Story = {
  name: "Real Use: Volume Control",
  render: function VolumeStory() {
    const [volume, setVolume] = React.useState<number[]>([35]);
    return (
      <div className="flex items-center gap-3 w-80 rounded-lg border border-zinc-200 p-4">
        <svg className="size-5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
        <div className="flex-1">
          <Slider value={volume} onValueChange={setVolume} />
        </div>
        <span className="text-xs tabular-nums text-zinc-500 w-8 text-right">
          {volume[0]}%
        </span>
      </div>
    );
  },
};
