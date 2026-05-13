import type { Meta, StoryObj } from "@storybook/react-vite";
import { MultiSelect, type MultiSelectProps } from "../components/multi-select";
import { Label } from "../components/label";

const meta: Meta<typeof MultiSelect> = {
  title: "Components/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Multiple-value combobox with chip display, searchable list, and overflow `+N` summarisation. Controlled or uncontrolled, 5 sizes, 2 variants, 3 shapes.",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    variant: { control: "select", options: ["outline", "soft", "ghost"] },
    shape: { control: "select", options: ["square", "rounded", "pill"] },
    searchable: { control: "boolean" },
    disabled: { control: "boolean" },
    maxDisplay: { control: "number" },
  },
  args: {
    size: "md",
    variant: "outline",
    shape: "rounded",
    searchable: true,
    disabled: false,
    maxDisplay: 3,
  },
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

export const Default: Story = {
  render: (args: MultiSelectProps) => (
    <div className="flex flex-col gap-2 max-w-sm">
      <Label>Skills</Label>
      <MultiSelect
        {...args}
        options={[
          { value: "react", label: "React" },
          { value: "ts", label: "TypeScript" },
          { value: "node", label: "Node.js" },
          { value: "css", label: "Tailwind CSS" },
          { value: "go", label: "Go" },
          { value: "rust", label: "Rust" },
          { value: "py", label: "Python" },
        ]}
        defaultValue={["react", "ts"]}
        placeholder="Pick at least one"
      />
    </div>
  ),
};
