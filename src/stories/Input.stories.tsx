import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, type InputProps } from "../components/input";
import { Label } from "../components/label";
import { Typography } from "../components/typography";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Text input. 3 variant (outline / soft / ghost), 5 size (xs/sm/md/lg/xl), 3 shape (square/rounded/pill). Tüm standart HTML input type'ları (text/email/password/number/search/url/tel/date/file/...). Icon/button/addon kompozisyonu için **InputGroup** (sıradaki bileşen) kullanın. Hata göstergesi için `aria-invalid` attribute. Form composition: dış `Label` + `Typography variant=muted` helper text.",
      },
    },
  },
  args: {
    placeholder: "Bir şeyler yazın…",
    variant: "outline",
    size: "md",
    shape: "rounded",
    disabled: false,
  },
  argTypes: {
    variant: { control: "select", options: ["outline", "soft", "ghost"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    shape: { control: "select", options: ["square", "rounded", "pill"] },
    type: {
      control: "select",
      options: [
        "text",
        "email",
        "password",
        "number",
        "search",
        "url",
        "tel",
        "date",
        "time",
      ],
    },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: (args: InputProps) => (
    <div className="w-72">
      <Input {...args} />
    </div>
  ),
};

export const Variants: Story = {
  render: (args: InputProps) => (
    <div className="flex flex-col gap-3 w-72">
      <Input {...args} variant="outline" placeholder="outline (default)" />
      <Input {...args} variant="soft" placeholder="soft" />
      <Input {...args} variant="ghost" placeholder="ghost" />
    </div>
  ),
};

export const Shapes: Story = {
  render: (args: InputProps) => (
    <div className="flex flex-col gap-3 w-72">
      <Input {...args} shape="square" placeholder="square" />
      <Input {...args} shape="rounded" placeholder="rounded (default)" />
      <Input {...args} shape="pill" placeholder="pill" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args: InputProps) => (
    <div className="flex flex-col gap-3 w-72">
      <Input {...args} size="xs" placeholder="Extra small" />
      <Input {...args} size="sm" placeholder="Small" />
      <Input {...args} size="md" placeholder="Medium" />
      <Input {...args} size="lg" placeholder="Large" />
      <Input {...args} size="xl" placeholder="Extra large" />
    </div>
  ),
};

export const Types: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <Input type="text" placeholder="Text" />
      <Input type="email" placeholder="ornek@domain.com" />
      <Input type="password" placeholder="••••••••" />
      <Input type="number" placeholder="123" />
      <Input type="search" placeholder="Ara…" />
      <Input type="url" placeholder="https://example.com" />
      <Input type="tel" placeholder="+90 555 000 00 00" />
      <Input type="date" />
      <Input type="time" />
      <Input type="file" />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" required>
          E-posta
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="ornek@domain.com"
          autoComplete="email"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username">Kullanıcı Adı</Label>
        <Input
          id="username"
          type="text"
          placeholder="kullaniciadi"
          autoComplete="username"
        />
      </div>
    </div>
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5 w-72">
      <Label htmlFor="password">Şifre</Label>
      <Input
        id="password"
        type="password"
        placeholder="••••••••"
        aria-describedby="password-help"
      />
      <Typography variant="muted" id="password-help">
        En az 8 karakter, bir büyük harf ve bir rakam içermeli.
      </Typography>
    </div>
  ),
};

export const Invalid: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`aria-invalid={true}` → border ve ring koyulaşır. Hata mesajı için altına `Typography variant=\"muted\"` veya kendi helper text yapınızı kullanın.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-1.5 w-72">
      <Label htmlFor="email-invalid">E-posta</Label>
      <Input
        id="email-invalid"
        type="email"
        defaultValue="geçersiz-email"
        aria-invalid
        aria-describedby="email-error"
      />
      <Typography variant="muted" id="email-error" className="text-zinc-700">
        Geçerli bir e-posta adresi girin.
      </Typography>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <Input disabled placeholder="Devre dışı (boş)" />
      <Input disabled defaultValue="Düzenlenemez değer" />
    </div>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <Input readOnly defaultValue="Salt okunur metin" />
      <Input readOnly type="email" defaultValue="okunur@example.com" />
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form
      className="flex flex-col gap-3 w-72"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="form-name" required>
          Ad Soyad
        </Label>
        <Input
          id="form-name"
          name="name"
          placeholder="Ahmet Yılmaz"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="form-email" required>
          E-posta
        </Label>
        <Input
          id="form-email"
          name="email"
          type="email"
          placeholder="ornek@domain.com"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="form-website">Web Sitesi</Label>
        <Input
          id="form-website"
          name="website"
          type="url"
          placeholder="https://"
        />
        <Typography variant="muted">İsteğe bağlı.</Typography>
      </div>
    </form>
  ),
};
