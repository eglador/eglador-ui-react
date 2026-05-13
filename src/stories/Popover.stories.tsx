import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  type PopoverProps,
} from "../components/popover";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";

const meta: Meta<typeof Popover> = {
  title: "Components/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Click-triggered floating panel. Compound API: `<Popover>` + `<PopoverTrigger>` + `<PopoverContent>` (+ optional `<PopoverClose>`). Outside-click and Escape close it, viewport-collision aware, `asChild` on trigger/close.",
      },
    },
  },
  argTypes: {
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    align: { control: "select", options: ["start", "center", "end"] },
  },
  args: {
    side: "bottom",
    align: "center",
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: (args: PopoverProps) => (
    <div className="flex items-center justify-center p-16">
      <Popover {...args}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            Open popover
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-zinc-900">Dimensions</h4>
              <p className="text-xs text-zinc-500">
                Set the layout dimensions for this layer.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-3">
                <Label htmlFor="width" className="w-16">
                  Width
                </Label>
                <Input id="width" defaultValue="100%" />
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="height" className="w-16">
                  Height
                </Label>
                <Input id="height" defaultValue="25px" />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const WithClose: Story = {
  render: () => (
    <div className="flex items-center justify-center p-16">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            Confirm
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-3">
            <p className="text-sm">Delete this item?</p>
            <div className="flex gap-2 justify-end">
              <PopoverClose asChild>
                <Button size="xs" variant="ghost">
                  Cancel
                </Button>
              </PopoverClose>
              <PopoverClose asChild>
                <Button size="xs">Delete</Button>
              </PopoverClose>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
};
