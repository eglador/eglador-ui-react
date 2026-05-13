import type { Meta, StoryObj } from "@storybook/react-vite";
import { Share2, Copy, Edit, Heart } from "lucide-react";
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
    docs: {
      description: {
        component:
          "Floating action button with expandable secondary actions. Compound API: `<SpeedDial>` + `<SpeedDialTrigger>` + `<SpeedDialActions>` + `<SpeedDialAction>`. Direction (up / down / left / right), 3 sizes, label tooltips on each action.",
      },
    },
  },
  argTypes: {
    direction: {
      control: "select",
      options: ["up", "down", "left", "right"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  args: { direction: "up", size: "md" },
};

export default meta;
type Story = StoryObj<typeof SpeedDial>;

export const Default: Story = {
  render: (args: SpeedDialProps) => (
    <div className="flex items-end justify-end p-16 h-64">
      <SpeedDial {...args}>
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
    </div>
  ),
};
