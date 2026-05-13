import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Calendar, type CalendarRange } from "../components/calendar";

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Date picker grid with single or range mode, month navigation, controlled month, optional min/max dates and per-day disabled predicate. No external date library.",
      },
    },
  },
  argTypes: {
    mode: { control: "select", options: ["single", "range"] },
  },
  args: {
    mode: "single",
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Single: Story = {
  render: function SingleStory() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div className="flex items-start gap-4">
        <Calendar mode="single" value={date} onValueChange={setDate} />
        <div className="text-xs text-zinc-500">
          Selected:{" "}
          <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">
            {date?.toDateString() ?? "(none)"}
          </code>
        </div>
      </div>
    );
  },
};

export const Range: Story = {
  render: function RangeStory() {
    const [range, setRange] = React.useState<CalendarRange>({});
    return (
      <div className="flex items-start gap-4">
        <Calendar mode="range" value={range} onValueChange={setRange} />
        <div className="text-xs text-zinc-500">
          From: <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">{range.from?.toDateString() ?? "—"}</code>
          <br />
          To: <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">{range.to?.toDateString() ?? "—"}</code>
        </div>
      </div>
    );
  },
};
