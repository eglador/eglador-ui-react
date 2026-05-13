import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  Search,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AtSign,
  Globe,
  Copy,
  Send,
  Smile,
  Image as ImageIcon,
  Bold,
  Italic,
  Underline,
} from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
  InputGroupText,
} from "../components/input-group";
import { Label } from "../components/label";

const meta: Meta<typeof InputGroup> = {
  title: "Components/InputGroup",
  component: InputGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Input/textarea içine icon, text, button gibi addon'lar yerleştirmek için container. shadcn pattern: tek wrapper'da border + transparent input, `align` prop ile addon konumlanır (inline-start/end, block-start/end). `data-slot=\"input-group-control\"` ile özel input'lar da focus state'e dahil olabilir. Tab order için addon DOM'da input'tan SONRA yer almalı.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InputGroup>;

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <InputGroup>
        <InputGroupInput placeholder="Ara…" />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const InlineStart: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`align=\"inline-start\"` (default) — addon görsel olarak input'un başında. Tab order için DOM'da input'tan sonra yer alır, CSS `order-first` ile öne çekilir.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <InputGroup>
        <InputGroupInput placeholder="Site içinde ara…" />
        <InputGroupAddon align="inline-start">
          <Search />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput type="email" placeholder="ornek@domain.com" />
        <InputGroupAddon align="inline-start">
          <Mail />
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const InlineEnd: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <InputGroup>
        <InputGroupInput placeholder="example" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="kullaniciadi" />
        <InputGroupAddon align="inline-end">
          <Globe />
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const BothSides: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <InputGroup>
        <InputGroupInput placeholder="kullaniciadi" />
        <InputGroupAddon align="inline-start">
          <AtSign />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupText>@eglador.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput type="number" placeholder="0.00" />
        <InputGroupAddon align="inline-start">
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const WithButton: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-96">
      <InputGroup>
        <InputGroupInput placeholder="E-posta adresinizi girin…" type="email" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="solid" size="sm">
            Abone Ol
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput
          placeholder="https://eglador.com/abc123"
          readOnly
          defaultValue="https://eglador.com/abc123"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-sm" aria-label="Kopyala">
            <Copy />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const PasswordToggle: Story = {
  render: function PasswordToggleStory() {
    const [show, setShow] = React.useState(false);
    return (
      <div className="w-80">
        <InputGroup>
          <InputGroupInput
            type={show ? "text" : "password"}
            placeholder="Şifre"
          />
          <InputGroupAddon align="inline-start">
            <Lock />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-sm"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Şifreyi gizle" : "Şifreyi göster"}
            >
              {show ? <EyeOff /> : <Eye />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    );
  },
};

export const BlockStart: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`align=\"block-start\"` — addon input'un ÜSTÜNE. Genellikle textarea ile rich-editor toolbar'ı için kullanılır.",
      },
    },
  },
  render: () => (
    <div className="w-96">
      <InputGroup>
        <InputGroupAddon align="block-start">
          <InputGroupButton size="icon-xs" aria-label="Kalın">
            <Bold />
          </InputGroupButton>
          <InputGroupButton size="icon-xs" aria-label="İtalik">
            <Italic />
          </InputGroupButton>
          <InputGroupButton size="icon-xs" aria-label="Altı çizili">
            <Underline />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupInput placeholder="Yorumunuzu yazın…" />
      </InputGroup>
    </div>
  ),
};

export const BlockEnd: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`align=\"block-end\"` — addon input'un ALTINA. Chat/mesaj UI'ları için Send butonu vb.",
      },
    },
  },
  render: () => (
    <div className="w-96">
      <InputGroup>
        <InputGroupInput placeholder="Mesajınızı yazın…" />
        <InputGroupAddon align="block-end">
          <InputGroupButton size="icon-xs" aria-label="Emoji">
            <Smile />
          </InputGroupButton>
          <InputGroupButton size="icon-xs" aria-label="Görsel ekle">
            <ImageIcon />
          </InputGroupButton>
          <InputGroupButton
            variant="solid"
            size="sm"
            className="ms-auto"
          >
            <Send />
            Gönder
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const FocusRingOnGroup: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Focus halkası tek bir input yerine TÜM group'u sarar — wrapper'daki `has-[...:focus-visible]:ring-*` selektörü ile.",
      },
    },
  },
  render: () => (
    <div className="w-80">
      <InputGroup>
        <InputGroupInput placeholder="Buraya tıkla → ring tüm group'a uygulanır" />
        <InputGroupAddon align="inline-start">
          <Search />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-sm" aria-label="Kopyala">
            <Copy />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const Invalid: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Input'un `aria-invalid` attribute'u group'un border + ring rengini koyulaştırır (`has-[[aria-invalid=true]]`).",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-1.5 w-80">
      <Label htmlFor="email-invalid">E-posta</Label>
      <InputGroup>
        <InputGroupInput
          id="email-invalid"
          type="email"
          defaultValue="geçersiz-email"
          aria-invalid
        />
        <InputGroupAddon align="inline-start">
          <Mail />
        </InputGroupAddon>
      </InputGroup>
      <span className="text-xs text-zinc-700">
        Geçerli bir e-posta adresi girin.
      </span>
    </div>
  ),
};

export const InputGroupButtonVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 items-center">
        <InputGroupButton variant="ghost">Ghost</InputGroupButton>
        <InputGroupButton variant="outline">Outline</InputGroupButton>
        <InputGroupButton variant="soft">Soft</InputGroupButton>
        <InputGroupButton variant="solid">Solid</InputGroupButton>
      </div>
      <div className="flex gap-2 items-center">
        <InputGroupButton size="xs">xs</InputGroupButton>
        <InputGroupButton size="sm">sm</InputGroupButton>
        <InputGroupButton size="icon-xs" aria-label="Kopyala">
          <Copy />
        </InputGroupButton>
        <InputGroupButton size="icon-sm" aria-label="Kopyala">
          <Copy />
        </InputGroupButton>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <InputGroup key={size}>
          <InputGroupInput size={size} placeholder={`${size} input`} />
          <InputGroupAddon align="inline-start">
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupText>{size}</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      ))}
    </div>
  ),
};
