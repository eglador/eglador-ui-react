import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  Home,
  Inbox,
  Settings,
  User,
  Plus,
  Folder,
  Search,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
  SidebarSeparator,
  SidebarInput,
  useSidebar,
} from "../components/sidebar";

interface SidebarPlaygroundArgs {
  side: "left" | "right";
  variant: "sidebar" | "floating" | "inset";
  collapsible: "offcanvas" | "icon" | "none";
  defaultOpen: boolean;
}

const meta: Meta<SidebarPlaygroundArgs> = {
  title: "Components/Sidebar",
  component: SidebarProvider as never,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "App-shell sidebar with collapsible / floating / inset variants. Compound API matching shadcn: `SidebarProvider` + `Sidebar` (`side`, `variant`, `collapsible`) + Header / Content / Footer / Group (Label / Action / Content) + Menu (Item / Button / Action / Badge / Sub) + Rail + Inset + Trigger. Mobile drawer fallback below 768px, Cmd/Ctrl+B keyboard shortcut, `useSidebar()` hook for imperative control, RTL-aware.",
      },
    },
  },
  argTypes: {
    side: { control: "select", options: ["left", "right"] },
    variant: {
      control: "select",
      options: ["sidebar", "floating", "inset"],
    },
    collapsible: {
      control: "select",
      options: ["offcanvas", "icon", "none"],
    },
    defaultOpen: { control: "boolean" },
  },
  args: {
    side: "left",
    variant: "sidebar",
    collapsible: "icon",
    defaultOpen: true,
  },
};

export default meta;
type Story = StoryObj<SidebarPlaygroundArgs>;

function AppShell({
  args,
  children,
  defaultActiveId,
  persistKey,
}: {
  args: SidebarPlaygroundArgs;
  children?: React.ReactNode;
  defaultActiveId?: string;
  persistKey?: string;
}) {
  return (
    <SidebarProvider
      key={`${args.defaultOpen}-${args.collapsible}-${args.side}-${args.variant}`}
      defaultOpen={args.defaultOpen}
      defaultActiveId={defaultActiveId}
      persistKey={persistKey}
    >
      <Sidebar
        side={args.side}
        variant={args.variant}
        collapsible={args.collapsible}
      >
        {children}
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-zinc-200 px-4">
          <SidebarTrigger />
          <span className="text-sm font-medium">Dashboard</span>
          <span className="ms-auto text-xs text-zinc-400">
            <kbd className="rounded-sm border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px]">
              ⌘
            </kbd>{" "}
            +{" "}
            <kbd className="rounded-sm border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px]">
              B
            </kbd>{" "}
            to toggle
          </span>
        </header>
        <main className="flex-1 p-6 text-sm text-zinc-600">
          App content goes here.
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const Default: Story = {
  render: (args) => (
    <AppShell args={args} defaultActiveId="home">
      <SidebarHeader className="h-14 flex-row items-center gap-2 border-b border-zinc-200 px-3 py-0 group-data-[collapsible=icon]/sidebar:px-0 group-data-[collapsible=icon]/sidebar:justify-center">
        <div className="size-7 rounded-sm bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold shrink-0 group-data-[collapsible=icon]/sidebar:size-6">
          A
        </div>
        <div className="flex flex-col leading-tight overflow-hidden min-w-0 group-data-[collapsible=icon]/sidebar:hidden">
          <span className="text-sm font-medium text-zinc-900 truncate">
            Acme Inc.
          </span>
          <span className="text-xs text-zinc-500 truncate">Pro plan</span>
        </div>
        <ChevronDown className="ms-auto size-4 text-zinc-400 shrink-0 group-data-[collapsible=icon]/sidebar:hidden" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton value="home" tooltip="Home">
                  <Home />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton value="inbox" tooltip="Inbox">
                  <Inbox />
                  <span>Inbox</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>24</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton value="projects" tooltip="Projects">
                  <Folder />
                  <span>Projects</span>
                </SidebarMenuButton>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton href="#" value="projects/alpha">
                      Alpha
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton href="#" value="projects/beta">
                      Beta
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton href="#" value="projects/gamma">
                      Gamma
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton value="team" tooltip="Team">
                  <User />
                  <span>Team</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupAction>
            <Plus className="size-4" />
            <span className="sr-only">Add project</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton value="preferences" tooltip="Preferences">
                  <Settings />
                  <span>Preferences</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton value="search" tooltip="Search">
                  <Search />
                  <span>Search</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-zinc-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Kenan">
              <div className="size-7 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-semibold shrink-0 group-data-[collapsible=icon]/sidebar:size-4 group-data-[collapsible=icon]/sidebar:text-[9px]">
                K
              </div>
              <div className="flex flex-col leading-tight overflow-hidden group-data-[collapsible=icon]/sidebar:hidden">
                <span className="text-sm font-medium text-zinc-900 truncate">
                  Kenan
                </span>
                <span className="text-xs text-zinc-500 truncate">
                  kenan@cyh.com.tr
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </AppShell>
  ),
};

export const Floating: Story = {
  args: { variant: "floating" },
  render: Default.render,
};

export const Inset: Story = {
  args: { variant: "inset" },
  render: Default.render,
};

export const RightSide: Story = {
  args: { side: "right" },
  render: Default.render,
};

export const CollapsibleOffcanvas: Story = {
  args: { collapsible: "offcanvas" },
  parameters: {
    docs: {
      description: {
        story:
          "`collapsible=\"offcanvas\"` slides the sidebar fully off the viewport. Press Cmd/Ctrl+B or click the trigger to bring it back.",
      },
    },
  },
  render: Default.render,
};

export const CollapsibleIcon: Story = {
  args: { collapsible: "icon" },
  parameters: {
    docs: {
      description: {
        story:
          "`collapsible=\"icon\"` keeps a narrow icon rail visible when collapsed. Labels and badges hide; tooltips on hover are recommended.",
      },
    },
  },
  render: Default.render,
};

export const WithSearch: Story = {
  render: (args) => (
    <AppShell args={args} defaultActiveId="All">
      <SidebarHeader className="h-14 flex-row items-center border-b border-zinc-200 px-3 py-0 group-data-[collapsible=icon]/sidebar:px-2 group-data-[collapsible=icon]/sidebar:justify-center">
        <SidebarInput placeholder="Search…" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Inbox</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {["All", "Unread", "Starred", "Drafts", "Sent"].map((label) => (
                <SidebarMenuItem key={label}>
                  <SidebarMenuButton value={label} tooltip={label}>
                    <Inbox />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </AppShell>
  ),
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `<SidebarMenuSkeleton>` to render placeholder rows while menu data is fetching.",
      },
    },
  },
  render: (args) => (
    <AppShell args={args}>
      <SidebarHeader className="h-14 flex-row items-center border-b border-zinc-200 px-3 py-0 group-data-[collapsible=icon]/sidebar:px-2 group-data-[collapsible=icon]/sidebar:justify-center">
        <SidebarMenuSkeleton showIcon />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Loading…</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Array.from({ length: 6 }).map((_, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </AppShell>
  ),
};

export const UseSidebarHook: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The exported `useSidebar()` hook gives you imperative access: `state`, `open` / `setOpen`, `openMobile` / `setOpenMobile`, `isMobile`, and `toggleSidebar`.",
      },
    },
  },
  render: function HookStory(args) {
    function StatusPanel() {
      const ctx = useSidebar();
      return (
        <div className="rounded-sm border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 space-y-1">
          <div>
            state:{" "}
            <code className="bg-white px-1.5 py-0.5 rounded-sm">
              {ctx.state}
            </code>
          </div>
          <div>
            open:{" "}
            <code className="bg-white px-1.5 py-0.5 rounded-sm">
              {String(ctx.open)}
            </code>
          </div>
          <div>
            isMobile:{" "}
            <code className="bg-white px-1.5 py-0.5 rounded-sm">
              {String(ctx.isMobile)}
            </code>
          </div>
          <button
            type="button"
            onClick={ctx.toggleSidebar}
            className="mt-1 inline-flex items-center justify-center rounded-sm border border-zinc-300 bg-white px-2 py-1 text-xs hover:bg-zinc-50 cursor-pointer"
          >
            toggleSidebar()
          </button>
        </div>
      );
    }

    return (
      <SidebarProvider defaultOpen={args.defaultOpen}>
        <Sidebar
          side={args.side}
          variant={args.variant}
          collapsible={args.collapsible}
        >
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Status</SidebarGroupLabel>
              <SidebarGroupContent>
                <StatusPanel />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-2 border-b border-zinc-200 px-4">
            <SidebarTrigger />
            <span className="text-sm font-medium">useSidebar()</span>
          </header>
          <main className="flex-1 p-6 text-sm text-zinc-600 space-y-3">
            <StatusPanel />
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  },
};

export const Persistence: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pass `persistKey=\"my-app:sidebar\"` to the Provider; the open/collapsed state is written to `localStorage` under that key and restored on next mount. Toggle the sidebar, refresh the Storybook iframe — the state survives.",
      },
    },
  },
  render: (args) => (
    <SidebarProvider
      defaultOpen={args.defaultOpen}
      persistKey="eglador:sidebar:demo"
      defaultActiveId="home"
    >
      <Sidebar
        side={args.side}
        variant={args.variant}
        collapsible={args.collapsible}
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Persistent</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton value="home" tooltip="Home">
                    <Home />
                    <span>Home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton value="inbox" tooltip="Inbox">
                    <Inbox />
                    <span>Inbox</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton value="settings" tooltip="Settings">
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b border-zinc-200 px-4">
          <SidebarTrigger />
          <span className="text-sm font-medium">Persistence</span>
          <span className="ms-auto text-xs text-zinc-400">
            Toggle, reload — state restored from{" "}
            <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">
              localStorage
            </code>
          </span>
        </header>
        <main className="flex-1 p-6 text-sm text-zinc-600">
          The Provider writes to{" "}
          <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">
            localStorage["eglador:sidebar:demo"]
          </code>{" "}
          on every toggle.
        </main>
      </SidebarInset>
    </SidebarProvider>
  ),
};

export const ActiveIdControlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Drive `activeId` externally to bind the sidebar selection to your router. Each `SidebarMenuButton` declares its `value`; the matching one auto-receives the active state and `aria-current=\"page\"`.",
      },
    },
  },
  render: function ActiveIdStory(args) {
    const [active, setActive] = React.useState<string | undefined>("home");
    return (
      <SidebarProvider
        defaultOpen={args.defaultOpen}
        activeId={active}
        onActiveIdChange={setActive}
      >
        <Sidebar
          side={args.side}
          variant={args.variant}
          collapsible={args.collapsible}
        >
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton value="home" tooltip="Home">
                      <Home />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton value="inbox" tooltip="Inbox">
                      <Inbox />
                      <span>Inbox</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton value="team" tooltip="Team">
                      <User />
                      <span>Team</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-2 border-b border-zinc-200 px-4">
            <SidebarTrigger />
            <span className="text-sm font-medium">activeId</span>
            <span className="ms-auto text-xs text-zinc-500">
              activeId:{" "}
              <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">
                {active ?? "(none)"}
              </code>
            </span>
          </header>
          <main className="flex-1 p-6 text-sm text-zinc-600 space-y-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActive("home")}
                className="inline-flex items-center justify-center rounded-sm border border-zinc-300 bg-white px-3 py-1 text-xs hover:bg-zinc-50 cursor-pointer"
              >
                Jump to Home
              </button>
              <button
                type="button"
                onClick={() => setActive("team")}
                className="inline-flex items-center justify-center rounded-sm border border-zinc-300 bg-white px-3 py-1 text-xs hover:bg-zinc-50 cursor-pointer"
              >
                Jump to Team
              </button>
              <button
                type="button"
                onClick={() => setActive(undefined)}
                className="inline-flex items-center justify-center rounded-sm border border-zinc-300 bg-white px-3 py-1 text-xs hover:bg-zinc-50 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  },
};

export const TooltipOnCollapsed: Story = {
  args: { collapsible: "icon", defaultOpen: false },
  parameters: {
    docs: {
      description: {
        story:
          "With `collapsible=\"icon\"` and the sidebar collapsed, hovering any `SidebarMenuButton` shows its `tooltip` (or the button's string children) as a Tooltip flipped to the opposite side. Open the sidebar (Cmd/Ctrl+B) to hide tooltips again.",
      },
    },
  },
  render: Default.render,
};
