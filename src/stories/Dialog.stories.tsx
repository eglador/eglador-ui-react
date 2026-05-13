import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  type DialogProps,
} from "../components/dialog";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Modal dialog. Compound API: `<Dialog>` + `<DialogTrigger>` + `<DialogContent>` + `<DialogHeader>` / `<DialogTitle>` / `<DialogDescription>` / `<DialogFooter>` / `<DialogClose>`. 6 sizes (xs–xl, full), Escape + overlay-click close, focus-trap, body-scroll lock, portal-rendered.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "full"],
    },
    shape: { control: "select", options: ["square", "rounded"] },
    shadow: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl"],
    },
    modal: { control: "boolean" },
  },
  args: { size: "md", shape: "rounded", shadow: "lg", modal: true },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: (args: DialogProps) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          <div className="flex items-center gap-3">
            <Label htmlFor="name" className="w-24 text-end">
              Name
            </Label>
            <Input id="name" defaultValue="Kenan Gündoğan" className="flex-1" />
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="username" className="w-24 text-end">
              Username
            </Label>
            <Input id="username" defaultValue="@kenan" className="flex-1" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button size="sm">Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      {(["xs", "sm", "md", "lg", "xl", "full"] as const).map((size) => (
        <Dialog key={size} size={size}>
          <DialogTrigger asChild>
            <Button size="xs" variant="outline">
              {size}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>size = {size}</DialogTitle>
              <DialogDescription>
                The content scales to the chosen size.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      {(["square", "rounded"] as const).map((shape) => (
        <Dialog key={shape} shape={shape}>
          <DialogTrigger asChild>
            <Button size="xs" variant="outline">
              {shape}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>shape = {shape}</DialogTitle>
              <DialogDescription>
                Corner radius for the modal surface.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      {(["none", "xs", "sm", "md", "lg", "xl"] as const).map((shadow) => (
        <Dialog key={shadow} shadow={shadow}>
          <DialogTrigger asChild>
            <Button size="xs" variant="outline">
              {shadow}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>shadow = {shadow}</DialogTitle>
              <DialogDescription>
                Elevation level for the modal surface.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
};
