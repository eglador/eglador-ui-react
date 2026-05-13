import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Folder, FileText } from "lucide-react";
import { TreeView, TreeItem } from "../components/tree-view";
import { Button } from "../components/button";

const meta: Meta<typeof TreeView> = {
  title: "Components/TreeView",
  component: TreeView,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Recursive hierarchical tree (file explorer, taxonomies). Compound API: `<TreeView>` + nested `<TreeItem>`. 4 sizes, expand/collapse via click or Arrow keys, controlled or uncontrolled (expand & select), single or multi-select, optional indent guides, disabled state, expand-all on mount.",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    indentGuides: { control: "boolean" },
    selectable: { control: "boolean" },
    multiSelect: { control: "boolean" },
    defaultExpandAll: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    size: "sm",
    indentGuides: true,
    selectable: true,
    multiSelect: false,
    defaultExpandAll: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof TreeView>;

const FileTree = (
  <>
    <TreeItem id="src" label="src" icon={<Folder />}>
      <TreeItem id="src/components" label="components" icon={<Folder />}>
        <TreeItem id="button.tsx" label="button.tsx" icon={<FileText />} />
        <TreeItem id="input.tsx" label="input.tsx" icon={<FileText />} />
        <TreeItem id="dialog.tsx" label="dialog.tsx" icon={<FileText />} />
        <TreeItem id="tree-view.tsx" label="tree-view.tsx" icon={<FileText />} />
      </TreeItem>
      <TreeItem id="src/lib" label="lib" icon={<Folder />}>
        <TreeItem id="utils.ts" label="utils.ts" icon={<FileText />} />
        <TreeItem id="icons.tsx" label="icons.tsx" icon={<FileText />} />
      </TreeItem>
      <TreeItem id="src/index.ts" label="index.ts" icon={<FileText />} />
    </TreeItem>
    <TreeItem id="package.json" label="package.json" icon={<FileText />} />
    <TreeItem id="README.md" label="README.md" icon={<FileText />} />
    <TreeItem id="tsconfig.json" label="tsconfig.json" icon={<FileText />} />
  </>
);

export const Default: Story = {
  render: (args) => (
    <TreeView
      {...args}
      defaultExpanded={["src", "src/components"]}
      defaultSelected={["button.tsx"]}
      className="w-72"
    >
      {FileTree}
    </TreeView>
  ),
};

export const MultiSelect: Story = {
  args: { multiSelect: true },
  parameters: {
    docs: {
      description: {
        story:
          "Hold ⌘ / Ctrl while clicking to add items to or remove items from the selection. Plain clicks replace the selection.",
      },
    },
  },
  render: function MultiSelectStory(args) {
    const [selected, setSelected] = React.useState<string[]>(["button.tsx"]);
    return (
      <div className="flex flex-col gap-3">
        <TreeView
          {...args}
          defaultExpanded={["src", "src/components"]}
          selected={selected}
          onSelectedChange={setSelected}
          className="w-72"
        >
          {FileTree}
        </TreeView>
        <div className="text-xs text-zinc-500">
          Selected:{" "}
          <code className="bg-zinc-100 px-1.5 py-0.5 rounded-sm">
            [{selected.join(", ") || "(none)"}]
          </code>
        </div>
      </div>
    );
  },
};

export const ExpandAll: Story = {
  args: { defaultExpandAll: true },
  parameters: {
    docs: {
      description: {
        story:
          "Set `defaultExpandAll` to expand every collapsible item on first render. Each `<TreeItem>` registers itself on mount, then the root commits the full set in a microtask.",
      },
    },
  },
  render: (args) => (
    <TreeView {...args} className="w-72">
      {FileTree}
    </TreeView>
  ),
};

export const ControlledExpand: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Drive `expanded` from external state to power Expand All / Collapse All buttons or to persist tree state across sessions.",
      },
    },
  },
  render: function ControlledStory(args) {
    const ALL_FOLDERS = ["src", "src/components", "src/lib"];
    const [expanded, setExpanded] = React.useState<string[]>(["src"]);
    return (
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Button
            size="xs"
            variant="outline"
            onClick={() => setExpanded(ALL_FOLDERS)}
          >
            Expand all
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={() => setExpanded([])}
          >
            Collapse all
          </Button>
        </div>
        <TreeView
          {...args}
          expanded={expanded}
          onExpandedChange={setExpanded}
          className="w-72"
        >
          {FileTree}
        </TreeView>
      </div>
    );
  },
};

export const NotSelectable: Story = {
  args: { selectable: false },
  parameters: {
    docs: {
      description: {
        story:
          "When `selectable={false}`, clicks only expand / collapse. No row gets the selected state.",
      },
    },
  },
  render: (args) => (
    <TreeView
      {...args}
      defaultExpanded={["src", "src/components"]}
      className="w-72"
    >
      {FileTree}
    </TreeView>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <TreeView
      {...args}
      defaultExpanded={["src", "src/components"]}
      defaultSelected={["button.tsx"]}
      className="w-72"
    >
      {FileTree}
    </TreeView>
  ),
};
