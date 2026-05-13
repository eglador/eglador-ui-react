import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupProps,
} from "../components/radio-group";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Single-select radio group. `<fieldset role=\"radiogroup\">` semantic. Single state (`value: string`); controlled / uncontrolled. `RadioGroupItem` reads state from context — composes Radio + label / description. 5 group-wide sizes.",
      },
    },
  },
  args: {
    orientation: "vertical",
    size: "md",
    disabled: false,
    invalid: false,
  },
  argTypes: {
    orientation: { control: "select", options: ["vertical", "horizontal"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    onValueChange: { action: "value changed" },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: (args: RadioGroupProps) => (
    <RadioGroup {...args} defaultValue="apple">
      <RadioGroupItem value="apple" label="Apple" />
      <RadioGroupItem value="banana" label="Banana" />
      <RadioGroupItem value="cherry" label="Cherry" />
      <RadioGroupItem value="date" label="Date" />
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: (args: RadioGroupProps) => (
    <RadioGroup {...args} orientation="horizontal" defaultValue="md">
      <RadioGroupItem value="xs" label="xs" />
      <RadioGroupItem value="sm" label="sm" />
      <RadioGroupItem value="md" label="md" />
      <RadioGroupItem value="lg" label="lg" />
      <RadioGroupItem value="xl" label="xl" />
    </RadioGroup>
  ),
};

export const WithLegend: Story = {
  render: (args: RadioGroupProps) => (
    <RadioGroup
      {...args}
      legend="Visibility"
      description="Who can see this content?"
      defaultValue="private"
    >
      <RadioGroupItem value="public" label="Public" />
      <RadioGroupItem value="private" label="Private" />
      <RadioGroupItem value="invite" label="Invite-only" />
    </RadioGroup>
  ),
};

export const WithDescriptions: Story = {
  render: (args: RadioGroupProps) => (
    <RadioGroup {...args} legend="Notification frequency" defaultValue="daily">
      <RadioGroupItem
        value="realtime"
        label="Real-time"
        description="Get notified instantly when something happens."
      />
      <RadioGroupItem
        value="daily"
        label="Daily digest"
        description="A summary email every day at noon."
      />
      <RadioGroupItem
        value="weekly"
        label="Weekly digest"
        description="A weekly activity report every Monday."
      />
      <RadioGroupItem
        value="never"
        label="Never"
        description="Don't send notifications."
      />
    </RadioGroup>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <RadioGroup
          key={size}
          size={size}
          legend={`size = ${size}`}
          defaultValue="a"
        >
          <RadioGroupItem value="a" label="Option A" />
          <RadioGroupItem value="b" label="Option B" />
          <RadioGroupItem value="c" label="Option C" />
        </RadioGroup>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <RadioGroup legend="Whole group disabled" disabled defaultValue="a">
        <RadioGroupItem value="a" label="Option A" />
        <RadioGroupItem value="b" label="Option B" />
        <RadioGroupItem value="c" label="Option C" />
      </RadioGroup>

      <RadioGroup legend="Single item disabled" defaultValue="a">
        <RadioGroupItem value="a" label="Option A" />
        <RadioGroupItem value="b" label="Option B (disabled)" disabled />
        <RadioGroupItem value="c" label="Option C" />
      </RadioGroup>
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <RadioGroup
      legend="You must pick an option"
      description="Make a selection to continue."
      invalid
    >
      <RadioGroupItem value="a" label="Option A" />
      <RadioGroupItem value="b" label="Option B" />
      <RadioGroupItem value="c" label="Option C" />
    </RadioGroup>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = React.useState("free");
    return (
      <div className="flex flex-col gap-3">
        <RadioGroup
          legend="Plan"
          value={value}
          onValueChange={setValue}
        >
          <RadioGroupItem
            value="free"
            label="Free"
            description="Ideal for solo projects."
          />
          <RadioGroupItem
            value="pro"
            label="Pro"
            description="Advanced features for professionals."
          />
          <RadioGroupItem
            value="enterprise"
            label="Enterprise"
            description="Scalable solution for organizations."
          />
        </RadioGroup>
        <p className="text-sm text-zinc-600">
          Selected:{" "}
          <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">{value}</code>
        </p>
      </div>
    );
  },
};

export const FormSubmit: Story = {
  render: () => (
    <form
      className="flex flex-col gap-3 max-w-sm"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        alert(`plan = ${fd.get("plan")}`);
      }}
    >
      <RadioGroup
        legend="Pick a plan"
        name="plan"
        defaultValue="pro"
      >
        <RadioGroupItem value="free" label="Free" />
        <RadioGroupItem value="pro" label="Pro" />
        <RadioGroupItem value="enterprise" label="Enterprise" />
      </RadioGroup>
      <button
        type="submit"
        className="mt-1 inline-flex self-start items-center h-8 px-3 text-sm rounded-sm bg-zinc-900 text-white cursor-pointer"
      >
        Submit
      </button>
    </form>
  ),
};
