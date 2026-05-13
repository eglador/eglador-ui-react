import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  type HoverCardProps,
} from "../components/hover-card";
import { Avatar } from "../components/avatar";

const meta: Meta<typeof HoverCard> = {
  title: "Components/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Hover-triggered rich-content card (e.g., user previews, link unfurls). Like Tooltip but supports interactive content. Configurable `openDelay` / `closeDelay`, viewport-collision aware.",
      },
    },
  },
  argTypes: {
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    align: { control: "select", options: ["start", "center", "end"] },
    sideOffset: { control: "number" },
    alignOffset: { control: "number" },
    openDelay: { control: "number" },
    closeDelay: { control: "number" },
  },
  args: {
    side: "bottom",
    align: "center",
    sideOffset: 8,
    alignOffset: 0,
    openDelay: 400,
    closeDelay: 200,
  },
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  render: (args: HoverCardProps) => (
    <div className="flex items-center justify-center p-16">
      <HoverCard {...args}>
        <HoverCardTrigger asChild>
          <a href="#" className="text-sm font-medium text-zinc-900 underline">
            @kenan
          </a>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex gap-3">
            <Avatar size="md" src="https://i.pravatar.cc/80?u=kenan" name="Kenan" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-zinc-900">
                Kenan Gündoğan
              </h4>
              <p className="text-xs text-zinc-500">
                Building eglador-ui-react — a headless React component library.
              </p>
              <p className="text-xs text-zinc-400">Joined December 2026</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};
