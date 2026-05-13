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
          "Tag / status badge. 3 variants (solid / soft / outline), 5 sizes (xs / sm / md / lg / xl), 3 shapes (square / rounded / pill), optional left / right icons, removable mode.",
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
        New
      </Badge>
      <Badge {...args} icon={<AlertTriangle />}>
        Critical
      </Badge>
      <Badge {...args} icon={<Check />}>
        Verified
      </Badge>
      <Badge {...args} iconRight={<Clock />}>
        Pending
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
          <span className="text-sm text-zinc-400">All tags removed</span>
        )}
      </div>
    );
  },
};

export const StatusBadges: Story = {
  render: (args: BadgeProps) => (
    <div className="flex gap-2 flex-wrap">
      <Badge {...args} variant="solid" shape="pill" icon={<Check />}>
        Active
      </Badge>
      <Badge {...args} variant="soft" shape="pill" icon={<Clock />}>
        Pending
      </Badge>
      <Badge {...args} variant="outline" shape="pill" icon={<AlertTriangle />}>
        Error
      </Badge>
      <Badge {...args} variant="soft" shape="pill">
        Draft
      </Badge>
    </div>
  ),
};

export const InText: Story = {
  render: (args: BadgeProps) => (
    <div className="flex flex-col gap-2 max-w-md text-sm text-zinc-600">
      <p>
        New feature <Badge {...args} size="xs">NEW</Badge> just landed.
      </p>
      <p>
        Your account is on the <Badge {...args} size="xs" variant="outline">PRO</Badge> plan.
      </p>
    </div>
  ),
};
