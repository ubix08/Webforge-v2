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
