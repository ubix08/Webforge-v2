# UI Design Patterns

## Design Principles

- Clean, professional, minimal
- Mobile-first responsive
- Consistent spacing via Tailwind spacing scale
- Accessible by default
- Dark mode support

## Component Library

- **Pipeline A:** shadcn/ui (Radix primitives + Tailwind)
- **Pipeline B:** shadcn/ui components where applicable; custom dark-theme design system
- Customize via Tailwind config (`tailwind.config.ts`) — not inline CSS overrides
- Install shadcn components via CLI: `npx shadcn@latest add button`

## Layout Patterns

- **Dashboard/app views:** Sidebar + main content
  - Sidebar collapses to a `Sheet` drawer on mobile
  - TopBar with breadcrumbs + user menu
- **Auth pages:** Centered card layout, max-width `sm`
- **Landing/marketing pages:** Full-width, hero + feature sections
- **Pipeline B tools:** Single-column processing wizard or file drop zone centered on page

## Responsive Breakpoints (Tailwind)

| Breakpoint | Width | Usage |
|-----------|-------|-------|
| (default) | 0px+ | Mobile — stack everything vertically |
| `sm` | 640px | Mobile landscape — minor layout shifts |
| `md` | 768px | Tablet — sidebar appears |
| `lg` | 1024px | Desktop — full layout |
| `xl` | 1280px | Wide desktop — max content width applied |

## Dark Mode

- **Pipeline A:** Class-based (`class="dark"` on `<html>`), toggled by user preference
- **Pipeline B:** Dark theme by default; `dark` class applied permanently in root layout
- Default to system preference for Pipeline A
- Use `next-themes` (Pipeline B) or a Zustand theme store (Pipeline A)
- Test both modes before shipping

## Typography

- Primary font: Inter via `next/font/google` (Pipeline B) or `@fontsource/inter` (Pipeline A)
- Fallback: system font stack (`ui-sans-serif, system-ui, sans-serif`)
- No Google Fonts CDN at runtime — always load at build time
- Max line length: ~70ch for body text
- Heading hierarchy: `h1` per page, logical `h2`/`h3` nesting

## Pipeline B Design System

Each Pipeline B product should have a distinct visual identity via a product-specific accent color:

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      accent: {
        DEFAULT: '#YOUR_ACCENT_HEX',
        foreground: '#ffffff',
      }
    }
  }
}
```

Examples: PDFCompressr uses green (`#22c55e`), SchemaLocal uses purple (`#7C65FF`). Pick a distinct accent per product.

## Spacing & Sizing

- Use Tailwind spacing scale exclusively — no arbitrary `px` values unless required
- Card padding: `p-6` (desktop), `p-4` (mobile)
- Section gaps: `gap-4` to `gap-8` depending on density
- Form field gaps: `space-y-4`

## Interactive States

All interactive elements must have visible:
- **Hover** state
- **Focus-visible** ring (for keyboard nav — use `ring-2 ring-offset-2`)
- **Disabled** state (reduced opacity + `cursor-not-allowed`)
- **Loading** state (spinner or skeleton, not a frozen UI)
