import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreHorizontal, ArrowUpRight, Plus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  type CardProps,
} from "../components/card";
import { Button } from "../components/button";
import { Badge } from "../components/badge";
import { Separator } from "../components/separator";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Surface container. Compound API: `<Card>` + `<CardHeader>` (`<CardTitle>` + `<CardDescription>` + `<CardAction>`) + `<CardContent>` + `<CardFooter>`. `variant` controls background/border style, `shape` controls corner radius, `shadow` controls elevation. Header auto-switches to 2-column grid when a `<CardAction>` is present. Add `border-b` to header or `border-t` to footer for divider lines.",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: ["solid", "soft", "outline", "ghost"] },
    shape: { control: "select", options: ["square", "rounded"] },
    shadow: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl"],
    },
  },
  args: {
    variant: "solid",
    shape: "rounded",
    shadow: "xs",
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args: CardProps) => (
    <Card {...args} className="w-[360px]">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-600">Card body content.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Mark all as read</Button>
      </CardFooter>
    </Card>
  ),
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`variant` controls background and border: `solid` (default white), `soft` (muted zinc-50), `outline` (transparent + border), `ghost` (transparent, no border).",
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[680px]">
      {(["solid", "soft", "outline", "ghost"] as const).map((variant) => (
        <Card key={variant} variant={variant}>
          <CardHeader>
            <CardTitle>variant = {variant}</CardTitle>
            <CardDescription>
              {variant === "solid" && "Default white background with border."}
              {variant === "soft" && "Muted zinc-50 background."}
              {variant === "outline" && "Transparent with a border only."}
              {variant === "ghost" && "Transparent, no border."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600">Body content.</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(["square", "rounded"] as const).map((shape) => (
        <Card key={shape} shape={shape} className="w-[260px]">
          <CardHeader>
            <CardTitle>shape = {shape}</CardTitle>
            <CardDescription>Corner radius preset.</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-6 w-[760px] p-4 bg-zinc-50">
      {(["none", "xs", "sm", "md", "lg", "xl"] as const).map((shadow) => (
        <Card key={shadow} shadow={shadow}>
          <CardHeader>
            <CardTitle>shadow = {shadow}</CardTitle>
            <CardDescription>Elevation preset.</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  ),
};

export const WithAction: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`<CardAction>` sits in the top-right of the header — the header grid auto-detects it and switches to `[1fr_auto]`.",
      },
    },
  },
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Project Alpha</CardTitle>
        <CardDescription>Updated 2 minutes ago.</CardDescription>
        <CardAction>
          <Button size="xs" variant="ghost">
            <MoreHorizontal className="size-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-600">12 tasks open · 4 in review</p>
      </CardContent>
    </Card>
  ),
};

export const WithDividers: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Add `border-b` to `<CardHeader>` or `border-t` to `<CardFooter>` for divider lines. Padding adjusts automatically via `[.border-b]:pb-6` / `[.border-t]:pt-6`.",
      },
    },
  },
  render: () => (
    <Card className="w-[420px]">
      <CardHeader className="border-b border-zinc-200">
        <CardTitle>Account</CardTitle>
        <CardDescription>Manage your account preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-600">Settings body…</p>
      </CardContent>
      <CardFooter className="border-t border-zinc-200 justify-between">
        <span className="text-xs text-zinc-500">Saved automatically</span>
        <Button size="sm" variant="outline">
          Cancel
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Stats: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-[720px]">
      {[
        { label: "Revenue", value: "$45,231", trend: "+12%" },
        { label: "Users", value: "2,420", trend: "+4%" },
        { label: "Orders", value: "187", trend: "−2%" },
      ].map((s) => (
        <Card key={s.label}>
          <CardHeader>
            <CardDescription>{s.label}</CardDescription>
            <CardTitle className="text-2xl tabular-nums">{s.value}</CardTitle>
            <CardAction>
              <Badge>{s.trend}</Badge>
            </CardAction>
          </CardHeader>
        </Card>
      ))}
    </div>
  ),
};

export const Linkable: Story = {
  render: () => (
    <Card className="w-[360px] cursor-pointer transition-colors hover:border-zinc-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          Documentation
          <ArrowUpRight className="size-4 text-zinc-400" />
        </CardTitle>
        <CardDescription>Read the getting-started guide.</CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const ListInCard: Story = {
  render: () => (
    <Card className="w-[420px]">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardAction>
          <Button size="xs" variant="ghost">
            <Plus className="size-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2">
        {["Created issue #42", "Merged PR #138", "Updated README"].map(
          (line, i, arr) => (
            <div key={line}>
              <p className="text-sm text-zinc-700">{line}</p>
              {i < arr.length - 1 && <Separator className="mt-2" />}
            </div>
          ),
        )}
      </CardContent>
    </Card>
  ),
};

export const Tight: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Override padding/gap via className to fit dense layouts (dashboards, sparkline cards).",
      },
    },
  },
  render: () => (
    <Card className="w-[200px] gap-2 py-4">
      <CardHeader className="px-4">
        <CardDescription className="text-xs">Posts</CardDescription>
        <CardTitle className="text-xl tabular-nums">1,284</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="h-8 w-full rounded bg-zinc-100" />
      </CardContent>
    </Card>
  ),
};
