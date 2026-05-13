import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  Search,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AtSign,
  Globe,
  Copy,
  Send,
  Smile,
  Image as ImageIcon,
  Bold,
  Italic,
  Underline,
} from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
  InputGroupText,
} from "../components/input-group";
import { Label } from "../components/label";

const meta: Meta<typeof InputGroup> = {
  title: "Components/InputGroup",
  component: InputGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Container for placing icons, text, or buttons alongside an input / textarea. shadcn pattern: single wrapper with border + transparent input; `align` positions addons (inline-start / end, block-start / end). Custom inputs join the focus state via `data-slot=\"input-group-control\"`. For correct tab order, addons appear AFTER the input in the DOM.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InputGroup>;

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <InputGroup>
        <InputGroupInput placeholder="Search…" />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const InlineStart: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`align=\"inline-start\"` (default) — addon visually at the start of the input. Addon stays AFTER the input in the DOM (for tab order) and CSS `order-first` brings it to the front.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <InputGroup>
        <InputGroupInput placeholder="Search the site…" />
        <InputGroupAddon align="inline-start">
          <Search />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput type="email" placeholder="you@example.com" />
        <InputGroupAddon align="inline-start">
          <Mail />
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const InlineEnd: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <InputGroup>
        <InputGroupInput placeholder="example" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="username" />
        <InputGroupAddon align="inline-end">
          <Globe />
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const BothSides: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <InputGroup>
        <InputGroupInput placeholder="username" />
        <InputGroupAddon align="inline-start">
          <AtSign />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupText>@eglador.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput type="number" placeholder="0.00" />
        <InputGroupAddon align="inline-start">
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const WithButton: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-96">
      <InputGroup>
        <InputGroupInput placeholder="Enter your email…" type="email" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="solid" size="sm">
            Subscribe
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput
          placeholder="https://eglador.com/abc123"
          readOnly
          defaultValue="https://eglador.com/abc123"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-sm" aria-label="Copy">
            <Copy />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const PasswordToggle: Story = {
  render: function PasswordToggleStory() {
    const [show, setShow] = React.useState(false);
    return (
      <div className="w-80">
        <InputGroup>
          <InputGroupInput
            type={show ? "text" : "password"}
            placeholder="Password"
          />
          <InputGroupAddon align="inline-start">
            <Lock />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-sm"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff /> : <Eye />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    );
  },
};

export const BlockStart: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`align=\"block-start\"` — addon ABOVE the input. Common for rich-editor toolbars paired with a textarea.",
      },
    },
  },
  render: () => (
    <div className="w-96">
      <InputGroup>
        <InputGroupAddon align="block-start">
          <InputGroupButton size="icon-xs" aria-label="Bold">
            <Bold />
          </InputGroupButton>
          <InputGroupButton size="icon-xs" aria-label="Italic">
            <Italic />
          </InputGroupButton>
          <InputGroupButton size="icon-xs" aria-label="Underline">
            <Underline />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupInput placeholder="Write your comment…" />
      </InputGroup>
    </div>
  ),
};

export const BlockEnd: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`align=\"block-end\"` — addon BELOW the input. Useful in chat / message UIs for a Send action row.",
      },
    },
  },
  render: () => (
    <div className="w-96">
      <InputGroup>
        <InputGroupInput placeholder="Write your message…" />
        <InputGroupAddon align="block-end">
          <InputGroupButton size="icon-xs" aria-label="Emoji">
            <Smile />
          </InputGroupButton>
          <InputGroupButton size="icon-xs" aria-label="Attach image">
            <ImageIcon />
          </InputGroupButton>
          <InputGroupButton
            variant="solid"
            size="sm"
            className="ms-auto"
          >
            <Send />
            Send
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const FocusRingOnGroup: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The focus ring wraps the WHOLE group rather than just the input — via the wrapper's `has-[...:focus-visible]:ring-*` selector.",
      },
    },
  },
  render: () => (
    <div className="w-80">
      <InputGroup>
        <InputGroupInput placeholder="Click here — the ring wraps the whole group" />
        <InputGroupAddon align="inline-start">
          <Search />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-sm" aria-label="Copy">
            <Copy />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const Invalid: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The input's `aria-invalid` deepens the group's border + ring colour (`has-[[aria-invalid=true]]`).",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-1.5 w-80">
      <Label htmlFor="email-invalid">Email</Label>
      <InputGroup>
        <InputGroupInput
          id="email-invalid"
          type="email"
          defaultValue="invalid-email"
          aria-invalid
        />
        <InputGroupAddon align="inline-start">
          <Mail />
        </InputGroupAddon>
      </InputGroup>
      <span className="text-xs text-zinc-700">
        Enter a valid email address.
      </span>
    </div>
  ),
};

export const InputGroupButtonVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 items-center">
        <InputGroupButton variant="ghost">Ghost</InputGroupButton>
        <InputGroupButton variant="outline">Outline</InputGroupButton>
        <InputGroupButton variant="soft">Soft</InputGroupButton>
        <InputGroupButton variant="solid">Solid</InputGroupButton>
      </div>
      <div className="flex gap-2 items-center">
        <InputGroupButton size="xs">xs</InputGroupButton>
        <InputGroupButton size="sm">sm</InputGroupButton>
        <InputGroupButton size="icon-xs" aria-label="Copy">
          <Copy />
        </InputGroupButton>
        <InputGroupButton size="icon-sm" aria-label="Copy">
          <Copy />
        </InputGroupButton>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <InputGroup key={size}>
          <InputGroupInput size={size} placeholder={`${size} input`} />
          <InputGroupAddon align="inline-start">
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupText>{size}</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      ))}
    </div>
  ),
};
