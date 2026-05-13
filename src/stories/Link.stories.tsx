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
          "Inline link bileşeni. underline (hover/always/none), 5 size (xs/sm/md/lg/xl), sol/sağ icon, external (otomatik `_blank` + `rel=noopener noreferrer` + ExternalLinkIcon), disabled. Button gibi stillenmiş link için `buttonVariants()` helper'ı kullanılır.",
      },
    },
  },
  args: {
    children: "Buraya tıkla",
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
        Bize ulaşın
      </Link>
      <Link {...args} icon={<Download />}>
        İndir
      </Link>
      <Link {...args} icon={<FileText />}>
        Dokümanlar
      </Link>
    </div>
  ),
};

export const WithRightIcon: Story = {
  render: (args: LinkProps) => (
    <div className="flex gap-6 flex-wrap">
      <Link {...args} iconRight={<ArrowRight />}>
        Daha fazla
      </Link>
      <Link {...args} iconRight={<ArrowRight />} underline="always">
        Tüm makaleler
      </Link>
    </div>
  ),
};

export const External: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`external` prop → otomatik `target=\"_blank\"` + `rel=\"noopener noreferrer\"` + sağda `ExternalLinkIcon`. `iconRight` verilirse external icon yerine onu gösterir.",
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
        Devre dışı
      </Link>
      <Link {...args} disabled icon={<Download />}>
        İndir
      </Link>
    </div>
  ),
};

export const InText: Story = {
  render: (args: LinkProps) => (
    <div className="flex flex-col gap-2 max-w-md text-sm text-zinc-600">
      <p>
        Daha fazla bilgi için{" "}
        <Link {...args} href="#" underline="hover">
          dokümantasyona göz atın
        </Link>{" "}
        ya da{" "}
        <Link {...args} href="#" external>
          GitHub repo'sunu
        </Link>{" "}
        inceleyin.
      </p>
      <p>
        Hesabınızı yönetmek için{" "}
        <Link {...args} href="#" underline="always">
          ayarlar
        </Link>{" "}
        sayfasına gidin.
      </p>
    </div>
  ),
};

export const AsButton: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Button stilinde link gerekiyorsa `Link` yerine `<a>` + `buttonVariants()` kullanın. Semantik `role=link` korunur (Button bileşeni `role=button` zorlar).",
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
