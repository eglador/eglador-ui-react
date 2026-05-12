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
          "Tutarlı metin rendering bileşeni. Heading'ler, paragraph, lead, blockquote, code, kbd; color (default/muted), align, weight, truncate, line clamping.",
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
      <Typography variant="h1">Heading 1 — Tilki tembel köpeğin üstünden atlar</Typography>
      <Typography variant="h2">Heading 2 — Tilki tembel köpeğin üstünden atlar</Typography>
      <Typography variant="h3">Heading 3 — Tilki tembel köpeğin üstünden atlar</Typography>
      <Typography variant="h4">Heading 4 — Tilki tembel köpeğin üstünden atlar</Typography>
    </div>
  ),
};

export const BodyText: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-lg">
      <Typography variant="lead">
        Lead — Daha büyük bir giriş paragrafı, okuyucuyu içeri çeker.
      </Typography>
      <Typography variant="large">
        Large — Normal paragraftan biraz daha büyük metin.
      </Typography>
      <Typography variant="p">
        Paragraph — Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
        do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Typography>
      <Typography variant="small">
        Small — Daha küçük, ikincil bilgi parçası.
      </Typography>
      <Typography variant="muted">
        Muted — Zaman damgaları veya yardımcı metin gibi soluk içerik.
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
      <Typography align="left">Sola hizalı metin</Typography>
      <Typography align="center">Ortalı metin</Typography>
      <Typography align="right">Sağa hizalı metin</Typography>
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
          {weight.charAt(0).toUpperCase() + weight.slice(1)} — metin örneği
        </Typography>
      ))}
    </div>
  ),
};

export const Blockquote: Story = {
  render: () => (
    <div className="max-w-lg">
      <Typography variant="blockquote">
        "Geleceği tahmin etmenin en iyi yolu onu icat etmektir." — Alan Kay
      </Typography>
    </div>
  ),
};

export const List: Story = {
  render: () => (
    <div className="max-w-lg">
      <Typography variant="list">
        <li>İlk madde — kısa açıklama</li>
        <li>İkinci madde — bir önceki gibi</li>
        <li>
          Üçüncü madde — uzun bir paragraf da olabilir. Lorem ipsum dolor sit
          amet, consectetur adipiscing elit.
        </li>
        <li>Dördüncü madde</li>
      </Typography>
    </div>
  ),
};

export const OrderedList: Story = {
  render: () => (
    <div className="max-w-lg">
      <Typography variant="list" as="ol" className="list-decimal">
        <li>Önce paketi kur</li>
        <li>Tailwind v4 için <code className="bg-zinc-100 px-1 rounded-sm text-xs font-mono">@source</code> ekle</li>
        <li>Bileşeni import et</li>
        <li>JSX'ine yerleştir</li>
      </Typography>
    </div>
  ),
};

export const CodeAndKbd: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-lg">
      <Typography>
        Paketi terminalde{" "}
        <Typography variant="code" as="span">
          npm install eglador-ui-react
        </Typography>{" "}
        ile kurun.
      </Typography>
      <Typography>
        Kopyalamak için{" "}
        <Typography variant="kbd" as="span">
          Ctrl
        </Typography>{" "}
        +{" "}
        <Typography variant="kbd" as="span">
          C
        </Typography>{" "}
        tuşlayın.
      </Typography>
    </div>
  ),
};

export const Truncate: Story = {
  render: (args: TypographyProps) => (
    <div className="max-w-xs">
      <Typography {...args} truncate>
        Bu, konteynır genişliğini aştığında ellipsis ile kısaltılması gereken
        uzun bir metindir.
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
        H3 stiliyle div olarak render edildi
      </Typography>
      <Typography variant="p" as="span">
        Paragraph stiliyle span olarak render edildi
      </Typography>
    </div>
  ),
};

export const ArticleExample: Story = {
  render: () => (
    <article className="max-w-xl flex flex-col gap-4">
      <Typography variant="h1">Modern UI'lar İnşa Etmek</Typography>
      <Typography variant="lead" color="muted">
        React ve Tailwind CSS ile güzel, erişilebilir kullanıcı arayüzleri
        oluşturmaya yönelik kapsamlı bir rehber.
      </Typography>
      <Separator />
      <Typography>
        Modern web geliştirme son on yılda önemli ölçüde gelişti. Bileşen-tabanlı
        mimariler standart hâline geldi ve geliştiricilerin karmaşık arayüzleri
        basit, yeniden kullanılabilir parçalardan inşa etmesine olanak tanıdı.
      </Typography>
      <Typography variant="h2">Başlangıç</Typography>
      <Typography>
        Başlamak için{" "}
        <Typography variant="code" as="span">
          npm install
        </Typography>{" "}
        ile gerekli bağımlılıkları kurun. Bu, bileşen geliştirmeye başlamak için
        ihtiyacınız olan her şeyi kurar.
      </Typography>
      <Typography variant="blockquote">
        "Sadelik nihai sofistikasyondur." — Leonardo da Vinci
      </Typography>
      <Typography variant="muted">12 Mayıs 2026 · 5 dk okuma</Typography>
    </article>
  ),
};

export const RTL: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "RTL (sağdan sola) yön. Blockquote'un `border-s-4` ve list'in `ms-6` gibi logical Tailwind sınıfları kullandığı için yön ebeveynin `dir` attribute'undan otomatik çıkarılır.",
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
