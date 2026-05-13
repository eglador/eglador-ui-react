import type { Meta, StoryObj } from "@storybook/react-vite";
import { AspectRatio, type AspectRatioProps } from "../components/aspect-ratio";

const meta: Meta<typeof AspectRatio> = {
  title: "Components/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Container that enforces an aspect ratio on its children. Ready-made presets (1:1, 16:9, 4:3, 21:9, 3:2, 2:3, 9:16) or a numeric value.",
      },
    },
  },
  args: {
    ratio: "16:9",
  },
  argTypes: {
    ratio: {
      control: "select",
      options: ["1:1", "16:9", "4:3", "21:9", "3:2", "2:3", "9:16"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AspectRatio>;

export const Default: Story = {
  render: (args: AspectRatioProps) => (
    <div className="max-w-sm">
      <AspectRatio {...args} className="rounded-sm">
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 text-sm font-medium text-zinc-500">
          {String(args.ratio)}
        </div>
      </AspectRatio>
    </div>
  ),
};

export const Presets: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 max-w-xl">
      {(["1:1", "16:9", "4:3", "21:9", "3:2", "2:3"] as const).map((ratio) => (
        <div key={ratio}>
          <span className="text-xs text-zinc-400 mb-1 block">{ratio}</span>
          <AspectRatio ratio={ratio} className="rounded-sm">
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 text-sm font-medium text-zinc-500">
              {ratio}
            </div>
          </AspectRatio>
        </div>
      ))}
    </div>
  ),
};

export const WithImage: Story = {
  render: () => (
    <div className="max-w-sm">
      <AspectRatio ratio="16:9" className="rounded-sm">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80"
          alt="Landscape"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AspectRatio>
    </div>
  ),
};

export const WithVideo: Story = {
  render: () => (
    <div className="max-w-lg">
      <AspectRatio ratio="16:9" className="rounded-sm bg-black">
        <video
          src="https://www.w3schools.com/html/mov_bbb.mp4"
          controls
          className="absolute inset-0 w-full h-full object-contain"
        />
      </AspectRatio>
    </div>
  ),
};

export const CustomNumericRatio: Story = {
  render: () => (
    <div className="flex gap-4 max-w-xl">
      <div className="flex-1">
        <span className="text-xs text-zinc-400 mb-1 block">ratio: 2.35 (cinemascope)</span>
        <AspectRatio ratio={2.35} className="rounded-sm">
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 text-sm font-medium text-zinc-500">
            2.35:1
          </div>
        </AspectRatio>
      </div>
      <div className="flex-1">
        <span className="text-xs text-zinc-400 mb-1 block">ratio: 0.75 (portrait)</span>
        <AspectRatio ratio={0.75} className="rounded-sm">
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 text-sm font-medium text-zinc-500">
            3:4
          </div>
        </AspectRatio>
      </div>
    </div>
  ),
};

export const Square: Story = {
  render: () => (
    <div className="max-w-50">
      <AspectRatio ratio="1:1" className="rounded-full">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80"
          alt="Avatar"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AspectRatio>
    </div>
  ),
};

export const Portrait: Story = {
  render: () => (
    <div className="max-w-xs">
      <AspectRatio ratio="9:16" className="rounded-sm">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80"
          alt="Portrait"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AspectRatio>
    </div>
  ),
};
