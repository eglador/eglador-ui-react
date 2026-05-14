import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { DatePicker } from "../components/date-picker";
import { Label } from "../components/label";
import type { CalendarRange } from "../components/calendar";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Trigger button + popover Calendar. Supports `single` / `range`, dropdown caption (year/month), multi-month layout, locale, RTL, min/max, disabled predicates, and an optional clear button.",
      },
    },
  },
  argTypes: {
    mode: { control: "select", options: ["single", "range"] },
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
    showWeekNumber: { control: "boolean" },
    showOutsideDays: { control: "boolean" },
    fixedWeeks: { control: "boolean" },
    clearable: { control: "boolean" },
    disabled: { control: "boolean" },
    dir: { control: "select", options: ["ltr", "rtl"] },
    locale: { control: "text" },
    placeholder: { control: "text" },
  },
  args: {
    mode: "single",
    size: "md",
    captionLayout: "label",
    weekdayFormat: "short",
    firstDayOfWeek: 0,
    showWeekNumber: false,
    showOutsideDays: true,
    fixedWeeks: false,
    clearable: false,
    disabled: false,
    dir: "ltr",
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2 max-w-xs">
      <Label>Date</Label>
      <DatePicker key={JSON.stringify(args)} {...args} />
    </div>
  ),
};

export const Single: Story = {
  render: function SingleStory() {
    const [date, setDate] = React.useState<Date>();
    return (
      <div className="flex flex-col gap-2 max-w-xs">
        <Label>Date</Label>
        <DatePicker mode="single" value={date} onValueChange={setDate} />
      </div>
    );
  },
};

export const Range: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`mode=\"range\"` switches the calendar to range selection. Defaults to a 2-month layout. Closes when `to` is picked.",
      },
    },
  },
  render: function RangeStory() {
    const [range, setRange] = React.useState<CalendarRange>({});
    return (
      <div className="flex flex-col gap-2 max-w-md">
        <Label>Stay</Label>
        <DatePicker mode="range" value={range} onValueChange={setRange} />
      </div>
    );
  },
};

export const DateOfBirth: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`captionLayout=\"dropdown\"` + `yearRange` makes long-distance navigation (e.g. birth dates) easy.",
      },
    },
  },
  render: function DOBStory() {
    const [date, setDate] = React.useState<Date>();
    const currentYear = new Date().getFullYear();
    return (
      <div className="flex flex-col gap-2 max-w-xs">
        <Label>Date of birth</Label>
        <DatePicker
          mode="single"
          value={date}
          onValueChange={setDate}
          captionLayout="dropdown"
          yearRange={[currentYear - 100, currentYear]}
          maxDate={new Date()}
        />
      </div>
    );
  },
};

export const Clearable: Story = {
  render: function ClearableStory() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div className="flex flex-col gap-2 max-w-xs">
        <Label>Date</Label>
        <DatePicker
          mode="single"
          value={date}
          onValueChange={setDate}
          clearable
        />
      </div>
    );
  },
};

export const MinMax: Story = {
  render: () => {
    const today = new Date();
    const min = new Date(today.getFullYear(), today.getMonth(), 5);
    const max = new Date(today.getFullYear(), today.getMonth(), 25);
    return (
      <div className="flex flex-col gap-2 max-w-xs">
        <Label>Within 5–25 of this month</Label>
        <DatePicker minDate={min} maxDate={max} />
      </div>
    );
  },
};

export const DisabledWeekends: Story = {
  render: () => (
    <div className="flex flex-col gap-2 max-w-xs">
      <Label>Weekdays only</Label>
      <DatePicker
        disabledDates={(d) => d.getDay() === 0 || d.getDay() === 6}
      />
    </div>
  ),
};

export const Locale: Story = {
  parameters: {
    docs: {
      description: {
        story: "`locale` + `firstDayOfWeek` drive month/weekday names and grid order.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 max-w-xs">
      <div className="flex flex-col gap-2">
        <Label>tr-TR · Pazartesi başlangıçlı</Label>
        <DatePicker locale="tr-TR" firstDayOfWeek={1} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>de-DE · Montag start</Label>
        <DatePicker locale="de-DE" firstDayOfWeek={1} />
      </div>
    </div>
  ),
};

export const RTL: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`dir=\"rtl\"` flips both trigger and calendar layout. Combine with an Arabic/Hebrew locale.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2 max-w-xs" dir="rtl">
      <Label>التاريخ</Label>
      <DatePicker
        dir="rtl"
        locale="ar-EG"
        firstDayOfWeek={6}
        placeholder="اختر تاريخًا"
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
          <DatePicker size={size} />
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-2 max-w-xs">
      <Label>Disabled</Label>
      <DatePicker disabled defaultValue={new Date()} />
    </div>
  ),
};
