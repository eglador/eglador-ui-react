import type { Meta, StoryObj } from "@storybook/react-vite";
import { User, Settings, CreditCard, LogOut } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "../components/command";

const meta: Meta<typeof Command> = {
  title: "Components/Command",
  component: Command,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Command palette / search list (Cmd+K UI). Compound API: `<Command>` + `<CommandInput>` + `<CommandList>` + `<CommandGroup>` + `<CommandItem>` + `<CommandSeparator>` / `<CommandShortcut>` / `<CommandEmpty>`. Filter, keyboard nav (Arrow / Home / End / Enter), auto-focus first match.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Command>;

export const Default: Story = {
  render: () => (
    <Command className="w-[420px]">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem value="calendar" onSelect={(v) => console.log(v)}>
            <User className="size-4" /> Calendar
          </CommandItem>
          <CommandItem value="search" onSelect={(v) => console.log(v)}>
            <Settings className="size-4" /> Search Emoji
          </CommandItem>
          <CommandItem value="calculator" onSelect={(v) => console.log(v)}>
            <CreditCard className="size-4" /> Calculator
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem value="profile" onSelect={(v) => console.log(v)}>
            <User className="size-4" /> Profile
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem value="billing" onSelect={(v) => console.log(v)}>
            <CreditCard className="size-4" /> Billing
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem value="logout" onSelect={(v) => console.log(v)}>
            <LogOut className="size-4" /> Log out
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
