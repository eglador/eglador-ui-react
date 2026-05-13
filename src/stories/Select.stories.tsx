import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  type SelectProps,
} from "../components/select";
import { Label } from "../components/label";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Custom-rendered combobox-style select. Compound API: `<Select>` + `<SelectTrigger>` + `<SelectValue>` + `<SelectContent>` + `<SelectItem>` + `<SelectGroup>` / `<SelectLabel>` / `<SelectSeparator>`. Portal-rendered, keyboard nav (Arrow / Home / End / Enter / Escape), 5 sizes, 3 variants, 3 shapes.",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    variant: { control: "select", options: ["outline", "soft", "ghost"] },
    shape: { control: "select", options: ["square", "rounded", "pill"] },
    disabled: { control: "boolean" },
  },
  args: {
    size: "md",
    variant: "outline",
    shape: "rounded",
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: (args: SelectProps) => (
    <div className="flex flex-col gap-2 max-w-xs">
      <Label htmlFor="fruit">Favourite fruit</Label>
      <Select {...(args as SelectProps)}>
        <SelectTrigger>
          <SelectValue placeholder="Pick a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Citrus</SelectLabel>
            <SelectItem value="orange">Orange</SelectItem>
            <SelectItem value="lemon">Lemon</SelectItem>
            <SelectItem value="lime">Lime</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Berries</SelectLabel>
            <SelectItem value="strawberry">Strawberry</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="raspberry" disabled>
              Raspberry (out of stock)
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};
