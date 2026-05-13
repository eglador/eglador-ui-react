import type { Meta, StoryObj } from "@storybook/react-vite";
import { NativeSelect, type NativeSelectProps } from "../components/native-select";
import { Label } from "../components/label";

const meta: Meta<typeof NativeSelect> = {
  title: "Components/NativeSelect",
  component: NativeSelect,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Native `<select>` styled to match the design system. Use when you need OS-level keyboard support, mobile-native pickers, and zero bundle overhead. For custom rendering (icons, search, grouping), use `<Select>` instead.",
      },
    },
  },
  argTypes: {
    selectSize: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    variant: { control: "select", options: ["outline", "soft", "ghost"] },
    shape: { control: "select", options: ["square", "rounded", "pill"] },
    disabled: { control: "boolean" },
  },
  args: {
    selectSize: "md",
    variant: "outline",
    shape: "rounded",
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof NativeSelect>;

export const Default: Story = {
  render: (args: NativeSelectProps) => (
    <div className="flex flex-col gap-2 max-w-xs">
      <Label htmlFor="country">Country</Label>
      <NativeSelect id="country" {...args}>
        <option value="">Select a country</option>
        <option value="tr">Türkiye</option>
        <option value="us">United States</option>
        <option value="de">Germany</option>
      </NativeSelect>
    </div>
  ),
};
