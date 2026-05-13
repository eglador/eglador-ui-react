import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  CheckboxGroup,
  CheckboxGroupItem,
  type CheckboxGroupProps,
} from "../components/checkbox-group";

const meta: Meta<typeof CheckboxGroup> = {
  title: "Components/CheckboxGroup",
  component: CheckboxGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Multi-select checkbox group. `<fieldset>` semantic (optional `<legend>`). Single state (`value: string[]`); controlled / uncontrolled. `CheckboxGroupItem` reads state from context — composes Checkbox + label / description. 5 group-wide sizes.",
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
type Story = StoryObj<typeof CheckboxGroup>;

export const Default: Story = {
  render: (args: CheckboxGroupProps) => (
    <CheckboxGroup {...args} defaultValue={["apple"]}>
      <CheckboxGroupItem value="apple" label="Apple" />
      <CheckboxGroupItem value="banana" label="Banana" />
      <CheckboxGroupItem value="cherry" label="Cherry" />
      <CheckboxGroupItem value="date" label="Date" />
    </CheckboxGroup>
  ),
};

export const Horizontal: Story = {
  render: (args: CheckboxGroupProps) => (
    <CheckboxGroup {...args} orientation="horizontal" defaultValue={["ts"]}>
      <CheckboxGroupItem value="react" label="React" />
      <CheckboxGroupItem value="ts" label="TypeScript" />
      <CheckboxGroupItem value="tw" label="Tailwind" />
      <CheckboxGroupItem value="next" label="Next.js" />
    </CheckboxGroup>
  ),
};

export const WithLegend: Story = {
  render: (args: CheckboxGroupProps) => (
    <CheckboxGroup
      {...args}
      legend="Interests"
      description="You can pick more than one."
      defaultValue={["react"]}
    >
      <CheckboxGroupItem value="react" label="React" />
      <CheckboxGroupItem value="vue" label="Vue" />
      <CheckboxGroupItem value="svelte" label="Svelte" />
      <CheckboxGroupItem value="angular" label="Angular" />
    </CheckboxGroup>
  ),
};

export const WithDescriptions: Story = {
  render: (args: CheckboxGroupProps) => (
    <CheckboxGroup
      {...args}
      legend="Notification preferences"
      defaultValue={["email", "weekly"]}
    >
      <CheckboxGroupItem
        value="email"
        label="Email notifications"
        description="Get important updates via email."
      />
      <CheckboxGroupItem
        value="push"
        label="Push notifications"
        description="Mobile and desktop push alerts."
      />
      <CheckboxGroupItem
        value="sms"
        label="SMS notifications"
        description="Short text messages to your phone."
      />
      <CheckboxGroupItem
        value="weekly"
        label="Weekly digest"
        description="A weekly activity email every Monday."
      />
    </CheckboxGroup>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <CheckboxGroup
          key={size}
          size={size}
          legend={`size = ${size}`}
          defaultValue={["a"]}
        >
          <CheckboxGroupItem value="a" label="Option A" />
          <CheckboxGroupItem value="b" label="Option B" />
          <CheckboxGroupItem value="c" label="Option C" />
        </CheckboxGroup>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <CheckboxGroup legend="Whole group disabled" disabled defaultValue={["a"]}>
        <CheckboxGroupItem value="a" label="Option A" />
        <CheckboxGroupItem value="b" label="Option B" />
        <CheckboxGroupItem value="c" label="Option C" />
      </CheckboxGroup>

      <CheckboxGroup
        legend="Single item disabled"
        defaultValue={["a"]}
      >
        <CheckboxGroupItem value="a" label="Option A" />
        <CheckboxGroupItem value="b" label="Option B (disabled)" disabled />
        <CheckboxGroupItem value="c" label="Option C" />
      </CheckboxGroup>
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <CheckboxGroup
      legend="Pick at least one option"
      description="Please check one or more items."
      invalid
    >
      <CheckboxGroupItem value="a" label="Option A" />
      <CheckboxGroupItem value="b" label="Option B" />
      <CheckboxGroupItem value="c" label="Option C" />
    </CheckboxGroup>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = React.useState<string[]>(["react"]);
    return (
      <div className="flex flex-col gap-3">
        <CheckboxGroup
          legend="Technologies"
          value={value}
          onValueChange={setValue}
        >
          <CheckboxGroupItem value="react" label="React" />
          <CheckboxGroupItem value="vue" label="Vue" />
          <CheckboxGroupItem value="svelte" label="Svelte" />
        </CheckboxGroup>
        <p className="text-sm text-zinc-600">
          Selected:{" "}
          <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">
            {JSON.stringify(value)}
          </code>
        </p>
        <button
          type="button"
          onClick={() => setValue([])}
          className="self-start text-xs text-zinc-700 underline underline-offset-4 cursor-pointer"
        >
          Clear all
        </button>
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
        const all = fd.getAll("interests");
        alert(`interests = ${JSON.stringify(all)}`);
      }}
    >
      <CheckboxGroup
        legend="Interests"
        name="interests"
        defaultValue={["react", "ts"]}
      >
        <CheckboxGroupItem value="react" label="React" />
        <CheckboxGroupItem value="ts" label="TypeScript" />
        <CheckboxGroupItem value="tw" label="Tailwind CSS" />
        <CheckboxGroupItem value="next" label="Next.js" />
      </CheckboxGroup>
      <button
        type="submit"
        className="mt-1 inline-flex self-start items-center h-8 px-3 text-sm rounded-sm bg-zinc-900 text-white cursor-pointer"
      >
        Submit
      </button>
    </form>
  ),
};
