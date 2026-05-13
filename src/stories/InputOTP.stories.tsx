import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
  type InputOTPProps,
} from "../components/input-otp";

const meta: Meta<typeof InputOTP> = {
  title: "Components/InputOTP",
  component: InputOTP,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "One-time-code input with per-character slots, auto-advance, paste support, and full keyboard navigation. Compound API: `<InputOTP>` + `<InputOTPGroup>` + `<InputOTPSlot>` + `<InputOTPSeparator>`. 4 sizes.",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl"] },
    length: { control: "number" },
    disabled: { control: "boolean" },
  },
  args: { size: "md", length: 6, disabled: false },
};

export default meta;
type Story = StoryObj<typeof InputOTP>;

export const Default: Story = {
  render: (args: InputOTPProps) => (
    <InputOTP {...args}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [v, setV] = React.useState("");
    return (
      <div className="flex flex-col gap-3">
        <InputOTP value={v} onChange={setV} length={4} onComplete={(val) => console.log("Complete:", val)}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
        <div className="text-xs text-zinc-500">
          Value: <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">{v || "(empty)"}</code>
        </div>
      </div>
    );
  },
};
