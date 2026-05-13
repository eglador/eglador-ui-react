import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Mail, CreditCard, Truck, CheckCircle } from "lucide-react";
import {
  Stepper,
  Step,
  type StepperProps,
} from "../components/stepper";
import { Button } from "../components/button";

const meta: Meta<typeof Stepper> = {
  title: "Components/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Multi-step progress indicator. Compound API: `<Stepper>` + `<Step>`. 2 variants (solid / outline), 5 sizes, horizontal + vertical orientation, clickable steps with controlled state, per-step icon / title / description / content, optional error states.",
      },
    },
  },
  args: {
    activeStep: 1,
    variant: "solid",
    size: "md",
    orientation: "horizontal",
    clickable: false,
  },
  argTypes: {
    activeStep: { control: { type: "number", min: 0, max: 4 } },
    variant: { control: "select", options: ["solid", "outline"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    clickable: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
  render: (args) => (
    <Stepper {...(args as StepperProps)} className="w-[640px]">
      <Step title="Account" description="Enter your details" />
      <Step title="Verify" description="Confirm your email" />
      <Step title="Payment" description="Add a payment method" />
      <Step title="Done" description="Account ready" />
    </Stepper>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Stepper activeStep={2} orientation="vertical" className="w-[420px]">
      <Step title="Cart" description="Review your items">
        2 items totaling $79.
      </Step>
      <Step title="Shipping" description="Choose a delivery option">
        Standard, 3-5 business days.
      </Step>
      <Step title="Payment" description="Enter your card">
        We accept all major cards.
      </Step>
      <Step title="Confirm" description="Place the order" />
    </Stepper>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-[640px]">
      <Stepper activeStep={2} variant="solid">
        <Step title="One" />
        <Step title="Two" />
        <Step title="Three" />
        <Step title="Four" />
      </Stepper>
      <Stepper activeStep={2} variant="outline">
        <Step title="One" />
        <Step title="Two" />
        <Step title="Three" />
        <Step title="Four" />
      </Stepper>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-[640px]">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Stepper key={size} size={size} activeStep={1}>
          <Step title={`size = ${size}`} />
          <Step title="Active" />
          <Step title="Upcoming" />
        </Stepper>
      ))}
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Stepper activeStep={2} className="w-[680px]">
      <Step icon={<Mail />} title="Sign up" description="Free forever" />
      <Step icon={<CreditCard />} title="Billing" description="Optional" />
      <Step icon={<Truck />} title="Shipping" description="In progress" />
      <Step icon={<CheckCircle />} title="Confirm" description="One last step" />
    </Stepper>
  ),
};

export const ErrorStep: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pass an array of step indices to `errors` — those steps render in the error state.",
      },
    },
  },
  render: () => (
    <Stepper activeStep={2} errors={[1]} className="w-[640px]">
      <Step title="Verified" description="Looks good" />
      <Step title="Payment" description="Card declined" />
      <Step title="Shipping" description="Choose method" />
      <Step title="Done" />
    </Stepper>
  ),
};

export const Clickable: Story = {
  render: function ClickableStory() {
    const [step, setStep] = React.useState(0);
    return (
      <div className="flex flex-col gap-4 w-[640px]">
        <Stepper
          activeStep={step}
          clickable
          onStepClick={setStep}
        >
          <Step title="Account" description="Click any step" />
          <Step title="Profile" description="Navigate freely" />
          <Step title="Preferences" description="Move forward & back" />
          <Step title="Done" description="Wrap up" />
        </Stepper>
        <div className="flex gap-2 items-center text-xs text-zinc-500">
          <span>
            Active:{" "}
            <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">{step}</code>
          </span>
          <div className="ms-auto flex gap-2">
            <Button
              size="xs"
              variant="outline"
              onClick={() => setStep((v) => Math.max(0, v - 1))}
            >
              Back
            </Button>
            <Button
              size="xs"
              onClick={() => setStep((v) => Math.min(3, v + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  },
};
