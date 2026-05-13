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
          "Buton. 5 varyant (solid / soft / outline / ghost / link), 5 boyut (xs/sm/md/lg/xl), 3 şekil (square/rounded/circle), sol/sağ icon, loading + active + disabled state. Ayrıca `buttonVariants()` helper'ı ile `<a>` etiketini buton gibi stillemek mümkün.",
      },
    },
  },
  args: {
    children: "Buton",
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
        Şifrenizi mi unuttunuz?{" "}
        <Button {...args}>Yardım al</Button>
      </p>
      <p className="text-sm text-zinc-600">
        Hesap oluştur veya{" "}
        <Button {...args} active>
          giriş yap
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
          "`buttonVariants()` helper'ı `<a>` veya `<Link>` elementine buton stilini uygular. Base UI / Radix Slot dep'i gerekmeden semantik `<a>` korunur (role=link, href çalışır).",
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
        GitHub'a git
      </a>
      <a
        href="#docs"
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        Dokümanlar
      </a>
      <a
        href="#"
        className={buttonVariants({ variant: "ghost", size: "xs" })}
      >
        Yardım
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
        Yeni öğe
      </Button>
      <Button {...args} variant="soft" icon={<Download />}>
        İndir
      </Button>
      <Button {...args} variant="outline" icon={<Settings />}>
        Ayarlar
      </Button>
      <Button {...args} variant="ghost" icon={<Trash2 />}>
        Sil
      </Button>
    </div>
  ),
};

export const WithRightIcon: Story = {
  render: (args: ButtonProps) => (
    <div className="flex gap-2 items-center flex-wrap">
      <Button {...args} iconRight={<ArrowRight />}>
        Devam et
      </Button>
      <Button {...args} variant="soft" iconRight={<Download />}>
        Dosya indir
      </Button>
      <Button {...args} variant="outline" iconRight={<Plus />}>
        Ekle
      </Button>
    </div>
  ),
};

export const IconOnly: Story = {
  args: { children: undefined },
  render: (args: ButtonProps) => (
    <div className="flex gap-2 items-center">
      <Button {...args} icon={<Settings />} aria-label="Ayarlar" />
      <Button {...args} icon={<Plus />} aria-label="Ekle" variant="soft" />
      <Button {...args} icon={<Trash2 />} aria-label="Sil" variant="outline" />
      <Button {...args} icon={<Heart />} aria-label="Beğen" shape="circle" />
      <Button {...args} icon={<Download />} aria-label="İndir" variant="ghost" />
    </div>
  ),
};

export const Loading: Story = {
  render: (args: ButtonProps) => (
    <div className="flex gap-2 items-center flex-wrap">
      <Button {...args} loading>
        Kaydediliyor…
      </Button>
      <Button {...args} variant="soft" loading>
        Yükleniyor
      </Button>
      <Button {...args} variant="outline" loading icon={<Trash2 />} />
      <Button {...args} variant="ghost" loading>
        Bekleyin
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
        placeholder="ornek@domain.com"
        className="h-9 px-3 text-sm rounded-sm border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1"
      />
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" type="reset">
          İptal
        </Button>
        <Button type="submit">Gönder</Button>
      </div>
    </form>
  ),
};
