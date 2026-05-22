import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormFieldSet,
  FormLegend,
  FormFieldGroup,
  useFormField,
} from "../components/form";
import { Input } from "../components/input";
import { Textarea } from "../components/textarea";
import { NativeSelect } from "../components/native-select";
import { MultiSelect } from "../components/multi-select";
import { Checkbox } from "../components/checkbox";
import {
  CheckboxGroup,
  CheckboxGroupItem,
} from "../components/checkbox-group";
import { RadioGroup, RadioGroupItem } from "../components/radio-group";
import { Switch } from "../components/switch";
import { Toggle } from "../components/toggle";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../components/toggle-group";
import { DatePicker } from "../components/date-picker";
import { DateTimePicker } from "../components/date-time-picker";
import { InputTag } from "../components/input-tag";
import { InputOTP } from "../components/input-otp";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupText,
} from "../components/input-group";
import { Button } from "../components/button";

const meta: Meta<typeof Form> = {
  title: "Components/Form",
  component: Form,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Library-agnostic form primitives — works with any validation library (react-hook-form, Formik, Zod) or your own state. Compound API: `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`. `FormControl` automatically wires `id`, `aria-describedby`, and `aria-invalid` onto its single child input. 4 message statuses (error/warning/success/info), required marker, automatic disabled cascade. Does not replace Input/Checkbox/Select — it builds the surrounding label/error/aria/spacing around them.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Form>;

const AUTHOR_OPTIONS = [
  { value: "1", label: "Alice Johnson" },
  { value: "2", label: "Eglador Editor" },
  { value: "3", label: "Guest Author" },
  { value: "4", label: "Anonymous" },
];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 border-t border-zinc-200 pt-6 first:border-t-0 first:pt-0">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
        {description && (
          <p className="text-xs text-zinc-500">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

const BoldIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
  </svg>
);
const ItalicIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="4" x2="10" y2="4" />
    <line x1="14" y1="20" x2="5" y2="20" />
    <line x1="15" y1="4" x2="9" y2="20" />
  </svg>
);
const UnderlineIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4v6a6 6 0 0 0 12 0V4" />
    <line x1="4" y1="20" x2="20" y2="20" />
  </svg>
);
const StarIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Comprehensive example using every form primitive — a 'Create Post' form composing Input, Textarea, NativeSelect, MultiSelect, Checkbox, CheckboxGroup, RadioGroup, Switch, Toggle, ToggleGroup, DatePicker, DateTimePicker, InputTag, InputOTP, and InputGroup in a single layout.",
      },
    },
  },
  render: function DefaultStory() {
    const [values, setValues] = React.useState({
      title: "",
      slug: "",
      excerpt: "",
      body: "",
      category: "tech",
      tags: ["react", "tailwind"],
      authors: ["1"],
      formatting: ["bold"],
      favorite: false,
      publishDate: undefined as Date | undefined,
      publishAt: undefined as Date | undefined,
      status: "draft",
      visibility: "public",
      allowComments: true,
      allowSharing: false,
      notifications: ["email"],
      acceptedTerms: false,
      quantity: 1,
      price: "",
      otp: "",
    });

    const update = <K extends keyof typeof values>(
      key: K,
      v: (typeof values)[K],
    ) => setValues((s) => ({ ...s, [key]: v }));

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("submit", values);
    };

    return (
      <Form onSubmit={handleSubmit} className="max-w-3xl gap-8">
        <Section
          title="Basic Information"
          description="Core post metadata"
        >
          <FormField name="title">
            <FormItem>
              <FormLabel required>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Post title"
                  value={values.title}
                  onChange={(e) => update("title", e.target.value)}
                />
              </FormControl>
              <FormDescription>
                Shown on listing pages and shared on social media.
              </FormDescription>
            </FormItem>
          </FormField>

          <FormField name="slug">
            <FormItem>
              <FormLabel>URL Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder="post-title"
                  value={values.slug}
                  onChange={(e) => update("slug", e.target.value)}
                />
              </FormControl>
              <FormDescription>
                Leave empty to generate from the title automatically.
              </FormDescription>
            </FormItem>
          </FormField>

          <FormField name="excerpt">
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea
                  rows={2}
                  placeholder="Short description..."
                  value={values.excerpt}
                  onChange={(e) => update("excerpt", e.target.value)}
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField name="body">
            <FormItem>
              <FormLabel required>Content</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Write the post..."
                  value={values.body}
                  onChange={(e) => update("body", e.target.value)}
                />
              </FormControl>
            </FormItem>
          </FormField>
        </Section>

        <Section
          title="Categorization"
          description="Category, tags, and authors"
        >
          <FormField name="category">
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <NativeSelect
                  value={values.category}
                  onChange={(e) => update("category", e.target.value)}
                >
                  <option value="tech">Technology</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                  <option value="culture">Culture</option>
                </NativeSelect>
              </FormControl>
            </FormItem>
          </FormField>

          <FormField name="tags">
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <InputTag
                  value={values.tags}
                  onValueChange={(t) => update("tags", t)}
                  placeholder="Press Enter to add a tag..."
                />
              </FormControl>
              <FormDescription>
                Up to 5 tags. Separate with Enter or a comma.
              </FormDescription>
            </FormItem>
          </FormField>

          <FormField name="authors">
            <FormItem>
              <FormLabel>Authors</FormLabel>
              <FormControl>
                <MultiSelect
                  options={AUTHOR_OPTIONS}
                  value={values.authors}
                  onValueChange={(v) => update("authors", v)}
                  placeholder="Select authors..."
                />
              </FormControl>
              <FormDescription>
                Co-authoring is supported — you can assign multiple authors.
              </FormDescription>
            </FormItem>
          </FormField>
        </Section>

        <Section
          title="Formatting"
          description="Default toolbar behavior"
        >
          <FormField name="formatting">
            <FormItem>
              <FormLabel>Default formatting</FormLabel>
              <FormControl>
                <ToggleGroup
                  type="multiple"
                  variant="outline"
                  value={values.formatting}
                  onValueChange={(v) => update("formatting", v)}
                >
                  <ToggleGroupItem value="bold" icon={BoldIcon} aria-label="Bold" />
                  <ToggleGroupItem value="italic" icon={ItalicIcon} aria-label="Italic" />
                  <ToggleGroupItem value="underline" icon={UnderlineIcon} aria-label="Underline" />
                </ToggleGroup>
              </FormControl>
              <FormDescription>
                Formats enabled in the toolbar when the editor opens.
              </FormDescription>
            </FormItem>
          </FormField>

          <FormField name="favorite">
            <FormItem className="flex-row items-center gap-3">
              <FormControl>
                <Toggle
                  variant="outline"
                  icon={StarIcon}
                  pressed={values.favorite}
                  onPressedChange={(p) => update("favorite", p)}
                />
              </FormControl>
              <FormLabel>Add to favorites</FormLabel>
            </FormItem>
          </FormField>
        </Section>

        <Section
          title="Publishing"
          description="Date, status, and visibility"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField name="publishDate">
              <FormItem>
                <FormLabel>Publish date</FormLabel>
                <FormControl>
                  <DatePicker
                    value={values.publishDate}
                    onValueChange={(d) => update("publishDate", d)}
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField name="publishAt">
              <FormItem>
                <FormLabel>Publish time</FormLabel>
                <FormControl>
                  <DateTimePicker
                    value={values.publishAt}
                    onValueChange={(d) => update("publishAt", d)}
                  />
                </FormControl>
                <FormDescription>
                  Leave empty to publish immediately.
                </FormDescription>
              </FormItem>
            </FormField>
          </div>

          <FormFieldSet>
            <FormLegend>Status</FormLegend>
            <RadioGroup
              orientation="horizontal"
              value={values.status}
              onValueChange={(v) => update("status", v)}
            >
              <RadioGroupItem value="draft" label="Draft" />
              <RadioGroupItem value="review" label="In review" />
              <RadioGroupItem value="published" label="Published" />
            </RadioGroup>
          </FormFieldSet>

          <FormFieldSet>
            <FormLegend>Visibility</FormLegend>
            <FormDescription>
              Controls who can see the post.
            </FormDescription>
            <RadioGroup
              value={values.visibility}
              onValueChange={(v) => update("visibility", v)}
            >
              <RadioGroupItem
                value="public"
                label="Public"
                description="Visible to everyone, indexed by search engines"
              />
              <RadioGroupItem
                value="unlisted"
                label="Unlisted"
                description="Accessible only via direct link"
              />
              <RadioGroupItem
                value="private"
                label="Private"
                description="Visible only to authors"
              />
            </RadioGroup>
          </FormFieldSet>
        </Section>

        <Section
          title="Settings"
          description="Interaction and notification preferences"
        >
          <FormField name="allowComments">
            <FormItem className="flex-row items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <FormLabel>Allow comments</FormLabel>
                <FormDescription>
                  Users can leave comments below the post.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={values.allowComments}
                  onCheckedChange={(c) => update("allowComments", c)}
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField name="allowSharing">
            <FormItem className="flex-row items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <FormLabel>Allow social sharing</FormLabel>
                <FormDescription>
                  Share buttons appear below the post.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={values.allowSharing}
                  onCheckedChange={(c) => update("allowSharing", c)}
                />
              </FormControl>
            </FormItem>
          </FormField>

          <FormFieldSet>
            <FormLegend>Notification channels</FormLegend>
            <FormDescription>
              Channels where you want to be notified when the post is
              published.
            </FormDescription>
            <CheckboxGroup
              orientation="horizontal"
              value={values.notifications}
              onValueChange={(v) => update("notifications", v)}
            >
              <CheckboxGroupItem value="email" label="Email" />
              <CheckboxGroupItem value="push" label="Push" />
              <CheckboxGroupItem value="sms" label="SMS" />
            </CheckboxGroup>
          </FormFieldSet>

          <FormField name="acceptedTerms">
            <FormItem className="flex-row items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={values.acceptedTerms}
                  onCheckedChange={(c) => update("acceptedTerms", c)}
                />
              </FormControl>
              <FormLabel>I have read and accept the publishing policy</FormLabel>
            </FormItem>
          </FormField>
        </Section>

        <Section
          title="Inventory & Pricing"
          description="Optional, for premium content"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField name="quantity">
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    value={values.quantity}
                    onChange={(e) =>
                      update("quantity", Number(e.target.value))
                    }
                  />
                </FormControl>
              </FormItem>
            </FormField>

            <FormField name="price">
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      type="number"
                      placeholder="0.00"
                      value={values.price}
                      onChange={(e) => update("price", e.target.value)}
                    />
                    <InputGroupAddon>
                      <InputGroupText>USD</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </FormControl>
                <FormDescription>
                  Leave empty for free content.
                </FormDescription>
              </FormItem>
            </FormField>
          </div>
        </Section>

        <Section
          title="Security"
          description="Sensitive action confirmation"
        >
          <FormField name="otp">
            <FormItem>
              <FormLabel>2FA code</FormLabel>
              <FormControl>
                <InputOTP
                  length={6}
                  value={values.otp}
                  onChange={(v) => update("otp", v)}
                />
              </FormControl>
              <FormDescription>
                The 6-digit code from your authenticator app.
              </FormDescription>
            </FormItem>
          </FormField>
        </Section>

        <div className="flex justify-end gap-2 border-t border-zinc-200 pt-6">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button variant="soft" type="submit">
            Save as draft
          </Button>
          <Button type="submit">Publish</Button>
        </div>
      </Form>
    );
  },
};

export const WithValidation: Story = {
  render: function WithValidationStory() {
    const [values, setValues] = React.useState({ email: "", password: "" });
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [submitted, setSubmitted] = React.useState(false);

    const validate = (next: typeof values) => {
      const e: Record<string, string> = {};
      if (!next.email) e.email = "Email is required";
      else if (!/^[^@]+@[^@]+\.[^@]+$/.test(next.email))
        e.email = "Enter a valid email";
      if (!next.password) e.password = "Password is required";
      else if (next.password.length < 8)
        e.password = "Password must be at least 8 characters";
      return e;
    };

    const onSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const e2 = validate(values);
      setErrors(e2);
      if (Object.keys(e2).length === 0) setSubmitted(true);
    };

    return (
      <Form onSubmit={onSubmit} className="max-w-md">
        <FormField name="email" error={errors.email}>
          <FormItem>
            <FormLabel required>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                value={values.email}
                onChange={(e) =>
                  setValues((v) => ({ ...v, email: e.target.value }))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField name="password" error={errors.password}>
          <FormItem>
            <FormLabel required>Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                value={values.password}
                onChange={(e) =>
                  setValues((v) => ({ ...v, password: e.target.value }))
                }
              />
            </FormControl>
            <FormDescription>At least 8 characters.</FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        {submitted && (
          <p className="text-sm font-medium text-emerald-600">
            Form submitted successfully
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button type="submit">Submit</Button>
        </div>
      </Form>
    );
  },
};

export const AllInputTypes: Story = {
  render: () => (
    <Form className="max-w-md">
      <FormField name="title">
        <FormItem>
          <FormLabel required>Title</FormLabel>
          <FormControl>
            <Input placeholder="Post title" />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField name="excerpt">
        <FormItem>
          <FormLabel>Excerpt</FormLabel>
          <FormControl>
            <Textarea rows={3} placeholder="Short description..." />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField name="category">
        <FormItem>
          <FormLabel>Category</FormLabel>
          <FormControl>
            <NativeSelect>
              <option value="">Select...</option>
              <option value="tech">Technology</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
            </NativeSelect>
          </FormControl>
        </FormItem>
      </FormField>

      <FormField name="terms">
        <FormItem className="flex-row items-center gap-2">
          <FormControl>
            <Checkbox />
          </FormControl>
          <FormLabel>I accept the terms</FormLabel>
        </FormItem>
      </FormField>

      <FormField name="newsletter">
        <FormItem className="flex-row items-center gap-2">
          <FormControl>
            <Switch />
          </FormControl>
          <FormLabel>Subscribe to the newsletter</FormLabel>
        </FormItem>
      </FormField>
    </Form>
  ),
};

export const MessageStatuses: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-md">
      {(
        [
          ["error", "This field is required"],
          ["warning", "Email is not verified"],
          ["success", "Username is available"],
          ["info", "This field is optional"],
        ] as const
      ).map(([status, msg]) => (
        <FormField
          key={status}
          name={`field-${status}`}
          error={status === "error" ? msg : undefined}
        >
          <FormItem>
            <FormLabel>Status: {status}</FormLabel>
            <FormControl>
              <Input placeholder="Sample input" />
            </FormControl>
            <FormMessage status={status}>{msg}</FormMessage>
          </FormItem>
        </FormField>
      ))}
    </div>
  ),
};

export const WithFieldSet: Story = {
  name: "With FieldSet",
  parameters: {
    docs: {
      description: {
        story:
          "`FormFieldSet` + `FormLegend` provide semantic grouping using native `<fieldset><legend>` HTML — for logically grouping multi-select components like RadioGroup and CheckboxGroup, or any related fields. The `disabled` prop cascades to every child input via native HTML.",
      },
    },
  },
  render: function WithFieldSetStory() {
    const [plan, setPlan] = React.useState("pro");
    const [notifications, setNotifications] = React.useState([
      "email",
      "push",
    ]);
    return (
      <Form className="max-w-md">
        <FormFieldSet>
          <FormLegend>Subscription plan</FormLegend>
          <FormDescription>
            Upgrade or downgrade at any time.
          </FormDescription>
          <RadioGroup value={plan} onValueChange={setPlan}>
            <RadioGroupItem
              value="free"
              label="Free"
              description="Basic features, 3-project limit"
            />
            <RadioGroupItem
              value="pro"
              label="Pro"
              description="Unlimited projects, priority support"
            />
            <RadioGroupItem
              value="team"
              label="Team"
              description="Pro + collaboration with up to 10 users"
            />
          </RadioGroup>
        </FormFieldSet>

        <FormFieldSet>
          <FormLegend>Notification preferences</FormLegend>
          <FormDescription>
            Which channels would you like to be notified on?
          </FormDescription>
          <CheckboxGroup
            value={notifications}
            onValueChange={setNotifications}
          >
            <CheckboxGroupItem value="email" label="Email" />
            <CheckboxGroupItem value="push" label="Push notifications" />
            <CheckboxGroupItem value="sms" label="SMS" />
            <CheckboxGroupItem value="slack" label="Slack" />
          </CheckboxGroup>
        </FormFieldSet>

        <FormFieldSet disabled>
          <FormLegend>Disabled section (disabled)</FormLegend>
          <FormDescription>
            The `disabled` prop cascades to every child input via native HTML.
          </FormDescription>
          <RadioGroup defaultValue="a">
            <RadioGroupItem value="a" label="Option A" />
            <RadioGroupItem value="b" label="Option B" />
          </RadioGroup>
        </FormFieldSet>
      </Form>
    );
  },
};

export const ArrayFields: Story = {
  name: "Array Fields",
  parameters: {
    docs: {
      description: {
        story:
          "`FormFieldSet` + `FormFieldGroup` pattern for repeating fields (e.g. multiple user emails). Pairs naturally with React Hook Form's `useFieldArray`; this example uses plain `useState`.",
      },
    },
  },
  render: function ArrayFieldsStory() {
    const [emails, setEmails] = React.useState<string[]>([""]);
    const update = (idx: number, value: string) => {
      setEmails((arr) => arr.map((e, i) => (i === idx ? value : e)));
    };
    const append = () => setEmails((arr) => [...arr, ""]);
    const remove = (idx: number) =>
      setEmails((arr) => arr.filter((_, i) => i !== idx));

    return (
      <Form className="max-w-md">
        <FormFieldSet>
          <FormLegend>Email addresses</FormLegend>
          <FormDescription>
            Up to 5 addresses.
          </FormDescription>
          <FormFieldGroup>
            {emails.map((email, i) => (
              <FormField key={i} name={`email-${i}`}>
                <FormItem className="flex-row items-start gap-2">
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@domain.com"
                      value={email}
                      onChange={(e) => update(i, e.target.value)}
                    />
                  </FormControl>
                  {emails.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => remove(i)}
                      aria-label={`Remove email ${i + 1}`}
                    >
                      Remove
                    </Button>
                  )}
                </FormItem>
              </FormField>
            ))}
          </FormFieldGroup>
          <Button
            type="button"
            variant="outline"
            onClick={append}
            disabled={emails.length >= 5}
          >
            + Add email
          </Button>
        </FormFieldSet>
      </Form>
    );
  },
};

export const RequiredAndOptional: Story = {
  render: () => (
    <Form className="max-w-md">
      <FormField name="email">
        <FormItem>
          <FormLabel required>Email</FormLabel>
          <FormControl>
            <Input type="email" />
          </FormControl>
        </FormItem>
      </FormField>

      <FormField name="phone">
        <FormItem>
          <FormLabel>Phone (optional)</FormLabel>
          <FormControl>
            <Input type="tel" />
          </FormControl>
        </FormItem>
      </FormField>
    </Form>
  ),
};

export const DisabledField: Story = {
  render: () => (
    <Form className="max-w-md">
      <FormField name="email">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" value="user@eglador.dev" readOnly />
          </FormControl>
          <FormDescription>Contact support to change your email.</FormDescription>
        </FormItem>
      </FormField>

      <FormField name="username" disabled>
        <FormItem>
          <FormLabel>Username (disabled)</FormLabel>
          <FormControl>
            <Input defaultValue="kenangundogan" />
          </FormControl>
          <FormDescription>This field cannot be edited.</FormDescription>
        </FormItem>
      </FormField>
    </Form>
  ),
};

function CharCounter() {
  const field = useFormField();
  const [value, setValue] = React.useState("");
  const max = 50;
  return (
    <>
      <FormControl>
        <Input
          value={value}
          maxLength={max}
          onChange={(e) => setValue(e.target.value)}
        />
      </FormControl>
      <FormDescription>
        {value.length} / {max} characters — field: {field.name}
      </FormDescription>
    </>
  );
}

export const CustomFieldHook: Story = {
  name: "Custom Field (useFormField)",
  parameters: {
    docs: {
      description: {
        story:
          "Use `useFormField()` to read id, error, name, etc. from the FormField context and build custom inputs or visualizations.",
      },
    },
  },
  render: () => (
    <Form className="max-w-md">
      <FormField name="title">
        <FormItem>
          <FormLabel>Title</FormLabel>
          <CharCounter />
        </FormItem>
      </FormField>
    </Form>
  ),
};
