import type { Meta, StoryObj } from "@storybook/react-vite";
import { Typography, type TypographyProps } from "../components/typography";
import { Separator } from "../components/separator";

const meta: Meta<typeof Typography> = {
  title: "Components/Typography",
  component: Typography,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Consistent text rendering primitive. Headings, paragraph, lead, blockquote, code, kbd; color (default / muted), align, weight, truncate, line clamping.",
      },
    },
  },
  args: {
    variant: "p",
    children: "The quick brown fox jumps over the lazy dog.",
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "p",
        "lead",
        "large",
        "small",
        "muted",
        "blockquote",
        "list",
        "code",
        "kbd",
      ],
    },
    color: { control: "select", options: ["default", "muted"] },
    align: { control: "select", options: ["left", "center", "right"] },
    weight: {
      control: "select",
      options: [
        "thin",
        "extralight",
        "light",
        "normal",
        "medium",
        "semibold",
        "bold",
        "extrabold",
        "black",
      ],
    },
    truncate: { control: "boolean" },
    lines: { control: { type: "number", min: 1, max: 10 } },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Default: Story = {};

export const Headings: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Typography variant="h1">Heading 1 — The quick brown fox jumps over the lazy dog</Typography>
      <Typography variant="h2">Heading 2 — The quick brown fox jumps over the lazy dog</Typography>
      <Typography variant="h3">Heading 3 — The quick brown fox jumps over the lazy dog</Typography>
      <Typography variant="h4">Heading 4 — The quick brown fox jumps over the lazy dog</Typography>
    </div>
  ),
};

export const BodyText: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-lg">
      <Typography variant="lead">
        Lead — A larger opening paragraph to pull the reader in.
      </Typography>
      <Typography variant="large">
        Large — Slightly larger than a regular paragraph.
      </Typography>
      <Typography variant="p">
        Paragraph — Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
        do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Typography>
      <Typography variant="small">
        Small — A smaller, secondary piece of information.
      </Typography>
      <Typography variant="muted">
        Muted — Faded content like timestamps or helper text.
      </Typography>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Typography color="default">Default — text-zinc-900</Typography>
      <Typography color="muted">Muted — text-zinc-500</Typography>
    </div>
  ),
};

export const Alignment: Story = {
  render: () => (
    <div className="flex flex-col gap-2 max-w-lg">
      <Typography align="left">Left-aligned text</Typography>
      <Typography align="center">Centered text</Typography>
      <Typography align="right">Right-aligned text</Typography>
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {(
        [
          "thin",
          "extralight",
          "light",
          "normal",
          "medium",
          "semibold",
          "bold",
          "extrabold",
          "black",
        ] as const
      ).map((weight) => (
        <Typography key={weight} weight={weight}>
          {weight.charAt(0).toUpperCase() + weight.slice(1)} — sample text
        </Typography>
      ))}
    </div>
  ),
};

export const Blockquote: Story = {
  render: () => (
    <div className="max-w-lg">
      <Typography variant="blockquote">
        "The best way to predict the future is to invent it." — Alan Kay
      </Typography>
    </div>
  ),
};

export const List: Story = {
  render: () => (
    <div className="max-w-lg">
      <Typography variant="list">
        <li>First item — short description</li>
        <li>Second item — same as the previous</li>
        <li>
          Third item — a longer paragraph also works. Lorem ipsum dolor sit
          amet, consectetur adipiscing elit.
        </li>
        <li>Fourth item</li>
      </Typography>
    </div>
  ),
};

export const OrderedList: Story = {
  render: () => (
    <div className="max-w-lg">
      <Typography variant="list" as="ol" className="list-decimal">
        <li>Install the package</li>
        <li>Add the <code className="bg-zinc-100 px-1 rounded-sm text-xs font-mono">@source</code> directive for Tailwind v4</li>
        <li>Import the component</li>
        <li>Drop it into your JSX</li>
      </Typography>
    </div>
  ),
};

export const CodeAndKbd: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-lg">
      <Typography>
        Install the package via{" "}
        <Typography variant="code" as="span">
          npm install eglador-ui-react
        </Typography>
        .
      </Typography>
      <Typography>
        To copy, press{" "}
        <Typography variant="kbd" as="span">
          Ctrl
        </Typography>{" "}
        +{" "}
        <Typography variant="kbd" as="span">
          C
        </Typography>
        .
      </Typography>
    </div>
  ),
};

export const Truncate: Story = {
  render: (args: TypographyProps) => (
    <div className="max-w-xs">
      <Typography {...args} truncate>
        This is a long line of text that should be truncated with an ellipsis
        when it exceeds the container width.
      </Typography>
    </div>
  ),
};

export const LineClamp: Story = {
  render: (args: TypographyProps) => {
    const text =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
    return (
      <div className="flex flex-col gap-4 max-w-sm">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="flex flex-col gap-1">
            <span className="text-xs text-zinc-400">lines = {n}</span>
            <Typography {...args} lines={n}>
              {text}
            </Typography>
          </div>
        ))}
      </div>
    );
  },
};

export const CustomElement: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Typography variant="h3" as="div">
        Rendered as a div with H3 styling
      </Typography>
      <Typography variant="p" as="span">
        Rendered as a span with paragraph styling
      </Typography>
    </div>
  ),
};

export const ArticleExample: Story = {
  render: () => (
    <article className="max-w-xl flex flex-col gap-4">
      <Typography variant="h1">Building Modern UIs</Typography>
      <Typography variant="lead" color="muted">
        A comprehensive guide to building beautiful, accessible user
        interfaces with React and Tailwind CSS.
      </Typography>
      <Separator />
      <Typography>
        Modern web development has evolved significantly in the past decade.
        Component-based architectures have become the norm, letting developers
        compose complex UIs from small, reusable pieces.
      </Typography>
      <Typography variant="h2">Getting started</Typography>
      <Typography>
        To begin, install the dependencies with{" "}
        <Typography variant="code" as="span">
          npm install
        </Typography>
        . That sets up everything you need to start building components.
      </Typography>
      <Typography variant="blockquote">
        "Simplicity is the ultimate sophistication." — Leonardo da Vinci
      </Typography>
      <Typography variant="muted">May 12, 2026 · 5 min read</Typography>
    </article>
  ),
};

export const RTL: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "RTL (right-to-left) direction. Because blockquote uses `border-s-4` and lists use `ms-6` (logical Tailwind classes), the direction is automatically inferred from the parent's `dir` attribute.",
      },
    },
  },
  render: () => (
    <div dir="rtl" className="flex flex-col gap-4 max-w-xl">
      <Typography variant="h1">واجهات حديثة</Typography>
      <Typography variant="lead" color="muted">
        دليل شامل لإنشاء واجهات مستخدم جميلة وسهلة الوصول إليها باستخدام React و Tailwind.
      </Typography>
      <Typography>
        تطورت تطوير الويب الحديث بشكل ملحوظ في العقد الماضي. أصبحت معماريات
        المكونات معيارًا.
      </Typography>
      <Typography variant="blockquote">
        "البساطة هي الذوق الأمثل." — ليوناردو دا فينشي
      </Typography>
      <Typography variant="list">
        <li>أولاً، قم بتثبيت الحزمة</li>
        <li>ثانياً، أضف Tailwind v4</li>
        <li>ثالثاً، استورد المكون</li>
      </Typography>
    </div>
  ),
};
