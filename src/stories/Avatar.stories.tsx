import type { Meta, StoryObj } from "@storybook/react-vite";
import { User, Bot, Crown } from "lucide-react";
import { Avatar, AvatarGroup, type AvatarProps } from "../components/avatar";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Profile image. Image / initials / icon fallback hierarchy. 5 sizes (xs / sm / md / lg / xl), 3 shapes (circle / rounded / square). Stack multiple avatars with AvatarGroup; cap with `max` and show a `+N` overflow.",
      },
    },
  },
  args: {
    size: "md",
    shape: "circle",
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    shape: { control: "select", options: ["circle", "rounded", "square"] },
    src: { control: "text" },
    name: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

const SAMPLE_IMAGE =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face";

export const Default: Story = {
  args: { src: SAMPLE_IMAGE, alt: "User avatar" },
};

export const Sizes: Story = {
  render: (args: AvatarProps) => (
    <div className="flex gap-3 items-center">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Avatar {...args} key={size} size={size} src={SAMPLE_IMAGE} />
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  render: (args: AvatarProps) => (
    <div className="flex gap-3 items-center">
      <Avatar {...args} shape="circle" src={SAMPLE_IMAGE} size="lg" />
      <Avatar {...args} shape="rounded" src={SAMPLE_IMAGE} size="lg" />
      <Avatar {...args} shape="square" src={SAMPLE_IMAGE} size="lg" />
    </div>
  ),
};

export const Names: Story = {
  render: (args: AvatarProps) => (
    <div className="flex gap-3 items-center">
      <Avatar {...args} name="Alice" />
      <Avatar {...args} name="Bob Smith" />
      <Avatar {...args} name="Charlie Brown" />
      <Avatar {...args} name="Diana" />
    </div>
  ),
};

export const WithIcon: Story = {
  render: (args: AvatarProps) => (
    <div className="flex gap-3 items-center">
      <Avatar {...args} icon={<User />} size="lg" />
      <Avatar {...args} icon={<Bot />} size="lg" />
      <Avatar {...args} icon={<Crown />} size="lg" />
    </div>
  ),
};

export const Fallback: Story = {
  render: (args: AvatarProps) => (
    <div className="flex gap-3 items-center">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Avatar {...args} key={size} size={size} />
      ))}
    </div>
  ),
};

export const BrokenImage: Story = {
  render: (args: AvatarProps) => (
    <div className="flex gap-3 items-center">
      <Avatar
        {...args}
        src="https://broken-url.com/no-image.jpg"
        name="Error User"
        size="lg"
      />
      <Avatar
        {...args}
        src="https://broken-url.com/no-image.jpg"
        size="lg"
      />
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <AvatarGroup size="md">
        <Avatar src={SAMPLE_IMAGE} />
        <Avatar name="Alice" />
        <Avatar name="Bob" />
        <Avatar name="Charlie" />
      </AvatarGroup>

      <AvatarGroup size="lg">
        <Avatar src={SAMPLE_IMAGE} />
        <Avatar name="Alice" />
        <Avatar name="Bob" />
        <Avatar name="Charlie" />
        <Avatar name="Diana" />
      </AvatarGroup>
    </div>
  ),
};

export const GroupWithMax: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <AvatarGroup size="md" max={3}>
        <Avatar src={SAMPLE_IMAGE} />
        <Avatar name="Alice" />
        <Avatar name="Bob" />
        <Avatar name="Charlie" />
        <Avatar name="Diana" />
        <Avatar name="Edward" />
      </AvatarGroup>

      <AvatarGroup size="sm" max={4}>
        <Avatar name="A" />
        <Avatar name="B" />
        <Avatar name="C" />
        <Avatar name="D" />
        <Avatar name="E" />
        <Avatar name="F" />
        <Avatar name="G" />
      </AvatarGroup>
    </div>
  ),
};
