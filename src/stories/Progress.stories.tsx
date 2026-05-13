import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Progress, type ProgressProps } from "../components/progress";

const meta: Meta<typeof Progress> = {
  title: "Components/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Progress bar. Determinate (`value`/`max`) and indeterminate (animated bar) modes. 5 sizes, 3 shapes, optional `label` and `showValue` (%). `role=\"progressbar\"` with proper `aria-valuemin/max/now`. Indeterminate animation respects `prefers-reduced-motion`.",
      },
    },
  },
  args: {
    value: 45,
    max: 100,
    size: "md",
    shape: "pill",
    indeterminate: false,
    showValue: false,
  },
  argTypes: {
    value: { control: { type: "number", min: 0, max: 100 } },
    max: { control: { type: "number", min: 1, max: 1000 } },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    shape: { control: "select", options: ["square", "rounded", "pill"] },
    indeterminate: { control: "boolean" },
    showValue: { control: "boolean" },
    label: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  render: (args: ProgressProps) => (
    <div className="w-80">
      <Progress {...args} />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-400">{size}</span>
          <Progress size={size} value={60} />
        </div>
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      {(["square", "rounded", "pill"] as const).map((shape) => (
        <div key={shape} className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-400">{shape}</span>
          <Progress shape={shape} value={70} size="md" />
        </div>
      ))}
    </div>
  ),
};

export const Values: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <Progress value={0} showValue label="0%" />
      <Progress value={25} showValue label="25%" />
      <Progress value={50} showValue label="50%" />
      <Progress value={75} showValue label="75%" />
      <Progress value={100} showValue label="100%" />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Progress label="Uploading…" value={32} showValue />
      <Progress label="Processing" value={68} showValue size="sm" />
      <Progress label="Compiling" value={91} showValue size="lg" />
    </div>
  ),
};

export const Indeterminate: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "When `value` is omitted or `indeterminate` is true, an animated bar slides across the track. Useful when the duration is unknown. Honors `prefers-reduced-motion: reduce`.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Progress indeterminate label="Loading…" />
      <Progress indeterminate size="xs" />
      <Progress indeterminate size="sm" />
      <Progress indeterminate size="md" />
      <Progress indeterminate size="lg" />
      <Progress indeterminate size="xl" />
    </div>
  ),
};

export const CustomMax: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <Progress label="3 of 8 steps" value={3} max={8} showValue />
      <Progress label="240 / 500 MB" value={240} max={500} showValue />
      <Progress label="12 of 20 items" value={12} max={20} showValue size="lg" />
    </div>
  ),
};

export const Animated: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Determinate progress transitions smoothly when `value` changes (`transition-[width] duration-500 ease-out`).",
      },
    },
  },
  render: function AnimatedStory() {
    const [value, setValue] = React.useState(0);
    React.useEffect(() => {
      const id = window.setInterval(() => {
        setValue((v) => (v >= 100 ? 0 : v + 10));
      }, 800);
      return () => window.clearInterval(id);
    }, []);
    return (
      <div className="w-80">
        <Progress value={value} label="Auto-incrementing" showValue size="md" />
      </div>
    );
  },
};

export const FileUpload: Story = {
  parameters: {
    docs: {
      description: {
        story: "Real-world file upload pattern with size + status text.",
      },
    },
  },
  render: () => (
    <div className="w-96 flex flex-col gap-3 border border-zinc-200 rounded-sm p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-zinc-900">
          design-mockup.fig
        </span>
        <span className="text-xs text-zinc-500 tabular-nums">
          1.2 MB / 4.8 MB
        </span>
      </div>
      <Progress value={1200} max={4800} size="sm" />
      <span className="text-xs text-zinc-500">Yükleniyor… 25%</span>
    </div>
  ),
};
