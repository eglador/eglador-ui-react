import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  User,
  Settings,
  CreditCard,
  LogOut,
  Calendar as CalendarIcon,
  Smile,
  Calculator,
  Mail,
  MessageSquare,
  Plus,
} from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
  CommandDialog,
} from "../components/command";
import { Button } from "../components/button";
import { Kbd } from "../components/kbd";

const meta: Meta<typeof Command> = {
  title: "Components/Command",
  component: Command,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Command palette (Cmd+K UI). Compound: `<Command>` + `<CommandInput>` + `<CommandList>` + `<CommandGroup>` + `<CommandItem>` + `<CommandSeparator>` / `<CommandShortcut>` / `<CommandEmpty>`. Built-in filter, keyboard nav (Arrow / Home / End / Enter), `keywords` matching, optional `shouldFilter` opt-out, and `CommandDialog` wrapper for modal Cmd+K.",
      },
    },
  },
  argTypes: {
    shouldFilter: { control: "boolean" },
    loop: { control: "boolean" },
    defaultFilter: { control: "text" },
  },
  args: {
    shouldFilter: true,
    loop: true,
    defaultFilter: "",
  },
};

export default meta;
type Story = StoryObj<typeof Command>;

export const Default: Story = {
  render: (args) => (
    <Command key={JSON.stringify(args)} {...args} className="w-[420px]">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem value="calendar">
            <CalendarIcon className="size-4" /> Calendar
          </CommandItem>
          <CommandItem value="emoji" keywords={["smile", "emoji", "react"]}>
            <Smile className="size-4" /> Search Emoji
          </CommandItem>
          <CommandItem value="calculator">
            <Calculator className="size-4" /> Calculator
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem value="profile">
            <User className="size-4" /> Profile
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem value="billing">
            <CreditCard className="size-4" /> Billing
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem value="settings">
            <Settings className="size-4" /> Settings
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const Shortcuts: Story = {
  render: () => (
    <Command className="w-[420px]">
      <CommandInput placeholder="Search actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem value="new-mail">
            <Mail className="size-4" /> New email
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem value="new-message">
            <MessageSquare className="size-4" /> New message
            <CommandShortcut>⌘⇧M</CommandShortcut>
          </CommandItem>
          <CommandItem value="add-account">
            <Plus className="size-4" /> Add account
            <CommandShortcut>⌘⇧A</CommandShortcut>
          </CommandItem>
          <CommandItem value="logout">
            <LogOut className="size-4" /> Log out
            <CommandShortcut>⌘Q</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const Groups: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Grouped commands with icons and a separator. `keywords` widens search beyond visible text.",
      },
    },
  },
  render: () => (
    <Command className="w-[420px]">
      <CommandInput placeholder="Type a command…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem value="calendar" keywords={["date", "schedule"]}>
            <CalendarIcon className="size-4" /> Calendar
          </CommandItem>
          <CommandItem value="emoji" keywords={["smile", "react"]}>
            <Smile className="size-4" /> Search Emoji
          </CommandItem>
          <CommandItem value="calculator" keywords={["math", "compute"]}>
            <Calculator className="size-4" /> Calculator
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem value="profile">
            <User className="size-4" /> Profile
          </CommandItem>
          <CommandItem value="billing">
            <CreditCard className="size-4" /> Billing
          </CommandItem>
          <CommandItem value="settings">
            <Settings className="size-4" /> Settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const Scrollable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`CommandList` has a default `max-h-72` and `overflow-auto` — many items scroll inside the palette.",
      },
    },
  },
  render: () => (
    <Command className="w-[420px]">
      <CommandInput placeholder="Search 50 items…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Items">
          {Array.from({ length: 50 }, (_, i) => (
            <CommandItem key={i} value={`item-${i + 1}`}>
              Item {i + 1}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const Dialog: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`CommandDialog` is `Dialog` + `Command` pre-composed for the Cmd+K modal pattern. Bind a keydown listener (⌘K / Ctrl+K) to toggle `open`.",
      },
    },
  },
  render: function DialogStory() {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          setOpen((o) => !o);
        }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm text-zinc-600">
          Press <Kbd>⌘</Kbd>
          <Kbd>K</Kbd> or click the button.
        </p>
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          Open command menu
        </Button>
        <CommandDialog
          open={open}
          onOpenChange={setOpen}
          title="Command menu"
          description="Search across the app."
        >
          <CommandInput placeholder="Type a command…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem value="calendar" onSelect={() => setOpen(false)}>
                <CalendarIcon className="size-4" /> Calendar
              </CommandItem>
              <CommandItem value="emoji" onSelect={() => setOpen(false)}>
                <Smile className="size-4" /> Search Emoji
              </CommandItem>
              <CommandItem value="calculator" onSelect={() => setOpen(false)}>
                <Calculator className="size-4" /> Calculator
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem value="profile" onSelect={() => setOpen(false)}>
                <User className="size-4" /> Profile
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem value="billing" onSelect={() => setOpen(false)}>
                <CreditCard className="size-4" /> Billing
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem value="settings" onSelect={() => setOpen(false)}>
                <Settings className="size-4" /> Settings
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Command className="w-[420px]">
      <CommandInput placeholder="Type…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Items">
          <CommandItem value="profile">
            <User className="size-4" /> Profile
          </CommandItem>
          <CommandItem value="billing" disabled>
            <CreditCard className="size-4" /> Billing (disabled)
          </CommandItem>
          <CommandItem value="settings">
            <Settings className="size-4" /> Settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const CustomFilter: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`shouldFilter={false}` disables built-in filtering — useful when consumer supplies an already-filtered list (e.g., async server search).",
      },
    },
  },
  render: function CustomFilterStory() {
    const [q, setQ] = React.useState("");
    const all = ["Apple", "Banana", "Cherry", "Durian", "Elderberry"];
    const filtered = q
      ? all.filter((x) => x.toLowerCase().startsWith(q.toLowerCase()))
      : all;
    return (
      <Command shouldFilter={false} className="w-[420px]" filter={q} onFilterChange={setQ}>
        <CommandInput placeholder="Starts-with filter only…" />
        <CommandList>
          <CommandEmpty>Nothing starts with “{q}”.</CommandEmpty>
          <CommandGroup heading="Fruits">
            {filtered.map((f) => (
              <CommandItem key={f} value={f.toLowerCase()}>
                {f}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    );
  },
};

export const RTL: Story = {
  parameters: {
    docs: {
      description: {
        story: "Set `dir=\"rtl\"` on a wrapper for right-to-left layout.",
      },
    },
  },
  render: () => (
    <div dir="rtl">
      <Command className="w-[420px]">
        <CommandInput placeholder="ابحث عن أمر…" />
        <CommandList>
          <CommandEmpty>لا توجد نتائج.</CommandEmpty>
          <CommandGroup heading="الاقتراحات">
            <CommandItem value="calendar">
              <CalendarIcon className="size-4" /> التقويم
            </CommandItem>
            <CommandItem value="emoji">
              <Smile className="size-4" /> الرموز
            </CommandItem>
            <CommandItem value="calculator">
              <Calculator className="size-4" /> الحاسبة
              <CommandShortcut>⌘C</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
};
