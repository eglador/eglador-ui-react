import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Send, Smile, Image as ImageIcon, Bold, Italic } from "lucide-react";
import { Textarea, type TextareaProps } from "../components/textarea";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
  InputGroupButton,
} from "../components/input-group";
import { Label } from "../components/label";
import { Typography } from "../components/typography";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Multi-line text input. 3 variants (outline / soft / ghost), 5 sizes, 2 shapes, 4 resize modes (none / vertical / horizontal / both), `autoGrow` + `maxRows` to grow with content. Inside an InputGroup, use `InputGroupTextarea` (block-end addon enables a toolbar / Send pattern).",
      },
    },
  },
  args: {
    placeholder: "Write something…",
    variant: "outline",
    size: "md",
    shape: "rounded",
    resize: "vertical",
    rows: 3,
  },
  argTypes: {
    variant: { control: "select", options: ["outline", "soft", "ghost"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    shape: { control: "select", options: ["square", "rounded"] },
    resize: {
      control: "select",
      options: ["none", "vertical", "horizontal", "both"],
    },
    rows: { control: { type: "number", min: 1, max: 20 } },
    autoGrow: { control: "boolean" },
    maxRows: { control: { type: "number", min: 1, max: 20 } },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  render: (args: TextareaProps) => (
    <div className="w-80">
      <Textarea {...args} />
    </div>
  ),
};

export const Variants: Story = {
  render: (args: TextareaProps) => (
    <div className="flex flex-col gap-3 w-80">
      <Textarea {...args} variant="outline" placeholder="outline (default)" />
      <Textarea {...args} variant="soft" placeholder="soft" />
      <Textarea {...args} variant="ghost" placeholder="ghost" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args: TextareaProps) => (
    <div className="flex flex-col gap-3 w-80">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Textarea
          key={size}
          {...args}
          size={size}
          placeholder={`${size} textarea`}
        />
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  render: (args: TextareaProps) => (
    <div className="flex flex-col gap-3 w-80">
      <Textarea {...args} shape="square" placeholder="square" />
      <Textarea {...args} shape="rounded" placeholder="rounded (default)" />
    </div>
  ),
};

export const ResizeModes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <div>
        <span className="text-xs text-zinc-400 mb-1.5 block">none</span>
        <Textarea resize="none" placeholder="resize: none" />
      </div>
      <div>
        <span className="text-xs text-zinc-400 mb-1.5 block">vertical (default)</span>
        <Textarea resize="vertical" placeholder="resize: vertical" />
      </div>
      <div>
        <span className="text-xs text-zinc-400 mb-1.5 block">horizontal</span>
        <Textarea resize="horizontal" placeholder="resize: horizontal" />
      </div>
      <div>
        <span className="text-xs text-zinc-400 mb-1.5 block">both</span>
        <Textarea resize="both" placeholder="resize: both" />
      </div>
    </div>
  ),
};

export const AutoGrow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`autoGrow` → height matches content. `maxRows` caps it; beyond that the textarea scrolls.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div>
        <Label className="mb-1.5 block">Unlimited auto-grow</Label>
        <Textarea autoGrow placeholder="Start typing — the box grows itself…" />
      </div>
      <div>
        <Label className="mb-1.5 block">maxRows=5 (then scroll)</Label>
        <Textarea
          autoGrow
          maxRows={5}
          placeholder="Grows up to 5 rows, then scrolls…"
        />
      </div>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5 w-80">
      <Label htmlFor="bio" required>
        Bio
      </Label>
      <Textarea
        id="bio"
        placeholder="Tell us about yourself…"
        rows={4}
      />
      <Typography variant="muted">500 characters max.</Typography>
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5 w-80">
      <Label htmlFor="msg">Message</Label>
      <Textarea
        id="msg"
        aria-invalid
        defaultValue="Too short"
        rows={3}
      />
      <Typography variant="muted" className="text-zinc-700">
        Message must be at least 20 characters.
      </Typography>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <Textarea disabled placeholder="Disabled (empty)" />
      <Textarea
        disabled
        defaultValue={"Not editable\nMulti-line content\nSample."}
        rows={4}
      />
    </div>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <div className="w-80">
      <Textarea
        readOnly
        rows={4}
        defaultValue={
          "Read-only content.\nCopyable but not editable.\nThe user can still make a selection."
        }
      />
    </div>
  ),
};

export const InInputGroup: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Inside an InputGroup with `InputGroupTextarea`. `block-start` is ideal for a toolbar; `block-end` for a Send-style action bar.",
      },
    },
  },
  render: function ChatStory() {
    const [value, setValue] = React.useState("");
    return (
      <div className="w-96">
        <InputGroup>
          <InputGroupTextarea
            placeholder="Write your message…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoGrow
            maxRows={6}
            rows={2}
          />
          <InputGroupAddon align="block-end">
            <InputGroupButton size="icon-xs" aria-label="Emoji">
              <Smile />
            </InputGroupButton>
            <InputGroupButton size="icon-xs" aria-label="Attach image">
              <ImageIcon />
            </InputGroupButton>
            <InputGroupButton
              variant="solid"
              size="sm"
              className="ms-auto"
              disabled={!value.trim()}
              onClick={() => setValue("")}
            >
              <Send />
              Send
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    );
  },
};

export const RichEditor: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`block-start` formatting toolbar + textarea — a simple rich-editor template.",
      },
    },
  },
  render: () => (
    <div className="w-96">
      <InputGroup>
        <InputGroupAddon align="block-start">
          <InputGroupButton size="icon-xs" aria-label="Bold">
            <Bold />
          </InputGroupButton>
          <InputGroupButton size="icon-xs" aria-label="Italic">
            <Italic />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupTextarea
          placeholder="Article body…"
          rows={6}
          autoGrow
          maxRows={12}
        />
      </InputGroup>
    </div>
  ),
};
