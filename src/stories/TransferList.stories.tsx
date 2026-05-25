import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  TransferList,
  TransferListColumn,
  TransferListHeader,
  TransferListTitle,
  TransferListCount,
  TransferListSearch,
  TransferListItems,
  TransferListControls,
  TransferListFooter,
  TransferListSelectAll,
  type TransferListProps,
  type TransferListOption,
} from "../components/transfer-list";

const SAMPLE: TransferListOption[] = [
  { value: "react", label: "React" },
  { value: "ts", label: "TypeScript" },
  { value: "node", label: "Node.js" },
  { value: "css", label: "Tailwind CSS" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "py", label: "Python" },
  { value: "java", label: "Java" },
  { value: "kt", label: "Kotlin", disabled: true },
  { value: "swift", label: "Swift" },
  { value: "rb", label: "Ruby" },
  { value: "php", label: "PHP" },
];

const meta: Meta<typeof TransferList> = {
  title: "Components/TransferList",
  component: TransferList,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Dual-list transfer (a.k.a. picker / shuttle) with selectable items, search, optional reordering, and full keyboard support. Controlled or uncontrolled. 5 sizes, 3 variants, 3 shapes. Responsive: columns stack vertically and the controls become a horizontal toolbar below the `md` breakpoint (chevrons rotate 90° to match the new axis). Compound API: `TransferList` + `TransferListColumn` + `TransferListHeader` (`TransferListTitle` + `TransferListCount`) + `TransferListSearch` + `TransferListItems` + `TransferListControls` + `TransferListFooter` (`TransferListSelectAll`).",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    variant: { control: "select", options: ["outline", "soft", "ghost"] },
    shape: { control: "select", options: ["square", "rounded", "pill"] },
    searchable: { control: "boolean" },
    reorderable: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    size: "md",
    variant: "outline",
    shape: "rounded",
    searchable: true,
    reorderable: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof TransferList>;

export const Default: Story = {
  render: (args: TransferListProps) => (
    <div className="max-w-3xl">
      <TransferList {...args} options={SAMPLE} defaultValue={["react", "ts"]}>
        <TransferListColumn side="source">
          <TransferListHeader>
            <TransferListTitle>Available</TransferListTitle>
            <TransferListCount />
          </TransferListHeader>
          {args.searchable && <TransferListSearch placeholder="Search available…" />}
          <TransferListItems />
          <TransferListFooter>
            <TransferListSelectAll />
          </TransferListFooter>
        </TransferListColumn>

        <TransferListControls />

        <TransferListColumn side="target">
          <TransferListHeader>
            <TransferListTitle>Selected</TransferListTitle>
            <TransferListCount />
          </TransferListHeader>
          {args.searchable && <TransferListSearch placeholder="Search selected…" />}
          <TransferListItems />
          <TransferListFooter>
            <TransferListSelectAll />
          </TransferListFooter>
        </TransferListColumn>
      </TransferList>
    </div>
  ),
};

export const Minimal: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pass no children to render the default layout: two columns plus the transfer controls.",
      },
    },
  },
  render: (args: TransferListProps) => (
    <div className="max-w-3xl">
      <TransferList {...args} options={SAMPLE} defaultValue={["react", "ts"]} />
    </div>
  ),
};

export const Reorderable: Story = {
  args: { reorderable: true },
  parameters: {
    docs: {
      description: {
        story:
          "When `reorderable` is true, hover or focus an item in the selected column to reveal up/down buttons. The order of `value` reflects the user's transfer/reorder history.",
      },
    },
  },
  render: (args: TransferListProps) => (
    <div className="max-w-3xl">
      <TransferList
        {...args}
        options={SAMPLE}
        defaultValue={["react", "ts", "node"]}
      >
        <TransferListColumn side="source">
          <TransferListHeader>
            <TransferListTitle>Available</TransferListTitle>
            <TransferListCount />
          </TransferListHeader>
          <TransferListSearch />
          <TransferListItems />
        </TransferListColumn>
        <TransferListControls />
        <TransferListColumn side="target">
          <TransferListHeader>
            <TransferListTitle>Selected (drag-free reorder)</TransferListTitle>
            <TransferListCount />
          </TransferListHeader>
          <TransferListSearch />
          <TransferListItems />
        </TransferListColumn>
      </TransferList>
    </div>
  ),
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "External state via `value` + `onValueChange`. Inspect the current value below the component.",
      },
    },
  },
  render: (args: TransferListProps) => {
    const [value, setValue] = React.useState<string[]>(["ts", "react"]);
    return (
      <div className="flex max-w-3xl flex-col gap-3">
        <TransferList
          {...args}
          options={SAMPLE}
          value={value}
          onValueChange={setValue}
        />
        <pre className="rounded-md border border-zinc-200 bg-zinc-50 p-2 text-xs text-zinc-700">
          value = {JSON.stringify(value, null, 2)}
        </pre>
      </div>
    );
  },
};

export const WithSelectAll: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The footer can host a `TransferListSelectAll` checkbox per column. Indeterminate state surfaces when some (but not all) filtered items are checked.",
      },
    },
  },
  render: (args: TransferListProps) => (
    <div className="max-w-3xl">
      <TransferList {...args} options={SAMPLE} defaultValue={["react"]}>
        <TransferListColumn side="source">
          <TransferListHeader>
            <TransferListTitle>Available</TransferListTitle>
            <TransferListCount />
          </TransferListHeader>
          <TransferListSearch />
          <TransferListItems />
          <TransferListFooter>
            <TransferListSelectAll>Select all available</TransferListSelectAll>
          </TransferListFooter>
        </TransferListColumn>
        <TransferListControls />
        <TransferListColumn side="target">
          <TransferListHeader>
            <TransferListTitle>Selected</TransferListTitle>
            <TransferListCount />
          </TransferListHeader>
          <TransferListSearch />
          <TransferListItems />
          <TransferListFooter>
            <TransferListSelectAll>Select all selected</TransferListSelectAll>
          </TransferListFooter>
        </TransferListColumn>
      </TransferList>
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: "All five sizes side by side." } },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
        <div key={s} className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            size = {s}
          </span>
          <TransferList
            size={s}
            options={SAMPLE.slice(0, 6)}
            defaultValue={["react"]}
            searchable
          />
        </div>
      ))}
    </div>
  ),
};

export const Variants: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: "outline / soft / ghost surface treatments." } },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      {(["outline", "soft", "ghost"] as const).map((v) => (
        <div key={v} className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            variant = {v}
          </span>
          <TransferList
            variant={v}
            options={SAMPLE.slice(0, 6)}
            defaultValue={["react"]}
          />
        </div>
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: "square / rounded / pill corner treatments." } },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      {(["square", "rounded", "pill"] as const).map((sh) => (
        <div key={sh} className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            shape = {sh}
          </span>
          <TransferList
            shape={sh}
            options={SAMPLE.slice(0, 6)}
            defaultValue={["react"]}
          />
        </div>
      ))}
    </div>
  ),
};

export const DisabledItems: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Per-item `disabled: true` makes an entry non-transferable and not toggleable. The whole list can also be disabled via the root prop.",
      },
    },
  },
  render: (args: TransferListProps) => (
    <div className="max-w-3xl">
      <TransferList
        {...args}
        options={SAMPLE}
        defaultValue={["react", "ts"]}
      />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args: TransferListProps) => (
    <div className="max-w-3xl">
      <TransferList
        {...args}
        options={SAMPLE.slice(0, 6)}
        defaultValue={["react"]}
      />
    </div>
  ),
};

export const CustomItem: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Override item rendering via `renderItem`. The handler receives the option plus its current side/checked/disabled state.",
      },
    },
  },
  render: (args: TransferListProps) => {
    const data: (TransferListOption & { meta: string })[] = [
      { value: "u1", label: "Ada Lovelace", meta: "Engineer" },
      { value: "u2", label: "Alan Turing", meta: "Cryptographer" },
      { value: "u3", label: "Grace Hopper", meta: "Admiral" },
      { value: "u4", label: "Linus Torvalds", meta: "Maintainer" },
      { value: "u5", label: "Margaret Hamilton", meta: "Director of SE" },
    ];
    return (
      <div className="max-w-3xl">
        <TransferList
          {...args}
          options={data}
          defaultValue={["u1"]}
          renderItem={(opt, { checked, disabled }) => {
            const m = data.find((d) => d.value === opt.value);
            return (
              <div
                className={[
                  "flex cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2",
                  checked ? "bg-zinc-100" : "hover:bg-zinc-50",
                  disabled ? "pointer-events-none opacity-50" : "",
                ].join(" ")}
              >
                <span
                  aria-hidden="true"
                  className={[
                    "inline-flex size-8 shrink-0 items-center justify-center rounded-full font-medium text-white",
                    checked ? "bg-zinc-900" : "bg-zinc-400",
                  ].join(" ")}
                >
                  {opt.label
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <span className="flex flex-col min-w-0">
                  <span className="truncate text-sm font-medium text-zinc-900">
                    {opt.label}
                  </span>
                  <span className="truncate text-xs text-zinc-500">{m?.meta}</span>
                </span>
              </div>
            );
          }}
        />
      </div>
    );
  },
};
