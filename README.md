<img src=".github/eglador-logo.svg" alt="eglador-ui-react" width="200" />

# eglador-ui-react

[![npm version](https://img.shields.io/npm/v/eglador-ui-react?style=flat-square&color=blue)](https://www.npmjs.com/package/eglador-ui-react)
[![npm downloads](https://img.shields.io/npm/dm/eglador-ui-react?style=flat-square&color=green)](https://www.npmjs.com/package/eglador-ui-react)
[![license](https://img.shields.io/npm/l/eglador-ui-react?style=flat-square)](https://github.com/eglador/eglador-ui-react/blob/main/LICENSE)
![zero runtime deps](https://img.shields.io/badge/zero%20deps-runtime-22C55E?style=flat-square)
![tailwind v4](https://img.shields.io/badge/tailwindcss-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![react >= 18](https://img.shields.io/badge/react-%3E%3D18-61DAFB?style=flat-square&logo=react&logoColor=white)
![typescript](https://img.shields.io/badge/typescript-ready-3178C6?style=flat-square&logo=typescript&logoColor=white)

Eglador UI for React — headless, accessible component library. Compound subcomponents, **Tailwind CSS v4**, zero runtime dependencies.

> **Status:** Alpha — 55/55 components shipped.

## Installation

```bash
npm install eglador-ui-react
```

**Peer dependencies:** `react >= 18` · `react-dom >= 18` · `tailwindcss ^4`

## Setup

```css
/* app/globals.css */
@import "tailwindcss";
@source "../node_modules/eglador-ui-react";
```

| Framework | CSS file location | Path |
|---|---|---|
| Next.js (App Router) | `app/globals.css` | `../node_modules/eglador-ui-react` |
| Next.js (`src/`) | `src/app/globals.css` | `../../node_modules/eglador-ui-react` |
| Vite | `src/index.css` | `../node_modules/eglador-ui-react` |

## Conventions

All components share the same vocabulary:

- **Variants** (visual hierarchy): `solid` · `soft` · `outline` · `ghost` · `link`
- **Sizes**: `xs` · `sm` · `md` · `lg` · `xl`
- **Shapes**: `square` · `rounded` · `pill` · `circle`
- **Palette**: zinc-only (no color schemes; theming handled separately)
- **A11y**: native HTML inputs, `aria-*` attributes, focus-visible rings, RTL-safe Tailwind logical properties

## Components (55/55)

**Layout & Structure (7/7)** — ✓ Accordion · ✓ AspectRatio · ✓ Collapsible · ✓ Resizable · ✓ ScrollArea · ✓ Separator · ✓ Sidebar

**Display (7/7)** — ✓ Avatar · ✓ Badge · ✓ Empty · ✓ Kbd · ✓ Skeleton · ✓ Spinner · ✓ Typography

**Navigation (7/7)** — ✓ Breadcrumb · ✓ Menubar · ✓ NavigationMenu · ✓ Pagination · ✓ Stepper · ✓ Tabs · ✓ TreeView

**Forms (15/15)** — ✓ Button · ✓ ButtonGroup · ✓ Checkbox · ✓ CheckboxGroup · ✓ Input · ✓ InputGroup · ✓ InputOTP · ✓ Label · ✓ MultiSelect · ✓ NativeSelect · ✓ Radio · ✓ RadioGroup · ✓ Select · ✓ Switch · ✓ Textarea

**Date & Time (3/3)** — ✓ Calendar · ✓ DatePicker · ✓ DateTimePicker

**Overlays (10/10)** — ✓ Alert · ✓ AlertDialog · ✓ ContextMenu · ✓ Dialog · ✓ Drawer · ✓ Dropdown · ✓ HoverCard · ✓ Notification · ✓ Popover · ✓ Tooltip

**Data (1/1)** — ✓ Table

**Misc (5/5)** — ✓ Command · ✓ ImageCropper · ✓ Link · ✓ Progress · ✓ SpeedDial

## Compatibility

Works with any React-based framework: **Next.js**, **Remix**, **Vite + React**, **Gatsby**.

Components are marked `"use client"`. Place them inside a client component or after a `"use client"` directive.

## Development

```bash
npm install
npm run dev               # tsup watch mode
npm run build             # production build to dist/
npm run typecheck         # tsc --noEmit
npm run storybook         # Storybook dev (http://localhost:6006)
npm run build-storybook   # static Storybook export
```

## Publishing

Publishing is automated via GitHub Actions. When a GitHub Release is created, the package is published to npm.

1. Update `version` in `package.json`
2. Commit and push
3. Create a GitHub Release with a matching tag (e.g. `v1.0.0`)

## Author

Kenan Gündoğan — [https://github.com/kenangundogan](https://github.com/kenangundogan)

Maintained under [Eglador](https://github.com/eglador)

## License

MIT
