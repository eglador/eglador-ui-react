import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "../components/separator";

const meta: Meta<typeof Separator> = {
  title: "Components/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Horizontal or vertical divider. solid / dashed / dotted variants, optional label, decorative mode (`role=\"none\"` for purely visual use).",
      },
    },
  },
  args: {
    orientation: "horizontal",
    variant: "solid",
    decorative: false,
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Orientation.",
    },
    variant: {
      control: "select",
      options: ["solid", "dashed", "dotted"],
      description: "Line style.",
    },
    label: {
      control: "text",
      description: "Text shown in the middle of a horizontal divider. When set, the line splits into two segments.",
    },
    decorative: {
      control: "boolean",
      description:
        "When true, role=\"none\" (no a11y semantics — visual only). When false (default), role=\"separator\" with aria-orientation.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <p className="text-sm text-zinc-600 mb-3">Content above.</p>
      <Separator {...args} />
      <p className="text-sm text-zinc-600 mt-3">Content below.</p>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-sm">
      <div>
        <span className="text-xs text-zinc-400 mb-2 block">solid</span>
        <Separator variant="solid" />
      </div>
      <div>
        <span className="text-xs text-zinc-400 mb-2 block">dashed</span>
        <Separator variant="dashed" />
      </div>
      <div>
        <span className="text-xs text-zinc-400 mb-2 block">dotted</span>
        <Separator variant="dotted" />
      </div>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-sm">
      <Separator label="OR" />
      <Separator label="Section" variant="dashed" />
      <Separator label="End" variant="dotted" />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-3 h-10">
      <span className="text-sm text-zinc-600">Left</span>
      <Separator orientation="vertical" />
      <span className="text-sm text-zinc-600">Middle</span>
      <Separator orientation="vertical" variant="dashed" />
      <span className="text-sm text-zinc-600">Right</span>
    </div>
  ),
};

export const InMenu: Story = {
  render: () => (
    <div className="w-56 rounded-sm border border-zinc-200 bg-white py-1.5">
      <div className="px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 cursor-pointer">
        Profile
      </div>
      <div className="px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 cursor-pointer">
        Settings
      </div>
      <div className="my-1">
        <Separator />
      </div>
      <div className="px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 cursor-pointer">
        Log out
      </div>
    </div>
  ),
};

export const Decorative: Story = {
  render: () => (
    <div className="max-w-sm">
      <p className="text-sm text-zinc-600 mb-3">
        decorative=true → role=none, screen readers skip this element.
      </p>
      <Separator decorative />
    </div>
  ),
};
