import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker } from "../components/date-picker";
import { Label } from "../components/label";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Date input that opens a Calendar popover. Single date only — use Calendar with `mode=\"range\"` for ranges.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-2 max-w-xs">
      <Label>Date of birth</Label>
      <DatePicker />
    </div>
  ),
};
