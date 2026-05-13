import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Settings, User, LogOut, Plus, Cloud } from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownCheckboxItem,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownShortcut,
  type DropdownProps,
} from "../components/dropdown";
import { Button } from "../components/button";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Compound dropdown menu. Subcomponents: `<DropdownTrigger>`, `<DropdownContent>`, `<DropdownItem>`, `<DropdownCheckboxItem>`, `<DropdownRadioGroup>` + `<DropdownRadioItem>`, `<DropdownLabel>`, `<DropdownSeparator>`, `<DropdownShortcut>`. Keyboard nav (Arrow / Home / End / Enter / Escape), outside-click + Escape close.",
      },
    },
  },
  argTypes: {
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    align: { control: "select", options: ["start", "center", "end"] },
    sideOffset: { control: "number" },
    alignOffset: { control: "number" },
    defaultOpen: { control: "boolean" },
  },
  args: {
    side: "bottom",
    align: "start",
    sideOffset: 6,
    alignOffset: 0,
    defaultOpen: false,
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  render: (args: DropdownProps) => (
    <div className="flex items-center justify-center p-16">
      <Dropdown {...args}>
        <DropdownTrigger asChild>
          <Button variant="outline" size="sm">
            Open menu
          </Button>
        </DropdownTrigger>
        <DropdownContent>
          <DropdownLabel>My Account</DropdownLabel>
          <DropdownSeparator />
          <DropdownItem>
            <User className="size-4" />
            Profile
            <DropdownShortcut>⇧⌘P</DropdownShortcut>
          </DropdownItem>
          <DropdownItem>
            <Settings className="size-4" />
            Settings
            <DropdownShortcut>⌘,</DropdownShortcut>
          </DropdownItem>
          <DropdownItem>
            <Cloud className="size-4" />
            API
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem disabled>
            <Plus className="size-4" />
            New team (coming soon)
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem>
            <LogOut className="size-4" />
            Log out
            <DropdownShortcut>⇧⌘Q</DropdownShortcut>
          </DropdownItem>
        </DropdownContent>
      </Dropdown>
    </div>
  ),
};

export const Checkboxes: Story = {
  render: function CheckboxStory() {
    const [bookmarks, setBookmarks] = React.useState(true);
    const [reload, setReload] = React.useState(false);
    return (
      <div className="flex items-center justify-center p-16">
        <Dropdown>
          <DropdownTrigger asChild>
            <Button variant="outline" size="sm">
              View
            </Button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownLabel>Appearance</DropdownLabel>
            <DropdownSeparator />
            <DropdownCheckboxItem checked={bookmarks} onCheckedChange={setBookmarks}>
              Show Bookmarks Bar
              <DropdownShortcut>⌘⇧B</DropdownShortcut>
            </DropdownCheckboxItem>
            <DropdownCheckboxItem checked={reload} onCheckedChange={setReload}>
              Reload Tabs
            </DropdownCheckboxItem>
            <DropdownCheckboxItem disabled>Show Full URLs</DropdownCheckboxItem>
          </DropdownContent>
        </Dropdown>
      </div>
    );
  },
};

export const RadioGroup: Story = {
  render: function RadioStory() {
    const [pos, setPos] = React.useState("bottom");
    return (
      <div className="flex items-center justify-center p-16">
        <Dropdown>
          <DropdownTrigger asChild>
            <Button variant="outline" size="sm">
              Panel: {pos}
            </Button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownLabel>Panel position</DropdownLabel>
            <DropdownSeparator />
            <DropdownRadioGroup value={pos} onValueChange={setPos}>
              <DropdownRadioItem value="top">Top</DropdownRadioItem>
              <DropdownRadioItem value="bottom">Bottom</DropdownRadioItem>
              <DropdownRadioItem value="right">Right</DropdownRadioItem>
            </DropdownRadioGroup>
          </DropdownContent>
        </Dropdown>
      </div>
    );
  },
};
