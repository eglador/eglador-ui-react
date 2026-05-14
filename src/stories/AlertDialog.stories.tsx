import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  type AlertDialogProps,
} from "../components/alert-dialog";
import { Button } from "../components/button";

const meta: Meta<typeof AlertDialog> = {
  title: "Components/AlertDialog",
  component: AlertDialog,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Confirmation dialog for destructive or irreversible actions. Like Dialog but uses `role=\"alertdialog\"`, requires an explicit action/cancel (no overlay-click dismiss), and renders default-styled action buttons.",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    shape: { control: "select", options: ["square", "rounded"] },
    shadow: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl"],
    },
    defaultOpen: { control: "boolean" },
  },
  args: {
    size: "md",
    shape: "rounded",
    shadow: "lg",
    defaultOpen: false,
  },
};

export default meta;
type Story = StoryObj<typeof AlertDialog>;

export const Default: Story = {
  render: (args: AlertDialogProps) => (
    <AlertDialog key={String(args.defaultOpen)} {...args}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          Delete account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <AlertDialog key={size} size={size}>
          <AlertDialogTrigger asChild>
            <Button size="xs" variant="outline">
              {size}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>size = {size}</AlertDialogTitle>
              <AlertDialogDescription>
                The content scales to the chosen size.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      {(["square", "rounded"] as const).map((shape) => (
        <AlertDialog key={shape} shape={shape}>
          <AlertDialogTrigger asChild>
            <Button size="xs" variant="outline">
              {shape}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>shape = {shape}</AlertDialogTitle>
              <AlertDialogDescription>
                Corner radius for the alert surface.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </div>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      {(["none", "xs", "sm", "md", "lg", "xl"] as const).map((shadow) => (
        <AlertDialog key={shadow} shadow={shadow}>
          <AlertDialogTrigger asChild>
            <Button size="xs" variant="outline">
              {shadow}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>shadow = {shadow}</AlertDialogTitle>
              <AlertDialogDescription>
                Elevation level for the alert surface.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </div>
  ),
};
