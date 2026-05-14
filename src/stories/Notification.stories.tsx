import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Bell,
  Zap,
  Download,
} from "lucide-react";
import {
  Notification,
  NotificationIcon,
  NotificationTitle,
  NotificationDescription,
  NotificationActions,
  NotificationContainer,
  useNotification,
  renderNotification,
  type NotificationProps,
} from "../components/notification";
import { Button } from "../components/button";

const meta: Meta<typeof Notification> = {
  title: "Components/Notification",
  component: Notification,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Toast notification. Two APIs: (1) static compound (`<Notification>` + `<NotificationIcon>` / `<NotificationTitle>` / `<NotificationDescription>` / `<NotificationActions>`) with optional `onDismiss`, `duration`, `showProgress`, `pauseOnHover`, `timestamp`; (2) imperative via `useNotification()` hook + `<NotificationContainer>` portal. 3 variants, 5 sizes, 2 shapes.",
      },
    },
  },
  args: {
    variant: "outline",
    size: "md",
    shape: "rounded",
    shadow: "md",
    duration: 0,
    showProgress: false,
    pauseOnHover: true,
    dismissLabel: "Dismiss",
  },
  argTypes: {
    variant: { control: "select", options: ["soft", "outline", "solid"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    shape: { control: "select", options: ["square", "rounded"] },
    shadow: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl"],
    },
    duration: { control: { type: "number", min: 0, max: 30000, step: 500 } },
    showProgress: { control: "boolean" },
    pauseOnHover: { control: "boolean" },
    dismissLabel: { control: "text" },
    onDismiss: { action: "dismissed" },
  },
};

export default meta;
type Story = StoryObj<typeof Notification>;

export const Default: Story = {
  render: (args: NotificationProps) => (
    <Notification {...args} onDismiss={() => {}}>
      <NotificationIcon>
        <Info />
      </NotificationIcon>
      <NotificationTitle>New message received</NotificationTitle>
      <NotificationDescription>
        You have a new message from the team.
      </NotificationDescription>
    </Notification>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Notification variant="soft" onDismiss={() => {}}>
        <NotificationIcon>
          <Info />
        </NotificationIcon>
        <NotificationTitle>Soft variant</NotificationTitle>
        <NotificationDescription>
          Muted zinc background with subtle shadow.
        </NotificationDescription>
      </Notification>
      <Notification variant="outline" onDismiss={() => {}}>
        <NotificationIcon>
          <Info />
        </NotificationIcon>
        <NotificationTitle>Outline variant</NotificationTitle>
        <NotificationDescription>
          White background, bordered — default toast style.
        </NotificationDescription>
      </Notification>
      <Notification variant="solid" onDismiss={() => {}}>
        <NotificationIcon>
          <Info />
        </NotificationIcon>
        <NotificationTitle>Solid variant</NotificationTitle>
        <NotificationDescription>
          High-contrast dark surface for emphasis.
        </NotificationDescription>
      </Notification>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Notification key={size} size={size} onDismiss={() => {}}>
          <NotificationIcon>
            <Info />
          </NotificationIcon>
          <NotificationTitle>size = {size}</NotificationTitle>
          <NotificationDescription>
            Width, padding and font scale together.
          </NotificationDescription>
        </Notification>
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Notification shape="square" onDismiss={() => {}}>
        <NotificationIcon>
          <Info />
        </NotificationIcon>
        <NotificationTitle>Square corners</NotificationTitle>
      </Notification>
      <Notification shape="rounded" onDismiss={() => {}}>
        <NotificationIcon>
          <Info />
        </NotificationIcon>
        <NotificationTitle>Rounded corners (default)</NotificationTitle>
      </Notification>
    </div>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      {(["none", "xs", "sm", "md", "lg", "xl"] as const).map((shadow) => (
        <Notification key={shadow} shadow={shadow} onDismiss={() => {}}>
          <NotificationIcon>
            <Info />
          </NotificationIcon>
          <NotificationTitle>shadow = {shadow}</NotificationTitle>
          <NotificationDescription>
            Elevation scales from flat to xl.
          </NotificationDescription>
        </Notification>
      ))}
    </div>
  ),
};

export const WithActions: Story = {
  render: () => (
    <Notification onDismiss={() => {}}>
      <NotificationIcon>
        <Zap />
      </NotificationIcon>
      <NotificationTitle>New version available</NotificationTitle>
      <NotificationDescription>
        Version 2.0 is ready to install.
      </NotificationDescription>
      <NotificationActions>
        <Button size="xs">Update now</Button>
        <Button size="xs" variant="ghost">
          Later
        </Button>
      </NotificationActions>
    </Notification>
  ),
};

export const WithTimestamp: Story = {
  render: () => (
    <Notification timestamp={new Date(Date.now() - 32000)} onDismiss={() => {}}>
      <NotificationIcon>
        <Bell />
      </NotificationIcon>
      <NotificationTitle>You were mentioned</NotificationTitle>
      <NotificationDescription>
        @alex tagged you in #design-system.
      </NotificationDescription>
    </Notification>
  ),
};

export const WithProgressBar: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pair `showProgress` with `duration` to display a countdown bar. Hover pauses by default.",
      },
    },
  },
  render: function ProgressStory() {
    const [show, setShow] = React.useState(true);
    if (!show) {
      return (
        <Button size="xs" variant="outline" onClick={() => setShow(true)}>
          Replay
        </Button>
      );
    }
    return (
      <Notification
        duration={6000}
        showProgress
        onDismiss={() => setShow(false)}
      >
        <NotificationIcon>
          <Download />
        </NotificationIcon>
        <NotificationTitle>Uploading file</NotificationTitle>
        <NotificationDescription>
          Hover to pause the countdown.
        </NotificationDescription>
      </Notification>
    );
  },
};

export const StatusVariants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Semantic status via icon choice (zinc-only — meaning is in the icon, not the background color).",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <Notification onDismiss={() => {}}>
        <NotificationIcon>
          <Info />
        </NotificationIcon>
        <NotificationTitle>Information</NotificationTitle>
        <NotificationDescription>
          Your trial expires in 7 days.
        </NotificationDescription>
      </Notification>
      <Notification onDismiss={() => {}}>
        <NotificationIcon>
          <CheckCircle2 />
        </NotificationIcon>
        <NotificationTitle>Success</NotificationTitle>
        <NotificationDescription>
          Your changes have been saved.
        </NotificationDescription>
      </Notification>
      <Notification onDismiss={() => {}}>
        <NotificationIcon>
          <AlertTriangle />
        </NotificationIcon>
        <NotificationTitle>Warning</NotificationTitle>
        <NotificationDescription>
          This action cannot be undone.
        </NotificationDescription>
      </Notification>
      <Notification onDismiss={() => {}}>
        <NotificationIcon>
          <XCircle />
        </NotificationIcon>
        <NotificationTitle>Error</NotificationTitle>
        <NotificationDescription>
          Failed to connect to the server.
        </NotificationDescription>
      </Notification>
    </div>
  ),
};

export const ImperativeAPI: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `useNotification()` for toast-style imperative API. The hook returns `{ notifications, push, dismiss, dismissAll, update }`. Render via `<NotificationContainer>` (portal) using `renderNotification` helper.",
      },
    },
  },
  render: function ImperativeStory() {
    const { notifications, push, dismiss } = useNotification();
    return (
      <div className="flex gap-2 flex-wrap">
        <Button
          size="xs"
          onClick={() =>
            push({
              icon: <CheckCircle2 />,
              title: "Saved",
              description: "Your changes are live.",
              duration: 4000,
              showProgress: true,
            })
          }
        >
          Success toast
        </Button>
        <Button
          size="xs"
          variant="outline"
          onClick={() =>
            push({
              icon: <XCircle />,
              title: "Failed to save",
              description: "Check your connection and try again.",
              duration: 0,
            })
          }
        >
          Persistent error
        </Button>
        <Button
          size="xs"
          variant="ghost"
          onClick={() =>
            push({
              variant: "solid",
              icon: <Bell />,
              title: "New message",
              description: "Tap to open the inbox.",
              duration: 5000,
              timestamp: new Date(),
            })
          }
        >
          Solid + timestamp
        </Button>
        <NotificationContainer position="top-right">
          {notifications.map((item) =>
            renderNotification({ item, onDismiss: dismiss }),
          )}
        </NotificationContainer>
      </div>
    );
  },
};

export const Positions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Set position on the container — six placements with RTL-safe logical properties (`start`/`end`).",
      },
    },
  },
  render: function PositionsStory() {
    const { notifications, push, dismiss } = useNotification();
    const positions = [
      "top-right",
      "top-left",
      "top-center",
      "bottom-right",
      "bottom-left",
      "bottom-center",
    ] as const;
    return (
      <div className="flex flex-wrap gap-2">
        {positions.map((pos) => (
          <Button
            key={pos}
            size="xs"
            variant="outline"
            onClick={() =>
              push({
                id: pos,
                icon: <Bell />,
                title: pos,
                description: `Toast anchored at ${pos}.`,
                duration: 3000,
              })
            }
          >
            {pos}
          </Button>
        ))}
        {positions.map((pos) => (
          <NotificationContainer key={pos} position={pos}>
            {notifications
              .filter((n) => n.id === pos)
              .map((item) =>
                renderNotification({ item, onDismiss: dismiss }),
              )}
          </NotificationContainer>
        ))}
      </div>
    );
  },
};

export const Stacking: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`maxVisible` caps the rendered count — overflow is summarized as `+N more`.",
      },
    },
  },
  render: function StackingStory() {
    const { notifications, push, dismiss, dismissAll } = useNotification();
    const counter = React.useRef(0);
    return (
      <div className="flex gap-2">
        <Button
          size="xs"
          onClick={() => {
            counter.current += 1;
            push({
              icon: <Bell />,
              title: `Notification ${counter.current}`,
              description: "Stack me up.",
              duration: 20000,
              showProgress: true,
            });
          }}
        >
          Add
        </Button>
        <Button size="xs" variant="outline" onClick={dismissAll}>
          Clear all
        </Button>
        <NotificationContainer position="top-right" maxVisible={3}>
          {notifications.map((item) =>
            renderNotification({ item, onDismiss: dismiss }),
          )}
        </NotificationContainer>
      </div>
    );
  },
};

export const UpdateInPlace: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Mutate an existing toast with `update(id, patch)` — useful for progress flows.",
      },
    },
  },
  render: function UpdateStory() {
    const { notifications, push, dismiss, update } = useNotification();
    return (
      <div className="flex gap-2">
        <Button
          size="xs"
          onClick={() => {
            const id = push({
              icon: <Download />,
              title: "Uploading…",
              description: "0% complete",
              duration: 0,
              showProgress: true,
            });
            setTimeout(
              () => update(id, { description: "50% complete" }),
              1500,
            );
            setTimeout(
              () =>
                update(id, {
                  icon: <CheckCircle2 />,
                  title: "Complete",
                  description: "File uploaded successfully.",
                  duration: 3000,
                }),
              3000,
            );
          }}
        >
          Simulate upload
        </Button>
        <NotificationContainer position="top-right">
          {notifications.map((item) =>
            renderNotification({ item, onDismiss: dismiss }),
          )}
        </NotificationContainer>
      </div>
    );
  },
};
