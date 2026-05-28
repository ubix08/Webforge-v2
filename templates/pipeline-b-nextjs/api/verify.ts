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

    const privateKey = await importPKCS8(process.env.JWT_PRIVATE_KEY!, 'RS256')
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
