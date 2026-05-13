import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  type DrawerProps,
} from "../components/drawer";
import { Button } from "../components/button";

const meta: Meta<typeof Drawer> = {
  title: "Components/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Slide-in panel from any edge. Compound API: `<Drawer>` + `<DrawerTrigger>` + `<DrawerContent>` + `<DrawerHeader>` / `<DrawerBody>` / `<DrawerFooter>` / `<DrawerTitle>` / `<DrawerDescription>` / `<DrawerClose>`. 4 sides + 6 sizes (xs–xl, full), Escape + overlay-click close, body-scroll lock.",
      },
    },
  },
  argTypes: {
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "full"],
    },
    shape: { control: "select", options: ["square", "rounded"] },
    shadow: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl"],
    },
  },
  args: {
    side: "right",
    size: "md",
    shape: "square",
    shadow: "lg",
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  render: (args: DrawerProps) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          Open drawer
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Workspace settings</DrawerTitle>
          <DrawerDescription>
            Configure your workspace defaults. Changes save automatically.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Drawer body content. Scroll if it overflows. Use the body slot for
            forms or any scrollable region — the header and footer stay pinned.
          </p>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button size="sm">Save</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const Sides: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Drawer key={side} side={side}>
          <DrawerTrigger asChild>
            <Button size="xs" variant="outline">
              {side}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Drawer from {side}</DrawerTitle>
              <DrawerDescription>
                Slides in from the {side} edge.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerBody>
              <p className="text-sm text-zinc-600">Content area.</p>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Rounded drawers only round the inner edges (the edges that face the viewport content); the anchor edges stay flush against the viewport.",
      },
    },
  },
  render: () => (
    <div className="flex gap-2 flex-wrap">
      {(["square", "rounded"] as const).map((shape) => (
        <Drawer key={shape} shape={shape}>
          <DrawerTrigger asChild>
            <Button size="xs" variant="outline">
              {shape}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>shape = {shape}</DrawerTitle>
              <DrawerDescription>
                Corner radius on the inward edge.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerBody>
              <p className="text-sm text-zinc-600">Body content.</p>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      {(["none", "xs", "sm", "md", "lg", "xl"] as const).map((shadow) => (
        <Drawer key={shadow} shadow={shadow}>
          <DrawerTrigger asChild>
            <Button size="xs" variant="outline">
              {shadow}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>shadow = {shadow}</DrawerTitle>
              <DrawerDescription>
                Elevation level for the drawer surface.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerBody>
              <p className="text-sm text-zinc-600">Body content.</p>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  ),
};
