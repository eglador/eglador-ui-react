import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Cloud,
  FolderPlus,
  Bell,
  Search,
  FileX,
  ShieldX,
  WifiOff,
  Import,
} from "lucide-react";
import { Empty, type EmptyProps } from "../components/empty";

const meta: Meta<typeof Empty> = {
  title: "Components/Empty",
  component: Empty,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Veri yokken gösterilen empty state. Dairesel arka planda icon, opsiyonel title / description / action. 3 boyut (sm / md / lg).",
      },
    },
  },
  args: {
    size: "md",
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    title: { control: "text" },
    description: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Empty>;

const btnPrimary =
  "inline-flex items-center gap-1.5 h-7 px-2.5 text-xs font-medium rounded-sm bg-zinc-900 text-white hover:bg-zinc-700 cursor-pointer";
const btnOutline =
  "inline-flex items-center gap-1.5 h-7 px-2.5 text-xs font-medium rounded-sm border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 cursor-pointer";

export const Default: Story = {
  args: {
    title: "Veri yok",
    description: "Şu anda gösterilecek veri bulunmuyor.",
  },
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-sm max-w-md">
      <Empty {...args} />
    </div>
  ),
};

export const CloudStorage: Story = {
  args: {
    title: "Bulut depolama boş",
    description: "Dosyalarınıza her yerden erişmek için bulut depolamaya yükleyin.",
  },
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-sm max-w-md">
      <Empty
        {...args}
        icon={<Cloud strokeWidth={1} />}
        action={
          <button type="button" className={btnPrimary}>
            Dosya yükle
          </button>
        }
      />
    </div>
  ),
};

export const NoProjects: Story = {
  args: {
    title: "Henüz proje yok",
    description: "Henüz bir proje oluşturmadınız. İlk projenizi oluşturarak başlayın.",
  },
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-sm max-w-md">
      <Empty {...args} icon={<FolderPlus strokeWidth={1} />}>
        <div className="flex gap-2 mt-1">
          <button type="button" className={btnPrimary}>
            Proje oluştur
          </button>
          <button type="button" className={btnOutline}>
            <Import className="size-3.5" />
            İçe aktar
          </button>
        </div>
      </Empty>
    </div>
  ),
};

export const NoNotifications: Story = {
  args: {
    title: "Bildirim yok",
    description: "Her şey güncel. Yeni bildirimler burada görünecek.",
  },
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-sm max-w-md">
      <Empty
        {...args}
        icon={<Bell strokeWidth={1} />}
        action={
          <button type="button" className={btnOutline}>
            Yenile
          </button>
        }
      />
    </div>
  ),
};

export const NotFound: Story = {
  args: {
    size: "lg",
    title: "404 — Sayfa bulunamadı",
    description: "Aradığınız sayfa mevcut değil. Aşağıdan arama yapabilirsiniz.",
  },
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-sm max-w-lg">
      <Empty {...args}>
        <div className="flex flex-col items-center gap-3 mt-1 w-full max-w-xs">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400" />
            <input
              type="search"
              placeholder="Sayfa ara…"
              className="w-full h-8 pl-8 pr-2.5 text-xs rounded-sm border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1"
            />
          </div>
          <span className="text-xs text-zinc-400">
            Yardım için{" "}
            <a href="#" className="text-zinc-700 underline underline-offset-2">
              destek
            </a>
            .
          </span>
        </div>
      </Empty>
    </div>
  ),
};

export const NoSearchResults: Story = {
  args: {
    title: "Sonuç bulunamadı",
    description:
      "Aramanızla eşleşen sonuç yok. Filtrelerinizi veya arama terimlerinizi değiştirmeyi deneyin.",
  },
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-sm max-w-md">
      <Empty
        {...args}
        icon={<Search strokeWidth={1} />}
        action={
          <button type="button" className={btnOutline}>
            Filtreleri temizle
          </button>
        }
      />
    </div>
  ),
};

export const ErrorState: Story = {
  args: {
    title: "Yüklenemedi",
    description: "Veriler yüklenirken bir şeyler ters gitti. Lütfen tekrar deneyin.",
  },
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-sm max-w-md">
      <Empty
        {...args}
        icon={<FileX strokeWidth={1} />}
        action={
          <button type="button" className={btnOutline}>
            Tekrar dene
          </button>
        }
      />
    </div>
  ),
};

export const PermissionDenied: Story = {
  args: {
    title: "Erişim reddedildi",
    description:
      "Bu içeriği görüntüleme yetkiniz yok. Yöneticinizle iletişime geçin.",
  },
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-sm max-w-md">
      <Empty {...args} icon={<ShieldX strokeWidth={1} />} />
    </div>
  ),
};

export const Offline: Story = {
  args: {
    title: "Çevrimdışısınız",
    description: "İnternet bağlantınızı kontrol edin ve tekrar deneyin.",
  },
  render: (args: EmptyProps) => (
    <div className="border border-zinc-200 rounded-sm max-w-md">
      <Empty
        {...args}
        icon={<WifiOff strokeWidth={1} />}
        action={
          <button type="button" className={btnOutline}>
            Tekrar dene
          </button>
        }
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div
          key={size}
          className="border border-zinc-200 rounded-sm max-w-md"
        >
          <Empty
            size={size}
            icon={<Bell strokeWidth={1} />}
            title={`Boyut: ${size}`}
            description="Empty state placeholder örneği."
          />
        </div>
      ))}
    </div>
  ),
};
