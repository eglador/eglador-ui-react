import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { ChevronsUpDown, Plus, Minus } from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  type CollapsibleProps,
} from "../components/collapsible";
import { Button } from "../components/button";

const meta: Meta<typeof Collapsible> = {
  title: "Components/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Headless show/hide primitive. Single open/close panel without the grouping logic of Accordion. `<Collapsible>` + `<CollapsibleTrigger>` + `<CollapsibleContent>`. Supports `asChild` for fully custom triggers, controlled + uncontrolled, smooth grid-rows animation, `forceMount` for SSR/SEO content.",
      },
    },
  },
  args: {
    defaultOpen: false,
    disabled: false,
  },
  argTypes: {
    defaultOpen: { control: "boolean" },
    disabled: { control: "boolean" },
    onOpenChange: { action: "openChanged" },
  },
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  render: (args: CollapsibleProps) => (
    <Collapsible {...args} className="w-[480px] space-y-2">
      <div className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 px-4 py-3">
        <div className="text-sm font-medium text-zinc-900">
          @alex starred 3 repositories
        </div>
        <CollapsibleTrigger asChild>
          <Button size="xs" variant="ghost" aria-label="Toggle">
            <ChevronsUpDown />
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border border-zinc-200 px-4 py-3 text-sm text-zinc-700">
        @alex/dotfiles
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border border-zinc-200 px-4 py-3 text-sm text-zinc-700">
          @alex/eslint-config
        </div>
        <div className="rounded-md border border-zinc-200 px-4 py-3 text-sm text-zinc-700">
          @alex/lambda-builder
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const PlainTrigger: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Without `asChild`, `<CollapsibleTrigger>` renders a native `<button>` you can style directly.",
      },
    },
  },
  render: () => (
    <Collapsible className="w-[480px]">
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-md border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50">
        <span>What's included in the free plan?</span>
        <ChevronsUpDown className="size-4 text-zinc-500" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pt-3 text-sm text-zinc-600 leading-relaxed">
        <p>
          The free plan includes up to 3 workspaces, unlimited public projects,
          and community support. Paid plans add private projects, SSO, and
          priority support.
        </p>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const DefaultOpen: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Set `defaultOpen` to expand on first render. Useful for highlighting the most relevant section in an FAQ or onboarding flow.",
      },
    },
  },
  render: () => (
    <Collapsible defaultOpen className="w-[480px]">
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-md border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50">
        <span>Advanced settings</span>
        <ChevronsUpDown className="size-4 text-zinc-500" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pt-3 text-sm text-zinc-600 leading-relaxed">
        <p>
          Expanded on mount via <code className="bg-zinc-100 px-1 py-0.5 rounded-sm font-mono text-xs">defaultOpen</code>.
        </p>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const AsChild: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`asChild` projects the trigger props onto the immediate child instead of rendering a button — useful when you want a Button, Link, or any custom element to act as the trigger.",
      },
    },
  },
  render: () => (
    <Collapsible className="w-[480px] space-y-3">
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-between">
          Show release notes
          <ChevronsUpDown className="ms-2 size-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="rounded-md border border-zinc-200 p-4 text-sm text-zinc-600 leading-relaxed space-y-2">
          <p>
            <strong className="text-zinc-900">v1.0.0-alpha.4</strong> — Added
            Accordion, Tabs, Notification, Collapsible.
          </p>
          <p>
            <strong className="text-zinc-900">v1.0.0-alpha.3</strong> — Variant
            naming consolidated to solid/soft/outline/ghost/link.
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="w-[480px] space-y-3">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          State:{" "}
          <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">
            {open ? "open" : "closed"}
          </code>
          <button
            type="button"
            className="ms-auto text-xs underline text-zinc-700"
            onClick={() => setOpen((v) => !v)}
          >
            Toggle externally
          </button>
        </div>
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-md border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50">
            <span>External state controls this</span>
            {open ? (
              <Minus className="size-4 text-zinc-500" />
            ) : (
              <Plus className="size-4 text-zinc-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pt-3 text-sm text-zinc-600 leading-relaxed">
            <p>
              The parent component owns the open/closed state via{" "}
              <code className="bg-zinc-100 px-1 py-0.5 rounded-sm font-mono text-xs">
                open
              </code>{" "}
              and{" "}
              <code className="bg-zinc-100 px-1 py-0.5 rounded-sm font-mono text-xs">
                onOpenChange
              </code>
              .
            </p>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Collapsible disabled className="w-[480px]">
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-md border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-900">
        <span>Locked panel</span>
        <ChevronsUpDown className="size-4 text-zinc-500" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pt-3 text-sm text-zinc-600 leading-relaxed">
        <p>You can't reach this — disabled at root.</p>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const ForceMount: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pass `forceMount` to keep content in the DOM even when closed — useful for SEO/SSR-critical text and content that should be searchable by the browser's find-in-page.",
      },
    },
  },
  render: () => (
    <Collapsible className="w-[480px]">
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-md border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50">
        <span>Try Ctrl+F for "indexable"</span>
        <ChevronsUpDown className="size-4 text-zinc-500" />
      </CollapsibleTrigger>
      <CollapsibleContent forceMount className="px-4 pt-3 text-sm text-zinc-600 leading-relaxed">
        <p>
          This text stays in the DOM even when the panel is collapsed. The
          word <strong>indexable</strong> is reachable by find-in-page and
          visible to crawlers.
        </p>
      </CollapsibleContent>
    </Collapsible>
  ),
};
