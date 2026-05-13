import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, type InputProps } from "../components/input";
import { Label } from "../components/label";
import { Typography } from "../components/typography";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Text input. 3 variants (outline / soft / ghost), 5 sizes (xs / sm / md / lg / xl), 3 shapes (square / rounded / pill). All standard HTML input types (text / email / password / number / search / url / tel / date / file / …). For icon / button / addon composition, use **InputGroup**. For errors use the `aria-invalid` attribute. Compose with external `Label` and `Typography variant=\"muted\"` helper text.",
      },
    },
  },
  args: {
    placeholder: "Write something…",
    variant: "outline",
    size: "md",
    shape: "rounded",
    disabled: false,
  },
  argTypes: {
    variant: { control: "select", options: ["outline", "soft", "ghost"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    shape: { control: "select", options: ["square", "rounded", "pill"] },
    type: {
      control: "select",
      options: [
        "text",
        "email",
        "password",
        "number",
        "search",
        "url",
        "tel",
        "date",
        "time",
      ],
    },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: (args: InputProps) => (
    <div className="w-72">
      <Input {...args} />
    </div>
  ),
};

export const Variants: Story = {
  render: (args: InputProps) => (
    <div className="flex flex-col gap-3 w-72">
      <Input {...args} variant="outline" placeholder="outline (default)" />
      <Input {...args} variant="soft" placeholder="soft" />
      <Input {...args} variant="ghost" placeholder="ghost" />
    </div>
  ),
};

export const Shapes: Story = {
  render: (args: InputProps) => (
    <div className="flex flex-col gap-3 w-72">
      <Input {...args} shape="square" placeholder="square" />
      <Input {...args} shape="rounded" placeholder="rounded (default)" />
      <Input {...args} shape="pill" placeholder="pill" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args: InputProps) => (
    <div className="flex flex-col gap-3 w-72">
      <Input {...args} size="xs" placeholder="Extra small" />
      <Input {...args} size="sm" placeholder="Small" />
      <Input {...args} size="md" placeholder="Medium" />
      <Input {...args} size="lg" placeholder="Large" />
      <Input {...args} size="xl" placeholder="Extra large" />
    </div>
  ),
};

export const Types: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <Input type="text" placeholder="Text" />
      <Input type="email" placeholder="you@example.com" />
      <Input type="password" placeholder="••••••••" />
      <Input type="number" placeholder="123" />
      <Input type="search" placeholder="Search…" />
      <Input type="url" placeholder="https://example.com" />
      <Input type="tel" placeholder="+1 555 000 0000" />
      <Input type="date" />
      <Input type="time" />
      <Input type="file" />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" required>
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="username"
          autoComplete="username"
        />
      </div>
    </div>
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5 w-72">
      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        type="password"
        placeholder="••••••••"
        aria-describedby="password-help"
      />
      <Typography variant="muted" id="password-help">
        At least 8 characters with one uppercase letter and one number.
      </Typography>
    </div>
  ),
};

export const Invalid: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`aria-invalid={true}` → border and ring darken. Pair with a helper line below using `Typography variant=\"muted\"` (or your own helper-text component).",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-1.5 w-72">
      <Label htmlFor="email-invalid">Email</Label>
      <Input
        id="email-invalid"
        type="email"
        defaultValue="invalid-email"
        aria-invalid
        aria-describedby="email-error"
      />
      <Typography variant="muted" id="email-error" className="text-zinc-700">
        Enter a valid email address.
      </Typography>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <Input disabled placeholder="Disabled (empty)" />
      <Input disabled defaultValue="Non-editable value" />
    </div>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <Input readOnly defaultValue="Read-only text" />
      <Input readOnly type="email" defaultValue="readonly@example.com" />
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form
      className="flex flex-col gap-3 w-72"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="form-name" required>
          Full name
        </Label>
        <Input
          id="form-name"
          name="name"
          placeholder="Jane Doe"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="form-email" required>
          Email
        </Label>
        <Input
          id="form-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="form-website">Website</Label>
        <Input
          id="form-website"
          name="website"
          type="url"
          placeholder="https://"
        />
        <Typography variant="muted">Optional.</Typography>
      </div>
    </form>
  ),
};
