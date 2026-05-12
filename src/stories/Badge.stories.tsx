import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Star, Zap, AlertTriangle, Check, Clock } from "lucide-react";
import { Badge, type BadgeProps } from "../components/badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Etiket / durum rozeti. 3 varyant (solid / soft / outline), 3 boyut (xs / sm / md), 3 şekil (square / rounded / pill), opsiyonel ikonlar (sol / sağ), removable mod.",
      },
    },
  },
  args: {
    children: "Badge",
    variant: "soft",
    size: "sm",
    shape: "rounded",
    removable: false,
  },
  argTypes: {
    variant: { control: "select", options: ["solid", "soft", "outline"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    shape: { control: "select", options: ["square", "rounded", "pill"] },
    removable: { control: "boolean" },
    onRemove: { action: "removed" },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args: BadgeProps) => (
    <div className="flex flex-col gap-3">
      {(["solid", "soft", "outline"] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 w-14">{variant}</span>
          <Badge {...args} variant={variant}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Badge>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args: BadgeProps) => (
    <div className="flex gap-2 items-center flex-wrap">
      <Badge {...args} size="xs">
        Extra Small
      </Badge>
      <Badge {...args} size="sm">
        Small
      </Badge>
      <Badge {...args} size="md">
        Medium
      </Badge>
      <Badge {...args} size="lg">
        Large
      </Badge>
      <Badge {...args} size="xl">
        Extra Large
      </Badge>
    </div>
  ),
};

export const Shapes: Story = {
  render: (args: BadgeProps) => (
    <div className="flex gap-2 items-center">
      <Badge {...args} shape="square">
        Square
      </Badge>
      <Badge {...args} shape="rounded">
        Rounded
      </Badge>
      <Badge {...args} shape="pill">
        Pill
      </Badge>
    </div>
  ),
};

export const WithIcons: Story = {
  render: (args: BadgeProps) => (
    <div className="flex gap-2 flex-wrap">
      <Badge {...args} icon={<Star />}>
        Featured
      </Badge>
      <Badge {...args} icon={<Zap />}>
        Yeni
      </Badge>
      <Badge {...args} icon={<AlertTriangle />}>
        Kritik
      </Badge>
      <Badge {...args} icon={<Check />}>
        Doğrulandı
      </Badge>
      <Badge {...args} iconRight={<Clock />}>
        Beklemede
      </Badge>
    </div>
  ),
};

export const Removable: Story = {
  render: (args: BadgeProps) => {
    const [tags, setTags] = useState([
      "React",
      "TypeScript",
      "Tailwind",
      "Storybook",
      "Next.js",
    ]);
    return (
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <Badge
            {...args}
            key={tag}
            shape="pill"
            removable
            onRemove={() => setTags((t) => t.filter((v) => v !== tag))}
          >
            {tag}
          </Badge>
        ))}
        {tags.length === 0 && (
          <span className="text-sm text-zinc-400">Tüm etiketler kaldırıldı</span>
        )}
      </div>
    );
  },
};

export const StatusBadges: Story = {
  render: (args: BadgeProps) => (
    <div className="flex gap-2 flex-wrap">
      <Badge {...args} variant="solid" shape="pill" icon={<Check />}>
        Aktif
      </Badge>
      <Badge {...args} variant="soft" shape="pill" icon={<Clock />}>
        Beklemede
      </Badge>
      <Badge {...args} variant="outline" shape="pill" icon={<AlertTriangle />}>
        Hata
      </Badge>
      <Badge {...args} variant="soft" shape="pill">
        Taslak
      </Badge>
    </div>
  ),
};

export const InText: Story = {
  render: (args: BadgeProps) => (
    <div className="flex flex-col gap-2 max-w-md text-sm text-zinc-600">
      <p>
        Yeni özellik <Badge {...args} size="xs">YENİ</Badge> az önce eklendi.
      </p>
      <p>
        Hesabınız <Badge {...args} size="xs" variant="outline">PRO</Badge> planında.
      </p>
    </div>
  ),
};
