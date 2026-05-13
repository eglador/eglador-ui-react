import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ScrollArea,
  type ScrollAreaProps,
} from "../components/scroll-area";

const meta: Meta<typeof ScrollArea> = {
  title: "Components/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Styled scroll container with custom WebKit scrollbar. Orientation (vertical / horizontal / both), scrollbar visibility (auto / always / hover), 4 scrollbar sizes. Falls back to native scrollbar on non-WebKit browsers.",
      },
    },
  },
  args: {
    orientation: "vertical",
    scrollbarVisibility: "auto",
    scrollbarSize: "sm",
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal", "both"],
    },
    scrollbarVisibility: {
      control: "select",
      options: ["auto", "always", "hover"],
    },
    scrollbarSize: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
  },
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
  render: (args: ScrollAreaProps) => (
    <ScrollArea {...args} maxHeight={240} className="w-72 rounded-md border border-zinc-200">
      <div className="p-4 space-y-3 text-sm text-zinc-700">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="leading-relaxed">
            Item #{i + 1} — Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Cras a tortor at eros.
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea
      orientation="horizontal"
      maxWidth={420}
      className="rounded-md border border-zinc-200"
    >
      <div className="flex gap-3 p-4">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-32 h-24 rounded-md bg-zinc-100 flex items-center justify-center text-sm font-medium text-zinc-700"
          >
            Card {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const HoverScrollbar: Story = {
  render: () => (
    <ScrollArea
      scrollbarVisibility="hover"
      maxHeight={240}
      className="w-72 rounded-md border border-zinc-200"
    >
      <div className="p-4 space-y-3 text-sm text-zinc-700">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i}>Row {i + 1}</div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const ScrollbarSizes: Story = {
  render: () => (
    <div className="flex gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <ScrollArea
          key={size}
          scrollbarSize={size}
          maxHeight={200}
          className="w-44 rounded-md border border-zinc-200"
        >
          <div className="p-3 space-y-2 text-xs text-zinc-700">
            <div className="font-semibold text-zinc-900">{size}</div>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i}>Row {i + 1}</div>
            ))}
          </div>
        </ScrollArea>
      ))}
    </div>
  ),
};

export const Both: Story = {
  render: () => (
    <ScrollArea
      orientation="both"
      maxHeight={240}
      maxWidth={420}
      className="rounded-md border border-zinc-200"
    >
      <div className="p-4 w-[800px] grid grid-cols-6 gap-3">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-md bg-zinc-100 flex items-center justify-center text-xs text-zinc-600"
          >
            {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
