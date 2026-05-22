import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  Toggle,
  type ToggleProps,
  type ToggleSize,
  type ToggleVariant,
} from "../components/toggle";

const BoldIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
  </svg>
);

const ItalicIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="4" x2="10" y2="4" />
    <line x1="14" y1="20" x2="5" y2="20" />
    <line x1="15" y1="4" x2="9" y2="20" />
  </svg>
);

const UnderlineIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4v6a6 6 0 0 0 12 0V4" />
    <line x1="4" y1="20" x2="20" y2="20" />
  </svg>
);

const StarIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Two-state button — an icon/text button that reflects its pressed/unpressed state. A11y handled via `aria-pressed`; 2 variants (default ghost-style, outline), 5 sizes (xs/sm/md/lg/xl), 3 shapes (square/rounded/circle). Supports both controlled (`pressed` + `onPressedChange`) and uncontrolled (`defaultPressed`) usage.",
      },
    },
  },
  args: {
    variant: "ghost",
    size: "md",
    shape: "rounded",
    defaultPressed: false,
    disabled: false,
    children: "Toggle",
  },
  argTypes: {
    variant: { control: "select", options: ["ghost", "outline", "soft"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    shape: { control: "select", options: ["square", "rounded", "circle"] },
    defaultPressed: { control: "boolean" },
    disabled: { control: "boolean" },
    onPressedChange: { action: "pressed changed" },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  render: (args: ToggleProps) => (
    <Toggle
      key={`${args.defaultPressed}-${args.disabled}-${args.size}-${args.variant}-${args.shape}`}
      {...args}
    />
  ),
};

export const Outline: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toggle variant="outline">Outline</Toggle>
      <Toggle variant="outline" defaultPressed>
        Pressed
      </Toggle>
      <Toggle variant="outline" disabled>
        Disabled
      </Toggle>
    </div>
  ),
};

export const WithIcon: Story = {
  name: "With Icon (text formatting)",
  render: () => (
    <div className="flex gap-1">
      <Toggle icon={BoldIcon} aria-label="Bold" />
      <Toggle icon={ItalicIcon} aria-label="Italic" defaultPressed />
      <Toggle icon={UnderlineIcon} aria-label="Underline" />
    </div>
  ),
};

export const IconWithText: Story = {
  render: () => (
    <Toggle icon={StarIcon} defaultPressed>
      Favori
    </Toggle>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 items-start">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size: ToggleSize) => (
        <div key={size} className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 w-6">{size}</span>
          <Toggle size={size} defaultPressed>
            Toggle
          </Toggle>
          <Toggle size={size} icon={BoldIcon} aria-label="Bold" defaultPressed />
          <Toggle size={size} variant="outline" defaultPressed>
            Outline
          </Toggle>
        </div>
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex gap-2">
      <Toggle shape="square" icon={StarIcon} aria-label="Star square" defaultPressed />
      <Toggle shape="rounded" icon={StarIcon} aria-label="Star rounded" defaultPressed />
      <Toggle shape="circle" icon={StarIcon} aria-label="Star circle" defaultPressed />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 items-start">
      {(["ghost", "outline", "soft"] as const).map((variant: ToggleVariant) => (
        <div key={variant} className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 w-16">{variant}</span>
          <Toggle variant={variant}>Off</Toggle>
          <Toggle variant={variant} defaultPressed>
            On
          </Toggle>
          <Toggle variant={variant} disabled>
            Disabled
          </Toggle>
          <Toggle variant={variant} disabled defaultPressed>
            Disabled On
          </Toggle>
        </div>
      ))}
    </div>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [pressed, setPressed] = React.useState(false);
    return (
      <div className="flex flex-col gap-3 items-start">
        <Toggle pressed={pressed} onPressedChange={setPressed} icon={StarIcon}>
          {pressed ? "Favorilerden cikar" : "Favorilere ekle"}
        </Toggle>
        <p className="text-sm text-zinc-600">
          State:{" "}
          <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">
            {String(pressed)}
          </code>
        </p>
        <button
          type="button"
          onClick={() => setPressed((v) => !v)}
          className="text-xs text-zinc-700 underline underline-offset-4 cursor-pointer"
        >
          Disaridan toggle et
        </button>
      </div>
    );
  },
};
