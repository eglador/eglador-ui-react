import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  CheckboxGroup,
  CheckboxGroupItem,
  type CheckboxGroupProps,
} from "../components/checkbox-group";

const meta: Meta<typeof CheckboxGroup> = {
  title: "Components/CheckboxGroup",
  component: CheckboxGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Çoklu seçim checkbox grubu. `<fieldset>` semantik (gerekirse `<legend>`). Tek state (`value: string[]`); controlled/uncontrolled. `CheckboxGroupItem` context'ten state'i okur — Checkbox + label/description compose eder. 5 size group-wide.",
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
type Story = StoryObj<typeof CheckboxGroup>;

export const Default: Story = {
  render: (args: CheckboxGroupProps) => (
    <CheckboxGroup {...args} defaultValue={["apple"]}>
      <CheckboxGroupItem value="apple" label="Elma" />
      <CheckboxGroupItem value="banana" label="Muz" />
      <CheckboxGroupItem value="cherry" label="Kiraz" />
      <CheckboxGroupItem value="date" label="Hurma" />
    </CheckboxGroup>
  ),
};

export const Horizontal: Story = {
  render: (args: CheckboxGroupProps) => (
    <CheckboxGroup {...args} orientation="horizontal" defaultValue={["ts"]}>
      <CheckboxGroupItem value="react" label="React" />
      <CheckboxGroupItem value="ts" label="TypeScript" />
      <CheckboxGroupItem value="tw" label="Tailwind" />
      <CheckboxGroupItem value="next" label="Next.js" />
    </CheckboxGroup>
  ),
};

export const WithLegend: Story = {
  render: (args: CheckboxGroupProps) => (
    <CheckboxGroup
      {...args}
      legend="İlgi alanları"
      description="Birden fazla seçebilirsiniz."
      defaultValue={["react"]}
    >
      <CheckboxGroupItem value="react" label="React" />
      <CheckboxGroupItem value="vue" label="Vue" />
      <CheckboxGroupItem value="svelte" label="Svelte" />
      <CheckboxGroupItem value="angular" label="Angular" />
    </CheckboxGroup>
  ),
};

export const WithDescriptions: Story = {
  render: (args: CheckboxGroupProps) => (
    <CheckboxGroup
      {...args}
      legend="Bildirim ayarları"
      defaultValue={["email", "weekly"]}
    >
      <CheckboxGroupItem
        value="email"
        label="E-posta bildirimleri"
        description="Önemli güncellemeler için e-posta al."
      />
      <CheckboxGroupItem
        value="push"
        label="Push bildirimleri"
        description="Mobil ve masaüstü push uyarıları."
      />
      <CheckboxGroupItem
        value="sms"
        label="SMS bildirimleri"
        description="Telefonunuza kısa mesaj gönderir."
      />
      <CheckboxGroupItem
        value="weekly"
        label="Haftalık özet"
        description="Her pazartesi haftalık aktivite e-postası."
      />
    </CheckboxGroup>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <CheckboxGroup
          key={size}
          size={size}
          legend={`size = ${size}`}
          defaultValue={["a"]}
        >
          <CheckboxGroupItem value="a" label="Seçenek A" />
          <CheckboxGroupItem value="b" label="Seçenek B" />
          <CheckboxGroupItem value="c" label="Seçenek C" />
        </CheckboxGroup>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <CheckboxGroup legend="Tüm grup disabled" disabled defaultValue={["a"]}>
        <CheckboxGroupItem value="a" label="Seçenek A" />
        <CheckboxGroupItem value="b" label="Seçenek B" />
        <CheckboxGroupItem value="c" label="Seçenek C" />
      </CheckboxGroup>

      <CheckboxGroup
        legend="Tek item disabled"
        defaultValue={["a"]}
      >
        <CheckboxGroupItem value="a" label="Seçenek A" />
        <CheckboxGroupItem value="b" label="Seçenek B (devre dışı)" disabled />
        <CheckboxGroupItem value="c" label="Seçenek C" />
      </CheckboxGroup>
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <CheckboxGroup
      legend="En az bir seçenek seçmelisiniz"
      description="Lütfen bir veya daha fazla öğe işaretleyin."
      invalid
    >
      <CheckboxGroupItem value="a" label="Seçenek A" />
      <CheckboxGroupItem value="b" label="Seçenek B" />
      <CheckboxGroupItem value="c" label="Seçenek C" />
    </CheckboxGroup>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = React.useState<string[]>(["react"]);
    return (
      <div className="flex flex-col gap-3">
        <CheckboxGroup
          legend="Teknolojiler"
          value={value}
          onValueChange={setValue}
        >
          <CheckboxGroupItem value="react" label="React" />
          <CheckboxGroupItem value="vue" label="Vue" />
          <CheckboxGroupItem value="svelte" label="Svelte" />
        </CheckboxGroup>
        <p className="text-sm text-zinc-600">
          Seçili:{" "}
          <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">
            {JSON.stringify(value)}
          </code>
        </p>
        <button
          type="button"
          onClick={() => setValue([])}
          className="self-start text-xs text-zinc-700 underline underline-offset-4 cursor-pointer"
        >
          Hepsini temizle
        </button>
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
        const all = fd.getAll("interests");
        alert(`interests = ${JSON.stringify(all)}`);
      }}
    >
      <CheckboxGroup
        legend="İlgi alanları"
        name="interests"
        defaultValue={["react", "ts"]}
      >
        <CheckboxGroupItem value="react" label="React" />
        <CheckboxGroupItem value="ts" label="TypeScript" />
        <CheckboxGroupItem value="tw" label="Tailwind CSS" />
        <CheckboxGroupItem value="next" label="Next.js" />
      </CheckboxGroup>
      <button
        type="submit"
        className="mt-1 inline-flex self-start items-center h-8 px-3 text-sm rounded-sm bg-zinc-900 text-white cursor-pointer"
      >
        Submit
      </button>
    </form>
  ),
};
