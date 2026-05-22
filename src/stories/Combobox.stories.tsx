import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  Combobox,
  type ComboboxOption,
  type ComboboxSize,
  type ComboboxVariant,
  type ComboboxShape,
} from "../components/combobox";

const FRAMEWORKS: ComboboxOption[] = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "vite", label: "Vite" },
  { value: "astro", label: "Astro" },
  { value: "gatsby", label: "Gatsby" },
  { value: "redwood", label: "Redwood" },
  { value: "nuxt", label: "Nuxt" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "qwik", label: "Qwik" },
  { value: "solidstart", label: "SolidStart" },
];

const COUNTRIES: ComboboxOption[] = [
  { value: "tr", label: "Turkiye" },
  { value: "us", label: "United States" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "uk", label: "United Kingdom" },
  { value: "it", label: "Italy" },
  { value: "es", label: "Spain" },
  { value: "jp", label: "Japan" },
  { value: "kr", label: "South Korea" },
  { value: "in", label: "India" },
  { value: "br", label: "Brazil" },
  { value: "ar", label: "Argentina" },
];

const TAGS_WITH_DISABLED: ComboboxOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular", disabled: true },
  { value: "svelte", label: "Svelte" },
  { value: "ember", label: "Ember", disabled: true },
  { value: "solid", label: "Solid" },
];

type StoryArgs = {
  size: ComboboxSize;
  variant: ComboboxVariant;
  shape: ComboboxShape;
  disabled: boolean;
  clearable: boolean;
  searchable: boolean;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
};

const meta: Meta<StoryArgs> = {
  title: "Components/Combobox",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Searchable single-select dropdown. Single-select variant of MultiSelect — presented as an options dropdown with fuzzy search and keyboard navigation (Arrow/Home/End/Enter/Escape). 5-size (xs/sm/md/lg/xl), 3 variant (outline/soft/ghost), 3 shape (square/rounded/pill). Form integration via native `<input type=\"hidden\" name>` ; full ARIA Combobox role support via `aria-*`.",
      },
    },
  },
  args: {
    size: "md",
    variant: "outline",
    shape: "rounded",
    disabled: false,
    clearable: true,
    searchable: true,
    placeholder: "Select framework...",
    searchPlaceholder: "Search...",
    emptyMessage: "No results",
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    variant: { control: "select", options: ["outline", "soft", "ghost"] },
    shape: { control: "select", options: ["square", "rounded", "pill"] },
    disabled: { control: "boolean" },
    clearable: { control: "boolean" },
    searchable: { control: "boolean" },
    placeholder: { control: "text" },
    searchPlaceholder: { control: "text" },
    emptyMessage: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Default: Story = {
  render: (args) => (
    <div className="w-72">
      <Combobox
        options={FRAMEWORKS}
        placeholder={args.placeholder}
        searchPlaceholder={args.searchPlaceholder}
        emptyMessage={args.emptyMessage}
        size={args.size}
        variant={args.variant}
        shape={args.shape}
        disabled={args.disabled}
        clearable={args.clearable}
        searchable={args.searchable}
      />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size: ComboboxSize) => (
        <div key={size} className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 w-6">{size}</span>
          <div className="flex-1">
            <Combobox size={size} options={FRAMEWORKS} placeholder={`Size ${size}`} />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      {(["outline", "soft", "ghost"] as const).map((variant: ComboboxVariant) => (
        <div key={variant} className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 w-16">{variant}</span>
          <div className="flex-1">
            <Combobox variant={variant} options={FRAMEWORKS} placeholder={variant} />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      {(["square", "rounded", "pill"] as const).map((shape: ComboboxShape) => (
        <div key={shape} className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 w-16">{shape}</span>
          <div className="flex-1">
            <Combobox shape={shape} options={FRAMEWORKS} placeholder={shape} />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <div className="w-72">
      <Combobox options={FRAMEWORKS} defaultValue="vite" />
    </div>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = React.useState<string | undefined>("tr");
    return (
      <div className="flex flex-col gap-3 w-72">
        <Combobox
          options={COUNTRIES}
          value={value}
          onValueChange={setValue}
          placeholder="Select country..."
        />
        <p className="text-sm text-zinc-600">
          Selected:{" "}
          <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">
            {value ?? "(none)"}
          </code>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setValue("us")}
            className="text-xs underline underline-offset-4 text-zinc-700"
          >
            Select USA
          </button>
          <button
            type="button"
            onClick={() => setValue(undefined)}
            className="text-xs underline underline-offset-4 text-zinc-700"
          >
            Clear
          </button>
        </div>
      </div>
    );
  },
};

export const WithDisabledOptions: Story = {
  render: () => (
    <div className="w-72">
      <Combobox
        options={TAGS_WITH_DISABLED}
        placeholder="Select a framework..."
      />
    </div>
  ),
};

export const NotClearable: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <p className="text-xs text-zinc-500">
        clearable=false — The X button is hidden and a value is required.
      </p>
      <Combobox
        options={FRAMEWORKS}
        defaultValue="next"
        clearable={false}
      />
    </div>
  ),
};

export const NotSearchable: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <p className="text-xs text-zinc-500">
        searchable=false — No search box, list only.
      </p>
      <Combobox
        options={FRAMEWORKS.slice(0, 5)}
        searchable={false}
        placeholder="Select..."
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <Combobox options={FRAMEWORKS} disabled placeholder="Disabled" />
      <Combobox options={FRAMEWORKS} defaultValue="next" disabled />
    </div>
  ),
};

export const LongList: Story = {
  render: function LongListStory() {
    const options: ComboboxOption[] = Array.from({ length: 100 }, (_, i) => ({
      value: `item-${i + 1}`,
      label: `Item ${i + 1}`,
    }));
    return (
      <div className="w-72">
        <Combobox options={options} placeholder="Select from 100 items..." />
      </div>
    );
  },
};

export const UserPicker: Story = {
  name: "Real Use: User Picker",
  render: function UserPickerStory() {
    const users: ComboboxOption[] = [
      { value: "u-1", label: "Kenan Gundogan" },
      { value: "u-2", label: "Ayse Yilmaz" },
      { value: "u-3", label: "Mehmet Demir" },
      { value: "u-4", label: "Zeynep Kaya" },
      { value: "u-5", label: "Ali Ozturk" },
      { value: "u-6", label: "Fatma Sahin" },
      { value: "u-7", label: "Emre Aydin" },
      { value: "u-8", label: "Selin Celik" },
    ];
    const [assignee, setAssignee] = React.useState<string | undefined>(undefined);
    return (
      <div className="flex flex-col gap-2 w-80 rounded-lg border border-zinc-200 p-4">
        <label className="text-sm font-medium text-zinc-700">
          Assignee
        </label>
        <Combobox
          options={users}
          value={assignee}
          onValueChange={setAssignee}
          placeholder="Search user..."
          searchPlaceholder="Search by name..."
        />
        {assignee && (
          <p className="text-xs text-zinc-500">
            Assigned:{" "}
            {users.find((u) => u.value === assignee)?.label}
          </p>
        )}
      </div>
    );
  },
};
