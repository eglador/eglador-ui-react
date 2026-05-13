import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Settings,
  Plus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  ChevronDown,
  Copy,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Save,
} from "lucide-react";
import { Button } from "../components/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  type ButtonGroupProps,
} from "../components/button-group";

const meta: Meta<typeof ButtonGroup> = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Fuses several Buttons (or Inputs, etc.) into one group. Adjacent button borders merge (`-ms-px` overlap), inner corners flatten, outer corners stay. Compound API: `ButtonGroupSeparator` (visual divider) + `ButtonGroupText` (label / text slot). Orientation horizontal / vertical. Semantic via role=group + aria-label / aria-labelledby.",
      },
    },
  },
  args: {
    orientation: "horizontal",
  },
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  render: (args: ButtonGroupProps) => (
    <ButtonGroup {...args} aria-label="Actions">
      <Button variant="outline">Previous</Button>
      <Button variant="outline">Next</Button>
    </ButtonGroup>
  ),
};

export const Orientation: Story = {
  render: () => (
    <div className="flex gap-8 items-start">
      <div>
        <p className="text-xs text-zinc-400 mb-2">horizontal</p>
        <ButtonGroup>
          <Button variant="outline" icon={<AlignLeft />} aria-label="Align left" />
          <Button variant="outline" icon={<AlignCenter />} aria-label="Align center" />
          <Button variant="outline" icon={<AlignRight />} aria-label="Align right" />
          <Button variant="outline" icon={<AlignJustify />} aria-label="Justify" />
        </ButtonGroup>
      </div>
      <div>
        <p className="text-xs text-zinc-400 mb-2">vertical</p>
        <ButtonGroup orientation="vertical">
          <Button variant="outline" icon={<AlignLeft />} aria-label="Align left" />
          <Button variant="outline" icon={<AlignCenter />} aria-label="Align center" />
          <Button variant="outline" icon={<AlignRight />} aria-label="Align right" />
          <Button variant="outline" icon={<AlignJustify />} aria-label="Justify" />
        </ButtonGroup>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 items-start">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <ButtonGroup key={size}>
          <Button variant="outline" size={size}>
            Day
          </Button>
          <Button variant="outline" size={size}>
            Week
          </Button>
          <Button variant="outline" size={size}>
            Month
          </Button>
        </ButtonGroup>
      ))}
    </div>
  ),
};

export const TextFormatting: Story = {
  render: () => (
    <ButtonGroup aria-label="Text formatting">
      <Button variant="outline" icon={<Bold />} aria-label="Bold" active />
      <Button variant="outline" icon={<Italic />} aria-label="Italic" />
      <Button variant="outline" icon={<Underline />} aria-label="Underline" />
    </ButtonGroup>
  ),
};

export const WithSeparator: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Borderless variants (`soft` / `solid`) lose their visual divider when fused — `ButtonGroupSeparator` reintroduces one.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <ButtonGroup>
        <Button variant="soft">Left</Button>
        <ButtonGroupSeparator />
        <Button variant="soft">Center</Button>
        <ButtonGroupSeparator />
        <Button variant="soft">Right</Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button>Solid</Button>
        <ButtonGroupSeparator />
        <Button>Solid</Button>
        <ButtonGroupSeparator />
        <Button>Solid</Button>
      </ButtonGroup>
    </div>
  ),
};

export const Split: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Split button — primary action + dropdown trigger. Typically same variant for both.",
      },
    },
  },
  render: () => (
    <div className="flex gap-4 items-start flex-wrap">
      <ButtonGroup aria-label="Save options">
        <Button icon={<Save />}>Save</Button>
        <ButtonGroupSeparator />
        <Button icon={<ChevronDown />} aria-label="More options" />
      </ButtonGroup>

      <ButtonGroup aria-label="Copy options">
        <Button variant="outline" icon={<Copy />}>
          Copy
        </Button>
        <Button variant="outline" icon={<ChevronDown />} aria-label="More" />
      </ButtonGroup>
    </div>
  ),
};

export const WithText: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Drop inline text / labels inside a group with `ButtonGroupText`. 5 sizes, matched with the buttons.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3 items-start">
      <ButtonGroup>
        <ButtonGroupText>Sort</ButtonGroupText>
        <Button variant="outline">Date</Button>
        <Button variant="outline">Name</Button>
        <Button variant="outline">Size</Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="outline" icon={<ArrowLeft />} aria-label="Back" />
        <ButtonGroupText>Page 3 / 12</ButtonGroupText>
        <Button variant="outline" icon={<ArrowRight />} aria-label="Forward" />
      </ButtonGroup>
    </div>
  ),
};

export const Nested: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Multiple independent ButtonGroups side by side — separate them with an outer flex gap.",
      },
    },
  },
  render: () => (
    <div className="inline-flex gap-2">
      <ButtonGroup>
        <Button variant="outline" icon={<AlignLeft />} aria-label="Align left" />
        <Button variant="outline" icon={<AlignCenter />} aria-label="Align center" active />
        <Button variant="outline" icon={<AlignRight />} aria-label="Align right" />
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" icon={<Bold />} aria-label="Bold" />
        <Button variant="outline" icon={<Italic />} aria-label="Italic" />
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" icon={<Settings />} aria-label="Settings" />
        <Button variant="outline" icon={<Trash2 />} aria-label="Delete" />
      </ButtonGroup>
    </div>
  ),
};

export const WithInput: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "ButtonGroup also accepts an `<input>` as a child — the fuse logic still applies.",
      },
    },
  },
  render: () => (
    <ButtonGroup>
      <input
        type="text"
        placeholder="Add a tag…"
        className="h-9 px-3 text-sm border border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1 w-48"
      />
      <Button icon={<Plus />}>Add</Button>
    </ButtonGroup>
  ),
};

export const Pagination: Story = {
  render: () => (
    <ButtonGroup aria-label="Page navigation">
      <Button variant="outline" icon={<ArrowLeft />} aria-label="First" />
      <Button variant="outline">1</Button>
      <Button variant="outline" active>
        2
      </Button>
      <Button variant="outline">3</Button>
      <Button variant="outline">4</Button>
      <Button variant="outline">5</Button>
      <Button variant="outline" icon={<ArrowRight />} aria-label="Last" />
    </ButtonGroup>
  ),
};

export const FocusOverlap: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "When tabbing through the group, the focus ring always renders above the neighbours — achieved via `isolate` + `[&>*:focus-visible]:z-10`.",
      },
    },
  },
  render: () => (
    <ButtonGroup>
      <Button variant="outline">First</Button>
      <Button variant="outline">Second</Button>
      <Button variant="outline">Third</Button>
      <Button variant="outline">Fourth</Button>
    </ButtonGroup>
  ),
};
