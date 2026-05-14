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
          "Headless date picker grid with `single` / `range` / `multiple` modes, multi-month layout, caption dropdowns, week numbers, locale-aware weekday formatting, RTL, and a footer slot. Zero date-library dependencies — uses `Intl.DateTimeFormat`.",
      },
    },
  },
  argTypes: {
    mode: { control: "select", options: ["single", "range", "multiple"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    captionLayout: {
      control: "select",
      options: ["label", "dropdown", "dropdown-months", "dropdown-years"],
    },
    weekdayFormat: {
      control: "select",
      options: ["narrow", "short", "long"],
    },
    numberOfMonths: { control: { type: "number", min: 1, max: 4, step: 1 } },
    firstDayOfWeek: {
      control: "select",
      options: [0, 1, 2, 3, 4, 5, 6],
    },
    showWeekNumber: { control: "boolean" },
    showOutsideDays: { control: "boolean" },
    fixedWeeks: { control: "boolean" },
    dir: { control: "select", options: ["ltr", "rtl"] },
    locale: { control: "text" },
  },
  args: {
    mode: "single",
    size: "md",
    captionLayout: "label",
    weekdayFormat: "short",
    numberOfMonths: 1,
    firstDayOfWeek: 0,
    showWeekNumber: false,
    showOutsideDays: true,
    fixedWeeks: false,
    dir: "ltr",
  },
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: (args) => <Calendar key={JSON.stringify(args)} {...args} />,
};

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
          From:{" "}
          <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">
            {range.from?.toDateString() ?? "—"}
          </code>
          <br />
          To:{" "}
          <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">
            {range.to?.toDateString() ?? "—"}
          </code>
        </div>
      </div>
    );
  },
};

export const Multiple: Story = {
  render: function MultipleStory() {
    const [dates, setDates] = React.useState<Date[]>([]);
    return (
      <div className="flex items-start gap-4">
        <Calendar
          mode="multiple"
          value={dates}
          onValueChange={setDates}
          max={5}
        />
        <div className="text-xs text-zinc-500 max-w-[180px]">
          Up to 5 dates. Selected:{" "}
          <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm break-all">
            {dates.length
              ? dates.map((d) => d.toLocaleDateString()).join(", ")
              : "(none)"}
          </code>
        </div>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="text-xs text-zinc-500">{size}</span>
          <Calendar size={size} />
        </div>
      ))}
    </div>
  ),
};

export const CaptionDropdown: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`captionLayout` switches the month/year navigation. `dropdown` renders both as selects, `dropdown-months` / `dropdown-years` render only one.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      <Calendar captionLayout="dropdown" />
      <Calendar captionLayout="dropdown-months" />
      <Calendar captionLayout="dropdown-years" />
    </div>
  ),
};

export const MultipleMonths: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`numberOfMonths` renders multiple months side-by-side. Navigation moves the entire viewport.",
      },
    },
  },
  render: function MultipleMonthsStory() {
    const [range, setRange] = React.useState<CalendarRange>({});
    return (
      <Calendar
        mode="range"
        value={range}
        onValueChange={setRange}
        numberOfMonths={2}
      />
    );
  },
};

export const WeekNumbers: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`showWeekNumber` adds an ISO 8601 week column on the leading edge of the grid.",
      },
    },
  },
  render: () => <Calendar showWeekNumber />,
};

export const FixedWeeks: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`fixedWeeks` always renders 6 rows so the calendar height stays stable across months.",
      },
    },
  },
  render: () => <Calendar fixedWeeks showOutsideDays />,
};

export const HideOutsideDays: Story = {
  render: () => <Calendar showOutsideDays={false} />,
};

export const Locale: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`locale` drives month names and weekday labels via `Intl.DateTimeFormat`. `firstDayOfWeek` is independent.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-zinc-500">tr-TR · Monday start</span>
        <Calendar locale="tr-TR" firstDayOfWeek={1} weekdayFormat="short" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-zinc-500">de-DE · Monday start</span>
        <Calendar locale="de-DE" firstDayOfWeek={1} weekdayFormat="short" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-zinc-500">ja-JP · Sunday start</span>
        <Calendar locale="ja-JP" firstDayOfWeek={0} weekdayFormat="narrow" />
      </div>
    </div>
  ),
};

export const RTL: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`dir=\"rtl\"` flips the grid and chevrons. Combine with an Arabic/Hebrew locale for a localized layout.",
      },
    },
  },
  render: () => (
    <Calendar
      dir="rtl"
      locale="ar-EG"
      firstDayOfWeek={6}
      weekdayFormat="short"
    />
  ),
};

export const MinMax: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`minDate` / `maxDate` clamp the selectable range. Out-of-bounds days are non-interactive.",
      },
    },
  },
  render: function MinMaxStory() {
    const today = new Date();
    const min = new Date(today.getFullYear(), today.getMonth(), 5);
    const max = new Date(today.getFullYear(), today.getMonth(), 25);
    return <Calendar minDate={min} maxDate={max} />;
  },
};

export const DisabledWeekends: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`disabledDates` accepts a predicate `(date) => boolean`. Here weekends are blocked.",
      },
    },
  },
  render: () => (
    <Calendar
      disabledDates={(d) => d.getDay() === 0 || d.getDay() === 6}
    />
  ),
};

export const WithFooter: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`footer` accepts any React node — useful for quick presets, action buttons, or selection summaries.",
      },
    },
  },
  render: function WithFooterStory() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <Calendar
        mode="single"
        value={date}
        onValueChange={setDate}
        footer={
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="text-xs text-zinc-600">
              {date ? date.toLocaleDateString() : "Pick a day"}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setDate(new Date())}
                className="text-xs px-2 py-1 rounded-md border border-zinc-300 hover:bg-zinc-100"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setDate(undefined)}
                className="text-xs px-2 py-1 rounded-md border border-zinc-300 hover:bg-zinc-100"
              >
                Clear
              </button>
            </div>
          </div>
        }
      />
    );
  },
};
