import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
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
          "Calendar + hour/minute inputs (with optional seconds + AM/PM). Same Calendar pass-throughs as `DatePicker`: caption dropdown, locale, RTL, disabled predicates, min/max, etc.",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    captionLayout: {
      control: "select",
      options: ["label", "dropdown", "dropdown-months", "dropdown-years"],
    },
    weekdayFormat: {
      control: "select",
      options: ["narrow", "short", "long"],
    },
    firstDayOfWeek: {
      control: "select",
      options: [0, 1, 2, 3, 4, 5, 6],
    },
    numberOfMonths: { control: { type: "number", min: 1, max: 3, step: 1 } },
    step: { control: { type: "number", min: 1, max: 30, step: 1 } },
    showSeconds: { control: "boolean" },
    hour12: { control: "boolean" },
    clearable: { control: "boolean" },
    disabled: { control: "boolean" },
    showWeekNumber: { control: "boolean" },
    showOutsideDays: { control: "boolean" },
    fixedWeeks: { control: "boolean" },
    dir: { control: "select", options: ["ltr", "rtl"] },
    locale: { control: "text" },
    placeholder: { control: "text" },
  },
  args: {
    size: "md",
    captionLayout: "label",
    weekdayFormat: "short",
    firstDayOfWeek: 0,
    step: 1,
    showSeconds: false,
    hour12: false,
    clearable: false,
    disabled: false,
    showWeekNumber: false,
    showOutsideDays: true,
    fixedWeeks: false,
    dir: "ltr",
  },
};

export default meta;
type Story = StoryObj<typeof DateTimePicker>;

export const Default: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2 max-w-xs">
      <Label>Schedule a meeting</Label>
      <DateTimePicker key={JSON.stringify(args)} {...args} />
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

export const Hour12: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`hour12` switches to 12-hour input with an AM/PM toggle button.",
      },
    },
  },
  render: function Hour12Story() {
    const [d, setD] = React.useState<Date | undefined>(new Date());
    return (
      <div className="flex flex-col gap-2 max-w-xs">
        <Label>Meeting time</Label>
        <DateTimePicker hour12 value={d} onValueChange={setD} />
      </div>
    );
  },
};

export const MinuteStep: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`step` controls the minute input step. Set to 15 for quarter-hour slots, 30 for half-hour, etc.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2 max-w-xs">
      <Label>15-minute slots</Label>
      <DateTimePicker step={15} />
    </div>
  ),
};

export const Clearable: Story = {
  render: function ClearableStory() {
    const [d, setD] = React.useState<Date | undefined>(new Date());
    return (
      <div className="flex flex-col gap-2 max-w-xs">
        <Label>Date & time</Label>
        <DateTimePicker clearable value={d} onValueChange={setD} />
      </div>
    );
  },
};

export const DropdownCaption: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`captionLayout=\"dropdown\"` adds month + year dropdowns. Combine with `yearRange` for bounded years.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2 max-w-xs">
      <Label>Pick date & time</Label>
      <DateTimePicker captionLayout="dropdown" />
    </div>
  ),
};

export const MinMax: Story = {
  render: () => {
    const today = new Date();
    const min = new Date(today.getFullYear(), today.getMonth(), 5);
    const max = new Date(today.getFullYear(), today.getMonth(), 25);
    return (
      <div className="flex flex-col gap-2 max-w-xs">
        <Label>Within 5–25 of this month</Label>
        <DateTimePicker minDate={min} maxDate={max} />
      </div>
    );
  },
};

export const Locale: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-xs">
      <div className="flex flex-col gap-2">
        <Label>tr-TR · Pazartesi başlangıçlı</Label>
        <DateTimePicker locale="tr-TR" firstDayOfWeek={1} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>de-DE · 24h</Label>
        <DateTimePicker locale="de-DE" firstDayOfWeek={1} />
      </div>
    </div>
  ),
};

export const RTL: Story = {
  parameters: {
    docs: {
      description: {
        story: "`dir=\"rtl\"` flips trigger + calendar layout.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2 max-w-xs" dir="rtl">
      <Label>التاريخ والوقت</Label>
      <DateTimePicker
        dir="rtl"
        locale="ar-EG"
        firstDayOfWeek={6}
        placeholder="اختر التاريخ والوقت"
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-xs">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-1">
          <Label>{size}</Label>
          <DateTimePicker size={size} />
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-2 max-w-xs">
      <Label>Disabled</Label>
      <DateTimePicker disabled defaultValue={new Date()} />
    </div>
  ),
};
