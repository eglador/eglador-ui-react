import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  ToggleGroup,
  ToggleGroupItem,
  type ToggleGroupOrientation,
} from "../components/toggle-group";
import type {
  ToggleShape,
  ToggleSize,
  ToggleVariant,
} from "../components/toggle";

const AlignLeftIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="17" y1="10" x2="3" y2="10" />
    <line x1="21" y1="6" x2="3" y2="6" />
    <line x1="21" y1="14" x2="3" y2="14" />
    <line x1="17" y1="18" x2="3" y2="18" />
  </svg>
);

const AlignCenterIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="10" x2="6" y2="10" />
    <line x1="21" y1="6" x2="3" y2="6" />
    <line x1="21" y1="14" x2="3" y2="14" />
    <line x1="18" y1="18" x2="6" y2="18" />
  </svg>
);

const AlignRightIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="21" y1="10" x2="7" y2="10" />
    <line x1="21" y1="6" x2="3" y2="6" />
    <line x1="21" y1="14" x2="3" y2="14" />
    <line x1="21" y1="18" x2="7" y2="18" />
  </svg>
);

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

type StoryArgs = {
  type: "single" | "multiple";
  orientation: ToggleGroupOrientation;
  size: ToggleSize;
  variant: ToggleVariant;
  shape: ToggleShape;
  disabled: boolean;
  spacing: number;
};

const meta: Meta<StoryArgs> = {
  title: "Components/ToggleGroup",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Manages a group of `Toggle`s under a single logic. `type=\"single\"` for a segmented control (radio-like with deselect support); `type=\"multiple\"` for multi-select (checkbox-like). Used in toolbar action groups, alignment selectors, view-mode toggles, etc. The `spacing` prop (default 2px) controls the gap between items; `orientation` flips between horizontal and vertical; all style props (`size`, `variant`, `shape`, `disabled`) cascade to child items.",
      },
    },
  },
  args: {
    type: "single",
    orientation: "horizontal",
    size: "md",
    variant: "ghost",
    shape: "rounded",
    disabled: false,
    spacing: 2,
  },
  argTypes: {
    type: { control: "select", options: ["single", "multiple"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    variant: { control: "select", options: ["ghost", "outline", "soft"] },
    shape: { control: "select", options: ["square", "rounded", "circle"] },
    disabled: { control: "boolean" },
    spacing: { control: { type: "number", min: 0, max: 16, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Playground: Story = {
  render: (args) => {
    const key = `${args.type}-${args.orientation}-${args.size}-${args.variant}-${args.shape}-${args.disabled}-${args.spacing}`;
    if (args.type === "single") {
      return (
        <ToggleGroup
          key={key}
          type="single"
          defaultValue="b"
          orientation={args.orientation}
          size={args.size}
          variant={args.variant}
          shape={args.shape}
          disabled={args.disabled}
          spacing={args.spacing}
        >
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
          <ToggleGroupItem value="c">C</ToggleGroupItem>
        </ToggleGroup>
      );
    }
    return (
      <ToggleGroup
        key={key}
        type="multiple"
        defaultValue={["a", "c"]}
        orientation={args.orientation}
        size={args.size}
        variant={args.variant}
        shape={args.shape}
        disabled={args.disabled}
        spacing={args.spacing}
      >
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
        <ToggleGroupItem value="c">C</ToggleGroupItem>
      </ToggleGroup>
    );
  },
};

export const SingleDefault: Story = {
  name: "Single (default)",
  render: () => (
    <ToggleGroup type="single" defaultValue="b">
      <ToggleGroupItem value="a">A</ToggleGroupItem>
      <ToggleGroupItem value="b">B</ToggleGroupItem>
      <ToggleGroupItem value="c">C</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Multiple: Story = {
  render: () => (
    <ToggleGroup type="multiple" defaultValue={["bold", "italic"]}>
      <ToggleGroupItem value="bold" icon={BoldIcon} aria-label="Bold" />
      <ToggleGroupItem value="italic" icon={ItalicIcon} aria-label="Italic" />
      <ToggleGroupItem
        value="underline"
        icon={UnderlineIcon}
        aria-label="Underline"
      />
    </ToggleGroup>
  ),
};

export const Outline: Story = {
  render: () => (
    <ToggleGroup type="single" variant="outline" defaultValue="center">
      <ToggleGroupItem value="left" icon={AlignLeftIcon} aria-label="Sola hizala" />
      <ToggleGroupItem value="center" icon={AlignCenterIcon} aria-label="Ortaya hizala" />
      <ToggleGroupItem value="right" icon={AlignRightIcon} aria-label="Saga hizala" />
    </ToggleGroup>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size: ToggleSize) => (
        <div key={size} className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 w-6">{size}</span>
          <ToggleGroup type="single" defaultValue="b" size={size} variant="outline">
            <ToggleGroupItem value="a">A</ToggleGroupItem>
            <ToggleGroupItem value="b">B</ToggleGroupItem>
            <ToggleGroupItem value="c">C</ToggleGroupItem>
          </ToggleGroup>
        </div>
      ))}
    </div>
  ),
};

export const SpacingVariations: Story = {
  name: "Spacing",
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      {[0, 2, 4, 8].map((spacing) => (
        <div key={spacing} className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 w-16">spacing={spacing}</span>
          <ToggleGroup
            type="single"
            defaultValue="b"
            variant="outline"
            spacing={spacing}
          >
            <ToggleGroupItem value="a">A</ToggleGroupItem>
            <ToggleGroupItem value="b">B</ToggleGroupItem>
            <ToggleGroupItem value="c">C</ToggleGroupItem>
          </ToggleGroup>
        </div>
      ))}
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ToggleGroup
      type="single"
      orientation="vertical"
      variant="outline"
      defaultValue="b"
    >
      <ToggleGroupItem value="a">Birinci</ToggleGroupItem>
      <ToggleGroupItem value="b">Ikinci</ToggleGroupItem>
      <ToggleGroupItem value="c">Ucuncu</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-500 w-32">Group disabled</span>
        <ToggleGroup type="single" defaultValue="b" disabled>
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
          <ToggleGroupItem value="c">C</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-500 w-32">Item disabled</span>
        <ToggleGroup type="single" defaultValue="a">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b" disabled>
            B (disabled)
          </ToggleGroupItem>
          <ToggleGroupItem value="c">C</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = React.useState<string>("center");
    return (
      <div className="flex flex-col gap-3 items-start">
        <ToggleGroup
          type="single"
          value={value}
          onValueChange={setValue}
          variant="outline"
        >
          <ToggleGroupItem value="left" icon={AlignLeftIcon} aria-label="Sola" />
          <ToggleGroupItem value="center" icon={AlignCenterIcon} aria-label="Ortaya" />
          <ToggleGroupItem value="right" icon={AlignRightIcon} aria-label="Saga" />
        </ToggleGroup>
        <p className="text-sm text-zinc-600">
          Selected:{" "}
          <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">
            {value || "(none)"}
          </code>
        </p>
      </div>
    );
  },
};

export const ControlledMultiple: Story = {
  render: function ControlledMultipleStory() {
    const [value, setValue] = React.useState<string[]>(["bold"]);
    return (
      <div className="flex flex-col gap-3 items-start">
        <ToggleGroup
          type="multiple"
          value={value}
          onValueChange={setValue}
        >
          <ToggleGroupItem value="bold" icon={BoldIcon} aria-label="Bold" />
          <ToggleGroupItem
            value="italic"
            icon={ItalicIcon}
            aria-label="Italic"
          />
          <ToggleGroupItem
            value="underline"
            icon={UnderlineIcon}
            aria-label="Underline"
          />
        </ToggleGroup>
        <p className="text-sm text-zinc-600">
          Aktif:{" "}
          <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">
            [{value.join(", ")}]
          </code>
        </p>
      </div>
    );
  },
};

export const FontWeightSelector: Story = {
  name: "Custom: Font Weight",
  render: function FontWeightStory() {
    const [weight, setWeight] = React.useState("normal");
    return (
      <div className="flex flex-col gap-3 items-start">
        <ToggleGroup
          type="single"
          value={weight}
          onValueChange={(v) => setWeight(v || "normal")}
          variant="outline"
          size="sm"
        >
          <ToggleGroupItem value="light">Light</ToggleGroupItem>
          <ToggleGroupItem value="normal">Normal</ToggleGroupItem>
          <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
          <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        </ToggleGroup>
        <p
          className="text-2xl text-zinc-900"
          style={{
            fontWeight:
              weight === "light"
                ? 300
                : weight === "normal"
                  ? 400
                  : weight === "medium"
                    ? 500
                    : 700,
          }}
        >
          The quick brown fox
        </p>
      </div>
    );
  },
};
