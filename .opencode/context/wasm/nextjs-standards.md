# Next.js Standards (Pipeline B)

## next.config.js

```javascript
const withSerwist = require('@serwist/next').default({
  disable: process.env.NODE_ENV === 'development',
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  cacheOnNavigation: true,
  reloadOnOnline: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

module.exports = withSerwist(nextConfig)
```

### Service Worker Source

`src/app/sw.ts` — compiled by @serwist/next during build:

```typescript
import { defaultCache } from '@serwist/next/worker'
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { Serwist } from 'serwist'

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
}

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
})

serwist.addEventListeners()
```

## App Router Conventions

- All routes in `app/` directory
- `'use client'` on any component using hooks, browser APIs, or event handlers
- No server components needed for static export — all pages are client-rendered
- `generateStaticParams` for any dynamic `[slug]` routes
- Metadata API for SEO: export `metadata` object from each `page.tsx`

## PWA Manifest

`public/manifest.json`:

```json
{
  "name": "Product Name",
  "short_name": "Product",
  "description": "One-sentence product description",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#0f172a",
  "theme_color": "#0f172a",
  "icons": [
    { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

## PWA Icon Generation

Generate icons via a zero-dependency Node.js script (no ImageMagick required):

```javascript
// scripts/generate-icons.js
const fs = require('fs')
const path = require('path')

function generatePNG(size, accentHex, outputPath) {
  // Minimal PNG header + IHDR + IDAT (solid color)
  // ... (pure Node.js PNG generation)
}

const ACCENT = '#7C65FF' // product accent color
const outDir = path.join(__dirname, '../public/icons')
fs.mkdirSync(outDir, { recursive: true })
generatePNG(192, ACCENT, path.join(outDir, 'icon-192x192.png'))
generatePNG(512, ACCENT, path.join(outDir, 'icon-512x512.png'))
console.log('Icons generated ✓')
```

Run with `node scripts/generate-icons.js`. Add to `package.json` scripts:
```json
"generate-icons": "node scripts/generate-icons.js"
```

## Fonts

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})
```

- Always use `next/font/google` — loads at build time, no runtime CDN request
- Set `display: 'swap'` to prevent invisible text during load
- Pass font class to `<html>` element: `<html lang="en" className={inter.variable}>`

## SEO / Metadata

```typescript
// app/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Product Name — Tagline',
  description: 'One-sentence description for search engines',
  openGraph: {
    title: 'Product Name',
    description: 'One-sentence description',
    type: 'website',
    url: 'https://product.example.com',
  },
}
```

Programmatic SEO pages: create `app/{category}/[slug]/page.tsx` with `generateStaticParams` returning all slug values.

## Offline Strategy

- All HTML, CSS, JS, WASM cached by service worker after first visit
- Full functionality offline after PWA install
- No external API calls at runtime (everything runs in browser)
- OPFS or Cache API for large model files (WebGPU/LLM products)

## Routing Note

Do NOT add catch-all rewrites in `vercel.json` for static exports. The `trailingSlash: true` in `next.config.js` correctly handles routing for all pages in the `out/` directory.
