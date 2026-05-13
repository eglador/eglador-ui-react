import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kbd, KbdGroup, type KbdProps } from "../components/kbd";

const meta: Meta<typeof Kbd> = {
  title: "Components/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Klavye kısayolu göstergesi. Tek tuş veya `keys` ile kombo. 5 boyut (xs/sm/md/lg/xl), 3 varyant (soft/outline/ghost), 2 şekil (square/rounded). KbdGroup compound API ile compose edilebilir.",
      },
    },
  },
  args: {
    size: "sm",
    variant: "soft",
    shape: "rounded",
    children: "K",
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    variant: { control: "select", options: ["soft", "outline", "ghost"] },
    shape: { control: "select", options: ["square", "rounded"] },
  },
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {};

export const SingleKeys: Story = {
  render: (args: KbdProps) => (
    <div className="flex gap-2 items-center">
      <Kbd {...args}>⌘</Kbd>
      <Kbd {...args}>Shift</Kbd>
      <Kbd {...args}>Enter</Kbd>
      <Kbd {...args}>Tab</Kbd>
      <Kbd {...args}>Esc</Kbd>
      <Kbd {...args}>Space</Kbd>
      <Kbd {...args}>↑</Kbd>
      <Kbd {...args}>↓</Kbd>
    </div>
  ),
};

export const ComboKeys: Story = {
  render: (args: KbdProps) => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Kbd {...args} keys={["⌘", "C"]} />
        <span className="text-sm text-zinc-500">Kopyala</span>
      </div>
      <div className="flex items-center gap-3">
        <Kbd {...args} keys={["⌘", "V"]} />
        <span className="text-sm text-zinc-500">Yapıştır</span>
      </div>
      <div className="flex items-center gap-3">
        <Kbd {...args} keys={["⌘", "Shift", "P"]} />
        <span className="text-sm text-zinc-500">Komut paleti</span>
      </div>
      <div className="flex items-center gap-3">
        <Kbd {...args} keys={["Ctrl", "Alt", "Del"]} />
        <span className="text-sm text-zinc-500">Görev yöneticisi</span>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args: KbdProps) => (
    <div className="flex flex-col gap-3">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 w-6">{size}</span>
          <Kbd {...args} size={size} keys={["⌘", "K"]} />
        </div>
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: (args: KbdProps) => (
    <div className="flex flex-col gap-3">
      {(["soft", "outline", "ghost"] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 w-14">{variant}</span>
          <Kbd {...args} variant={variant} keys={["⌘", "Shift", "K"]} />
        </div>
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  render: (args: KbdProps) => (
    <div className="flex flex-col gap-3">
      {(["square", "rounded"] as const).map((shape) => (
        <div key={shape} className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 w-16">{shape}</span>
          <Kbd {...args} shape={shape} keys={["Ctrl", "Shift", "K"]} />
        </div>
      ))}
    </div>
  ),
};

export const InlineUsage: Story = {
  render: (args: KbdProps) => (
    <div className="flex flex-col gap-3 max-w-sm">
      <p className="text-sm text-zinc-600">
        Komut paletini açmak için <Kbd {...args} keys={["⌘", "K"]} /> tuşlayın.
      </p>
      <p className="text-sm text-zinc-600">
        Gezinmek için <Kbd {...args}>↑</Kbd> ve <Kbd {...args}>↓</Kbd>, seçmek için{" "}
        <Kbd {...args}>Enter</Kbd>.
      </p>
      <p className="text-sm text-zinc-600">
        Kapatmak için <Kbd {...args}>Esc</Kbd>.
      </p>
    </div>
  ),
};

export const Group: Story = {
  render: (args: KbdProps) => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <KbdGroup size={args.size}>
          <Kbd {...args}>⌘</Kbd>
          <Kbd {...args}>K</Kbd>
        </KbdGroup>
        <span className="text-sm text-zinc-500">Komut paleti</span>
      </div>
      <div className="flex items-center gap-3">
        <KbdGroup size={args.size}>
          <Kbd {...args}>Ctrl</Kbd>
          <Kbd {...args}>Shift</Kbd>
          <Kbd {...args}>P</Kbd>
        </KbdGroup>
        <span className="text-sm text-zinc-500">Hızlı işlemler</span>
      </div>
      <div className="flex items-center gap-3">
        <KbdGroup
          size={args.size}
          separator={<span className="text-zinc-400 text-xs">sonra</span>}
        >
          <Kbd {...args}>G</Kbd>
          <Kbd {...args}>H</Kbd>
        </KbdGroup>
        <span className="text-sm text-zinc-500">Ana sayfaya git (sekans)</span>
      </div>
    </div>
  ),
};

export const ShortcutList: Story = {
  render: (args: KbdProps) => {
    const shortcuts = [
      { keys: ["⌘", "N"], label: "Yeni dosya" },
      { keys: ["⌘", "O"], label: "Dosya aç" },
      { keys: ["⌘", "S"], label: "Kaydet" },
      { keys: ["⌘", "Shift", "S"], label: "Farklı kaydet" },
      { keys: ["⌘", "W"], label: "Sekmeyi kapat" },
      { keys: ["⌘", "Q"], label: "Çıkış" },
    ];
    return (
      <div className="border border-zinc-200 rounded-sm divide-y divide-zinc-100 max-w-xs">
        {shortcuts.map((s, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2.5">
            <span className="text-sm text-zinc-700">{s.label}</span>
            <Kbd {...args} keys={s.keys} size="xs" />
          </div>
        ))}
      </div>
    );
  },
};
