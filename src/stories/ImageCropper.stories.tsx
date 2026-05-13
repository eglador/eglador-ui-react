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
  },
  args: { aspect: 1, cropShape: "rect" },
};

export default meta;
type Story = StoryObj<typeof ImageCropper>;

export const Default: Story = {
  render: (args) => (
    <ImageCropper
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
