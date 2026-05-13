import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Checkbox, type CheckboxProps } from "../components/checkbox";
import { Label } from "../components/label";
import { Typography } from "../components/typography";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Native `<input type=\"checkbox\">` üzerine kurulu checkbox. 5 size, controlled/uncontrolled, `indeterminate` 3rd-state desteği. Label dış `<Label>` ile compose.",
      },
    },
  },
  args: {
    size: "md",
    defaultChecked: false,
    disabled: false,
    indeterminate: false,
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    defaultChecked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
    onCheckedChange: { action: "checked changed" },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args: CheckboxProps) => (
    <div className="flex flex-col gap-3 items-start">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 w-6">{size}</span>
          <Checkbox {...args} size={size} defaultChecked />
        </div>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Checkbox />
      <Checkbox defaultChecked />
      <Checkbox indeterminate />
      <Checkbox disabled />
      <Checkbox disabled defaultChecked />
    </div>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [on, setOn] = React.useState(false);
    return (
      <div className="flex flex-col gap-3 items-start">
        <div className="flex items-center gap-3">
          <Checkbox id="ctrl" checked={on} onCheckedChange={setOn} />
          <Label htmlFor="ctrl">Şartları kabul ediyorum</Label>
        </div>
        <p className="text-sm text-zinc-600">
          State:{" "}
          <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">
            {String(on)}
          </code>
        </p>
      </div>
    );
  },
};

export const Indeterminate: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`indeterminate` 3rd state — alt-checkbox'ların bir kısmı seçili olduğunda parent checkbox kullanılır. Native DOM property (HTML attribute değil), `useEffect` ile set edilir.",
      },
    },
  },
  render: function IndeterminateStory() {
    const [items, setItems] = React.useState({
      apple: false,
      banana: true,
      cherry: false,
    });
    const all = Object.values(items).every(Boolean);
    const some = Object.values(items).some(Boolean);
    const indeterminate = some && !all;

    const toggleAll = () => {
      const next = !all;
      setItems({ apple: next, banana: next, cherry: next });
    };

    return (
      <div className="flex flex-col gap-2 max-w-xs">
        <div className="flex items-center gap-3">
          <Checkbox
            id="all"
            checked={all}
            indeterminate={indeterminate}
            onCheckedChange={toggleAll}
          />
          <Label htmlFor="all" className="font-semibold">
            Tümünü seç
          </Label>
        </div>
        <div className="ms-7 flex flex-col gap-1.5">
          {(["apple", "banana", "cherry"] as const).map((k) => (
            <div key={k} className="flex items-center gap-3">
              <Checkbox
                id={k}
                checked={items[k]}
                onCheckedChange={(c) => setItems((s) => ({ ...s, [k]: c }))}
              />
              <Label htmlFor={k}>
                {k.charAt(0).toUpperCase() + k.slice(1)}
              </Label>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-sm">
      <div className="flex items-start gap-3">
        <Checkbox id="cb-terms" defaultChecked />
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="cb-terms">Şartları kabul ediyorum</Label>
          <Typography variant="muted">
            Hizmet şartları ve gizlilik politikasını okudum.
          </Typography>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="cb-marketing" />
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="cb-marketing">Pazarlama e-postaları</Label>
          <Typography variant="muted">
            Yeni özellikler ve kampanyalar hakkında bilgilendiril.
          </Typography>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="cb-disabled" disabled />
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="cb-disabled" disabled>
            İki adımlı doğrulama
          </Label>
          <Typography variant="muted">
            Bu hesap için kullanılamıyor.
          </Typography>
        </div>
      </div>
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5 max-w-sm">
      <div className="flex items-start gap-3">
        <Checkbox id="cb-invalid" aria-invalid />
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="cb-invalid" required>
            Şartları kabul et
          </Label>
          <Typography variant="muted" className="text-zinc-700">
            Devam edebilmek için bu kutuyu işaretlemelisin.
          </Typography>
        </div>
      </div>
    </div>
  ),
};

export const FormSubmit: Story = {
  render: () => (
    <form
      className="flex flex-col gap-3 max-w-sm"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const keys = fd.getAll("interests");
        alert(`Seçilen: ${keys.join(", ") || "yok"}`);
      }}
    >
      <p className="text-sm font-medium text-zinc-700">İlgi alanları</p>
      {[
        { id: "react", label: "React" },
        { id: "ts", label: "TypeScript" },
        { id: "tw", label: "Tailwind CSS" },
        { id: "next", label: "Next.js" },
      ].map((item) => (
        <div key={item.id} className="flex items-center gap-3">
          <Checkbox id={item.id} name="interests" value={item.id} />
          <Label htmlFor={item.id}>{item.label}</Label>
        </div>
      ))}
      <button
        type="submit"
        className="mt-1 inline-flex self-start items-center h-8 px-3 text-sm rounded-sm bg-zinc-900 text-white cursor-pointer"
      >
        Submit
      </button>
    </form>
  ),
};
