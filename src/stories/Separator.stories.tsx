import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "../components/separator";

const meta: Meta<typeof Separator> = {
  title: "Components/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Yatay veya dikey ayraç. solid / dashed / dotted varyantları, opsiyonel label, decorative mod (semantik olmayan kullanım için role=none).",
      },
    },
  },
  args: {
    orientation: "horizontal",
    variant: "solid",
    decorative: false,
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Yön.",
    },
    variant: {
      control: "select",
      options: ["solid", "dashed", "dotted"],
      description: "Çizgi stili.",
    },
    label: {
      control: "text",
      description: "Yatay ayraç ortasında gösterilen metin. Verilirse iki yana ayrılır.",
    },
    decorative: {
      control: "boolean",
      description:
        "true ise role=none (a11y semantiği yok — yalnızca görsel). false (default) iken role=separator + aria-orientation.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <p className="text-sm text-zinc-600 mb-3">Yukarıdaki içerik.</p>
      <Separator {...args} />
      <p className="text-sm text-zinc-600 mt-3">Aşağıdaki içerik.</p>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-sm">
      <div>
        <span className="text-xs text-zinc-400 mb-2 block">solid</span>
        <Separator variant="solid" />
      </div>
      <div>
        <span className="text-xs text-zinc-400 mb-2 block">dashed</span>
        <Separator variant="dashed" />
      </div>
      <div>
        <span className="text-xs text-zinc-400 mb-2 block">dotted</span>
        <Separator variant="dotted" />
      </div>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-sm">
      <Separator label="VEYA" />
      <Separator label="Bölüm" variant="dashed" />
      <Separator label="Son" variant="dotted" />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-3 h-10">
      <span className="text-sm text-zinc-600">Sol</span>
      <Separator orientation="vertical" />
      <span className="text-sm text-zinc-600">Orta</span>
      <Separator orientation="vertical" variant="dashed" />
      <span className="text-sm text-zinc-600">Sağ</span>
    </div>
  ),
};

export const InMenu: Story = {
  render: () => (
    <div className="w-56 rounded-sm border border-zinc-200 bg-white py-1.5">
      <div className="px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 cursor-pointer">
        Profil
      </div>
      <div className="px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 cursor-pointer">
        Ayarlar
      </div>
      <div className="my-1">
        <Separator />
      </div>
      <div className="px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 cursor-pointer">
        Çıkış
      </div>
    </div>
  ),
};

export const Decorative: Story = {
  render: () => (
    <div className="max-w-sm">
      <p className="text-sm text-zinc-600 mb-3">
        decorative=true → role=none, screen reader bunu atlar.
      </p>
      <Separator decorative />
    </div>
  ),
};
