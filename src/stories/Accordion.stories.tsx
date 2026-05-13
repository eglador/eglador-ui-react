import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { ShieldCheck, Bell, CreditCard, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  type AccordionProps,
} from "../components/accordion";
import { Badge } from "../components/badge";

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Compound accordion with grouped items. `<Accordion>` + `<AccordionItem>` + `<AccordionTrigger>` + `<AccordionContent>`. Single or multiple expand via `type`, optional `collapsible` for single mode, 3 variants (underline / outline / soft), 5 sizes, controlled + uncontrolled, full keyboard nav (Arrow / Home / End / Enter / Space), smooth grid-rows animation.",
      },
    },
  },
  args: {
    type: "single",
    collapsible: true,
    variant: "underline",
    size: "md",
    shape: "rounded",
    iconPosition: "end",
    indicator: "chevron",
    disabled: false,
  },
  argTypes: {
    type: { control: "select", options: ["single", "multiple"] },
    collapsible: { control: "boolean" },
    variant: {
      control: "select",
      options: ["underline", "outline", "soft"],
    },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    shape: { control: "select", options: ["square", "rounded"] },
    iconPosition: { control: "select", options: ["start", "end"] },
    indicator: {
      control: "select",
      options: ["chevron", "plus-minus", "none"],
    },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: (args) => (
    <Accordion
      type="single"
      collapsible
      variant={(args as AccordionProps).variant}
      size={(args as AccordionProps).size}
      shape={(args as AccordionProps).shape}
      iconPosition={(args as AccordionProps).iconPosition}
      indicator={(args as AccordionProps).indicator}
      disabled={(args as AccordionProps).disabled}
      defaultValue="installation"
      className="w-[640px]"
    >
      <AccordionItem value="installation">
        <AccordionTrigger>How do I install eglador-ui-react?</AccordionTrigger>
        <AccordionContent>
          <p>
            Install the package with your preferred package manager:
            <code className="ms-1 bg-zinc-100 px-1 py-0.5 rounded-sm font-mono text-xs">
              npm install eglador-ui-react
            </code>
            . The library ships React 18+ components, TypeScript definitions,
            and zero runtime dependencies — clsx and tailwind-merge are
            pre-bundled.
          </p>
          <p className="mt-2">
            Tailwind v4 needs to scan the package classes. Add
            <code className="mx-1 bg-zinc-100 px-1 py-0.5 rounded-sm font-mono text-xs">
              @source "../node_modules/eglador-ui-react";
            </code>
            to your global stylesheet after the
            <code className="mx-1 bg-zinc-100 px-1 py-0.5 rounded-sm font-mono text-xs">
              @import "tailwindcss";
            </code>
            line.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="theming">
        <AccordionTrigger>Can I customize the colors?</AccordionTrigger>
        <AccordionContent>
          <p>
            The library is zinc-only by design. A separate theme layer is
            planned but not yet shipped — until then, override classes via the
            <code className="mx-1 bg-zinc-100 px-1 py-0.5 rounded-sm font-mono text-xs">
              className
            </code>
            prop on any component. tailwind-merge resolves conflicts, so your
            classes win over the defaults.
          </p>
          <p className="mt-2">
            All components expose
            <code className="mx-1 bg-zinc-100 px-1 py-0.5 rounded-sm font-mono text-xs">
              data-slot
            </code>
            attributes you can target with CSS for fine-grained overrides.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="ssr">
        <AccordionTrigger>Does it work with Next.js Server Components?</AccordionTrigger>
        <AccordionContent>
          <p>
            Components that use state are marked
            <code className="mx-1 bg-zinc-100 px-1 py-0.5 rounded-sm font-mono text-xs">
              "use client"
            </code>
            and need to live inside a client boundary. Display-only components
            (Badge, Avatar, Typography, Skeleton, etc.) work in both Server and
            Client trees.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="rtl">
        <AccordionTrigger>Is RTL supported?</AccordionTrigger>
        <AccordionContent>
          <p>
            Yes. All horizontal spacing uses Tailwind logical properties (
            <code className="mx-1 bg-zinc-100 px-1 py-0.5 rounded-sm font-mono text-xs">
              ps-*
            </code>
            ,
            <code className="mx-1 bg-zinc-100 px-1 py-0.5 rounded-sm font-mono text-xs">
              me-*
            </code>
            ,
            <code className="mx-1 bg-zinc-100 px-1 py-0.5 rounded-sm font-mono text-xs">
              border-s
            </code>
            ). Set
            <code className="mx-1 bg-zinc-100 px-1 py-0.5 rounded-sm font-mono text-xs">
              dir="rtl"
            </code>
            on a parent element and the entire library mirrors.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-[640px]">
      {(["underline", "outline", "soft"] as const).map((variant) => (
        <div key={variant} className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            variant: {variant}
          </div>
          <Accordion variant={variant} defaultValue="a">
            <AccordionItem value="a">
              <AccordionTrigger>First section</AccordionTrigger>
              <AccordionContent>
                <p>
                  Content for the first section. The {variant} variant changes
                  how items are visually separated.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>Second section</AccordionTrigger>
              <AccordionContent>
                <p>Second panel content.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="c">
              <AccordionTrigger>Third section</AccordionTrigger>
              <AccordionContent>
                <p>Third panel content.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[640px]">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Accordion key={size} size={size} variant="outline" defaultValue="a">
          <AccordionItem value="a">
            <AccordionTrigger>size = {size}</AccordionTrigger>
            <AccordionContent>
              <p>
                Padding, chevron and font scale with the size prop. Use larger
                sizes for prominent FAQs, smaller for dense settings panels.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  ),
};

export const MultipleOpen: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Set `type=\"multiple\"` to allow several panels to stay open at once. `value` and `defaultValue` become string arrays.",
      },
    },
  },
  render: () => (
    <Accordion
      type="multiple"
      defaultValue={["a", "c"]}
      variant="outline"
      className="w-[640px]"
    >
      <AccordionItem value="a">
        <AccordionTrigger>A — open by default</AccordionTrigger>
        <AccordionContent>
          <p>Multiple sections can be open simultaneously.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>B — closed</AccordionTrigger>
        <AccordionContent>
          <p>Toggle independently of other panels.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>C — open by default</AccordionTrigger>
        <AccordionContent>
          <p>Default array controls which items start expanded.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const WithIconsAndExtra: Story = {
  render: () => (
    <Accordion type="multiple" variant="soft" className="w-[640px]">
      <AccordionItem value="security">
        <AccordionTrigger
          icon={<ShieldCheck />}
          extra={<Badge size="xs">Critical</Badge>}
        >
          Security
        </AccordionTrigger>
        <AccordionContent>
          <p>
            Two-factor authentication is enabled. Review your recovery codes
            and active sessions periodically.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="notifications">
        <AccordionTrigger
          icon={<Bell />}
          extra={<Badge variant="outline" size="xs">3 new</Badge>}
        >
          Notifications
        </AccordionTrigger>
        <AccordionContent>
          <p>
            Choose how you want to be notified. Email, push, and in-app
            channels can be muted independently.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="billing">
        <AccordionTrigger icon={<CreditCard />}>Billing</AccordionTrigger>
        <AccordionContent>
          <p>
            Manage your subscription, invoices, and payment methods. Plan
            changes take effect on the next billing cycle.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="help" disabled>
        <AccordionTrigger icon={<HelpCircle />}>
          Help & support (disabled)
        </AccordionTrigger>
        <AccordionContent>
          <p>This panel is disabled.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const InitialOpenState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Set `defaultValue` (string for `type=\"single\"`, string[] for `type=\"multiple\"`) to control which item(s) start expanded. Below: `defaultValue=\"b\"` makes the second item active on mount.",
      },
    },
  },
  render: () => (
    <Accordion defaultValue="b" variant="outline" className="w-[640px]">
      <AccordionItem value="a">
        <AccordionTrigger>Section A — closed by default</AccordionTrigger>
        <AccordionContent>
          <p>Renders closed; user must click to expand.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Section B — open by default</AccordionTrigger>
        <AccordionContent>
          <p>
            <code className="bg-zinc-100 px-1 py-0.5 rounded-sm font-mono text-xs">
              defaultValue="b"
            </code>{" "}
            makes this panel active on first mount. Use <code className="bg-zinc-100 px-1 py-0.5 rounded-sm font-mono text-xs">defaultValue={"{['a','b']}"}</code> with{" "}
            <code className="bg-zinc-100 px-1 py-0.5 rounded-sm font-mono text-xs">type="multiple"</code>{" "}
            to open several at once.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>Section C — closed by default</AccordionTrigger>
        <AccordionContent>
          <p>Same as section A.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const IconPosition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Place the indicator at the inline-start (leading) or inline-end (trailing) of the trigger. Defaults to `end`.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 w-[640px]">
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          iconPosition: end (default)
        </div>
        <Accordion variant="outline" defaultValue="a">
          <AccordionItem value="a">
            <AccordionTrigger>Trailing chevron</AccordionTrigger>
            <AccordionContent>
              <p>Chevron sits at the inline-end edge.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Another item</AccordionTrigger>
            <AccordionContent>
              <p>Same layout.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          iconPosition: start
        </div>
        <Accordion variant="outline" iconPosition="start" defaultValue="a">
          <AccordionItem value="a">
            <AccordionTrigger>Leading chevron</AccordionTrigger>
            <AccordionContent>
              <p>Chevron is shown before the title — common for tree views.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Another item</AccordionTrigger>
            <AccordionContent>
              <p>Same layout.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  ),
};

export const Indicators: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Switch the expand/collapse indicator. `chevron` (default), `plus-minus`, or `none`. Each `AccordionTrigger` can also override the root via its own `indicator` prop — pass any ReactNode for a fully custom marker.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 w-[640px]">
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          indicator: plus-minus
        </div>
        <Accordion variant="outline" indicator="plus-minus" defaultValue="a">
          <AccordionItem value="a">
            <AccordionTrigger>FAQ — billing</AccordionTrigger>
            <AccordionContent>
              <p>Plus when closed, minus when open.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>FAQ — shipping</AccordionTrigger>
            <AccordionContent>
              <p>Common pattern on marketing FAQ pages.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          indicator: none
        </div>
        <Accordion variant="outline" indicator="none" defaultValue="a">
          <AccordionItem value="a">
            <AccordionTrigger>No marker</AccordionTrigger>
            <AccordionContent>
              <p>Useful when the title itself acts as the affordance.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Another item</AccordionTrigger>
            <AccordionContent>
              <p>No chevron, no plus-minus.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          per-trigger override
        </div>
        <Accordion variant="outline" defaultValue="a">
          <AccordionItem value="a">
            <AccordionTrigger indicator="plus-minus">
              Plus / minus (per-trigger)
            </AccordionTrigger>
            <AccordionContent>
              <p>Overrides the root `indicator` only on this trigger.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Default chevron</AccordionTrigger>
            <AccordionContent>
              <p>Other triggers stay on the root setting.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  ),
};

export const DisabledRoot: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pass `disabled` on the root `<Accordion>` to lock every item. Per-item `disabled` still works for partial locking.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 w-[640px]">
      <Accordion disabled variant="outline" defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>All items locked</AccordionTrigger>
          <AccordionContent>
            <p>Root-level `disabled` cascades to every trigger.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Second item</AccordionTrigger>
          <AccordionContent>
            <p>Also locked.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = React.useState<string>("a");
    return (
      <div className="flex flex-col gap-3 w-[640px]">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          Active:{" "}
          <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">
            {value || "(none)"}
          </code>
          <button
            type="button"
            className="ms-auto text-xs underline text-zinc-700"
            onClick={() => setValue("c")}
          >
            Open C
          </button>
          <button
            type="button"
            className="text-xs underline text-zinc-700"
            onClick={() => setValue("")}
          >
            Close all
          </button>
        </div>
        <Accordion
          type="single"
          collapsible
          value={value}
          onValueChange={setValue}
          variant="outline"
        >
          <AccordionItem value="a">
            <AccordionTrigger>Panel A</AccordionTrigger>
            <AccordionContent>
              <p>Controlled by external state.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Panel B</AccordionTrigger>
            <AccordionContent>
              <p>Controlled by external state.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="c">
            <AccordionTrigger>Panel C</AccordionTrigger>
            <AccordionContent>
              <p>Controlled by external state.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  },
};

export const NonCollapsibleSingle: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "When `type=\"single\"` and `collapsible={false}`, clicking the open item does not close it — one panel is always open.",
      },
    },
  },
  render: () => (
    <Accordion
      type="single"
      collapsible={false}
      defaultValue="a"
      variant="outline"
      className="w-[640px]"
    >
      <AccordionItem value="a">
        <AccordionTrigger>Step 1 — choose a plan</AccordionTrigger>
        <AccordionContent>
          <p>Pick the tier that fits your team.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Step 2 — add billing details</AccordionTrigger>
        <AccordionContent>
          <p>Provide a credit card or invoice address.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>Step 3 — invite teammates</AccordionTrigger>
        <AccordionContent>
          <p>Send invitations and assign roles.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
