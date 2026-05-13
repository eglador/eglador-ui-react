import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupProps,
} from "../components/radio-group";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Tek seçimli radio grubu. `<fieldset role=\"radiogroup\">` semantik. Tek state (`value: string`); controlled/uncontrolled. `RadioGroupItem` context'ten state'i okur — Radio + label/description compose eder. 5 size group-wide.",
      },
    },
  },
  args: {
    orientation: "vertical",
    size: "md",
    disabled: false,
    invalid: false,
  },
  argTypes: {
    orientation: { control: "select", options: ["vertical", "horizontal"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    onValueChange: { action: "value changed" },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: (args: RadioGroupProps) => (
    <RadioGroup {...args} defaultValue="apple">
      <RadioGroupItem value="apple" label="Elma" />
      <RadioGroupItem value="banana" label="Muz" />
      <RadioGroupItem value="cherry" label="Kiraz" />
      <RadioGroupItem value="date" label="Hurma" />
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: (args: RadioGroupProps) => (
    <RadioGroup {...args} orientation="horizontal" defaultValue="md">
      <RadioGroupItem value="xs" label="xs" />
      <RadioGroupItem value="sm" label="sm" />
      <RadioGroupItem value="md" label="md" />
      <RadioGroupItem value="lg" label="lg" />
      <RadioGroupItem value="xl" label="xl" />
    </RadioGroup>
  ),
};

export const WithLegend: Story = {
  render: (args: RadioGroupProps) => (
    <RadioGroup
      {...args}
      legend="Görünürlük"
      description="Bu içeriği kimler görebilir?"
      defaultValue="private"
    >
      <RadioGroupItem value="public" label="Herkese açık" />
      <RadioGroupItem value="private" label="Özel" />
      <RadioGroupItem value="invite" label="Yalnızca davetli" />
    </RadioGroup>
  ),
};

export const WithDescriptions: Story = {
  render: (args: RadioGroupProps) => (
    <RadioGroup {...args} legend="Bildirim sıklığı" defaultValue="daily">
      <RadioGroupItem
        value="realtime"
        label="Gerçek zamanlı"
        description="Bir şey olduğunda anında bildirim alın."
      />
      <RadioGroupItem
        value="daily"
        label="Günlük özet"
        description="Her gün öğleyin bir özet e-postası."
      />
      <RadioGroupItem
        value="weekly"
        label="Haftalık özet"
        description="Her pazartesi haftalık aktivite raporu."
      />
      <RadioGroupItem
        value="never"
        label="Hiç"
        description="Bildirim göndermeyin."
      />
    </RadioGroup>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <RadioGroup
          key={size}
          size={size}
          legend={`size = ${size}`}
          defaultValue="a"
        >
          <RadioGroupItem value="a" label="Seçenek A" />
          <RadioGroupItem value="b" label="Seçenek B" />
          <RadioGroupItem value="c" label="Seçenek C" />
        </RadioGroup>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <RadioGroup legend="Tüm grup disabled" disabled defaultValue="a">
        <RadioGroupItem value="a" label="Seçenek A" />
        <RadioGroupItem value="b" label="Seçenek B" />
        <RadioGroupItem value="c" label="Seçenek C" />
      </RadioGroup>

      <RadioGroup legend="Tek item disabled" defaultValue="a">
        <RadioGroupItem value="a" label="Seçenek A" />
        <RadioGroupItem value="b" label="Seçenek B (devre dışı)" disabled />
        <RadioGroupItem value="c" label="Seçenek C" />
      </RadioGroup>
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <RadioGroup
      legend="Bir seçenek seçmelisin"
      description="Devam etmek için seçim yap."
      invalid
    >
      <RadioGroupItem value="a" label="Seçenek A" />
      <RadioGroupItem value="b" label="Seçenek B" />
      <RadioGroupItem value="c" label="Seçenek C" />
    </RadioGroup>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = React.useState("free");
    return (
      <div className="flex flex-col gap-3">
        <RadioGroup
          legend="Plan"
          value={value}
          onValueChange={setValue}
        >
          <RadioGroupItem
            value="free"
            label="Free"
            description="Bireysel projeler için ideal."
          />
          <RadioGroupItem
            value="pro"
            label="Pro"
            description="Profesyoneller için gelişmiş özellikler."
          />
          <RadioGroupItem
            value="enterprise"
            label="Enterprise"
            description="Ölçeklenebilir kurumsal çözüm."
          />
        </RadioGroup>
        <p className="text-sm text-zinc-600">
          Seçili:{" "}
          <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">{value}</code>
        </p>
      </div>
    );
  },
};

export const FormSubmit: Story = {
  render: () => (
    <form
      className="flex flex-col gap-3 max-w-sm"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        alert(`plan = ${fd.get("plan")}`);
      }}
    >
      <RadioGroup
        legend="Plan seç"
        name="plan"
        defaultValue="pro"
      >
        <RadioGroupItem value="free" label="Free" />
        <RadioGroupItem value="pro" label="Pro" />
        <RadioGroupItem value="enterprise" label="Enterprise" />
      </RadioGroup>
      <button
        type="submit"
        className="mt-1 inline-flex self-start items-center h-8 px-3 text-sm rounded-sm bg-zinc-900 text-white cursor-pointer"
      >
        Submit
      </button>
    </form>
  ),
};
