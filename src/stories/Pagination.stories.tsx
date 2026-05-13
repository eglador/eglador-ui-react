import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationEllipsis,
  usePaginationRange,
  type PaginationProps,
} from "../components/pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Compound pagination primitives + a `usePaginationRange` hook for computing the page sequence with ellipsis. Build any layout: classic numbered list, prev/next only, with first/last jumps, label-text buttons. 3 variants (solid / outline / ghost), 5 sizes, 3 shapes (square / rounded / pill).",
      },
    },
  },
  args: {
    size: "md",
    variant: "ghost",
    shape: "rounded",
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    variant: { control: "select", options: ["solid", "outline", "ghost"] },
    shape: { control: "select", options: ["square", "rounded", "pill"] },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

function PagedDemo({
  totalPages = 10,
  initial = 1,
  ...props
}: { totalPages?: number; initial?: number } & PaginationProps) {
  const [page, setPage] = React.useState(initial);
  const range = usePaginationRange({
    totalPages,
    currentPage: page,
    siblingCount: 1,
    boundaryCount: 1,
  });

  return (
    <Pagination {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          />
        </PaginationItem>
        {range.map((item, i) =>
          typeof item === "number" ? (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={item === page}
                onClick={() => setPage(item)}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={i}>
              <PaginationEllipsis />
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export const Default: Story = {
  render: (args) => <PagedDemo {...args} totalPages={10} initial={3} />,
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["solid", "outline", "ghost"] as const).map((variant) => (
        <div key={variant} className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            variant: {variant}
          </div>
          <PagedDemo variant={variant} totalPages={8} initial={3} />
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <code className="text-xs text-zinc-400 w-8">{size}</code>
          <PagedDemo size={size} totalPages={8} initial={3} />
        </div>
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["square", "rounded", "pill"] as const).map((shape) => (
        <div key={shape} className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            shape: {shape}
          </div>
          <PagedDemo shape={shape} variant="outline" totalPages={8} initial={3} />
        </div>
      ))}
    </div>
  ),
};

export const WithFirstLast: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `<PaginationFirst>` / `<PaginationLast>` for double-chevron jumps to the boundaries.",
      },
    },
  },
  render: function FirstLastStory(args) {
    const [page, setPage] = React.useState(7);
    const totalPages = 20;
    const range = usePaginationRange({
      totalPages,
      currentPage: page,
      siblingCount: 1,
      boundaryCount: 1,
    });
    return (
      <Pagination {...args}>
        <PaginationContent>
          <PaginationItem>
            <PaginationFirst
              onClick={() => setPage(1)}
              disabled={page === 1}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            />
          </PaginationItem>
          {range.map((item, i) =>
            typeof item === "number" ? (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={item === page}
                  onClick={() => setPage(item)}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            ) : (
              <PaginationItem key={i}>
                <PaginationEllipsis />
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLast
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  },
};

export const PrevNextOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Minimal layout for sequential flows (wizard, article browsing). Use the `label` prop on Previous/Next to show text alongside the chevron.",
      },
    },
  },
  render: function PrevNextStory() {
    const [page, setPage] = React.useState(5);
    const total = 12;
    return (
      <div className="flex flex-col gap-3">
        <div className="text-xs text-zinc-500">
          Page <code className="bg-zinc-100 px-1 py-0.5 rounded-sm">{page}</code> of {total}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                label="Previous"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                label="Next"
                onClick={() => setPage((p) => Math.min(total, p + 1))}
                disabled={page === total}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  },
};

export const SiblingAndBoundary: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`siblingCount` controls how many neighbour pages render around the current page. `boundaryCount` controls how many at the edges. Tune the density for narrow vs. wide layouts.",
      },
    },
  },
  render: function SiblingStory() {
    const [page, setPage] = React.useState(7);
    const totalPages = 20;

    function Row({
      label,
      siblingCount,
      boundaryCount,
    }: {
      label: string;
      siblingCount: number;
      boundaryCount: number;
    }) {
      const range = usePaginationRange({
        totalPages,
        currentPage: page,
        siblingCount,
        boundaryCount,
      });
      return (
        <div className="space-y-1">
          <div className="text-xs text-zinc-400">{label}</div>
          <Pagination size="sm">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                />
              </PaginationItem>
              {range.map((item, i) =>
                typeof item === "number" ? (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={item === page}
                      onClick={() => setPage(item)}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                ) : (
                  <PaginationItem key={i}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ),
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-5">
        <Row label="siblingCount=0 boundaryCount=1" siblingCount={0} boundaryCount={1} />
        <Row label="siblingCount=1 boundaryCount=1 (default)" siblingCount={1} boundaryCount={1} />
        <Row label="siblingCount=2 boundaryCount=2" siblingCount={2} boundaryCount={2} />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious disabled />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink disabled>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive disabled>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink disabled>3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext disabled />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

export const AsChildAnchor: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pass `asChild` on `<PaginationLink>` to use a real `<a href>` (or a router Link), enabling middle-click open in new tab and right-click context menu — the proper UX for paginated content tied to URLs.",
      },
    },
  },
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink asChild>
            <a href="?page=1">1</a>
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive asChild>
            <a href="?page=2">2</a>
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink asChild>
            <a href="?page=3">3</a>
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink asChild>
            <a href="?page=20">20</a>
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};
