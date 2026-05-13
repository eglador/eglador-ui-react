import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Resizable,
  ResizablePanel,
  ResizableHandle,
} from "../components/resizable";

interface ResizablePlaygroundArgs {
  direction: "horizontal" | "vertical";
  minSize: number;
  maxSize: number;
  keyboardStep: number;
  withHandle: boolean;
  panels: 2 | 3;
}

const meta: Meta<ResizablePlaygroundArgs> = {
  title: "Components/Resizable",
  component: Resizable as never,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Resizable panel group with pointer + keyboard drag. Compound API: `<Resizable>` + `<ResizablePanel>` + `<ResizableHandle>`. Horizontal or vertical direction, per-panel min/max sizes, optional grip indicator on handles, full a11y (`role=\"separator\"`, arrow-key resize, Home/End for boundaries).",
      },
    },
  },
  args: {
    direction: "horizontal",
    minSize: 10,
    maxSize: 90,
    keyboardStep: 5,
    withHandle: false,
    panels: 2,
  },
  argTypes: {
    direction: { control: "select", options: ["horizontal", "vertical"] },
    minSize: { control: { type: "number", min: 0, max: 100, step: 1 } },
    maxSize: { control: { type: "number", min: 0, max: 100, step: 1 } },
    keyboardStep: { control: { type: "number", min: 1, max: 25, step: 1 } },
    withHandle: { control: "boolean" },
    panels: { control: "select", options: [2, 3] },
  },
};

export default meta;
type Story = StoryObj<ResizablePlaygroundArgs>;

const Pane = ({ children }: { children: React.ReactNode }) => (
  <div className="h-full w-full flex items-center justify-center bg-zinc-50 text-sm text-zinc-700 p-4">
    {children}
  </div>
);

export const Default: Story = {
  render: (args) => {
    const isHorizontal = args.direction === "horizontal";
    const containerClass = isHorizontal
      ? "border border-zinc-200 rounded-md w-[720px] h-[280px]"
      : "border border-zinc-200 rounded-md w-[480px] h-[360px]";

    return (
      <Resizable
        direction={args.direction}
        minSize={args.minSize}
        maxSize={args.maxSize}
        keyboardStep={args.keyboardStep}
        className={containerClass}
      >
        <ResizablePanel>
          <Pane>Panel 1</Pane>
        </ResizablePanel>
        <ResizableHandle withHandle={args.withHandle} />
        <ResizablePanel>
          <Pane>Panel 2</Pane>
        </ResizablePanel>
        {args.panels === 3 && (
          <>
            <ResizableHandle withHandle={args.withHandle} />
            <ResizablePanel>
              <Pane>Panel 3</Pane>
            </ResizablePanel>
          </>
        )}
      </Resizable>
    );
  },
};

export const WithGrip: Story = {
  args: { withHandle: true },
  render: (args) => (
    <Resizable
      direction={args.direction}
      minSize={args.minSize}
      maxSize={args.maxSize}
      className="border border-zinc-200 rounded-md w-[640px] h-[260px]"
    >
      <ResizablePanel>
        <Pane>Left</Pane>
      </ResizablePanel>
      <ResizableHandle withHandle={args.withHandle} />
      <ResizablePanel>
        <Pane>Right</Pane>
      </ResizablePanel>
    </Resizable>
  ),
};

export const Vertical: Story = {
  args: { direction: "vertical", withHandle: true },
  render: (args) => (
    <Resizable
      direction={args.direction}
      minSize={args.minSize}
      maxSize={args.maxSize}
      className="border border-zinc-200 rounded-md w-[480px] h-[360px]"
    >
      <ResizablePanel>
        <Pane>Top</Pane>
      </ResizablePanel>
      <ResizableHandle withHandle={args.withHandle} />
      <ResizablePanel>
        <Pane>Bottom</Pane>
      </ResizablePanel>
    </Resizable>
  ),
};

export const ThreePanes: Story = {
  args: { panels: 3, withHandle: true },
  render: (args) => (
    <Resizable
      direction={args.direction}
      minSize={args.minSize}
      maxSize={args.maxSize}
      className="border border-zinc-200 rounded-md w-[760px] h-[280px]"
    >
      <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
        <Pane>Files</Pane>
      </ResizablePanel>
      <ResizableHandle withHandle={args.withHandle} />
      <ResizablePanel defaultSize={50} minSize={30}>
        <Pane>Editor</Pane>
      </ResizablePanel>
      <ResizableHandle withHandle={args.withHandle} />
      <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
        <Pane>Inspector</Pane>
      </ResizablePanel>
    </Resizable>
  ),
};

export const NestedDirections: Story = {
  args: { withHandle: true },
  render: (args) => (
    <Resizable
      minSize={args.minSize}
      maxSize={args.maxSize}
      className="border border-zinc-200 rounded-md w-[760px] h-[360px]"
    >
      <ResizablePanel defaultSize={30}>
        <Pane>Navigation</Pane>
      </ResizablePanel>
      <ResizableHandle withHandle={args.withHandle} />
      <ResizablePanel defaultSize={70}>
        <Resizable direction="vertical" className="h-full">
          <ResizablePanel defaultSize={60}>
            <Pane>Top editor</Pane>
          </ResizablePanel>
          <ResizableHandle withHandle={args.withHandle} />
          <ResizablePanel defaultSize={40}>
            <Pane>Terminal</Pane>
          </ResizablePanel>
        </Resizable>
      </ResizablePanel>
    </Resizable>
  ),
};
