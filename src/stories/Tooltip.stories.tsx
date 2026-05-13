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
          "Hover-triggered annotation. Compound API: `<Tooltip>` + `<TooltipTrigger>` + `<TooltipContent>`. Portal-rendered, viewport-collision aware (flips side when needed), `asChild` for custom triggers, configurable delay / side / align, optional arrow.",
      },
    },
  },
  argTypes: {
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    align: { control: "select", options: ["start", "center", "end"] },
    delayDuration: { control: "number" },
  },
  args: {
    side: "top",
    align: "center",
    delayDuration: 300,
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

export const LongContent: Story = {
  render: () => (
    <div className="flex items-center justify-center p-16">
      <Tooltip side="bottom">
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
