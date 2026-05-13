import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  type ContextMenuProps,
} from "../components/context-menu";

const meta: Meta<typeof ContextMenu> = {
  title: "Components/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Right-click menu. Same item primitives as Dropdown (items, checkboxes, radios, labels, separators, shortcuts) but anchored to the cursor position. Outside-click and Escape close.",
      },
    },
  },
  argTypes: {
    defaultOpen: { control: "boolean" },
  },
  args: {
    defaultOpen: false,
  },
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
  render: function DefaultStory(args: ContextMenuProps) {
    const [bookmarks, setBookmarks] = React.useState(true);
    const [pos, setPos] = React.useState("bottom");
    return (
      <ContextMenu key={String(args.defaultOpen)} {...args}>
        <ContextMenuTrigger>
          <div className="flex h-40 w-full max-w-md items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500 select-none">
            Right-click anywhere in this area
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>Actions</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuItem>
            Back
            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Forward
            <ContextMenuShortcut>⌘]</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem disabled>Reload (disabled)</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem checked={bookmarks} onCheckedChange={setBookmarks}>
            Show bookmarks bar
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuLabel>Panel position</ContextMenuLabel>
          <ContextMenuRadioGroup value={pos} onValueChange={setPos}>
            <ContextMenuRadioItem value="top">Top</ContextMenuRadioItem>
            <ContextMenuRadioItem value="bottom">Bottom</ContextMenuRadioItem>
            <ContextMenuRadioItem value="right">Right</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};
