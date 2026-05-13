import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  type TableProps,
} from "../components/table";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Semantic HTML table primitives with size scale, layout / scroll / sticky options, and visual modifiers (bordered / striped / hoverable). Compound API matches the native `<table>` structure.",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    layout: { control: "select", options: ["auto", "fixed"] },
    bordered: { control: "boolean" },
    striped: { control: "boolean" },
    hoverable: { control: "boolean" },
    fullWidth: { control: "boolean" },
    scrollX: { control: "boolean" },
    scrollY: { control: "boolean" },
    stickyHeader: { control: "boolean" },
    maxHeight: { control: "number" },
  },
  args: {
    size: "md",
    layout: "auto",
    bordered: false,
    striped: true,
    hoverable: true,
    fullWidth: true,
    scrollX: true,
    scrollY: false,
    stickyHeader: false,
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

const ROWS = [
  { id: "INV001", status: "Paid", method: "Credit Card", amount: "$250.00" },
  { id: "INV002", status: "Pending", method: "PayPal", amount: "$150.00" },
  { id: "INV003", status: "Unpaid", method: "Bank Transfer", amount: "$350.00" },
  { id: "INV004", status: "Paid", method: "Credit Card", amount: "$450.00" },
];

const LONG_ROWS = Array.from({ length: 40 }, (_, i) => ({
  id: `INV${String(i + 1).padStart(3, "0")}`,
  status: ["Paid", "Pending", "Unpaid"][i % 3],
  method: ["Credit Card", "PayPal", "Bank Transfer", "Wire"][i % 4],
  amount: `$${((i + 1) * 75).toFixed(2)}`,
}));

const WIDE_COLUMNS = [
  "Invoice",
  "Customer",
  "Status",
  "Method",
  "Issued",
  "Due",
  "Country",
  "Currency",
  "Subtotal",
  "Tax",
  "Total",
];

export const Default: Story = {
  render: (args: TableProps) => (
    <Table {...args}>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-medium">{r.id}</TableCell>
            <TableCell>{r.status}</TableCell>
            <TableCell>{r.method}</TableCell>
            <TableCell className="text-end">{r.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-end">$1,200.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const ScrollYWithStickyHeader: Story = {
  args: { maxHeight: 320, stickyHeader: true, bordered: true },
  parameters: {
    docs: {
      description: {
        story:
          "Set `maxHeight` to cap the table height and enable vertical scrolling. Pair with `stickyHeader` to keep the `<thead>` pinned while the body scrolls.",
      },
    },
  },
  render: (args: TableProps) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {LONG_ROWS.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-medium">{r.id}</TableCell>
            <TableCell>{r.status}</TableCell>
            <TableCell>{r.method}</TableCell>
            <TableCell className="text-end">{r.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const HorizontalScroll: Story = {
  args: { bordered: true, fullWidth: false, scrollX: true },
  parameters: {
    docs: {
      description: {
        story:
          "When the column count exceeds the container width, the wrapper scrolls horizontally. Set `fullWidth=false` to let the table size to its natural width so the overflow kicks in.",
      },
    },
  },
  render: (args: TableProps) => (
    <div className="max-w-2xl">
      <Table {...args}>
        <TableHeader>
          <TableRow>
            {WIDE_COLUMNS.map((c) => (
              <TableHead key={c} className="whitespace-nowrap">
                {c}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 6 }).map((_, i) => (
            <TableRow key={i}>
              {WIDE_COLUMNS.map((c) => (
                <TableCell key={c} className="whitespace-nowrap">
                  {c} #{i + 1}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

export const BothScrolls: Story = {
  args: {
    maxHeight: 280,
    stickyHeader: true,
    bordered: true,
    fullWidth: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Combine `maxHeight` + `stickyHeader` + horizontal overflow for spreadsheet-like layouts.",
      },
    },
  },
  render: (args: TableProps) => (
    <div className="max-w-2xl">
      <Table {...args}>
        <TableHeader>
          <TableRow>
            {WIDE_COLUMNS.map((c) => (
              <TableHead key={c} className="whitespace-nowrap">
                {c}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 30 }).map((_, i) => (
            <TableRow key={i}>
              {WIDE_COLUMNS.map((c) => (
                <TableCell key={c} className="whitespace-nowrap">
                  {c} #{i + 1}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

export const LayoutFixed: Story = {
  args: { layout: "fixed", bordered: true },
  parameters: {
    docs: {
      description: {
        story:
          "`layout=\"fixed\"` uses `table-fixed` so column widths are determined by the header row, not the content. Use width classes on `<TableHead>` to set explicit column sizes.",
      },
    },
  },
  render: (args: TableProps) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead className="w-24">Invoice</TableHead>
          <TableHead className="w-28">Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="w-32 text-end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-medium truncate">{r.id}</TableCell>
            <TableCell className="truncate">{r.status}</TableCell>
            <TableCell className="truncate">
              {r.method} — long description that should truncate
            </TableCell>
            <TableCell className="text-end">{r.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const AutoWidth: Story = {
  args: { fullWidth: false, bordered: true },
  parameters: {
    docs: {
      description: {
        story:
          "`fullWidth=false` lets the table size to its natural content width instead of filling the container.",
      },
    },
  },
  render: (args: TableProps) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.slice(0, 3).map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-medium">{r.id}</TableCell>
            <TableCell>{r.status}</TableCell>
            <TableCell className="text-end">{r.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
