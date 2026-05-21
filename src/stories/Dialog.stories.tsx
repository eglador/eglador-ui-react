import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  type DialogProps,
} from "../components/dialog";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { DateTimePicker } from "../components/date-time-picker";
import { DatePicker } from "../components/date-picker";
import { Combobox } from "../components/combobox";
import { MultiSelect } from "../components/multi-select";
import { ColorPicker } from "../components/color-picker";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/select";
import { Tooltip, TooltipTrigger, TooltipContent } from "../components/tooltip";

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Modal dialog. Compound API: `<Dialog>` + `<DialogTrigger>` + `<DialogContent>` + `<DialogHeader>` / `<DialogTitle>` / `<DialogDescription>` / `<DialogFooter>` / `<DialogClose>`. 6 sizes (xs–xl, full), Escape + overlay-click close, focus-trap, body-scroll lock, portal-rendered.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "full"],
    },
    shape: { control: "select", options: ["square", "rounded"] },
    shadow: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl"],
    },
    modal: { control: "boolean" },
    defaultOpen: { control: "boolean" },
  },
  args: { size: "md", shape: "rounded", shadow: "lg", modal: true, defaultOpen: false },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: (args: DialogProps) => (
    <Dialog key={String(args.defaultOpen)} {...args}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          <div className="flex items-center gap-3">
            <Label htmlFor="name" className="w-24 text-end">
              Name
            </Label>
            <Input id="name" defaultValue="Kenan Gündoğan" className="flex-1" />
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="username" className="w-24 text-end">
              Username
            </Label>
            <Input id="username" defaultValue="@kenan" className="flex-1" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button size="sm">Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      {(["xs", "sm", "md", "lg", "xl", "full"] as const).map((size) => (
        <Dialog key={size} size={size}>
          <DialogTrigger asChild>
            <Button size="xs" variant="outline">
              {size}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>size = {size}</DialogTitle>
              <DialogDescription>
                The content scales to the chosen size.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      {(["square", "rounded"] as const).map((shape) => (
        <Dialog key={shape} shape={shape}>
          <DialogTrigger asChild>
            <Button size="xs" variant="outline">
              {shape}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>shape = {shape}</DialogTitle>
              <DialogDescription>
                Corner radius for the modal surface.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      {(["none", "xs", "sm", "md", "lg", "xl"] as const).map((shadow) => (
        <Dialog key={shadow} shadow={shadow}>
          <DialogTrigger asChild>
            <Button size="xs" variant="outline">
              {shadow}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>shadow = {shadow}</DialogTitle>
              <DialogDescription>
                Elevation level for the modal surface.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
};

export const FloatingPopupsInsideDialog: Story = {
  name: "Floating Popups Inside Dialog",
  parameters: {
    docs: {
      description: {
        story:
          "Z-index hierarchy dogrulamasi — Dialog (z-50) icindeki floating popup'lar (DatePicker/DateTimePicker, Combobox, MultiSelect, Select, ColorPicker, Tooltip — hepsi z-[60] veya z-[70]) Dialog'un uzerinde dogru sirayla render edilir. Schedule publish, edit profile gibi gercek CRUD CMS pattern'leri icin gerekli.",
      },
    },
  },
  render: function InsideDialogStory() {
    const [publishAt, setPublishAt] = React.useState<Date | undefined>();
    const [publishDate, setPublishDate] = React.useState<Date | undefined>();
    const [author, setAuthor] = React.useState<string | undefined>("u1");
    const [tags, setTags] = React.useState<string[]>(["news"]);
    const [color, setColor] = React.useState("#3b82f6");
    const [status, setStatus] = React.useState("draft");

    return (
      <Dialog defaultOpen size="md">
        <DialogTrigger>
          <Button>Schedule Publish</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yayin Zamanla</DialogTitle>
            <DialogDescription>
              Tum floating popup tipleri Dialog icinde dogru sirada render olur.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <div className="flex flex-col gap-1.5">
              <Label>Yayin Tarihi (DatePicker)</Label>
              <DatePicker value={publishDate} onValueChange={setPublishDate} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Yayin Zamani (DateTimePicker)</Label>
              <DateTimePicker value={publishAt} onValueChange={setPublishAt} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Yazar (Combobox)</Label>
              <Combobox
                value={author}
                onValueChange={setAuthor}
                options={[
                  { value: "u1", label: "Kenan Gundogan" },
                  { value: "u2", label: "Ayse Yilmaz" },
                  { value: "u3", label: "Mehmet Demir" },
                ]}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Etiketler (MultiSelect)</Label>
              <MultiSelect
                value={tags}
                onValueChange={setTags}
                options={[
                  { value: "news", label: "Haber" },
                  { value: "tech", label: "Teknoloji" },
                  { value: "design", label: "Tasarim" },
                  { value: "culture", label: "Kultur" },
                ]}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Durum (Select)</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Taslak</SelectItem>
                  <SelectItem value="review">Onayda</SelectItem>
                  <SelectItem value="published">Yayinda</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>Aksan Rengi (ColorPicker)</Label>
              <ColorPicker value={color} onValueChange={setColor} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Tooltip Test</Label>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="outline" size="sm">
                    Hover et
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Tooltip da Dialog'un uzerinde gozukur (z-[70])
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Iptal</Button>
            </DialogClose>
            <Button>Zamanla</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};
