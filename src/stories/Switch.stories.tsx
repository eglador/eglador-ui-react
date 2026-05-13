import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Switch, type SwitchProps } from "../components/switch";
import { Label } from "../components/label";
import { Typography } from "../components/typography";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Toggle switch. Native `<input type=\"checkbox\" role=\"switch\">` (a11y). 5 size (xs/sm/md/lg/xl), controlled (`checked` + `onCheckedChange`) ve uncontrolled (`defaultChecked`) destek. Label dış `<Label>` ile, açıklama `Typography variant=\"muted\"` ile compose edilir.",
      },
    },
  },
  args: {
    size: "md",
    defaultChecked: false,
    disabled: false,
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
    onCheckedChange: { action: "checked changed" },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args: SwitchProps) => (
    <div className="flex flex-col gap-3 items-start">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 w-6">{size}</span>
          <Switch {...args} size={size} defaultChecked />
        </div>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3 items-start">
      <Switch defaultChecked={false} />
      <Switch defaultChecked />
      <Switch disabled defaultChecked={false} />
      <Switch disabled defaultChecked />
    </div>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [on, setOn] = React.useState(false);
    return (
      <div className="flex flex-col gap-3 items-start">
        <Switch checked={on} onCheckedChange={setOn} />
        <p className="text-sm text-zinc-600">
          State: <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">{String(on)}</code>
        </p>
        <button
          type="button"
          onClick={() => setOn((v) => !v)}
          className="text-xs text-zinc-700 underline underline-offset-4 cursor-pointer"
        >
          Dışarıdan toggle et
        </button>
      </div>
    );
  },
};

export const Uncontrolled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`defaultChecked` ile state internal yönetilir. Form içinde kullanışlı: `name` + `value` ile FormData'ya gider.",
      },
    },
  },
  render: () => (
    <form
      className="flex flex-col gap-3 items-start"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        alert(`notifications=${fd.get("notifications")}, marketing=${fd.get("marketing")}`);
      }}
    >
      <div className="flex items-center gap-3">
        <Switch
          id="notifications"
          name="notifications"
          value="on"
          defaultChecked
        />
        <Label htmlFor="notifications">Bildirimler açık (varsayılan)</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="marketing" name="marketing" value="on" />
        <Label htmlFor="marketing">Pazarlama e-postaları (varsayılan kapalı)</Label>
      </div>
      <button
        type="submit"
        className="mt-2 inline-flex items-center h-8 px-3 text-sm rounded-sm bg-zinc-900 text-white cursor-pointer"
      >
        Submit (alert ile FormData)
      </button>
    </form>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-sm">
      <div className="flex items-start gap-3">
        <Switch id="airplane" defaultChecked />
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="airplane">Uçak modu</Label>
          <Typography variant="muted">
            Tüm kablosuz iletişimi devre dışı bırakır.
          </Typography>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Switch id="darkmode" />
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="darkmode">Karanlık mod</Label>
          <Typography variant="muted">
            Düşük ışık koşullarında göze daha yumuşak.
          </Typography>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Switch id="sync" disabled defaultChecked />
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="sync" disabled>
            Otomatik senkronizasyon
          </Label>
          <Typography variant="muted">
            Bu hesap için kullanılamıyor.
          </Typography>
        </div>
      </div>
    </div>
  ),
};

export const SettingsList: Story = {
  render: () => (
    <div className="w-80 border border-zinc-200 rounded-sm divide-y divide-zinc-100">
      {[
        { id: "email", label: "E-posta bildirimleri", on: true },
        { id: "push", label: "Push bildirimleri", on: false },
        { id: "sms", label: "SMS bildirimleri", on: false },
        { id: "digest", label: "Haftalık özet", on: true },
      ].map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between px-4 py-3"
        >
          <Label htmlFor={item.id} className="font-normal">
            {item.label}
          </Label>
          <Switch id={item.id} defaultChecked={item.on} />
        </div>
      ))}
    </div>
  ),
};
