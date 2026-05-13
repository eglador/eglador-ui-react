import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Download, Mail, FileText } from "lucide-react";
import { Link, type LinkProps } from "../components/link";
import { buttonVariants } from "../components/button";

const meta: Meta<typeof Link> = {
  title: "Components/Link",
  component: Link,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Inline link component. Underline modes (hover / always / none), 5 sizes (xs / sm / md / lg / xl), left/right icons, `external` (auto `_blank` + `rel=noopener noreferrer` + ExternalLinkIcon), `disabled`. For a button-styled link, use `buttonVariants()` on an `<a>` element instead of `Link`.",
      },
    },
  },
  args: {
    children: "Click here",
    href: "#",
    underline: "hover",
    size: "sm",
    external: false,
    disabled: false,
  },
  argTypes: {
    underline: { control: "select", options: ["hover", "always", "none"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    external: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {};

export const Underlines: Story = {
  render: (args: LinkProps) => (
    <div className="flex gap-6 flex-wrap">
      <Link {...args} underline="hover">
        hover (default)
      </Link>
      <Link {...args} underline="always">
        always
      </Link>
      <Link {...args} underline="none">
        none
      </Link>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args: LinkProps) => (
    <div className="flex gap-6 items-center flex-wrap">
      <Link {...args} size="xs">
        Extra Small
      </Link>
      <Link {...args} size="sm">
        Small
      </Link>
      <Link {...args} size="md">
        Medium
      </Link>
      <Link {...args} size="lg">
        Large
      </Link>
      <Link {...args} size="xl">
        Extra Large
      </Link>
    </div>
  ),
};

export const WithLeftIcon: Story = {
  render: (args: LinkProps) => (
    <div className="flex gap-6 flex-wrap">
      <Link {...args} icon={<Mail />}>
        Contact us
      </Link>
      <Link {...args} icon={<Download />}>
        Download
      </Link>
      <Link {...args} icon={<FileText />}>
        Documentation
      </Link>
    </div>
  ),
};

export const WithRightIcon: Story = {
  render: (args: LinkProps) => (
    <div className="flex gap-6 flex-wrap">
      <Link {...args} iconRight={<ArrowRight />}>
        Learn more
      </Link>
      <Link {...args} iconRight={<ArrowRight />} underline="always">
        All articles
      </Link>
    </div>
  ),
};

export const External: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`external` → auto `target=\"_blank\"` + `rel=\"noopener noreferrer\"` + a trailing `ExternalLinkIcon`. If you pass `iconRight`, it overrides the external icon.",
      },
    },
  },
  render: (args: LinkProps) => (
    <div className="flex flex-col gap-2 items-start">
      <Link {...args} href="https://github.com" external>
        GitHub
      </Link>
      <Link {...args} href="https://npmjs.com" external>
        npm
      </Link>
      <Link {...args} href="https://tailwindcss.com" external underline="always">
        Tailwind CSS (always underlined)
      </Link>
    </div>
  ),
};

export const Disabled: Story = {
  render: (args: LinkProps) => (
    <div className="flex gap-6 flex-wrap">
      <Link {...args} disabled>
        Disabled
      </Link>
      <Link {...args} disabled icon={<Download />}>
        Download
      </Link>
    </div>
  ),
};

export const InText: Story = {
  render: (args: LinkProps) => (
    <div className="flex flex-col gap-2 max-w-md text-sm text-zinc-600">
      <p>
        For more details, check the{" "}
        <Link {...args} href="#" underline="hover">
          documentation
        </Link>{" "}
        or browse the{" "}
        <Link {...args} href="#" external>
          GitHub repo
        </Link>
        .
      </p>
      <p>
        To manage your account, head over to{" "}
        <Link {...args} href="#" underline="always">
          settings
        </Link>
        .
      </p>
    </div>
  ),
};

export const AsButton: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "If you need a link styled like a button, use `<a>` + `buttonVariants()` instead of `Link`. This preserves the semantic `role=link` (the Button component forces `role=button`).",
      },
    },
  },
  render: () => (
    <div className="flex gap-2 items-center flex-wrap">
      <a
        href="https://github.com/eglador"
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: "solid" })}
      >
        Solid (anchor)
      </a>
      <a href="#" className={buttonVariants({ variant: "outline", size: "sm" })}>
        Outline sm
      </a>
      <a href="#" className={buttonVariants({ variant: "ghost", size: "xs" })}>
        Ghost xs
      </a>
    </div>
  ),
};
