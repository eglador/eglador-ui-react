import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner, type SpinnerProps } from "../components/spinner";

const meta: Meta<typeof Spinner> = {
  title: "Components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Yükleniyor göstergesi. 4 boyut (xs / sm / md / lg), opsiyonel label. role=status; label yoksa sr-only \"Loading…\" otomatik eklenir.",
      },
    },
  },
  args: {
    size: "sm",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Spinner boyutu.",
    },
    label: {
      control: "text",
      description: "Spinner altında gösterilen metin. Verilmezse sr-only \"Loading…\" kullanılır.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args: SpinnerProps) => (
    <div className="flex gap-6 items-center">
      <Spinner {...args} size="xs" />
      <Spinner {...args} size="sm" />
      <Spinner {...args} size="md" />
      <Spinner {...args} size="lg" />
      <Spinner {...args} size="xl" />
    </div>
  ),
};

export const WithLabel: Story = {
  render: (args: SpinnerProps) => (
    <div className="flex gap-8 items-start">
      <Spinner {...args} size="sm" label="Yükleniyor…" />
      <Spinner {...args} size="md" label="Kaydediliyor" />
      <Spinner {...args} size="lg" label="İşleniyor" />
    </div>
  ),
};

export const InlineWithText: Story = {
  render: (args: SpinnerProps) => (
    <div className="flex items-center gap-2">
      <Spinner {...args} size="xs" />
      <span className="text-sm text-zinc-600">Müsaitlik kontrol ediliyor…</span>
    </div>
  ),
};

export const InsideButton: Story = {
  render: () => (
    <button
      type="button"
      disabled
      className="inline-flex items-center gap-2 h-9 px-3 text-sm rounded-sm bg-zinc-900 text-white disabled:opacity-70 cursor-not-allowed"
    >
      <Spinner size="xs" />
      Gönderiliyor…
    </button>
  ),
};
