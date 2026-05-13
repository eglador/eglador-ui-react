import type { Meta, StoryObj } from "@storybook/react-vite";
import { Share2, Copy, Edit, Heart, Trash, Plus } from "lucide-react";
import {
  SpeedDial,
  SpeedDialTrigger,
  SpeedDialActions,
  SpeedDialAction,
  type SpeedDialProps,
} from "../components/speed-dial";

const meta: Meta<typeof SpeedDial> = {
  title: "Components/SpeedDial",
  component: SpeedDial,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Floating action button with expandable secondary actions. Compound API: `<SpeedDial>` + `<SpeedDialTrigger>` + `<SpeedDialActions>` + `<SpeedDialAction>`. Inline or fixed viewport positioning (4 corners), 3 sizes, 3 shapes, 6 shadow levels, configurable direction (auto-derived from position), optional backdrop, outside-click + Escape close, disabled state, label tooltips on each action.",
      },
    },
  },
  argTypes: {
    position: {
      control: "select",
      options: [
        "inline",
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
      ],
    },
    direction: {
      control: "select",
      options: ["up", "down", "left", "right"],
    },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    shape: { control: "select", options: ["circle", "rounded", "square"] },
    shadow: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl"],
    },
    disabled: { control: "boolean" },
    backdrop: { control: "boolean" },
    closeOnOutsideClick: { control: "boolean" },
    closeOnEscape: { control: "boolean" },
    defaultOpen: { control: "boolean" },
  },
  args: {
    position: "inline",
    size: "md",
    shape: "circle",
    shadow: "lg",
    disabled: false,
    backdrop: false,
    closeOnOutsideClick: true,
    closeOnEscape: true,
    defaultOpen: false,
  },
};

export default meta;
type Story = StoryObj<typeof SpeedDial>;

function Demo(args: SpeedDialProps) {
  return (
    <SpeedDial key={String(args.defaultOpen)} {...args}>
      <SpeedDialTrigger />
      <SpeedDialActions>
        <SpeedDialAction label="Share">
          <Share2 className="size-4" />
        </SpeedDialAction>
        <SpeedDialAction label="Copy">
          <Copy className="size-4" />
        </SpeedDialAction>
        <SpeedDialAction label="Edit">
          <Edit className="size-4" />
        </SpeedDialAction>
        <SpeedDialAction label="Like">
          <Heart className="size-4" />
        </SpeedDialAction>
      </SpeedDialActions>
    </SpeedDial>
  );
}

export const Default: Story = {
  render: (args) => (
    <div className="flex items-end justify-center p-16 h-64">
      <Demo {...args} />
    </div>
  ),
};

export const Directions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-12 p-16">
      {(["up", "down", "left", "right"] as const).map((dir) => (
        <div
          key={dir}
          className="flex items-center justify-center h-32 border border-dashed border-zinc-200 rounded-sm"
        >
          <Demo
            position="inline"
            direction={dir}
            size="md"
            shape="circle"
            shadow="lg"
            disabled={false}
            backdrop={false}
            closeOnOutsideClick
            closeOnEscape
            defaultOpen={false}
          />
        </div>
      ))}
    </div>
  ),
};

export const Positions: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Set `position` to anchor the SpeedDial to a viewport corner with `fixed` positioning. Direction auto-derives from position (top corners default to `down`, bottom corners to `up`), but you can override.",
      },
    },
  },
  render: () => (
    <div className="relative min-h-[420px] bg-zinc-50">
      <SpeedDial position="top-left" size="sm">
        <SpeedDialTrigger />
        <SpeedDialActions>
          <SpeedDialAction label="Top-left">
            <Plus className="size-4" />
          </SpeedDialAction>
        </SpeedDialActions>
      </SpeedDial>
      <SpeedDial position="top-right" size="sm">
        <SpeedDialTrigger />
        <SpeedDialActions>
          <SpeedDialAction label="Top-right">
            <Plus className="size-4" />
          </SpeedDialAction>
        </SpeedDialActions>
      </SpeedDial>
      <SpeedDial position="bottom-left" size="sm">
        <SpeedDialTrigger />
        <SpeedDialActions>
          <SpeedDialAction label="Bottom-left">
            <Plus className="size-4" />
          </SpeedDialAction>
        </SpeedDialActions>
      </SpeedDial>
      <SpeedDial position="bottom-right" size="sm">
        <SpeedDialTrigger />
        <SpeedDialActions>
          <SpeedDialAction label="Bottom-right">
            <Plus className="size-4" />
          </SpeedDialAction>
        </SpeedDialActions>
      </SpeedDial>
      <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-500 pointer-events-none">
        Four corners anchored to viewport
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end justify-center gap-6 p-12">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <SpeedDial position="inline" size={size}>
            <SpeedDialTrigger />
          </SpeedDial>
          <code className="text-xs text-zinc-500">{size}</code>
        </div>
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-8 p-12">
      {(["circle", "rounded", "square"] as const).map((shape) => (
        <div key={shape} className="flex flex-col items-center gap-2">
          <Demo
            position="inline"
            shape={shape}
            size="md"
            shadow="lg"
            disabled={false}
            backdrop={false}
            closeOnOutsideClick
            closeOnEscape
            defaultOpen={false}
          />
          <code className="text-xs text-zinc-500">{shape}</code>
        </div>
      ))}
    </div>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-6 p-12">
      {(["none", "xs", "sm", "md", "lg", "xl"] as const).map((shadow) => (
        <div key={shadow} className="flex flex-col items-center gap-2">
          <SpeedDial position="inline" shadow={shadow}>
            <SpeedDialTrigger />
          </SpeedDial>
          <code className="text-xs text-zinc-500">{shadow}</code>
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center justify-center p-12">
      <Demo
        position="inline"
        disabled
        size="md"
        shape="circle"
        shadow="lg"
        backdrop={false}
        closeOnOutsideClick
        closeOnEscape
        defaultOpen={false}
      />
    </div>
  ),
};

export const WithBackdrop: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Set `backdrop` to dim the page when the dial is open. Clicking the backdrop closes it (when `closeOnOutsideClick` is enabled).",
      },
    },
  },
  render: () => (
    <div className="relative min-h-[320px] flex items-end justify-end p-8 bg-zinc-50 rounded-md">
      <SpeedDial position="inline" backdrop defaultOpen>
        <SpeedDialTrigger />
        <SpeedDialActions>
          <SpeedDialAction label="Share">
            <Share2 className="size-4" />
          </SpeedDialAction>
          <SpeedDialAction label="Copy">
            <Copy className="size-4" />
          </SpeedDialAction>
          <SpeedDialAction label="Delete">
            <Trash className="size-4" />
          </SpeedDialAction>
        </SpeedDialActions>
      </SpeedDial>
    </div>
  ),
};
