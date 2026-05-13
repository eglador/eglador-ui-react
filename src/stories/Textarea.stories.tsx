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
          "Multi-line text input. 3 variant (outline / soft / ghost), 5 size, 2 shape, 4 resize davranışı (none/vertical/horizontal/both), `autoGrow` + `maxRows` ile içerik kadar büyüme. InputGroup içinde `InputGroupTextarea` ile kullanılabilir (block-end addon ile toolbar/Send pattern).",
      },
    },
  },
  args: {
    placeholder: "Bir şeyler yazın…",
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
          "`autoGrow` → içerik kadar yükseklik. `maxRows` ile tavan sınırı; üstüne çıkarsa scroll.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div>
        <Label className="mb-1.5 block">Sınırsız auto-grow</Label>
        <Textarea autoGrow placeholder="Yazmaya başlayın, kutu kendini büyütür…" />
      </div>
      <div>
        <Label className="mb-1.5 block">maxRows=5 (üstü scroll)</Label>
        <Textarea
          autoGrow
          maxRows={5}
          placeholder="5 satıra kadar büyür, sonra scroll…"
        />
      </div>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5 w-80">
      <Label htmlFor="bio" required>
        Biyografi
      </Label>
      <Textarea
        id="bio"
        placeholder="Kendinizden kısaca bahsedin…"
        rows={4}
      />
      <Typography variant="muted">En fazla 500 karakter.</Typography>
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5 w-80">
      <Label htmlFor="msg">Mesaj</Label>
      <Textarea
        id="msg"
        aria-invalid
        defaultValue="Çok kısa"
        rows={3}
      />
      <Typography variant="muted" className="text-zinc-700">
        Mesaj en az 20 karakter olmalı.
      </Typography>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <Textarea disabled placeholder="Devre dışı (boş)" />
      <Textarea
        disabled
        defaultValue={"Düzenlenemez\nÇok satırlı içerik\nÖrnek."}
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
          "Salt okunur içerik.\nKopyalanabilir ama düzenlenemez.\nKullanıcı seçim yapabilir."
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
          "InputGroup içinde `InputGroupTextarea` ile birlikte. `block-start` toolbar, `block-end` Send butonu için ideal.",
      },
    },
  },
  render: function ChatStory() {
    const [value, setValue] = React.useState("");
    return (
      <div className="w-96">
        <InputGroup>
          <InputGroupTextarea
            placeholder="Mesajınızı yazın…"
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
            <InputGroupButton size="icon-xs" aria-label="Görsel ekle">
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
              Gönder
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
          "`block-start` formatting toolbar + textarea — basit rich editor şablonu.",
      },
    },
  },
  render: () => (
    <div className="w-96">
      <InputGroup>
        <InputGroupAddon align="block-start">
          <InputGroupButton size="icon-xs" aria-label="Kalın">
            <Bold />
          </InputGroupButton>
          <InputGroupButton size="icon-xs" aria-label="İtalik">
            <Italic />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupTextarea
          placeholder="Makale içeriği…"
          rows={6}
          autoGrow
          maxRows={12}
        />
      </InputGroup>
    </div>
  ),
};
