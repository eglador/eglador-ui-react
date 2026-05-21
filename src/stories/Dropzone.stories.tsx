import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  Dropzone,
  type DropzoneSize,
  type DropzoneVariant,
  type DropzoneRejection,
} from "../components/dropzone";
import { Button } from "../components/button";

type ViewMode = "list" | "gallery";

const FORMAT_OPTIONS = [
  "image/*",
  "video/*",
  "audio/*",
  "application/pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".txt",
  ".md",
  ".mdx",
  ".csv",
  ".json",
  ".zip",
];

type StoryArgs = {
  size: DropzoneSize;
  variant: DropzoneVariant;
  acceptedFormats: string[];
  multiple: boolean;
  maxSize: number;
  maxFiles: number;
  disabled: boolean;
  label: string;
  hint: string;
  viewMode: ViewMode;
};

const meta: Meta<StoryArgs> = {
  title: "Components/Dropzone",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Drag-and-drop file upload area. HTML5 native drag/drop + click-to-browse, MIME type ve dosya boyutu validasyonu, accepted/rejected dosya callback'leri. 5-size (xs/sm/md/lg/xl), 3 variant (outline/soft/ghost), data-state ile drag-accept/drag-reject/idle/disabled gorsel state'leri. Klavye erisilebilir (Enter/Space ile file picker'i acar). Default UI ozelleştirilebilir (label, hint, icon) ya da `children` ile tum content override edilebilir.",
      },
    },
  },
  args: {
    size: "md",
    variant: "outline",
    acceptedFormats: FORMAT_OPTIONS,
    multiple: true,
    maxSize: 10 * 1024 * 1024,
    maxFiles: 8,
    disabled: false,
    label: "Dosyalari buraya birak veya tikla",
    hint: "",
    viewMode: "list",
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    variant: { control: "select", options: ["outline", "soft", "ghost"] },
    viewMode: { control: "select", options: ["list", "gallery"] },
    acceptedFormats: {
      control: "check",
      options: FORMAT_OPTIONS,
      description: "Kabul edilen formatlar (MIME wildcard, MIME, ya da uzanti)",
    },
    multiple: { control: "boolean" },
    maxSize: { control: "number" },
    maxFiles: { control: "number" },
    disabled: { control: "boolean" },
    label: { control: "text" },
    hint: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const FileIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-6 text-zinc-400"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const TrashIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-3.5"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

interface UploadedFile {
  file: File;
  url?: string;
}

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

function FileListView({
  files,
  onRemove,
}: {
  files: UploadedFile[];
  onRemove: (index: number) => void;
}) {
  return (
    <ul className="flex flex-col gap-1.5">
      {files.map(({ file, url }, i) => (
        <li
          key={i}
          className="flex items-center gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2"
        >
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-zinc-100">
            {url ? (
              <img
                src={url}
                alt={file.name}
                className="size-full object-cover"
              />
            ) : (
              FileIcon
            )}
          </div>
          <div className="flex flex-1 flex-col gap-0.5 min-w-0">
            <p className="truncate text-sm font-medium text-zinc-900">
              {file.name}
            </p>
            <p className="text-xs text-zinc-500">
              {formatBytes(file.size)}
              {file.type && (
                <>
                  {" · "}
                  <span className="font-mono">{file.type}</span>
                </>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(i)}
            aria-label={`${file.name} sil`}
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
          >
            {TrashIcon}
          </button>
        </li>
      ))}
    </ul>
  );
}

function FileGalleryView({
  files,
  onRemove,
}: {
  files: UploadedFile[];
  onRemove: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {files.map(({ file, url }, i) => (
        <div
          key={i}
          className="group flex flex-col overflow-hidden rounded-md border border-zinc-200 bg-white"
        >
          <div className="relative aspect-square bg-zinc-100">
            {url ? (
              <img
                src={url}
                alt={file.name}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-zinc-400">
                {FileIcon}
              </div>
            )}
            <button
              type="button"
              onClick={() => onRemove(i)}
              aria-label={`${file.name} sil`}
              className="absolute top-1.5 right-1.5 inline-flex size-7 items-center justify-center rounded-md bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100 focus-visible:opacity-100"
            >
              {TrashIcon}
            </button>
          </div>
          <div className="flex flex-col gap-0.5 px-2.5 py-2">
            <p className="truncate text-xs font-medium text-zinc-900">
              {file.name}
            </p>
            <p className="text-[11px] text-zinc-500">
              {formatBytes(file.size)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export const Default: Story = {
  render: function DefaultStory(args) {
    const [files, setFiles] = React.useState<UploadedFile[]>([]);
    const [rejections, setRejections] = React.useState<DropzoneRejection[]>([]);

    const handleAccept = (accepted: File[]) => {
      const next = accepted.map((file) => ({
        file,
        url: isImageFile(file) ? URL.createObjectURL(file) : undefined,
      }));
      setFiles((s) => [...s, ...next].slice(0, args.maxFiles));
    };

    const handleRemove = (idx: number) => {
      setFiles((s) => {
        const copy = [...s];
        const [removed] = copy.splice(idx, 1);
        if (removed?.url) URL.revokeObjectURL(removed.url);
        return copy;
      });
    };

    const clearAll = () => {
      files.forEach((f) => f.url && URL.revokeObjectURL(f.url));
      setFiles([]);
      setRejections([]);
    };

    return (
      <div className="flex max-w-2xl flex-col gap-4">
        <Dropzone
          size={args.size}
          variant={args.variant}
          accept={
            args.acceptedFormats.length > 0
              ? args.acceptedFormats.join(",")
              : undefined
          }
          multiple={args.multiple}
          maxSize={args.maxSize}
          maxFiles={args.maxFiles}
          disabled={args.disabled}
          label={args.label}
          hint={args.hint}
          onDrop={(accepted, rejected) => {
            handleAccept(accepted);
            setRejections(rejected);
          }}
        />

        {files.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Yuklenen ({files.length}
                {args.maxFiles ? ` / ${args.maxFiles}` : ""})
              </p>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={clearAll}
              >
                Tumunu sil
              </Button>
            </div>
            {args.viewMode === "gallery" ? (
              <FileGalleryView files={files} onRemove={handleRemove} />
            ) : (
              <FileListView files={files} onRemove={handleRemove} />
            )}
          </div>
        )}

        {rejections.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium uppercase tracking-wide text-red-600">
              Reddedildi ({rejections.length})
            </p>
            <ul className="flex flex-col gap-1">
              {rejections.map((r, i) => (
                <li
                  key={i}
                  className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
                >
                  <span className="font-medium">{r.file.name}</span>
                  {" — "}
                  {r.errors.map((e) => e.message).join(", ")}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="grid max-w-xl grid-cols-1 gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size: DropzoneSize) => (
        <div key={size} className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-400">size = {size}</span>
          <Dropzone size={size} accept="image/*" hint="JPG, PNG" />
        </div>
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="grid max-w-xl grid-cols-1 gap-4">
      {(["outline", "soft", "ghost"] as const).map(
        (variant: DropzoneVariant) => (
          <div key={variant} className="flex flex-col gap-1.5">
            <span className="text-xs text-zinc-400">variant = {variant}</span>
            <Dropzone variant={variant} accept="image/*" />
          </div>
        ),
      )}
    </div>
  ),
};

export const SingleFile: Story = {
  render: function SingleFileStory() {
    const [file, setFile] = React.useState<File | null>(null);
    return (
      <div className="flex max-w-md flex-col gap-3">
        <Dropzone
          multiple={false}
          accept="image/*"
          maxSize={2 * 1024 * 1024}
          label="Profil fotografi yukle"
          hint="Tek dosya, max 2MB, JPG/PNG"
          onAccept={(files) => setFile(files[0] ?? null)}
        />
        {file && (
          <div className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2 text-sm">
            <div className="flex flex-col">
              <span className="truncate font-medium">{file.name}</span>
              <span className="text-xs text-zinc-500">
                {formatBytes(file.size)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-xs text-zinc-500 underline underline-offset-4"
            >
              Kaldir
            </button>
          </div>
        )}
      </div>
    );
  },
};

export const PdfOnly: Story = {
  name: "PDF/DOC Only",
  render: function PdfStory() {
    const [files, setFiles] = React.useState<File[]>([]);
    return (
      <div className="flex max-w-md flex-col gap-3">
        <Dropzone
          accept=".pdf,.doc,.docx,application/pdf"
          maxSize={10 * 1024 * 1024}
          label="Belge yukle"
          hint="PDF veya Word, max 10MB"
          onAccept={(f) => setFiles((s) => [...s, ...f])}
        />
        {files.map((f, i) => (
          <p key={i} className="text-xs text-zinc-600">
            ✓ {f.name} ({formatBytes(f.size)})
          </p>
        ))}
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="max-w-md">
      <Dropzone disabled accept="image/*" hint="Yukleme su an kapali" />
    </div>
  ),
};

export const CustomContent: Story = {
  name: "Custom Content (children)",
  parameters: {
    docs: {
      description: {
        story:
          "`children` ile default UI override edilir. Marka renkleri, custom icon, special CTA gibi durumlar icin.",
      },
    },
  },
  render: () => (
    <div className="max-w-md">
      <Dropzone accept="image/*" maxSize={5 * 1024 * 1024}>
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-zinc-900 text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="size-6"
            >
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-zinc-900">
              Yeni gorsel ekle
            </p>
            <p className="text-xs text-zinc-500">
              Surukle-birak ya da tikla
            </p>
          </div>
        </div>
      </Dropzone>
    </div>
  ),
};

export const AvatarUpload: Story = {
  name: "Real Use: Avatar Upload",
  render: function AvatarStory() {
    const [preview, setPreview] = React.useState<{ url: string; name: string } | null>(
      null,
    );
    return (
      <div className="flex items-center gap-4">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-100 text-zinc-400">
          {preview ? (
            <img
              src={preview.url}
              alt={preview.name}
              className="size-full object-cover"
            />
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="size-10"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <Dropzone
            multiple={false}
            accept="image/*"
            maxSize={2 * 1024 * 1024}
            size="sm"
            label="Avatar yukle"
            hint="JPG, PNG, max 2MB"
            onAccept={(files) => {
              const f = files[0];
              if (!f) return;
              if (preview?.url) URL.revokeObjectURL(preview.url);
              setPreview({ url: URL.createObjectURL(f), name: f.name });
            }}
          />
        </div>
      </div>
    );
  },
};
