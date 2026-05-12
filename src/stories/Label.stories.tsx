import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label, type LabelProps } from "../components/label";

const meta: Meta<typeof Label> = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Form etiketi. 3 boyut (xs / sm / md), required indicator (*), disabled state. `<label>` semantik; `htmlFor` ile bir input'a bağlanabilir.",
      },
    },
  },
  args: {
    children: "Label",
    size: "sm",
    required: false,
    disabled: false,
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

const inputCls =
  "w-full h-9 px-3 text-sm rounded-sm border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1 disabled:bg-zinc-50 disabled:text-zinc-400 disabled:cursor-not-allowed";

export const Default: Story = {};

export const Sizes: Story = {
  render: (args: LabelProps) => (
    <div className="flex flex-col gap-2">
      <Label {...args} size="xs">
        Extra Small
      </Label>
      <Label {...args} size="sm">
        Small
      </Label>
      <Label {...args} size="md">
        Medium
      </Label>
      <Label {...args} size="lg">
        Large
      </Label>
      <Label {...args} size="xl">
        Extra Large
      </Label>
    </div>
  ),
};

export const Required: Story = {
  args: { required: true, children: "E-posta Adresi" },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Devre Dışı Etiket" },
};

export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-xs">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" required>
          E-posta
        </Label>
        <input
          id="email"
          type="email"
          placeholder="ornek@domain.com"
          className={inputCls}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Ad Soyad</Label>
        <input
          id="name"
          type="text"
          placeholder="Ahmet Yılmaz"
          className={inputCls}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="disabled-field" disabled>
          Devre Dışı Alan
        </Label>
        <input
          id="disabled-field"
          type="text"
          placeholder="Düzenlenemez"
          disabled
          className={inputCls}
        />
      </div>
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          id="terms"
          type="checkbox"
          className="size-4 rounded-sm border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1 cursor-pointer"
        />
        <Label htmlFor="terms">Şartları kabul ediyorum</Label>
      </div>
      <div className="flex items-center gap-2">
        <input
          id="newsletter"
          type="checkbox"
          className="size-4 rounded-sm border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1 cursor-pointer"
        />
        <Label htmlFor="newsletter">Bültene abone ol</Label>
      </div>
    </div>
  ),
};
