import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateTimePicker } from "../components/date-time-picker";
import { Label } from "../components/label";

const meta: Meta<typeof DateTimePicker> = {
  title: "Components/DateTimePicker",
  component: DateTimePicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "DatePicker variant with hour / minute (and optional seconds) inputs in the popover footer.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DateTimePicker>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-2 max-w-xs">
      <Label>Schedule a meeting</Label>
      <DateTimePicker />
    </div>
  ),
};

export const WithSeconds: Story = {
  render: () => (
    <div className="flex flex-col gap-2 max-w-xs">
      <Label>Precise timestamp</Label>
      <DateTimePicker showSeconds />
    </div>
  ),
};
