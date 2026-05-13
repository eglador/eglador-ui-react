import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Terminal,
  Sparkles,
} from "lucide-react";
import {
  Alert,
  AlertTitle,
  AlertDescription,
  type AlertProps,
} from "../components/alert";
import { Button } from "../components/button";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Status / informational banner. Compound API: `<Alert>`, `<AlertTitle>`, `<AlertDescription>`. Direct `<svg>` child auto-grids as icon column. 3 variants (soft / outline / solid), 5 sizes, 2 shapes, optional dismiss button (top-end).",
      },
    },
  },
  args: {
    variant: "soft",
    size: "md",
    shape: "rounded",
  },
  argTypes: {
    variant: { control: "select", options: ["soft", "outline", "solid"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    shape: { control: "select", options: ["square", "rounded"] },
    onDismiss: { action: "dismissed" },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: (args: AlertProps) => (
    <div className="max-w-lg">
      <Alert {...args}>
        <Info />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the CLI.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-lg">
      <Alert variant="soft">
        <Info />
        <AlertTitle>Soft variant</AlertTitle>
        <AlertDescription>
          Muted filled background — default style.
        </AlertDescription>
      </Alert>
      <Alert variant="outline">
        <Info />
        <AlertTitle>Outline variant</AlertTitle>
        <AlertDescription>
          Bordered with white background.
        </AlertDescription>
      </Alert>
      <Alert variant="solid">
        <Info />
        <AlertTitle>Solid variant</AlertTitle>
        <AlertDescription>
          High-contrast dark background for emphasis.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-lg">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Alert key={size} size={size}>
          <Info />
          <AlertTitle>size = {size}</AlertTitle>
          <AlertDescription>
            Padding, icon and font size scale together.
          </AlertDescription>
        </Alert>
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-lg">
      <Alert shape="square">
        <Info />
        <AlertTitle>Square corners</AlertTitle>
      </Alert>
      <Alert shape="rounded">
        <Info />
        <AlertTitle>Rounded corners (default)</AlertTitle>
      </Alert>
    </div>
  ),
};

export const WithoutIcon: Story = {
  render: () => (
    <div className="max-w-lg">
      <Alert>
        <AlertTitle>No icon</AlertTitle>
        <AlertDescription>
          Grid collapses to single column when no SVG is present.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-lg">
      <Alert>
        <Info />
        <AlertTitle>A short status message.</AlertTitle>
      </Alert>
      <Alert variant="outline">
        <AlertTitle>Inline without icon.</AlertTitle>
      </Alert>
    </div>
  ),
};

export const Dismissible: Story = {
  render: function DismissibleStory() {
    const [visible, setVisible] = React.useState(true);
    if (!visible) {
      return (
        <div className="max-w-lg flex items-center gap-3">
          <p className="text-sm text-zinc-500">Alert dismissed.</p>
          <Button variant="outline" size="xs" onClick={() => setVisible(true)}>
            Show again
          </Button>
        </div>
      );
    }
    return (
      <div className="max-w-lg">
        <Alert onDismiss={() => setVisible(false)}>
          <Info />
          <AlertTitle>Dismissible alert</AlertTitle>
          <AlertDescription>
            Click the × button in the top-right to dismiss.
          </AlertDescription>
        </Alert>
      </div>
    );
  },
};

export const StatusVariants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Semantic status alerts via icon choice (zinc-only — icon conveys meaning, not background color).",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3 max-w-lg">
      <Alert>
        <Info />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          Your trial expires in 7 days. Upgrade anytime.
        </AlertDescription>
      </Alert>
      <Alert>
        <CheckCircle2 />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Your changes have been saved.
        </AlertDescription>
      </Alert>
      <Alert>
        <AlertTriangle />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          This action cannot be undone.
        </AlertDescription>
      </Alert>
      <Alert>
        <XCircle />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to connect to the server. Check your internet connection.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <div className="max-w-lg">
      <Alert variant="outline">
        <Sparkles />
        <AlertTitle>New feature available</AlertTitle>
        <AlertDescription>
          Schema-driven data tables are now ready to try.
        </AlertDescription>
        <div className="mt-3 flex gap-2">
          <Button size="xs">Try it out</Button>
          <Button size="xs" variant="ghost">
            Dismiss
          </Button>
        </div>
      </Alert>
    </div>
  ),
};

export const Terminal_: Story = {
  name: "Terminal-style (developer tip)",
  render: () => (
    <div className="max-w-lg">
      <Alert variant="solid">
        <Terminal />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the{" "}
          <code className="bg-white/10 px-1 py-0.5 rounded-sm font-mono">
            npx eglador add
          </code>{" "}
          command.
        </AlertDescription>
      </Alert>
    </div>
  ),
};
