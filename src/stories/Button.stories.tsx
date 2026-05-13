import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Plus,
  Trash2,
  Download,
  Settings,
  Heart,
  ArrowRight,
} from "lucide-react";
import { Button, buttonVariants, type ButtonProps } from "../components/button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Button. 5 variants (solid / soft / outline / ghost / link), 5 sizes (xs / sm / md / lg / xl), 3 shapes (square / rounded / circle), left/right icons, loading + active + disabled states. The `buttonVariants()` helper applies the same styling to `<a>` so anchors can look like buttons while keeping native link semantics.",
      },
    },
  },
  args: {
    children: "Button",
    variant: "solid",
    size: "md",
    shape: "rounded",
    loading: false,
    active: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "soft", "outline", "ghost", "link"],
    },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    shape: { control: "select", options: ["square", "rounded", "circle"] },
    loading: { control: "boolean" },
    active: { control: "boolean" },
    disabled: { control: "boolean" },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args: ButtonProps) => (
    <div className="flex gap-2 items-center flex-wrap">
      <Button {...args} variant="solid">
        Solid
      </Button>
      <Button {...args} variant="soft">
        Soft
      </Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="link">
        Link
      </Button>
    </div>
  ),
};

export const Link: Story = {
  args: { variant: "link" },
  render: (args: ButtonProps) => (
    <div className="flex flex-col gap-3 max-w-sm">
      <p className="text-sm text-zinc-600">
        Forgot your password?{" "}
        <Button {...args}>Get help</Button>
      </p>
      <p className="text-sm text-zinc-600">
        Create an account or{" "}
        <Button {...args} active>
          sign in
        </Button>
        .
      </p>
    </div>
  ),
};

export const AsLink: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The `buttonVariants()` helper applies button styling to an `<a>` or router `<Link>`. The native anchor (role=link, working `href`) is preserved without needing Radix Slot or a similar dep.",
      },
    },
  },
  render: () => (
    <div className="flex gap-2 items-center flex-wrap">
      <a
        href="https://github.com/eglador"
        target="_blank"
        rel="noreferrer noopener"
        className={buttonVariants({ variant: "solid" })}
      >
        Open GitHub
      </a>
      <a
        href="#docs"
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        Documentation
      </a>
      <a
        href="#"
        className={buttonVariants({ variant: "ghost", size: "xs" })}
      >
        Help
      </a>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args: ButtonProps) => (
    <div className="flex gap-2 items-center flex-wrap">
      <Button {...args} size="xs">
        Extra Small
      </Button>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
      <Button {...args} size="xl">
        Extra Large
      </Button>
    </div>
  ),
};

export const Shapes: Story = {
  render: (args: ButtonProps) => (
    <div className="flex gap-2 items-center">
      <Button {...args} shape="square">
        Square
      </Button>
      <Button {...args} shape="rounded">
        Rounded
      </Button>
      <Button {...args} shape="circle">
        Circle
      </Button>
    </div>
  ),
};

export const WithLeftIcon: Story = {
  render: (args: ButtonProps) => (
    <div className="flex gap-2 items-center flex-wrap">
      <Button {...args} icon={<Plus />}>
        New item
      </Button>
      <Button {...args} variant="soft" icon={<Download />}>
        Download
      </Button>
      <Button {...args} variant="outline" icon={<Settings />}>
        Settings
      </Button>
      <Button {...args} variant="ghost" icon={<Trash2 />}>
        Delete
      </Button>
    </div>
  ),
};

export const WithRightIcon: Story = {
  render: (args: ButtonProps) => (
    <div className="flex gap-2 items-center flex-wrap">
      <Button {...args} iconRight={<ArrowRight />}>
        Continue
      </Button>
      <Button {...args} variant="soft" iconRight={<Download />}>
        Download file
      </Button>
      <Button {...args} variant="outline" iconRight={<Plus />}>
        Add
      </Button>
    </div>
  ),
};

export const IconOnly: Story = {
  args: { children: undefined },
  render: (args: ButtonProps) => (
    <div className="flex gap-2 items-center">
      <Button {...args} icon={<Settings />} aria-label="Settings" />
      <Button {...args} icon={<Plus />} aria-label="Add" variant="soft" />
      <Button {...args} icon={<Trash2 />} aria-label="Delete" variant="outline" />
      <Button {...args} icon={<Heart />} aria-label="Like" shape="circle" />
      <Button {...args} icon={<Download />} aria-label="Download" variant="ghost" />
    </div>
  ),
};

export const Loading: Story = {
  render: (args: ButtonProps) => (
    <div className="flex gap-2 items-center flex-wrap">
      <Button {...args} loading>
        Saving…
      </Button>
      <Button {...args} variant="soft" loading>
        Loading
      </Button>
      <Button {...args} variant="outline" loading icon={<Trash2 />} />
      <Button {...args} variant="ghost" loading>
        Please wait
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args: ButtonProps) => (
    <div className="flex gap-2 items-center flex-wrap">
      <Button {...args}>Solid</Button>
      <Button {...args} variant="soft">
        Soft
      </Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
    </div>
  ),
};

export const Active: Story = {
  render: (args: ButtonProps) => (
    <div className="flex gap-2 items-center flex-wrap">
      <Button {...args} active>
        Solid · active
      </Button>
      <Button {...args} variant="soft" active>
        Soft · active
      </Button>
      <Button {...args} variant="outline" active>
        Outline · active
      </Button>
      <Button {...args} variant="ghost" active>
        Ghost · active
      </Button>
      <Button {...args} variant="link" active>
        Link · active
      </Button>
    </div>
  ),
};

export const FormSubmit: Story = {
  render: () => (
    <form className="flex flex-col gap-3 max-w-xs" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        placeholder="you@example.com"
        className="h-9 px-3 text-sm rounded-sm border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1"
      />
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" type="reset">
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  ),
};
