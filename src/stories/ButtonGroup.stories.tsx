import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Settings,
  Plus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  ChevronDown,
  Copy,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Save,
} from "lucide-react";
import { Button } from "../components/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  type ButtonGroupProps,
} from "../components/button-group";

const meta: Meta<typeof ButtonGroup> = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Birden fazla Button'ı (veya Input vb.) tek bir grup olarak birleştirir. Bitişik butonların border'ları kaynaşır (`-ms-px` overlap), iç köşeler düzleşir, dış köşeler korunur. Compound API: `ButtonGroupSeparator` (görsel divider) + `ButtonGroupText` (label/text slot). orientation horizontal/vertical. role=group + aria-label/aria-labelledby ile semantik.",
      },
    },
  },
  args: {
    orientation: "horizontal",
  },
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  render: (args: ButtonGroupProps) => (
    <ButtonGroup {...args} aria-label="Eylemler">
      <Button variant="outline">Önceki</Button>
      <Button variant="outline">Sonraki</Button>
    </ButtonGroup>
  ),
};

export const Orientation: Story = {
  render: () => (
    <div className="flex gap-8 items-start">
      <div>
        <p className="text-xs text-zinc-400 mb-2">horizontal</p>
        <ButtonGroup>
          <Button variant="outline" icon={<AlignLeft />} aria-label="Sola" />
          <Button variant="outline" icon={<AlignCenter />} aria-label="Orta" />
          <Button variant="outline" icon={<AlignRight />} aria-label="Sağa" />
          <Button variant="outline" icon={<AlignJustify />} aria-label="Yasla" />
        </ButtonGroup>
      </div>
      <div>
        <p className="text-xs text-zinc-400 mb-2">vertical</p>
        <ButtonGroup orientation="vertical">
          <Button variant="outline" icon={<AlignLeft />} aria-label="Sola" />
          <Button variant="outline" icon={<AlignCenter />} aria-label="Orta" />
          <Button variant="outline" icon={<AlignRight />} aria-label="Sağa" />
          <Button variant="outline" icon={<AlignJustify />} aria-label="Yasla" />
        </ButtonGroup>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 items-start">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <ButtonGroup key={size}>
          <Button variant="outline" size={size}>
            Gün
          </Button>
          <Button variant="outline" size={size}>
            Hafta
          </Button>
          <Button variant="outline" size={size}>
            Ay
          </Button>
        </ButtonGroup>
      ))}
    </div>
  ),
};

export const TextFormatting: Story = {
  render: () => (
    <ButtonGroup aria-label="Metin biçimlendirme">
      <Button variant="outline" icon={<Bold />} aria-label="Kalın" active />
      <Button variant="outline" icon={<Italic />} aria-label="İtalik" />
      <Button variant="outline" icon={<Underline />} aria-label="Altı çizili" />
    </ButtonGroup>
  ),
};

export const WithSeparator: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`soft`/`solid` gibi border'sız varyantlarda butonlar kaynaşınca ayrım kaybolur — `ButtonGroupSeparator` görsel divider sağlar.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <ButtonGroup>
        <Button variant="soft">Sol</Button>
        <ButtonGroupSeparator />
        <Button variant="soft">Orta</Button>
        <ButtonGroupSeparator />
        <Button variant="soft">Sağ</Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button>Solid</Button>
        <ButtonGroupSeparator />
        <Button>Solid</Button>
        <ButtonGroupSeparator />
        <Button>Solid</Button>
      </ButtonGroup>
    </div>
  ),
};

export const Split: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Split button — ana aksiyon + dropdown trigger. Genellikle aynı varyantla.",
      },
    },
  },
  render: () => (
    <div className="flex gap-4 items-start flex-wrap">
      <ButtonGroup aria-label="Kaydet seçenekleri">
        <Button icon={<Save />}>Kaydet</Button>
        <ButtonGroupSeparator />
        <Button icon={<ChevronDown />} aria-label="Daha fazla seçenek" />
      </ButtonGroup>

      <ButtonGroup aria-label="Kopyala seçenekleri">
        <Button variant="outline" icon={<Copy />}>
          Kopyala
        </Button>
        <Button variant="outline" icon={<ChevronDown />} aria-label="Daha fazla" />
      </ButtonGroup>
    </div>
  ),
};

export const WithText: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`ButtonGroupText` ile grup içine inline metin/label eklenebilir. 5 size, button'larla aynı.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3 items-start">
      <ButtonGroup>
        <ButtonGroupText>Sıralama</ButtonGroupText>
        <Button variant="outline">Tarih</Button>
        <Button variant="outline">Ad</Button>
        <Button variant="outline">Boyut</Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="outline" icon={<ArrowLeft />} aria-label="Geri" />
        <ButtonGroupText>Sayfa 3 / 12</ButtonGroupText>
        <Button variant="outline" icon={<ArrowRight />} aria-label="İleri" />
      </ButtonGroup>
    </div>
  ),
};

export const Nested: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Birden fazla bağımsız ButtonGroup yan yana — dış konteynerle gap verin.",
      },
    },
  },
  render: () => (
    <div className="inline-flex gap-2">
      <ButtonGroup>
        <Button variant="outline" icon={<AlignLeft />} aria-label="Sola" />
        <Button variant="outline" icon={<AlignCenter />} aria-label="Orta" active />
        <Button variant="outline" icon={<AlignRight />} aria-label="Sağa" />
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" icon={<Bold />} aria-label="Kalın" />
        <Button variant="outline" icon={<Italic />} aria-label="İtalik" />
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" icon={<Settings />} aria-label="Ayarlar" />
        <Button variant="outline" icon={<Trash2 />} aria-label="Sil" />
      </ButtonGroup>
    </div>
  ),
};

export const WithInput: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "ButtonGroup, child olarak `<input>` da kabul eder — fuse mantığı aynı şekilde çalışır.",
      },
    },
  },
  render: () => (
    <ButtonGroup>
      <input
        type="text"
        placeholder="Etiket ekle…"
        className="h-9 px-3 text-sm border border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1 w-48"
      />
      <Button icon={<Plus />}>Ekle</Button>
    </ButtonGroup>
  ),
};

export const Pagination: Story = {
  render: () => (
    <ButtonGroup aria-label="Sayfa gezinme">
      <Button variant="outline" icon={<ArrowLeft />} aria-label="İlk" />
      <Button variant="outline">1</Button>
      <Button variant="outline" active>
        2
      </Button>
      <Button variant="outline">3</Button>
      <Button variant="outline">4</Button>
      <Button variant="outline">5</Button>
      <Button variant="outline" icon={<ArrowRight />} aria-label="Son" />
    </ButtonGroup>
  ),
};

export const FocusOverlap: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Tab tuşu ile gezindiğinizde focus halkası her zaman üstte kalır — `isolate` + `[&>*:focus-visible]:z-10` kombinasyonu.",
      },
    },
  },
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Birinci</Button>
      <Button variant="outline">İkinci</Button>
      <Button variant="outline">Üçüncü</Button>
      <Button variant="outline">Dördüncü</Button>
    </ButtonGroup>
  ),
};
