import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  ScissorsIcon,
  CopyIcon,
  ClipboardPasteIcon,
  TrashIcon,
  RefreshCcwIcon,
  StarIcon,
  ArrowRightIcon,
  ShareIcon,
  MailIcon,
  MessageSquareIcon,
  LinkIcon,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "../components/context-menu";

const meta: Meta<typeof ContextMenu> = {
  title: "Components/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Right-click menu anchored to cursor. Compound API mirrors Dropdown: items, checkboxes, radios, labels, separators, shortcuts, **submenus**, and a `destructive` item variant. Outside-click / Escape close.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

function Surface({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-40 w-full max-w-md items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500 select-none">
      {children}
    </div>
  );
}

export const Default: Story = {
  render: function DefaultStory() {
    const [bookmarks, setBookmarks] = React.useState(true);
    const [pos, setPos] = React.useState("bottom");
    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <Surface>Right-click anywhere in this area</Surface>
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
          <ContextMenuCheckboxItem
            checked={bookmarks}
            onCheckedChange={setBookmarks}
          >
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

export const Basic: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <Surface>Right-click for basic menu</Surface>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Profile</ContextMenuItem>
        <ContextMenuItem>Billing</ContextMenuItem>
        <ContextMenuItem>Team</ContextMenuItem>
        <ContextMenuItem>Subscription</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const Submenu: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Nest secondary actions with `<ContextMenuSub>` + `<ContextMenuSubTrigger>` + `<ContextMenuSubContent>`. Hover or `→` opens the sub; `←` / Escape closes it.",
      },
    },
  },
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <Surface>Right-click for submenus</Surface>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <CopyIcon className="size-4" />
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <ClipboardPasteIcon className="size-4" />
          Paste
          <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <ShareIcon className="size-4" />
            Share
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>
              <MailIcon className="size-4" /> Email
            </ContextMenuItem>
            <ContextMenuItem>
              <MessageSquareIcon className="size-4" /> Message
            </ContextMenuItem>
            <ContextMenuItem>
              <LinkIcon className="size-4" /> Copy link
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <ArrowRightIcon className="size-4" />
            Move to
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Inbox</ContextMenuItem>
            <ContextMenuItem>Archive</ContextMenuItem>
            <ContextMenuItem>Trash</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const Shortcuts: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <Surface>Right-click for shortcuts</Surface>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          Cut <ContextMenuShortcut>⌘X</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Copy <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Paste <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          Reload <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const Groups: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `<ContextMenuGroup>` to wrap related items semantically. Combine with `<ContextMenuLabel>` and `<ContextMenuSeparator>`.",
      },
    },
  },
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <Surface>Right-click for groups</Surface>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>Clipboard</ContextMenuLabel>
          <ContextMenuItem>Cut</ContextMenuItem>
          <ContextMenuItem>Copy</ContextMenuItem>
          <ContextMenuItem>Paste</ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel>Navigation</ContextMenuLabel>
          <ContextMenuItem>Back</ContextMenuItem>
          <ContextMenuItem>Forward</ContextMenuItem>
          <ContextMenuItem>Reload</ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const Icons: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <Surface>Right-click for icons</Surface>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <ScissorsIcon className="size-4" /> Cut
        </ContextMenuItem>
        <ContextMenuItem>
          <CopyIcon className="size-4" /> Copy
        </ContextMenuItem>
        <ContextMenuItem>
          <ClipboardPasteIcon className="size-4" /> Paste
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <StarIcon className="size-4" /> Add to favorites
        </ContextMenuItem>
        <ContextMenuItem>
          <RefreshCcwIcon className="size-4" /> Refresh
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const Checkboxes: Story = {
  render: function CheckboxesStory() {
    const [bookmarks, setBookmarks] = React.useState(true);
    const [fullUrls, setFullUrls] = React.useState(false);
    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <Surface>Right-click for toggles</Surface>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>View</ContextMenuLabel>
          <ContextMenuCheckboxItem
            checked={bookmarks}
            onCheckedChange={setBookmarks}
          >
            Show bookmarks bar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={fullUrls}
            onCheckedChange={setFullUrls}
          >
            Show full URLs
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};

export const Radio: Story = {
  render: function RadioStory() {
    const [theme, setTheme] = React.useState("system");
    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <Surface>Right-click for radio</Surface>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>Theme</ContextMenuLabel>
          <ContextMenuRadioGroup value={theme} onValueChange={setTheme}>
            <ContextMenuRadioItem value="light">Light</ContextMenuRadioItem>
            <ContextMenuRadioItem value="dark">Dark</ContextMenuRadioItem>
            <ContextMenuRadioItem value="system">System</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};

export const Destructive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`variant=\"destructive\"` styles the item in red for destructive actions (Delete, Remove, etc.).",
      },
    },
  },
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <Surface>Right-click for destructive</Surface>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <CopyIcon className="size-4" /> Duplicate
        </ContextMenuItem>
        <ContextMenuItem>
          <StarIcon className="size-4" /> Favorite
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <TrashIcon className="size-4" /> Delete
          <ContextMenuShortcut>⌘⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const RTL: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Wrap with `dir=\"rtl\"` — submenu chevrons auto-flip via `rtl:rotate-180`.",
      },
    },
  },
  render: () => (
    <div dir="rtl">
      <ContextMenu>
        <ContextMenuTrigger>
          <Surface>انقر بزر الماوس الأيمن</Surface>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>الإجراءات</ContextMenuLabel>
          <ContextMenuItem>
            نسخ <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            لصق <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger>مشاركة</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>بريد إلكتروني</ContextMenuItem>
              <ContextMenuItem>رسالة</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">حذف</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  ),
};
