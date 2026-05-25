# Monetization Standards (Pipeline B)

## Architecture Overview

- **No user accounts** — device-bound licenses
- Stripe Payment Links for checkout (no Stripe API key needed in client)
- Edge Function for JWT signing at payment success
- JWT stored in localStorage and verified on the client before premium features unlock
- Static export + Vercel Edge Functions (free tier sufficient)

---

## Why Not Raw localStorage Booleans?

A raw `localStorage.setItem('isPremium', 'true')` is trivially bypassable via DevTools. For buyer personas that include legal, medical, and financial professionals with low price sensitivity, this is a business-critical vulnerability. The minimum viable secure paywall uses a **signed JWT** that cannot be forged without the server secret.

---

## Paywall Flow

```
User → "Upgrade" button
  → Stripe Payment Link (opens new tab)
  → Stripe processes payment
  → Stripe redirects to: {app-url}/payment/success?session_id={CHECKOUT_SESSION_ID}
  → Vercel Edge Function verifies session_id with Stripe API
  → Edge Function signs and returns a JWT
  → Client stores JWT in localStorage
  → Client verifies JWT signature on every premium action
```

---

## Edge Function (Vercel)

```typescript
// api/verify-payment.ts  (Vercel Edge Function)
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { SignJWT } from 'jose'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')
  if (!sessionId) return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 402 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const token = await new SignJWT({
      productId: process.env.NEXT_PUBLIC_PRODUCT_ID!,
      plan: session.metadata?.plan ?? 'pro',
      purchasedAt: Date.now(),
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(session.mode === 'subscription' ? '31d' : '10y')
      .sign(secret)

    return NextResponse.json({ token })
  } catch (err) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
```

---

## Client-side Token Storage

```typescript
// src/lib/paywall.ts
import { jwtVerify } from 'jose'

const STORAGE_KEY = 'wf_license'
const PUBLIC_KEY = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_VERIFY_KEY!)

export interface LicenseToken {
  productId: string
  plan: 'free' | 'pro' | 'lifetime'
  purchasedAt: number
  exp: number
}

export async function verifyLicense(): Promise<LicenseToken | null> {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const { payload } = await jwtVerify(raw, PUBLIC_KEY)
    return payload as unknown as LicenseToken
  } catch {
    localStorage.removeItem(STORAGE_KEY) // Invalid or expired — clear it
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

    fetch(`/api/verify-payment?session_id=${sessionId}`)
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
| localStorage cleared | Token lost — user must re-verify or re-purchase. Show "Restore purchase" button that re-runs payment verification. |
| Cross-device access | Separate purchase or subscription renewal. Document clearly in product UI. |
| Token expired (subscription) | `verifyLicense()` returns null. Prompt re-verification via Stripe customer portal link. |
| Offline after purchase | Token already stored in localStorage — offline verification works via JWT signature check (no network needed). |
| JWT tampered | `jwtVerify` throws — token cleared, user prompted to purchase. |

---

## Environment Variables Required

```bash
# .env.local (never committed)
STRIPE_SECRET_KEY=sk_live_...
JWT_SECRET=minimum-32-char-random-string

# .env (safe to commit — public values only)
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO=https://buy.stripe.com/...
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_LIFETIME=https://buy.stripe.com/...
NEXT_PUBLIC_PRODUCT_ID=your-product-slug
NEXT_PUBLIC_JWT_VERIFY_KEY=  # Public half of JWT key for client verification
```
