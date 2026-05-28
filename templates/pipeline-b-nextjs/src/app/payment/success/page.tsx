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

  return <div className="p-8 text-center">Verifying your payment...</div>
}
