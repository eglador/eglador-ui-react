import type { Meta, StoryObj } from "@storybook/react-vite";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  type TooltipProps,
} from "../components/tooltip";
import { Button } from "../components/button";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Hover-triggered annotation. Compound API: `<Tooltip>` + `<TooltipTrigger>` + `<TooltipContent>`. Portal-rendered, viewport-collision aware (flips side when needed), `asChild` for custom triggers. 5 sizes, 3 variants (solid / soft / outline), 2 shapes, 6 shadow levels, optional arrow (variant-aware color), `disabled` prop, configurable delays.",
      },
    },
  },
  argTypes: {
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    align: { control: "select", options: ["start", "center", "end"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    variant: { control: "select", options: ["solid", "soft", "outline"] },
    shape: { control: "select", options: ["square", "rounded"] },
    shadow: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl"],
    },
    delayDuration: { control: "number" },
    closeDelay: { control: "number" },
    disabled: { control: "boolean" },
  },
  args: {
    side: "top",
    align: "center",
    size: "md",
    variant: "solid",
    shape: "rounded",
    shadow: "md",
    delayDuration: 300,
    closeDelay: 100,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: (args: TooltipProps) => (
    <div className="flex items-center justify-center p-16">
      <Tooltip {...args}>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            Hover me
          </Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip content</TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-3 p-16">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Tooltip key={size} size={size} defaultOpen side="bottom">
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              {size}
            </Button>
          </TooltipTrigger>
          <TooltipContent>size = {size}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-3 p-16">
      {(["solid", "soft", "outline"] as const).map((variant) => (
        <Tooltip key={variant} variant={variant} defaultOpen side="bottom">
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              {variant}
            </Button>
          </TooltipTrigger>
          <TooltipContent arrow>variant = {variant}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-3 p-16">
      {(["square", "rounded"] as const).map((shape) => (
        <Tooltip key={shape} shape={shape} defaultOpen side="bottom">
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              {shape}
            </Button>
          </TooltipTrigger>
          <TooltipContent>shape = {shape}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-4 p-16 bg-zinc-50">
      {(["none", "xs", "sm", "md", "lg", "xl"] as const).map((shadow) => (
        <Tooltip
          key={shadow}
          shadow={shadow}
          variant="outline"
          defaultOpen
          side="bottom"
        >
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              {shadow}
            </Button>
          </TooltipTrigger>
          <TooltipContent>shadow = {shadow}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

export const Sides: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-3 p-16">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side} side={side}>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              {side}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Side = {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

export const WithArrow: Story = {
  render: () => (
    <div className="flex items-center justify-center p-16">
      <Tooltip side="bottom">
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            <Info className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent arrow>Tooltip with arrow</TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "When `disabled` is true, the tooltip never opens — useful for conditional suppression without unmounting the trigger.",
      },
    },
  },
  render: () => (
    <div className="flex items-center justify-center gap-3 p-16">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            Enabled (hover)
          </Button>
        </TooltipTrigger>
        <TooltipContent>I will appear</TooltipContent>
      </Tooltip>
      <Tooltip disabled>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            Disabled (no tooltip)
          </Button>
        </TooltipTrigger>
        <TooltipContent>I will NOT appear</TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <div className="flex items-center justify-center p-16">
      <Tooltip side="bottom" size="lg" variant="soft">
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">
            Long tooltip
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs whitespace-normal">
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Tooltips can
          contain longer prose if you remove the default `whitespace-nowrap`
          via className.
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};
