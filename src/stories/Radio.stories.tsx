import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Radio, type RadioProps } from "../components/radio";
import { Label } from "../components/label";
import { Typography } from "../components/typography";

const meta: Meta<typeof Radio> = {
  title: "Components/Radio",
  component: Radio,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A single radio button. Native `<input type=\"radio\">`. Typically used inside a `RadioGroup` (mutually-exclusive selection). For standalone usage, `defaultChecked` or `checked` + `onCheckedChange`.",
      },
    },
  },
  args: {
    size: "md",
    defaultChecked: false,
    disabled: false,
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
    onCheckedChange: { action: "checked changed" },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  render: (args: RadioProps) => (
    <Radio
      key={`${args.defaultChecked}-${args.disabled}`}
      {...args}
    />
  ),
};

export const Sizes: Story = {
  render: (args: RadioProps) => (
    <div className="flex flex-col gap-3 items-start">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 w-6">{size}</span>
          <Radio {...args} size={size} defaultChecked />
        </div>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Radio />
      <Radio defaultChecked />
      <Radio disabled />
      <Radio disabled defaultChecked />
    </div>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [on, setOn] = React.useState(false);
    return (
      <div className="flex flex-col gap-3 items-start">
        <div className="flex items-center gap-3">
          <Radio id="ctrl" checked={on} onCheckedChange={setOn} />
          <Label htmlFor="ctrl">Standalone radio</Label>
        </div>
        <p className="text-sm text-zinc-600">
          State:{" "}
          <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">
            {String(on)}
          </code>
        </p>
      </div>
    );
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-sm">
      <div className="flex items-start gap-3">
        <Radio id="r-public" name="visibility" value="public" defaultChecked />
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="r-public">Public</Label>
          <Typography variant="muted">
            Anyone can see and search for this.
          </Typography>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Radio id="r-private" name="visibility" value="private" />
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="r-private">Private</Label>
          <Typography variant="muted">
            Only you and people you invite can access.
          </Typography>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Radio id="r-disabled" name="visibility" value="invite" disabled />
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="r-disabled" disabled>
            Invite-only
          </Label>
          <Typography variant="muted">
            Not available on this plan.
          </Typography>
        </div>
      </div>
    </div>
  ),
};

export const NativeGroup: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "To use a single Radio in native HTML radio behaviour, render multiple Radios with the same `name`. The browser handles mutual exclusion. For higher-level management, use the `RadioGroup` component (next).",
      },
    },
  },
  render: () => (
    <fieldset className="flex flex-col gap-2 max-w-sm">
      <legend className="text-sm font-medium text-zinc-700 mb-1">
        Choose a plan (native HTML)
      </legend>
      {[
        { value: "free", label: "Free" },
        { value: "pro", label: "Pro" },
        { value: "enterprise", label: "Enterprise" },
      ].map((p) => (
        <label
          key={p.value}
          htmlFor={`plan-${p.value}`}
          className="inline-flex items-center gap-3 cursor-pointer"
        >
          <Radio
            id={`plan-${p.value}`}
            name="plan"
            value={p.value}
            defaultChecked={p.value === "pro"}
          />
          <span className="text-sm">{p.label}</span>
        </label>
      ))}
    </fieldset>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div className="flex items-start gap-3 max-w-sm">
      <Radio id="r-invalid" aria-invalid />
      <div className="flex flex-col gap-0.5">
        <Label htmlFor="r-invalid" required>
          Pick an option
        </Label>
        <Typography variant="muted" className="text-zinc-700">
          You must make a selection to continue.
        </Typography>
      </div>
    </div>
  ),
};
