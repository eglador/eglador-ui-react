import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  NumberInput,
  type NumberInputSize,
  type NumberInputVariant,
  type NumberInputShape,
  type NumberInputStepperPosition,
} from "../components/number-input";

type StoryArgs = {
  size: NumberInputSize;
  variant: NumberInputVariant;
  shape: NumberInputShape;
  stepper: NumberInputStepperPosition;
  min: number;
  max: number;
  step: number;
  precision: number;
  disabled: boolean;
  allowMouseWheel: boolean;
  defaultValue: number;
};

const meta: Meta<StoryArgs> = {
  title: "Components/NumberInput",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Explicit numeric input + stepper. min/max clamp, step increment, precision (decimal), keyboard nav (ArrowUp/Down, PageUp/Down, Home/End), opsiyonel mouse wheel. 5-size, 3 variant, 3 shape, 3 stepper position (inline / stacked / none). Prefix/suffix slot'lari para birimi, birim gibi durumlara. Intl.NumberFormat ile blur'da formatlanir.",
      },
    },
  },
  args: {
    size: "md",
    variant: "outline",
    shape: "rounded",
    stepper: "inline",
    min: 0,
    max: 100,
    step: 1,
    precision: 0,
    disabled: false,
    allowMouseWheel: false,
    defaultValue: 10,
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    variant: { control: "select", options: ["outline", "soft", "ghost"] },
    shape: { control: "select", options: ["square", "rounded", "pill"] },
    stepper: { control: "select", options: ["inline", "stacked", "none"] },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    precision: { control: { type: "number", min: 0, max: 8 } },
    disabled: { control: "boolean" },
    allowMouseWheel: { control: "boolean" },
    defaultValue: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Default: Story = {
  render: function DefaultStory(args) {
    const [value, setValue] = React.useState<number | null>(args.defaultValue);
    React.useEffect(() => {
      setValue(args.defaultValue);
    }, [args.defaultValue]);
    return (
      <div className="flex flex-col gap-3 w-72">
        <NumberInput
          value={value}
          onValueChange={setValue}
          size={args.size}
          variant={args.variant}
          shape={args.shape}
          stepper={args.stepper}
          min={args.min}
          max={args.max}
          step={args.step}
          precision={args.precision}
          disabled={args.disabled}
          allowMouseWheel={args.allowMouseWheel}
        />
        <p className="text-sm text-zinc-600">
          Value:{" "}
          <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm font-mono text-xs">
            {value === null ? "null" : value}
          </code>
        </p>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size: NumberInputSize) => (
        <div key={size} className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 w-6">{size}</span>
          <div className="flex-1">
            <NumberInput defaultValue={10} size={size} />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      {(["outline", "soft", "ghost"] as const).map(
        (variant: NumberInputVariant) => (
          <div key={variant} className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 w-16">{variant}</span>
            <div className="flex-1">
              <NumberInput defaultValue={42} variant={variant} />
            </div>
          </div>
        ),
      )}
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      {(["square", "rounded", "pill"] as const).map(
        (shape: NumberInputShape) => (
          <div key={shape} className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 w-16">{shape}</span>
            <div className="flex-1">
              <NumberInput defaultValue={42} shape={shape} />
            </div>
          </div>
        ),
      )}
    </div>
  ),
};

export const StepperPositions: Story = {
  name: "Stepper Positions",
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      {(
        [
          ["inline", "Inline (yan yana saga)"],
          ["stacked", "Stacked (alt alta sag tarafta)"],
          ["none", "None (sadece input)"],
        ] as const
      ).map(([pos, label]) => (
        <div key={pos} className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-500">{label}</span>
          <NumberInput defaultValue={42} stepper={pos} />
        </div>
      ))}
    </div>
  ),
};

export const WithPrefixSuffix: Story = {
  name: "Prefix / Suffix",
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <NumberInput defaultValue={250} prefix="₺" precision={2} step={0.5} />
      <NumberInput defaultValue={75} suffix="%" min={0} max={100} />
      <NumberInput defaultValue={1500} prefix="$" suffix="USD" precision={2} step={0.01} />
      <NumberInput
        defaultValue={120}
        suffix={
          <span className="text-xs font-medium text-zinc-500">km/h</span>
        }
      />
    </div>
  ),
};

export const Decimal: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-zinc-500">precision=2, step=0.01</span>
        <NumberInput defaultValue={9.99} precision={2} step={0.01} prefix="$" />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-zinc-500">precision=3, step=0.001</span>
        <NumberInput defaultValue={1.234} precision={3} step={0.001} />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-zinc-500">precision=0, step=10</span>
        <NumberInput defaultValue={50} precision={0} step={10} />
      </div>
    </div>
  ),
};

export const MinMaxClamp: Story = {
  name: "Min / Max Clamp",
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-zinc-500">min=0, max=10</span>
        <NumberInput defaultValue={5} min={0} max={10} />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-zinc-500">min=-50, max=50</span>
        <NumberInput defaultValue={0} min={-50} max={50} />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-zinc-500">sadece min (max yok)</span>
        <NumberInput defaultValue={100} min={0} />
      </div>
    </div>
  ),
};

export const FormattedDisplay: Story = {
  name: "Formatted Display (Intl)",
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-zinc-500">Turkish lira (focus disinda formatlanir)</span>
        <NumberInput
          defaultValue={1234567.89}
          precision={2}
          step={0.01}
          locale="tr-TR"
          formatOptions={{
            style: "currency",
            currency: "TRY",
          }}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-zinc-500">US dollar</span>
        <NumberInput
          defaultValue={1234.56}
          precision={2}
          step={0.01}
          locale="en-US"
          formatOptions={{
            style: "currency",
            currency: "USD",
          }}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-zinc-500">Percentage</span>
        <NumberInput
          defaultValue={0.85}
          precision={2}
          step={0.01}
          min={0}
          max={1}
          locale="en-US"
          formatOptions={{ style: "percent" }}
        />
      </div>
    </div>
  ),
};

export const MouseWheel: Story = {
  name: "Mouse Wheel",
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <p className="text-xs text-zinc-500">
        Input'a tikla ve mouse wheel ile arttir/azalt
      </p>
      <NumberInput defaultValue={50} min={0} max={100} allowMouseWheel />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <NumberInput defaultValue={42} disabled />
      <NumberInput defaultValue={42} variant="soft" disabled />
    </div>
  ),
};

export const QuantityPicker: Story = {
  name: "Real Use: Quantity Picker",
  render: function QuantityStory() {
    const [qty, setQty] = React.useState<number | null>(1);
    const unitPrice = 24.99;
    const total = (qty ?? 0) * unitPrice;
    return (
      <div className="flex flex-col gap-3 w-80 rounded-lg border border-zinc-200 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-700">Adet</span>
          <NumberInput
            value={qty}
            onValueChange={setQty}
            min={1}
            max={99}
            step={1}
            size="sm"
            className="w-32"
          />
        </div>
        <div className="flex items-center justify-between border-t border-zinc-200 pt-3">
          <span className="text-sm text-zinc-500">Toplam</span>
          <span className="text-base font-semibold text-zinc-900">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
    );
  },
};

export const PriceEditor: Story = {
  name: "Real Use: Price Editor",
  render: function PriceStory() {
    const [price, setPrice] = React.useState<number | null>(99.99);
    return (
      <div className="flex flex-col gap-3 w-72">
        <label className="text-sm font-medium text-zinc-700">
          Urun Fiyati
        </label>
        <NumberInput
          value={price}
          onValueChange={setPrice}
          prefix="₺"
          precision={2}
          step={0.01}
          min={0}
          locale="tr-TR"
          formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
        />
        <p className="text-xs text-zinc-500">
          Focus icinde ham deger, blur sonrasi format gosterir
        </p>
      </div>
    );
  },
};
