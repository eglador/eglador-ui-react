import type { Meta, StoryObj } from "@storybook/react-vite";
import { Home, Settings, User, Inbox } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "../components/sidebar";

const meta: Meta<typeof SidebarProvider> = {
  title: "Components/Sidebar",
  component: SidebarProvider,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "App-shell sidebar with collapsible / floating / inset variants. Compound API: `<SidebarProvider>` + `<Sidebar>` + `<SidebarHeader>` / `<SidebarContent>` / `<SidebarFooter>` / `<SidebarGroup>` / `<SidebarMenu>` + items + `<SidebarMenuButton>` + `<SidebarTrigger>` + `<SidebarInset>`. Open/collapsed states are controlled or uncontrolled.",
      },
    },
  },
  argTypes: {
    side: { control: "select", options: ["left", "right"] },
    variant: {
      control: "select",
      options: ["sidebar", "floating", "inset"],
    },
    defaultOpen: { control: "boolean" },
    defaultCollapsed: { control: "boolean" },
  },
  args: {
    side: "left",
    variant: "sidebar",
    defaultOpen: true,
    defaultCollapsed: false,
  },
};

export default meta;
type Story = StoryObj<typeof SidebarProvider>;

export const Default: Story = {
  render: (args) => (
    <SidebarProvider {...args}>
      <Sidebar>
        <SidebarHeader>
          <span className="text-sm font-semibold">Acme Inc.</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Platform">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton active icon={<Home />}>
                  Home
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton icon={<Inbox />}>Inbox</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton icon={<User />}>Team</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup label="Settings">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton icon={<Settings />}>
                  Preferences
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <span className="text-xs text-zinc-500">v1.0.0-alpha</span>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center gap-2 border-b border-zinc-200 p-3">
          <SidebarTrigger />
          <span className="text-sm font-medium">Dashboard</span>
        </header>
        <main className="flex-1 p-6 text-sm text-zinc-600">
          App content goes here.
        </main>
      </SidebarInset>
    </SidebarProvider>
  ),
};
