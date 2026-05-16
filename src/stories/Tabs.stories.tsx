import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  User,
  Settings,
  Bell,
  Shield,
  CreditCard,
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Mail,
  Calendar,
  Folder,
  Tag,
  Globe,
  Database,
  KeyRound,
  Activity,
} from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  type TabsProps,
} from "../components/tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Compound tab component. `<Tabs>` + `<TabsList>` + `<TabsTrigger>` + `<TabsContent>`. 3 variants (underline / pills / segmented), 5 sizes, horizontal + vertical orientation, full keyboard navigation (Arrow / Home / End), controlled + uncontrolled, icons, disabled triggers.",
      },
    },
  },
  args: {
    variant: "underline",
    size: "md",
    orientation: "horizontal",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["underline", "pills", "segmented"],
    },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    onValueChange: { action: "valueChanged" },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const PanelBody = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm text-zinc-600 leading-relaxed space-y-3">
    {children}
  </div>
);

export const Default: Story = {
  render: (args: TabsProps) => (
    <Tabs {...args} defaultValue="account" className="w-[560px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <PanelBody>
          <h3 className="text-base font-semibold text-zinc-900">
            Account profile
          </h3>
          <p>
            Manage your personal information and the email address associated
            with your account. Your display name is visible to everyone you
            share workspaces with.
          </p>
          <p>
            Changes to your billing email take effect on your next invoice. If
            you need to switch the email used for login as well, you'll be
            asked to verify the new address before the change is applied.
          </p>
          <p>
            Deleting your account permanently removes all workspaces you own
            and is irreversible after a 14-day grace period.
          </p>
        </PanelBody>
      </TabsContent>
      <TabsContent value="password">
        <PanelBody>
          <h3 className="text-base font-semibold text-zinc-900">
            Password & security
          </h3>
          <p>
            Choose a strong, unique password that you don't use anywhere else.
            We recommend a passphrase of at least 16 characters mixing letters,
            numbers, and symbols.
          </p>
          <p>
            Two-factor authentication adds a second step to every sign-in.
            Authenticator apps are more secure than SMS — enable an app like
            1Password, Authy, or Google Authenticator from the Security tab.
          </p>
          <p>
            Active sessions across all your devices are listed below. Sign out
            of any session that you don't recognize.
          </p>
        </PanelBody>
      </TabsContent>
      <TabsContent value="settings">
        <PanelBody>
          <h3 className="text-base font-semibold text-zinc-900">
            General settings
          </h3>
          <p>
            Customize the interface to match your workflow. Choose between
            light and dark themes, set your preferred language, and adjust the
            default time zone for scheduled events.
          </p>
          <p>
            Notification preferences apply to email, push, and in-app messages.
            You can mute individual channels without disabling notifications
            globally.
          </p>
          <p>
            Beta features are opt-in and may change without notice. Toggle
            them on to preview upcoming changes before they ship.
          </p>
        </PanelBody>
      </TabsContent>
    </Tabs>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-[480px]">
      {(["underline", "pills", "segmented"] as const).map((variant) => (
        <Tabs key={variant} variant={variant} defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">{variant} A</TabsTrigger>
            <TabsTrigger value="b">{variant} B</TabsTrigger>
            <TabsTrigger value="c">{variant} C</TabsTrigger>
          </TabsList>
          <TabsContent value="a">
            <div className="text-sm text-zinc-600 leading-relaxed">Panel A — variant: {variant}</div>
          </TabsContent>
          <TabsContent value="b">
            <div className="text-sm text-zinc-600 leading-relaxed">Panel B — variant: {variant}</div>
          </TabsContent>
          <TabsContent value="c">
            <div className="text-sm text-zinc-600 leading-relaxed">Panel C — variant: {variant}</div>
          </TabsContent>
        </Tabs>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[480px]">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Tabs key={size} size={size} variant="segmented" defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">size = {size}</TabsTrigger>
            <TabsTrigger value="b">Tab B</TabsTrigger>
            <TabsTrigger value="c">Tab C</TabsTrigger>
          </TabsList>
        </Tabs>
      ))}
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="profile" variant="pills" className="w-[520px]">
      <TabsList>
        <TabsTrigger value="profile" icon={<User />}>
          Profile
        </TabsTrigger>
        <TabsTrigger value="notifications" icon={<Bell />}>
          Notifications
        </TabsTrigger>
        <TabsTrigger value="security" icon={<Shield />}>
          Security
        </TabsTrigger>
        <TabsTrigger value="billing" icon={<CreditCard />}>
          Billing
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <div className="text-sm text-zinc-600 leading-relaxed">Manage how others see you on the platform.</div>
      </TabsContent>
      <TabsContent value="notifications">
        <div className="text-sm text-zinc-600 leading-relaxed">Email, push, and in-app notification preferences.</div>
      </TabsContent>
      <TabsContent value="security">
        <div className="text-sm text-zinc-600 leading-relaxed">Two-factor authentication and active sessions.</div>
      </TabsContent>
      <TabsContent value="billing">
        <div className="text-sm text-zinc-600 leading-relaxed">Subscription, invoices, and payment methods.</div>
      </TabsContent>
    </Tabs>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="a" variant="segmented" className="w-[480px]">
      <TabsList>
        <TabsTrigger value="a">Enabled</TabsTrigger>
        <TabsTrigger value="b" disabled>
          Disabled
        </TabsTrigger>
        <TabsTrigger value="c">Enabled</TabsTrigger>
      </TabsList>
      <TabsContent value="a">
        <div className="text-sm text-zinc-600 leading-relaxed">Disabled tabs are skipped by keyboard navigation.</div>
      </TabsContent>
      <TabsContent value="c">
        <div className="text-sm text-zinc-600 leading-relaxed">Try arrow keys — the middle one is skipped.</div>
      </TabsContent>
    </Tabs>
  ),
};

export const Vertical: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Set `orientation=\"vertical\"` for a sidebar-style tab layout. Triggers are start-aligned; Up/Down arrows navigate; the active indicator (underline variant) moves to the inline-end.",
      },
    },
  },
  render: () => (
    <Tabs
      defaultValue="profile"
      orientation="vertical"
      className="w-[640px]"
    >
      <TabsList className="w-44">
        <TabsTrigger value="profile" icon={<User />}>
          Profile
        </TabsTrigger>
        <TabsTrigger value="notifications" icon={<Bell />}>
          Notifications
        </TabsTrigger>
        <TabsTrigger value="security" icon={<Shield />}>
          Security
        </TabsTrigger>
        <TabsTrigger value="general" icon={<Settings />}>
          General
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <div className="text-sm text-zinc-600 leading-relaxed space-y-3">
          <h3 className="text-base font-semibold text-zinc-900">Profile</h3>
          <p>
            Update your display name, avatar, and public bio. Mentions and
            search results use whatever you have here.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="notifications">
        <div className="text-sm text-zinc-600 leading-relaxed space-y-3">
          <h3 className="text-base font-semibold text-zinc-900">
            Notifications
          </h3>
          <p>
            Email, push, and in-app delivery channels can be muted
            independently. Use quiet hours to suppress non-critical alerts.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="security">
        <div className="text-sm text-zinc-600 leading-relaxed space-y-3">
          <h3 className="text-base font-semibold text-zinc-900">Security</h3>
          <p>
            Two-factor authentication, active sessions, and recovery codes.
            Sign out unfamiliar sessions and rotate codes after each use.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="general">
        <div className="text-sm text-zinc-600 leading-relaxed space-y-3">
          <h3 className="text-base font-semibold text-zinc-900">General</h3>
          <p>
            Theme, language, and time zone preferences. Beta features are
            opt-in and can be toggled here before they ship.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const ManyTabs: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Tabs with many entries — useful for admin panels or settings pages where the navigation has a long list of sections.",
      },
    },
  },
  render: () => {
    const items = [
      { value: "dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
      { value: "users", label: "Users", icon: <Users /> },
      { value: "posts", label: "Posts", icon: <FileText /> },
      { value: "analytics", label: "Analytics", icon: <BarChart3 /> },
      { value: "messages", label: "Messages", icon: <Mail /> },
      { value: "calendar", label: "Calendar", icon: <Calendar /> },
      { value: "files", label: "Files", icon: <Folder /> },
      { value: "tags", label: "Tags", icon: <Tag /> },
      { value: "domains", label: "Domains", icon: <Globe /> },
      { value: "database", label: "Database", icon: <Database /> },
      { value: "api-keys", label: "API Keys", icon: <KeyRound /> },
      { value: "activity", label: "Activity", icon: <Activity /> },
      { value: "billing", label: "Billing", icon: <CreditCard /> },
      { value: "security", label: "Security", icon: <Shield /> },
      { value: "settings", label: "Settings", icon: <Settings /> },
    ];
    return (
      <Tabs
        defaultValue="dashboard"
        variant="underline"
        className="w-[480px]"
      >
        <TabsList scrollable>
          {items.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              icon={item.icon}
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {items.map((item) => (
          <TabsContent key={item.value} value={item.value}>
            <div className="text-sm text-zinc-600 leading-relaxed space-y-2">
              <h3 className="text-base font-semibold text-zinc-900">
                {item.label}
              </h3>
              <p>
                This is the {item.label.toLowerCase()} section. Use arrow keys
                to navigate between tabs; Home and End jump to the first and
                last tab.
              </p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    );
  },
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [tab, setTab] = React.useState("a");
    return (
      <div className="flex flex-col gap-3 w-[480px]">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          Active value:{" "}
          <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">{tab}</code>
          <button
            type="button"
            className="ms-auto text-xs underline text-zinc-700"
            onClick={() => setTab("c")}
          >
            Jump to C
          </button>
        </div>
        <Tabs value={tab} onValueChange={setTab} variant="pills">
          <TabsList>
            <TabsTrigger value="a">A</TabsTrigger>
            <TabsTrigger value="b">B</TabsTrigger>
            <TabsTrigger value="c">C</TabsTrigger>
          </TabsList>
          <TabsContent value="a">
            <div className="text-sm text-zinc-600 leading-relaxed">External state controls this.</div>
          </TabsContent>
          <TabsContent value="b">
            <div className="text-sm text-zinc-600 leading-relaxed">External state controls this.</div>
          </TabsContent>
          <TabsContent value="c">
            <div className="text-sm text-zinc-600 leading-relaxed">External state controls this.</div>
          </TabsContent>
        </Tabs>
      </div>
    );
  },
};
