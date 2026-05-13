import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImageCropper } from "../components/image-cropper";

const meta: Meta<typeof ImageCropper> = {
  title: "Components/ImageCropper",
  component: ImageCropper,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Drag-to-pan, scroll/range-to-zoom image crop viewport. Reports `{ x, y, width, height, zoom }` (normalised 0–1) via `onChange`. Use the returned offsets with a canvas / server-side resize to produce the final crop.",
      },
    },
  },
  argTypes: {
    aspect: { control: { type: "number", min: 0.5, max: 4, step: 0.1 } },
    cropShape: { control: "select", options: ["rect", "circle"] },
    minZoom: { control: { type: "number", min: 0.5, max: 2, step: 0.1 } },
    maxZoom: { control: { type: "number", min: 1, max: 10, step: 0.5 } },
    defaultZoom: { control: { type: "number", min: 0.5, max: 10, step: 0.1 } },
  },
  args: {
    aspect: 1,
    cropShape: "rect",
    minZoom: 1,
    maxZoom: 3,
    defaultZoom: 1,
  },
};

export default meta;
type Story = StoryObj<typeof ImageCropper>;

export const Default: Story = {
  render: (args) => (
    <ImageCropper
      key={`${args.defaultZoom}-${args.minZoom}-${args.maxZoom}-${args.aspect}-${args.cropShape}`}
      {...args}
      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800"
    />
  ),
};

export const Circle: Story = {
  render: () => (
    <ImageCropper
      cropShape="circle"
      aspect={1}
      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800"
    />
  ),
};
