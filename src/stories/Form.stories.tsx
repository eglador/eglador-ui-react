import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormFieldSet,
  FormLegend,
  FormFieldGroup,
  useFormField,
} from "../components/form";
import { Input } from "../components/input";
import { Textarea } from "../components/textarea";
import { NativeSelect } from "../components/native-select";
import { MultiSelect } from "../components/multi-select";
import { Checkbox } from "../components/checkbox";
import {
  CheckboxGroup,
  CheckboxGroupItem,
} from "../components/checkbox-group";
import { RadioGroup, RadioGroupItem } from "../components/radio-group";
import { Switch } from "../components/switch";
import { Toggle } from "../components/toggle";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../components/toggle-group";
import { DatePicker } from "../components/date-picker";
import { DateTimePicker } from "../components/date-time-picker";
import { InputTag } from "../components/input-tag";
import { InputOTP } from "../components/input-otp";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupText,
} from "../components/input-group";
import { Button } from "../components/button";

const meta: Meta<typeof Form> = {
  title: "Components/Form",
  component: Form,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Library-agnostic form primitiveler — herhangi bir validation kutuphanesiyle (react-hook-form, Formik, Zod, kendi state) calisir. Compound API: `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`. FormControl tek bir child input'a `id`, `aria-describedby`, `aria-invalid` otomatik baglar. 4 message status (error/warning/success/info), required marker, automatic disabled cascade. Input/Checkbox/Select'in yerini almaz; etrafindaki label/error/aria/spacing'i hazirlar.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Form>;

const AUTHOR_OPTIONS = [
  { value: "1", label: "Kenan Gundogan" },
  { value: "2", label: "Eglador Editor" },
  { value: "3", label: "Misafir Yazar" },
  { value: "4", label: "Anonim" },
];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 border-t border-zinc-200 pt-6 first:border-t-0 first:pt-0">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
        {description && (
          <p className="text-xs text-zinc-500">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

const BoldIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
  </svg>
);
const ItalicIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="4" x2="10" y2="4" />
    <line x1="14" y1="20" x2="5" y2="20" />
    <line x1="15" y1="4" x2="9" y2="20" />
  </svg>
);
const UnderlineIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4v6a6 6 0 0 0 12 0V4" />
    <line x1="4" y1="20" x2="20" y2="20" />
  </svg>
);
const StarIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Tum form bilesenlerinin yer aldigi kapsamli ornek — bir 'Yazi Olustur' formu. Input, Textarea, NativeSelect, MultiSelect, Checkbox, CheckboxGroup, RadioGroup, Switch, Toggle, ToggleGroup, DatePicker, DateTimePicker, InputTag, InputOTP, InputGroup tek bir kompozisyonda.",
      },
    },
  },
  render: function DefaultStory() {
    const [values, setValues] = React.useState({
      title: "",
      slug: "",
      excerpt: "",
      body: "",
      category: "tech",
      tags: ["react", "tailwind"],
      authors: ["1"],
      formatting: ["bold"],
      favorite: false,
      publishDate: undefined as Date | undefined,
      publishAt: undefined as Date | undefined,
      status: "draft",
      visibility: "public",
      allowComments: true,
      allowSharing: false,
      notifications: ["email"],
      acceptedTerms: false,
      quantity: 1,
      price: "",
      otp: "",
    });

    const update = <K extends keyof typeof values>(
      key: K,
      v: (typeof values)[K],
    ) => setValues((s) => ({ ...s, [key]: v }));

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("submit", values);
    };

    return (
      <Form onSubmit={handleSubmit} className="max-w-3xl gap-8">
        <Section
          title="Temel Bilgiler"
          description="Yazinin ana metadata'si"
        >
          <FormField name="title">
            <FormItem>
              <FormLabel required>Baslik</FormLabel>
              <FormControl>
                <Input
                  placeholder="Yazinin basligi"
                  value={values.title}
                  onChange={(e) => update("title", e.target.value)}
                />
              </FormControl>
              <FormDescription>
                Liste sayfalarinda ve sosyal medyada paylasilan baslik.
              </FormDescription>
            </FormItem>
          </FormField>

          <FormField name="slug">
            <FormItem>
              <FormLabel>URL Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder="yazi-basligi"
                  value={values.slug}
                  onChange={(e) => update("slug", e.target.value)}
                />
              </FormControl>
              <FormDescription>
                Bos birakirsan baslikan otomatik uretilir.
              </FormDescription>
            </FormItem>
          </FormField>

          <FormField name="excerpt">
            <FormItem>
              <FormLabel>Ozet</FormLabel>
              <FormControl>
                <Textarea
                  rows={2}
                  placeholder="Kisa aciklama..."
                  value={values.excerpt}
                  onChange={(e) => update("excerpt", e.target.value)}
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField name="body">
            <FormItem>
              <FormLabel required>Icerik</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Yaziyi yaz..."
                  value={values.body}
                  onChange={(e) => update("body", e.target.value)}
                />
              </FormControl>
            </FormItem>
          </FormField>
        </Section>

        <Section
          title="Kategorizasyon"
          description="Kategori, etiket ve yazarlar"
        >
          <FormField name="category">
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <FormControl>
                <NativeSelect
                  value={values.category}
                  onChange={(e) => update("category", e.target.value)}
                >
                  <option value="tech">Teknoloji</option>
                  <option value="design">Tasarim</option>
                  <option value="business">Is</option>
                  <option value="culture">Kultur</option>
                </NativeSelect>
              </FormControl>
            </FormItem>
          </FormField>

          <FormField name="tags">
            <FormItem>
              <FormLabel>Etiketler</FormLabel>
              <FormControl>
                <InputTag
                  value={values.tags}
                  onValueChange={(t) => update("tags", t)}
                  placeholder="Enter ile etiket ekle..."
                />
              </FormControl>
              <FormDescription>
                Maksimum 5 etiket. Enter veya virgul ile ayir.
              </FormDescription>
            </FormItem>
          </FormField>

          <FormField name="authors">
            <FormItem>
              <FormLabel>Yazarlar</FormLabel>
              <FormControl>
                <MultiSelect
                  options={AUTHOR_OPTIONS}
                  value={values.authors}
                  onValueChange={(v) => update("authors", v)}
                  placeholder="Yazar sec..."
                />
              </FormControl>
              <FormDescription>
                Ortak yazi destekli — birden fazla yazar atayabilirsin.
              </FormDescription>
            </FormItem>
          </FormField>
        </Section>

        <Section
          title="Bicimlendirme"
          description="Toolbar varsayilan davranisi"
        >
          <FormField name="formatting">
            <FormItem>
              <FormLabel>Default bicimlendirme</FormLabel>
              <FormControl>
                <ToggleGroup
                  type="multiple"
                  variant="outline"
                  value={values.formatting}
                  onValueChange={(v) => update("formatting", v)}
                >
                  <ToggleGroupItem value="bold" icon={BoldIcon} aria-label="Bold" />
                  <ToggleGroupItem value="italic" icon={ItalicIcon} aria-label="Italic" />
                  <ToggleGroupItem value="underline" icon={UnderlineIcon} aria-label="Underline" />
                </ToggleGroup>
              </FormControl>
              <FormDescription>
                Yazi acildiginda toolbar'da aktif olacak bicimler.
              </FormDescription>
            </FormItem>
          </FormField>

          <FormField name="favorite">
            <FormItem className="flex-row items-center gap-3">
              <FormControl>
                <Toggle
                  variant="outline"
                  icon={StarIcon}
                  pressed={values.favorite}
                  onPressedChange={(p) => update("favorite", p)}
                />
              </FormControl>
              <FormLabel>Favorilere ekle</FormLabel>
            </FormItem>
          </FormField>
        </Section>

        <Section
          title="Yayinlama"
          description="Tarih, durum ve gorunurluk"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField name="publishDate">
              <FormItem>
                <FormLabel>Yayin Tarihi</FormLabel>
                <FormControl>
                  <DatePicker
                    value={values.publishDate}
                    onValueChange={(d) => update("publishDate", d)}
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField name="publishAt">
              <FormItem>
                <FormLabel>Yayin Saati</FormLabel>
                <FormControl>
                  <DateTimePicker
                    value={values.publishAt}
                    onValueChange={(d) => update("publishAt", d)}
                  />
                </FormControl>
                <FormDescription>
                  Bos birakirsan hemen yayinlanir.
                </FormDescription>
              </FormItem>
            </FormField>
          </div>

          <FormFieldSet>
            <FormLegend>Durum</FormLegend>
            <RadioGroup
              orientation="horizontal"
              value={values.status}
              onValueChange={(v) => update("status", v)}
            >
              <RadioGroupItem value="draft" label="Taslak" />
              <RadioGroupItem value="review" label="Onayda" />
              <RadioGroupItem value="published" label="Yayinda" />
            </RadioGroup>
          </FormFieldSet>

          <FormFieldSet>
            <FormLegend>Gorunurluk</FormLegend>
            <FormDescription>
              Yazinin kim tarafindan gorulebilecegini belirler.
            </FormDescription>
            <RadioGroup
              value={values.visibility}
              onValueChange={(v) => update("visibility", v)}
            >
              <RadioGroupItem
                value="public"
                label="Acik"
                description="Herkes gorebilir, arama motorlari indeksler"
              />
              <RadioGroupItem
                value="unlisted"
                label="Listelenmemis"
                description="Sadece link ile erisilebilir"
              />
              <RadioGroupItem
                value="private"
                label="Ozel"
                description="Sadece yazarlar gorebilir"
              />
            </RadioGroup>
          </FormFieldSet>
        </Section>

        <Section
          title="Ayarlar"
          description="Etkilesim ve bildirim tercihleri"
        >
          <FormField name="allowComments">
            <FormItem className="flex-row items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <FormLabel>Yorumlara izin ver</FormLabel>
                <FormDescription>
                  Kullanicilar yazinin altina yorum birakabilir.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={values.allowComments}
                  onCheckedChange={(c) => update("allowComments", c)}
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField name="allowSharing">
            <FormItem className="flex-row items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <FormLabel>Sosyal medyada paylasima izin ver</FormLabel>
                <FormDescription>
                  Yazinin altinda paylasim butonlari gozukur.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={values.allowSharing}
                  onCheckedChange={(c) => update("allowSharing", c)}
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormFieldSet>
            <FormLegend>Bildirim kanallari</FormLegend>
            <FormDescription>
              Yazi yayinlandiginda bildirim almak istedigin kanallar.
            </FormDescription>
            <CheckboxGroup
              orientation="horizontal"
              value={values.notifications}
              onValueChange={(v) => update("notifications", v)}
            >
              <CheckboxGroupItem value="email" label="Email" />
              <CheckboxGroupItem value="push" label="Push" />
              <CheckboxGroupItem value="sms" label="SMS" />
            </CheckboxGroup>
          </FormFieldSet>

          <FormField name="acceptedTerms">
            <FormItem className="flex-row items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={values.acceptedTerms}
                  onCheckedChange={(c) => update("acceptedTerms", c)}
                />
              </FormControl>
              <FormLabel>Yayin politikasini okudum, kabul ediyorum</FormLabel>
            </FormItem>
          </FormField>
        </Section>

        <Section
          title="Stok ve Fiyatlandirma"
          description="Premium icerik icin opsiyonel"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField name="quantity">
              <FormItem>
                <FormLabel>Stok</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    value={values.quantity}
                    onChange={(e) =>
                      update("quantity", Number(e.target.value))
                    }
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField name="price">
              <FormItem>
                <FormLabel>Fiyat</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>₺</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      type="number"
                      placeholder="0.00"
                      value={values.price}
                      onChange={(e) => update("price", e.target.value)}
                    />
                    <InputGroupAddon>
                      <InputGroupText>TRY</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </FormControl>
                <FormDescription>
                  Ucretsiz icerik icin bos birak.
                </FormDescription>
              </FormItem>
            </FormField>
          </div>
        </Section>

        <Section
          title="Guvenlik"
          description="Hassas islem onayi"
        >
          <FormField name="otp">
            <FormItem>
              <FormLabel>2FA Kodu</FormLabel>
              <FormControl>
                <InputOTP
                  length={6}
                  value={values.otp}
                  onChange={(v) => update("otp", v)}
                />
              </FormControl>
              <FormDescription>
                Authenticator uygulamandaki 6 haneli kod.
              </FormDescription>
            </FormItem>
          </FormField>
        </Section>

        <div className="flex justify-end gap-2 border-t border-zinc-200 pt-6">
          <Button variant="outline" type="button">
            Iptal
          </Button>
          <Button variant="soft" type="submit">
            Taslak olarak kaydet
          </Button>
          <Button type="submit">Yayinla</Button>
        </div>
      </Form>
    );
  },
};

export const WithValidation: Story = {
  render: function WithValidationStory() {
    const [values, setValues] = React.useState({ email: "", password: "" });
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [submitted, setSubmitted] = React.useState(false);

    const validate = (next: typeof values) => {
      const e: Record<string, string> = {};
      if (!next.email) e.email = "Email zorunlu";
      else if (!/^[^@]+@[^@]+\.[^@]+$/.test(next.email))
        e.email = "Gecerli bir email gir";
      if (!next.password) e.password = "Sifre zorunlu";
      else if (next.password.length < 8)
        e.password = "Sifre en az 8 karakter olmali";
      return e;
    };

    const onSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const e2 = validate(values);
      setErrors(e2);
      if (Object.keys(e2).length === 0) setSubmitted(true);
    };

    return (
      <Form onSubmit={onSubmit} className="max-w-md">
        <FormField name="email" error={errors.email}>
          <FormItem>
            <FormLabel required>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                value={values.email}
                onChange={(e) =>
                  setValues((v) => ({ ...v, email: e.target.value }))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField name="password" error={errors.password}>
          <FormItem>
            <FormLabel required>Sifre</FormLabel>
            <FormControl>
              <Input
                type="password"
                value={values.password}
                onChange={(e) =>
                  setValues((v) => ({ ...v, password: e.target.value }))
                }
              />
            </FormControl>
            <FormDescription>En az 8 karakter.</FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        {submitted && (
          <p className="text-sm font-medium text-emerald-600">
            Form basariyla gonderildi
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button type="submit">Gonder</Button>
        </div>
      </Form>
    );
  },
};

export const AllInputTypes: Story = {
  render: () => (
    <Form className="max-w-md">
      <FormField name="title">
        <FormItem>
          <FormLabel required>Baslik</FormLabel>
          <FormControl>
            <Input placeholder="Yazinin basligi" />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField name="excerpt">
        <FormItem>
          <FormLabel>Ozet</FormLabel>
          <FormControl>
            <Textarea rows={3} placeholder="Kisa aciklama..." />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField name="category">
        <FormItem>
          <FormLabel>Kategori</FormLabel>
          <FormControl>
            <NativeSelect>
              <option value="">Sec...</option>
              <option value="tech">Teknoloji</option>
              <option value="design">Tasarim</option>
              <option value="business">Is</option>
            </NativeSelect>
          </FormControl>
        </FormItem>
      </FormField>

      <FormField name="terms">
        <FormItem className="flex-row items-center gap-2">
          <FormControl>
            <Checkbox />
          </FormControl>
          <FormLabel>Kosullari kabul ediyorum</FormLabel>
        </FormItem>
      </FormField>

      <FormField name="newsletter">
        <FormItem className="flex-row items-center gap-2">
          <FormControl>
            <Switch />
          </FormControl>
          <FormLabel>Bultene abone ol</FormLabel>
        </FormItem>
      </FormField>
    </Form>
  ),
};

export const MessageStatuses: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-md">
      {(
        [
          ["error", "Bu alan zorunlu"],
          ["warning", "Email dogrulanmamis"],
          ["success", "Kullanici adi musait"],
          ["info", "Bu alan opsiyoneldir"],
        ] as const
      ).map(([status, msg]) => (
        <FormField
          key={status}
          name={`field-${status}`}
          error={status === "error" ? msg : undefined}
        >
          <FormItem>
            <FormLabel>Status: {status}</FormLabel>
            <FormControl>
              <Input placeholder="Ornek input" />
            </FormControl>
            <FormMessage status={status}>{msg}</FormMessage>
          </FormItem>
        </FormField>
      ))}
    </div>
  ),
};

export const WithFieldSet: Story = {
  name: "With FieldSet",
  parameters: {
    docs: {
      description: {
        story:
          "`FormFieldSet` + `FormLegend` semantic gruplama — native `<fieldset><legend>` HTML. RadioGroup, CheckboxGroup gibi cogul-secim componentleri veya ilgili field'lari mantiksal olarak gruplamak icin. `disabled` prop'u tum child input'lara native HTML cascade ile uygulanir.",
      },
    },
  },
  render: function WithFieldSetStory() {
    const [plan, setPlan] = React.useState("pro");
    const [notifications, setNotifications] = React.useState([
      "email",
      "push",
    ]);
    return (
      <Form className="max-w-md">
        <FormFieldSet>
          <FormLegend>Abonelik Plani</FormLegend>
          <FormDescription>
            Istediginiz zaman yukseltebilir veya dusurebilirsiniz.
          </FormDescription>
          <RadioGroup value={plan} onValueChange={setPlan}>
            <RadioGroupItem
              value="free"
              label="Ucretsiz"
              description="Temel ozellikler, 3 proje limiti"
            />
            <RadioGroupItem
              value="pro"
              label="Pro"
              description="Sinirsiz proje, oncelikli destek"
            />
            <RadioGroupItem
              value="team"
              label="Takim"
              description="Pro + 10 kullaniciya kadar takim isbirligi"
            />
          </RadioGroup>
        </FormFieldSet>

        <FormFieldSet>
          <FormLegend>Bildirim Tercihleri</FormLegend>
          <FormDescription>
            Hangi kanallardan haberdar olmak istersin?
          </FormDescription>
          <CheckboxGroup
            value={notifications}
            onValueChange={setNotifications}
          >
            <CheckboxGroupItem value="email" label="Email" />
            <CheckboxGroupItem value="push" label="Push bildirim" />
            <CheckboxGroupItem value="sms" label="SMS" />
            <CheckboxGroupItem value="slack" label="Slack" />
          </CheckboxGroup>
        </FormFieldSet>

        <FormFieldSet disabled>
          <FormLegend>Devre Disi Bolum (disabled)</FormLegend>
          <FormDescription>
            `disabled` prop'u native HTML ile butun child input'lara uygulanir.
          </FormDescription>
          <RadioGroup defaultValue="a">
            <RadioGroupItem value="a" label="Secenek A" />
            <RadioGroupItem value="b" label="Secenek B" />
          </RadioGroup>
        </FormFieldSet>
      </Form>
    );
  },
};

export const ArrayFields: Story = {
  name: "Array Fields",
  parameters: {
    docs: {
      description: {
        story:
          "Tekrar eden alanlar (kullanici emaileri gibi) icin `FormFieldSet` + `FormFieldGroup` pattern'i. React Hook Form'un `useFieldArray` ile kombine edilir, ama burada manuel useState ornegi.",
      },
    },
  },
  render: function ArrayFieldsStory() {
    const [emails, setEmails] = React.useState<string[]>([""]);
    const update = (idx: number, value: string) => {
      setEmails((arr) => arr.map((e, i) => (i === idx ? value : e)));
    };
    const append = () => setEmails((arr) => [...arr, ""]);
    const remove = (idx: number) =>
      setEmails((arr) => arr.filter((_, i) => i !== idx));

    return (
      <Form className="max-w-md">
        <FormFieldSet>
          <FormLegend>Email Adresleri</FormLegend>
          <FormDescription>
            En fazla 5 adres ekleyebilirsin.
          </FormDescription>
          <FormFieldGroup>
            {emails.map((email, i) => (
              <FormField key={i} name={`email-${i}`}>
                <FormItem className="flex-row items-start gap-2">
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@domain.com"
                      value={email}
                      onChange={(e) => update(i, e.target.value)}
                    />
                  </FormControl>
                  {emails.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => remove(i)}
                      aria-label={`${i + 1}. emaili sil`}
                    >
                      Sil
                    </Button>
                  )}
                </FormItem>
              </FormField>
            ))}
          </FormFieldGroup>
          <Button
            type="button"
            variant="outline"
            onClick={append}
            disabled={emails.length >= 5}
          >
            + Email ekle
          </Button>
        </FormFieldSet>
      </Form>
    );
  },
};

export const RequiredAndOptional: Story = {
  render: () => (
    <Form className="max-w-md">
      <FormField name="email">
        <FormItem>
          <FormLabel required>Email</FormLabel>
          <FormControl>
            <Input type="email" />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField name="phone">
        <FormItem>
          <FormLabel>Telefon (opsiyonel)</FormLabel>
          <FormControl>
            <Input type="tel" />
          </FormControl>
        </FormItem>
      </FormField>
    </Form>
  ),
};

export const DisabledField: Story = {
  render: () => (
    <Form className="max-w-md">
      <FormField name="email">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" value="kenan@eglador.dev" readOnly />
          </FormControl>
          <FormDescription>Email degisikligi destekten talep et.</FormDescription>
        </FormItem>
      </FormField>

      <FormField name="username" disabled>
        <FormItem>
          <FormLabel>Kullanici adi (disabled)</FormLabel>
          <FormControl>
            <Input defaultValue="kenangundogan" />
          </FormControl>
          <FormDescription>Bu alan duzenlenemez.</FormDescription>
        </FormItem>
      </FormField>
    </Form>
  ),
};

function CharCounter() {
  const field = useFormField();
  const [value, setValue] = React.useState("");
  const max = 50;
  return (
    <>
      <FormControl>
        <Input
          value={value}
          maxLength={max}
          onChange={(e) => setValue(e.target.value)}
        />
      </FormControl>
      <FormDescription>
        {value.length} / {max} karakter — alan: {field.name}
      </FormDescription>
    </>
  );
}

export const CustomFieldHook: Story = {
  name: "Custom Field (useFormField)",
  parameters: {
    docs: {
      description: {
        story:
          "`useFormField()` hook'u ile FormField context'inden id, error, name vb. degerleri okuyup custom input/visual'lar yazabilirsin.",
      },
    },
  },
  render: () => (
    <Form className="max-w-md">
      <FormField name="title">
        <FormItem>
          <FormLabel>Baslik</FormLabel>
          <CharCounter />
        </FormItem>
      </FormField>
    </Form>
  ),
};
