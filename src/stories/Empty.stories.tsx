import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Cloud,
  FolderPlus,
  Bell,
  Search,
  FileX,
  ShieldX,
  WifiOff,
  Import,
} from "lucide-react";
import { Empty, type EmptyProps } from "../components/empty";

const meta: Meta<typeof Empty> = {
  title: "Components/Empty",
  component: Empty,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Empty state shown when there is no data. Icon on a circular background, optional title / description / action. 5 sizes (xs / sm / md / lg / xl).",
      },
    },
  },
  args: {
    size: "md",
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    title: { control: "text" },
    description: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Empty>;

const btnPrimary =
  "inline-flex items-center gap-1.5 h-7 px-2.5 text-xs font-medium rounded-sm bg-zinc-900 text-white hover:bg-zinc-700 cursor-pointer";
const btnOutline =
  "inline-flex items-center gap-1.5 h-7 px-2.5 text-xs font-medium rounded-sm border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 cursor-pointer";

export const Default: Story = {
  args: {
    title: "No data",
    description: "There is nothing to show right now.",
  },
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-sm max-w-md">
      <Empty {...args} />
    </div>
  ),
};

export const CloudStorage: Story = {
  args: {
    title: "Cloud storage is empty",
    description: "Upload to cloud storage to access your files anywhere.",
  },
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-sm max-w-md">
      <Empty
        {...args}
        icon={<Cloud strokeWidth={1} />}
        action={
          <button type="button" className={btnPrimary}>
            Upload file
          </button>
        }
      />
    </div>
  ),
};

export const NoProjects: Story = {
  args: {
    title: "No projects yet",
    description: "You haven't created any projects yet. Create your first one to get started.",
  },
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-sm max-w-md">
      <Empty {...args} icon={<FolderPlus strokeWidth={1} />}>
        <div className="flex gap-2 mt-1">
          <button type="button" className={btnPrimary}>
            Create project
          </button>
          <button type="button" className={btnOutline}>
            <Import className="size-3.5" />
            Import
          </button>
        </div>
      </Empty>
    </div>
  ),
};

export const NoNotifications: Story = {
  args: {
    title: "No notifications",
    description: "All caught up. New notifications will appear here.",
  },
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-sm max-w-md">
      <Empty
        {...args}
        icon={<Bell strokeWidth={1} />}
        action={
          <button type="button" className={btnOutline}>
            Refresh
          </button>
        }
      />
    </div>
  ),
};

export const NotFound: Story = {
  args: {
    size: "lg",
    title: "404 — Page not found",
    description: "The page you're looking for doesn't exist. Try a search below.",
  },
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-sm max-w-lg">
      <Empty {...args}>
        <div className="flex flex-col items-center gap-3 mt-1 w-full max-w-xs">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400" />
            <input
              type="search"
              placeholder="Search pages…"
              className="w-full h-8 pl-8 pr-2.5 text-xs rounded-sm border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1"
            />
          </div>
          <span className="text-xs text-zinc-400">
            Need help?{" "}
            <a href="#" className="text-zinc-700 underline underline-offset-2">
              Contact support
            </a>
            .
          </span>
        </div>
      </Empty>
    </div>
  ),
};

export const NoSearchResults: Story = {
  args: {
    title: "No results found",
    description:
      "Nothing matches your search. Try changing your filters or query.",
  },
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-sm max-w-md">
      <Empty
        {...args}
        icon={<Search strokeWidth={1} />}
        action={
          <button type="button" className={btnOutline}>
            Clear filters
          </button>
        }
      />
    </div>
  ),
};

export const ErrorState: Story = {
  args: {
    title: "Couldn't load",
    description: "Something went wrong while loading the data. Please try again.",
  },
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-sm max-w-md">
      <Empty
        {...args}
        icon={<FileX strokeWidth={1} />}
        action={
          <button type="button" className={btnOutline}>
            Try again
          </button>
        }
      />
    </div>
  ),
};

export const PermissionDenied: Story = {
  args: {
    title: "Access denied",
    description:
      "You don't have permission to view this content. Contact your admin.",
  },
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-sm max-w-md">
      <Empty {...args} icon={<ShieldX strokeWidth={1} />} />
    </div>
  ),
};

export const Offline: Story = {
  args: {
    title: "You're offline",
    description: "Check your internet connection and try again.",
  },
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-sm max-w-md">
      <Empty
        {...args}
        icon={<WifiOff strokeWidth={1} />}
        action={
          <button type="button" className={btnOutline}>
            Try again
          </button>
        }
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div
          key={size}
          className="border border-zinc-200 rounded-sm max-w-md"
        >
          <Empty
            size={size}
            icon={<Bell strokeWidth={1} />}
            title={`Size: ${size}`}
            description="Empty state placeholder example."
          />
        </div>
      ))}
    </div>
  ),
};
