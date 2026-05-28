# Monetization Standards (Pipeline B)

## Architecture Overview

- **No user accounts** — device-bound licenses
- Stripe Payment Links for checkout (no Stripe API key needed in client)
- **RS256 asymmetric JWT** — Edge Function signs with private key, client verifies with public key
- JWT stored in localStorage and verified on the client before premium features unlock
- **Static export + standalone Vercel Function** — the verify endpoint is a Vercel Function at project root (outside Next.js export), serving alongside the static site

---

## Why RS256 (Asymmetric) Not HS256 (Symmetric)?

HS256 uses the same key for signing and verification. Exposing the verify key (e.g. via `NEXT_PUBLIC_`) exposes the signing key, allowing anyone to forge valid tokens. RS256 uses a key pair: the private key signs (server-side only), the public key verifies (safe to expose). Client-side verification with RS256 is secure because a forged token won't pass `jwtVerify` with the public key.

---

## Paywall Flow

```
User → "Upgrade" button
  → Stripe Payment Link (opens new tab)
  → Stripe processes payment
  → Stripe redirects to: {app-url}/payment/success?session_id={CHECKOUT_SESSION_ID}
  → Vercel Function verifies session_id with Stripe API
  → Function signs RS256 JWT with private key, returns token
  → Client stores JWT in localStorage
  → Client verifies RS256 JWT with public key on every premium action
```

---

## Key Generation (one-time setup)

```bash
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```

Set env vars:
- `JWT_PRIVATE_KEY` — contents of `private.pem` (server-side, never exposed)
- `NEXT_PUBLIC_JWT_PUBLIC_KEY` — contents of `public.pem` (safe to expose)

---

## Vercel Function — Payment Verification

The verify endpoint is deployed as a Vercel Function at project root (`api/verify.ts`), not inside Next.js pages/app dir. Vercel detects and deploys it alongside the static export automatically.

```typescript
// <project-root>/api/verify.ts  (Vercel Function)
import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { SignJWT, importPKCS8 } from 'jose'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sessionId = req.query.session_id as string | undefined
  if (!sessionId) return res.status(400).json({ error: 'Missing session_id' })

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') {
      return res.status(402).json({ error: 'Payment not completed' })
    }

    const privateKey = await importPKCS8(
      process.env.JWT_PRIVATE_KEY!,
      'RS256'
    )

    const token = await new SignJWT({
      productId: process.env.NEXT_PUBLIC_PRODUCT_ID!,
      plan: session.metadata?.plan ?? 'pro',
      purchasedAt: Date.now(),
    })
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuedAt()
      .setExpirationTime(session.mode === 'subscription' ? '31d' : '10y')
      .sign(privateKey)

    return res.status(200).json({ token })
  } catch {
    return res.status(500).json({ error: 'Verification failed' })
  }
}
```

---

## Client-side Token Verification

```typescript
// src/lib/paywall.ts
import { jwtVerify, importSPKI } from 'jose'

const STORAGE_KEY = 'wf_license'

export interface LicenseToken {
  productId: string
  plan: 'free' | 'pro' | 'lifetime'
  purchasedAt: number
  exp: number
}

let publicKey: Promise<CryptoKey> | null = null

function getPublicKey(): Promise<CryptoKey> {
  if (!publicKey) {
    publicKey = importSPKI(
      process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY!,
      'RS256'
    )
  }
  return publicKey
}

export async function verifyLicense(): Promise<LicenseToken | null> {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const key = await getPublicKey()
    const { payload } = await jwtVerify(raw, key)
    return payload as unknown as LicenseToken
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function storeLicense(token: string): void {
  localStorage.setItem(STORAGE_KEY, token)
}

export function clearLicense(): void {
  localStorage.removeItem(STORAGE_KEY)
}
```

---

## Zustand Paywall Store

```typescript
// src/stores/paywallStore.ts
import { create } from 'zustand'
import { verifyLicense, storeLicense, type LicenseToken } from '@/lib/paywall'

interface PaywallState {
  license: LicenseToken | null
  isVerifying: boolean
  checkLicense: () => Promise<void>
  activateLicense: (token: string) => Promise<void>
}

export const usePaywallStore = create<PaywallState>((set) => ({
  license: null,
  isVerifying: false,

  checkLicense: async () => {
    set({ isVerifying: true })
    const license = await verifyLicense()
    set({ license, isVerifying: false })
  },

  activateLicense: async (token: string) => {
    storeLicense(token)
    const license = await verifyLicense()
    set({ license })
  },
}))

export const isPremium = (state: PaywallState) => state.license !== null
```

---

## Payment Success Page

The success page lives in the Next.js static export and calls the Vercel Function at `/api/verify` by its deployed path. The function path is relative — Vercel serves both the static export and the function on the same domain.

```typescript
// app/payment/success/page.tsx
'use client'
import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { usePaywallStore } from '@/stores/paywallStore'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { activateLicense } = usePaywallStore()

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) { router.replace('/'); return }

    fetch(`/api/verify?session_id=${sessionId}`)
      .then(r => r.json())
      .then(async ({ token, error }) => {
        if (token) {
          await activateLicense(token)
          router.replace('/?upgraded=true')
        } else {
          router.replace(`/?error=${error}`)
        }
      })
  }, [])

  return <div>Verifying your payment…</div>
}
```

> **Note on static export + API route coexistence:** Vercel deploys the `api/` directory at project root as Serverless/Edge Functions regardless of Next.js output mode. The static export serves `out/` from the same domain, so `/api/verify` resolves correctly. Do NOT put the verify function inside `pages/api/` or `app/api/` — it must be at project root's `api/verify.ts`.

---

## Pricing Tiers

```
Free:     3 uses/day  OR  watermark on output
Pro:      $9.99/month — unlimited, no watermark
Lifetime: $29.99 one-time — unlimited, no watermark, early access
```

Adjust per product spec.

---

## Stripe Setup (Dashboard — no API needed for checkout)

1. Create a Product in Stripe Dashboard
2. Create a Payment Link for each tier
3. Set success URL: `{app-url}/payment/success?session_id={CHECKOUT_SESSION_ID}`
4. Set cancel URL: `{app-url}/payment/cancel`
5. Add metadata: `plan=pro` or `plan=lifetime`

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| localStorage cleared | Token lost — user must re-verify or re-purchase. Show "Restore purchase" button. |
| Cross-device access | Separate purchase or subscription renewal. Document clearly. |
| Token expired (subscription) | `verifyLicense()` returns null. Prompt re-verification via Stripe customer portal. |
| Offline after purchase | Token stored in localStorage — offline verification works via JWT signature check. |
| JWT tampered | `jwtVerify` throws — token cleared, user prompted to purchase. |

---

## Environment Variables

```bash
# .env.local (never committed)
STRIPE_SECRET_KEY=sk_live_...
JWT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----

# .env (safe to commit — public values only)
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO=https://buy.stripe.com/...
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_LIFETIME=https://buy.stripe.com/...
NEXT_PUBLIC_PRODUCT_ID=your-product-slug
NEXT_PUBLIC_JWT_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----
```
