import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { TagInput, type TagInputProps } from "../components/tag-input";

const meta: Meta<typeof TagInput> = {
  title: "Components/TagInput",
  component: TagInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Free-text tag entry. Type and press Enter (or any of the configured delimiters) to commit a tag. Backspace at the empty input removes the last tag; ←/→ navigate between chips, Delete removes the focused chip. Paste with newlines or delimiters auto-splits into multiple tags. Controlled + uncontrolled, validation, duplicate prevention, maxTags, paste-splitting, custom chip renderer.",
      },
    },
  },
  args: {
    size: "md",
    variant: "outline",
    shape: "rounded",
    allowDuplicates: false,
    splitOnPaste: true,
    placeholder: "Add a tag…",
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    variant: { control: "select", options: ["outline", "soft", "ghost"] },
    shape: { control: "select", options: ["square", "rounded", "pill"] },
    delimiters: { control: "object" },
    maxTags: { control: "number" },
    allowDuplicates: { control: "boolean" },
    splitOnPaste: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    placeholder: { control: "text" },
    onValueChange: { action: "valueChanged" },
  },
};

export default meta;
type Story = StoryObj<typeof TagInput>;

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5 w-[420px]">
    <label className="text-xs font-medium text-zinc-700">{label}</label>
    {children}
    {hint && <p className="text-xs text-zinc-500">{hint}</p>}
  </div>
);

export const Default: Story = {
  render: (args: TagInputProps) => (
    <div className="w-[420px]">
      <TagInput {...args} defaultValue={["react", "typescript", "tailwind"]} />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Field label="outline">
        <TagInput
          variant="outline"
          defaultValue={["alpha", "beta"]}
          placeholder="Add a tag…"
        />
      </Field>
      <Field label="soft">
        <TagInput
          variant="soft"
          defaultValue={["alpha", "beta"]}
          placeholder="Add a tag…"
        />
      </Field>
      <Field label="ghost">
        <TagInput
          variant="ghost"
          defaultValue={["alpha", "beta"]}
          placeholder="Add a tag…"
        />
      </Field>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Field key={size} label={`size = ${size}`}>
          <TagInput
            size={size}
            defaultValue={["one", "two", "three"]}
            placeholder="Add a tag…"
          />
        </Field>
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["square", "rounded", "pill"] as const).map((shape) => (
        <Field key={shape} label={`shape = ${shape}`}>
          <TagInput
            shape={shape}
            defaultValue={["one", "two"]}
            placeholder="Add a tag…"
          />
        </Field>
      ))}
    </div>
  ),
};

export const Delimiters: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Configure extra characters that commit the draft. Enter is always active. Try typing `red, green; blue` here.",
      },
    },
  },
  render: () => (
    <Field
      label="Delimiters: Enter, comma, semicolon"
      hint="Type values separated by , or ; to commit instantly."
    >
      <TagInput
        delimiters={[",", ";"]}
        placeholder="red, green; blue…"
        defaultValue={["amber"]}
      />
    </Field>
  ),
};

export const MaxTags: Story = {
  render: () => (
    <Field
      label="maxTags = 5"
      hint="Further entries are silently rejected once the limit is reached."
    >
      <TagInput
        maxTags={5}
        defaultValue={["one", "two", "three"]}
        placeholder="Up to 5 tags…"
      />
    </Field>
  ),
};

export const AllowDuplicates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Field label="allowDuplicates = false (default)">
        <TagInput defaultValue={["alpha"]} placeholder="Try adding 'alpha' again…" />
      </Field>
      <Field label="allowDuplicates = true">
        <TagInput allowDuplicates defaultValue={["alpha"]} placeholder="Duplicates allowed…" />
      </Field>
    </div>
  ),
};

export const WithValidation: Story = {
  parameters: {
    docs: {
      description: {
        story: "Only accepts strings matching a basic email pattern.",
      },
    },
  },
  render: function ValidationStory() {
    const [tags, setTags] = React.useState<string[]>(["hello@example.com"]);
    const [hint, setHint] = React.useState<string>("");
    return (
      <Field
        label="Email addresses only"
        hint={hint || "Add a valid email and press Enter."}
      >
        <TagInput
          value={tags}
          onValueChange={(next) => {
            setTags(next);
            setHint("");
          }}
          placeholder="name@example.com"
          validate={(tag) => {
            const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tag);
            if (!ok) setHint(`"${tag}" is not a valid email.`);
            return ok;
          }}
          transform={(raw) => raw.trim().toLowerCase()}
        />
      </Field>
    );
  },
};

export const Invalid: Story = {
  render: () => (
    <Field label="aria-invalid = true">
      <TagInput
        aria-invalid
        defaultValue={["broken-state"]}
        placeholder="Add a tag…"
      />
    </Field>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field label="disabled">
      <TagInput
        disabled
        defaultValue={["read", "only"]}
        placeholder="Add a tag…"
      />
    </Field>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <Field label="readOnly">
      <TagInput
        readOnly
        defaultValue={["snapshot", "frozen"]}
        placeholder="Add a tag…"
      />
    </Field>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [tags, setTags] = React.useState<string[]>(["draft"]);
    return (
      <div className="flex flex-col gap-3 w-[420px]">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>External state:</span>
          <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">
            {JSON.stringify(tags)}
          </code>
          <button
            type="button"
            className="ms-auto text-xs underline text-zinc-700 cursor-pointer"
            onClick={() => setTags([])}
          >
            Clear
          </button>
        </div>
        <TagInput
          value={tags}
          onValueChange={setTags}
          placeholder="Add a tag…"
        />
      </div>
    );
  },
};

export const CustomTagRenderer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `renderTag` to fully control chip presentation — e.g. show a leading color dot per tag.",
      },
    },
  },
  render: () => {
    const palette = ["bg-rose-500", "bg-amber-500", "bg-emerald-500", "bg-sky-500", "bg-violet-500"];
    const hashColor = (s: string) => {
      let h = 0;
      for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
      return palette[h % palette.length];
    };
    return (
      <Field
        label="Custom chip renderer"
        hint="Each tag gets a deterministic color dot."
      >
        <TagInput
          defaultValue={["urgent", "ops", "backend"]}
          placeholder="Add a label…"
          renderTag={(tag, { remove }) => (
            <span className="inline-flex items-center gap-1.5 h-6 px-2 text-xs font-medium rounded-sm bg-zinc-100 text-zinc-800 select-none">
              <span className={`size-2 rounded-full ${hashColor(tag)}`} />
              <span>{tag}</span>
              <button
                type="button"
                tabIndex={-1}
                aria-label={`Remove ${tag}`}
                onClick={(e) => {
                  e.stopPropagation();
                  remove();
                }}
                className="inline-flex items-center justify-center size-4 rounded-sm text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 cursor-pointer"
              >
                ×
              </button>
            </span>
          )}
        />
      </Field>
    );
  },
};

export const PasteToSplit: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Paste a comma- or newline-separated list and the component splits it into multiple tags in one go. Try pasting: `react, vue, svelte, solid`",
      },
    },
  },
  render: () => (
    <Field
      label="Paste to split (delimiters: , ;)"
      hint="Try: react, vue, svelte, solid — Cmd/Ctrl+V"
    >
      <TagInput
        delimiters={[",", ";"]}
        placeholder="Paste a comma-separated list…"
      />
    </Field>
  ),
};
