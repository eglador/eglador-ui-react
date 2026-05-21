import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  ColorPicker,
  type ColorPickerSize,
  type ColorPickerVariant,
  type ColorPickerShape,
} from "../components/color-picker";

type StoryArgs = {
  size: ColorPickerSize;
  variant: ColorPickerVariant;
  shape: ColorPickerShape;
  alpha: boolean;
  showHex: boolean;
  disabled: boolean;
  defaultValue: string;
};

const meta: Meta<StoryArgs> = {
  title: "Components/ColorPicker",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "HSV-tabanli renk secici. 2D Saturation/Value alani + Hue slider + opsiyonel Alpha slider + Hex input + Tailwind palette presets. Trigger button kontrol disinda mevcut rengi swatch + hex string olarak gosterir, popover'da picker acilir. 5-size (xs/sm/md/lg/xl), 3 variant (outline/soft/ghost), 3 shape (square/rounded/pill). Klavye nav: Arrow keys SV/Hue/Alpha icin, PageUp/Down hue icin 10°, Home/End ile uc degerler. Form integration native hidden input ile.",
      },
    },
  },
  args: {
    size: "md",
    variant: "outline",
    shape: "rounded",
    alpha: false,
    showHex: true,
    disabled: false,
    defaultValue: "#3b82f6",
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    variant: { control: "select", options: ["outline", "soft", "ghost"] },
    shape: { control: "select", options: ["square", "rounded", "pill"] },
    alpha: { control: "boolean" },
    showHex: { control: "boolean" },
    disabled: { control: "boolean" },
    defaultValue: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Default: Story = {
  render: function DefaultStory(args) {
    const [color, setColor] = React.useState(args.defaultValue);
    React.useEffect(() => {
      setColor(args.defaultValue);
    }, [args.defaultValue]);
    return (
      <div className="flex items-center gap-4">
        <ColorPicker
          key={`${args.size}-${args.variant}-${args.shape}-${args.alpha}`}
          value={color}
          onValueChange={setColor}
          size={args.size}
          variant={args.variant}
          shape={args.shape}
          alpha={args.alpha}
          showHex={args.showHex}
          disabled={args.disabled}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Live:</span>
          <code className="rounded-sm bg-zinc-100 px-1.5 py-0.5 font-mono text-xs">
            {color}
          </code>
        </div>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      {(["xs", "sm", "md", "lg", "xl"] as const).map(
        (size: ColorPickerSize) => (
          <div key={size} className="flex items-center gap-3">
            <span className="w-6 text-xs text-zinc-400">{size}</span>
            <ColorPicker defaultValue="#10b981" size={size} />
          </div>
        ),
      )}
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      {(["outline", "soft", "ghost"] as const).map(
        (variant: ColorPickerVariant) => (
          <div key={variant} className="flex items-center gap-3">
            <span className="w-16 text-xs text-zinc-400">{variant}</span>
            <ColorPicker defaultValue="#ec4899" variant={variant} />
          </div>
        ),
      )}
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      {(["square", "rounded", "pill"] as const).map(
        (shape: ColorPickerShape) => (
          <div key={shape} className="flex items-center gap-3">
            <span className="w-16 text-xs text-zinc-400">{shape}</span>
            <ColorPicker defaultValue="#f59e0b" shape={shape} />
          </div>
        ),
      )}
    </div>
  ),
};

export const WithAlpha: Story = {
  name: "With Alpha Channel",
  render: function AlphaStory() {
    const [color, setColor] = React.useState("#3b82f680");
    return (
      <div className="flex flex-col gap-3">
        <ColorPicker value={color} onValueChange={setColor} alpha />
        <p className="text-sm text-zinc-600">
          Hex (8-haneli):{" "}
          <code className="rounded-sm bg-zinc-100 px-1.5 py-0.5 font-mono text-xs">
            {color}
          </code>
        </p>
      </div>
    );
  },
};

export const CustomPresets: Story = {
  render: () => (
    <ColorPicker
      defaultValue="#0a0a0a"
      presets={[
        "#0a0a0a",
        "#262626",
        "#404040",
        "#737373",
        "#a3a3a3",
        "#d4d4d4",
        "#e5e5e5",
        "#f5f5f5",
        "#fafafa",
        "#ffffff",
      ]}
    />
  ),
};

export const NoPresets: Story = {
  render: () => <ColorPicker defaultValue="#8b5cf6" presets={[]} />,
};

export const Disabled: Story = {
  render: () => (
    <div className="flex gap-3">
      <ColorPicker defaultValue="#3b82f6" disabled />
      <ColorPicker defaultValue="#ef4444" variant="soft" disabled />
    </div>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [color, setColor] = React.useState("#ec4899");
    const [committed, setCommitted] = React.useState("#ec4899");
    return (
      <div className="flex flex-col gap-3">
        <ColorPicker
          value={color}
          onValueChange={setColor}
          onValueCommit={setCommitted}
        />
        <div className="flex flex-col gap-1 text-sm">
          <p>
            Live:{" "}
            <code className="rounded-sm bg-zinc-100 px-1.5 py-0.5 font-mono text-xs">
              {color}
            </code>
          </p>
          <p>
            Commit (release sonrasi):{" "}
            <code className="rounded-sm bg-zinc-100 px-1.5 py-0.5 font-mono text-xs">
              {committed}
            </code>
          </p>
        </div>
        <div className="flex gap-2">
          {["#ef4444", "#10b981", "#3b82f6", "#f59e0b"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className="size-6 rounded-sm border border-zinc-300"
              style={{ background: c }}
              aria-label={`Set ${c}`}
            />
          ))}
        </div>
      </div>
    );
  },
};

export const NoHexLabel: Story = {
  name: "Swatch Only (no hex label)",
  render: () => (
    <ColorPicker defaultValue="#22c55e" showHex={false} shape="pill" />
  ),
};

export const ThemeColorEditor: Story = {
  name: "Real Use: Theme Editor",
  render: function ThemeStory() {
    const [theme, setTheme] = React.useState({
      primary: "#3b82f6",
      accent: "#ec4899",
      background: "#ffffff",
      foreground: "#0a0a0a",
    });
    return (
      <div
        className="flex flex-col gap-4 rounded-lg border p-4"
        style={{
          background: theme.background,
          color: theme.foreground,
          borderColor: theme.foreground + "20",
        }}
      >
        <div>
          <h3 className="text-base font-semibold">Tema Onizleme</h3>
          <p className="text-sm opacity-70">
            Renkleri degistirip kart goruntusunun nasil etkilenecegini gor.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md px-3 py-1.5 text-sm font-medium"
            style={{ background: theme.primary, color: "#ffffff" }}
          >
            Primary
          </button>
          <button
            type="button"
            className="rounded-md px-3 py-1.5 text-sm font-medium"
            style={{ background: theme.accent, color: "#ffffff" }}
          >
            Accent
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(
            [
              ["primary", "Primary"],
              ["accent", "Accent"],
              ["background", "Background"],
              ["foreground", "Foreground"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium opacity-70">{label}</span>
              <ColorPicker
                size="sm"
                value={theme[key]}
                onValueChange={(c) =>
                  setTheme((t) => ({ ...t, [key]: c }))
                }
              />
            </div>
          ))}
        </div>
      </div>
    );
  },
};

export const PaletteSwatch: Story = {
  name: "Real Use: Palette Builder",
  render: function PaletteStory() {
    const [colors, setColors] = React.useState<string[]>([
      "#ef4444",
      "#f59e0b",
      "#10b981",
      "#3b82f6",
      "#8b5cf6",
    ]);
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-zinc-700">
          Paletini olustur
        </p>
        <div className="flex flex-wrap gap-2">
          {colors.map((c, i) => (
            <ColorPicker
              key={i}
              size="sm"
              showHex={false}
              shape="pill"
              value={c}
              onValueChange={(next) =>
                setColors((arr) => arr.map((x, idx) => (idx === i ? next : x)))
              }
            />
          ))}
        </div>
        <div className="flex h-12 gap-0 overflow-hidden rounded-md">
          {colors.map((c, i) => (
            <div
              key={i}
              className="flex-1"
              style={{ background: c }}
              title={c}
            />
          ))}
        </div>
        <pre className="rounded-sm bg-zinc-100 p-2 text-xs">
          {JSON.stringify(colors, null, 2)}
        </pre>
      </div>
    );
  },
};
