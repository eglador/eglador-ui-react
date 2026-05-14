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
  Plus,
  Inbox,
} from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "../components/empty";
import { Avatar, AvatarGroup } from "../components/avatar";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "../components/input-group";
import { Button } from "../components/button";

const meta: Meta<typeof Empty> = {
  title: "Components/Empty",
  component: Empty,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Empty state shown when there is no data. Compound API: `<Empty>` + `<EmptyHeader>` (`<EmptyMedia>` + `<EmptyTitle>` + `<EmptyDescription>`) + `<EmptyContent>`. `EmptyMedia` has `default` and `icon` variants; layout & background are caller-controlled via className.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Empty>;

export const Default: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox />
        </EmptyMedia>
        <EmptyTitle>No data</EmptyTitle>
        <EmptyDescription>
          There is nothing to show right now.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">
          <Plus className="size-4" /> Add data
        </Button>
      </EmptyContent>
    </Empty>
  ),
};

export const Outline: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Add `border` + `rounded-*` to the Empty wrapper for a card-like outline.",
      },
    },
  },
  render: () => (
    <Empty className="rounded-lg border border-zinc-200 bg-white">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderPlus />
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>
          You haven't created any projects yet. Create your first one to get
          started.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button size="sm">
            <Plus className="size-4" /> Create project
          </Button>
          <Button size="sm" variant="outline">
            <Import className="size-4" /> Import
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  ),
};

export const Background: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `bg-*` / `bg-gradient-*` utilities on the wrapper for a tinted empty state.",
      },
    },
  },
  render: () => (
    <Empty className="rounded-lg border border-zinc-200 bg-gradient-to-b from-zinc-50 to-white">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Cloud strokeWidth={1.5} />
        </EmptyMedia>
        <EmptyTitle>Cloud storage is empty</EmptyTitle>
        <EmptyDescription>
          Upload to cloud storage to access your files anywhere.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Upload file</Button>
      </EmptyContent>
    </Empty>
  ),
};

export const WithAvatar: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`EmptyMedia` with `default` variant renders any media (avatar, illustration) at natural size.",
      },
    },
  },
  render: () => (
    <Empty className="rounded-lg border border-zinc-200 bg-white">
      <EmptyHeader>
        <EmptyMedia>
          <Avatar
            size="xl"
            name="Kenan Gündoğan"
            src="https://i.pravatar.cc/96?u=kenan"
          />
        </EmptyMedia>
        <EmptyTitle>Welcome back, Kenan</EmptyTitle>
        <EmptyDescription>
          You don't have any active workspaces. Create one to get started.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Create workspace</Button>
      </EmptyContent>
    </Empty>
  ),
};

export const WithAvatarGroup: Story = {
  render: () => (
    <Empty className="rounded-lg border border-zinc-200 bg-white">
      <EmptyHeader>
        <EmptyMedia>
          <AvatarGroup max={3}>
            <Avatar name="Alex" src="https://i.pravatar.cc/64?u=alex" />
            <Avatar name="Sam" src="https://i.pravatar.cc/64?u=sam" />
            <Avatar name="Jordan" src="https://i.pravatar.cc/64?u=jordan" />
            <Avatar name="Casey" />
            <Avatar name="Riley" />
          </AvatarGroup>
        </EmptyMedia>
        <EmptyTitle>Invite your team</EmptyTitle>
        <EmptyDescription>
          You're the only one here. Invite teammates to start collaborating.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Invite members</Button>
      </EmptyContent>
    </Empty>
  ),
};

export const WithInputGroup: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `InputGroup` inside `EmptyContent` for inline search / submit flows.",
      },
    },
  },
  render: () => (
    <Empty className="rounded-lg border border-zinc-200 bg-white">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Search />
        </EmptyMedia>
        <EmptyTitle>No results</EmptyTitle>
        <EmptyDescription>
          Nothing matches your search. Try a different query.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <Search className="size-4 text-zinc-400" />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search again…" />
        </InputGroup>
        <span className="text-xs text-zinc-400">
          Need help?{" "}
          <a href="#" className="text-zinc-700 underline underline-offset-2">
            Contact support
          </a>
        </span>
      </EmptyContent>
    </Empty>
  ),
};

export const Notifications: Story = {
  render: () => (
    <Empty className="rounded-lg border border-zinc-200 bg-white">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Bell />
        </EmptyMedia>
        <EmptyTitle>No notifications</EmptyTitle>
        <EmptyDescription>
          All caught up. New notifications will appear here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" variant="outline">
          Refresh
        </Button>
      </EmptyContent>
    </Empty>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <Empty className="rounded-lg border border-zinc-200 bg-white">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileX />
        </EmptyMedia>
        <EmptyTitle>Couldn't load</EmptyTitle>
        <EmptyDescription>
          Something went wrong while loading the data. Please try again.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" variant="outline">
          Try again
        </Button>
      </EmptyContent>
    </Empty>
  ),
};

export const PermissionDenied: Story = {
  render: () => (
    <Empty className="rounded-lg border border-zinc-200 bg-white">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShieldX />
        </EmptyMedia>
        <EmptyTitle>Access denied</EmptyTitle>
        <EmptyDescription>
          You don't have permission to view this content. Contact your admin.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};

export const Offline: Story = {
  render: () => (
    <Empty className="rounded-lg border border-zinc-200 bg-white">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <WifiOff />
        </EmptyMedia>
        <EmptyTitle>You're offline</EmptyTitle>
        <EmptyDescription>
          Check your internet connection and try again.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" variant="outline">
          Try again
        </Button>
      </EmptyContent>
    </Empty>
  ),
};

export const RTL: Story = {
  parameters: {
    docs: {
      description: {
        story: "Wrap with `dir=\"rtl\"` — layout already uses logical alignment.",
      },
    },
  },
  render: () => (
    <div dir="rtl">
      <Empty className="rounded-lg border border-zinc-200 bg-white">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Inbox />
          </EmptyMedia>
          <EmptyTitle>لا توجد بيانات</EmptyTitle>
          <EmptyDescription>لا يوجد شيء لعرضه حاليًا.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm">
            <Plus className="size-4" /> إضافة
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  ),
};
