import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton, type SkeletonProps } from "../components/skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Loading placeholder. text / circular / rectangular / rounded variants; pulse / wave / none animations; multi-line text; custom sizing. Wave animation keyframes are auto-injected.",
      },
    },
  },
  args: {
    variant: "text",
    animation: "pulse",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "circular", "rectangular", "rounded"],
      description: "Shape variant.",
    },
    animation: {
      control: "select",
      options: ["pulse", "wave", "none"],
      description: "Animation type. `pulse` uses Tailwind's built-in; `wave` ships its own keyframes.",
    },
    width: {
      control: "text",
      description: "Width (px number or CSS string).",
    },
    height: {
      control: "text",
      description: "Height (px number or CSS string).",
    },
    lines: {
      control: { type: "number", min: 1, max: 10 },
      description: "Multi-line text. The last line is automatically 60% width.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  render: (args: SkeletonProps) => (
    <div className="max-w-sm">
      <Skeleton {...args} />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-sm">
      <div>
        <span className="text-xs text-zinc-400 mb-2 block">text</span>
        <Skeleton variant="text" />
      </div>
      <div>
        <span className="text-xs text-zinc-400 mb-2 block">circular</span>
        <Skeleton variant="circular" width={48} height={48} />
      </div>
      <div>
        <span className="text-xs text-zinc-400 mb-2 block">rectangular</span>
        <Skeleton variant="rectangular" height={120} />
      </div>
      <div>
        <span className="text-xs text-zinc-400 mb-2 block">rounded</span>
        <Skeleton variant="rounded" height={120} />
      </div>
    </div>
  ),
};

export const MultiLineText: Story = {
  render: (args: SkeletonProps) => (
    <div className="max-w-sm">
      <Skeleton {...args} variant="text" lines={4} />
    </div>
  ),
};

export const Animations: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-sm">
      <div>
        <span className="text-xs text-zinc-400 mb-2 block">pulse</span>
        <Skeleton animation="pulse" variant="rounded" height={60} />
      </div>
      <div>
        <span className="text-xs text-zinc-400 mb-2 block">wave</span>
        <Skeleton animation="wave" variant="rounded" height={60} />
      </div>
      <div>
        <span className="text-xs text-zinc-400 mb-2 block">none</span>
        <Skeleton animation="none" variant="rounded" height={60} />
      </div>
    </div>
  ),
};

export const CardSkeleton: Story = {
  render: () => (
    <div className="border border-zinc-200 rounded-sm overflow-hidden max-w-xs">
      <Skeleton variant="rectangular" height={180} />
      <div className="p-4 flex flex-col gap-3">
        <Skeleton variant="text" width="70%" height="1.25rem" />
        <Skeleton variant="text" lines={2} />
        <div className="flex items-center gap-3 mt-1">
          <Skeleton variant="circular" width={32} height={32} />
          <div className="flex-1 flex flex-col gap-1.5">
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="30%" />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ProfileSkeleton: Story = {
  render: () => (
    <div className="flex items-start gap-4 max-w-sm">
      <Skeleton variant="circular" width={64} height={64} />
      <div className="flex-1 flex flex-col gap-2 pt-1">
        <Skeleton variant="text" width="40%" height="1.25rem" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" lines={3} />
      </div>
    </div>
  ),
};

export const ListSkeleton: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-sm">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 flex flex-col gap-1.5">
            <Skeleton variant="text" width={`${70 - i * 10}%`} />
            <Skeleton variant="text" width={`${50 - i * 5}%`} />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const TableSkeleton: Story = {
  render: () => (
    <div className="border border-zinc-200 rounded-sm overflow-hidden max-w-lg">
      <div className="bg-zinc-50 px-4 py-3 flex gap-4">
        <Skeleton variant="text" width="20%" />
        <Skeleton variant="text" width="30%" />
        <Skeleton variant="text" width="25%" />
        <Skeleton variant="text" width="15%" />
      </div>
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="px-4 py-3 flex gap-4 border-t border-zinc-100"
        >
          <Skeleton variant="text" width="20%" />
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="25%" />
          <Skeleton variant="text" width="15%" />
        </div>
      ))}
    </div>
  ),
};

export const MediaGridSkeleton: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-3 max-w-lg">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} variant="rounded" height={120} />
      ))}
    </div>
  ),
};
