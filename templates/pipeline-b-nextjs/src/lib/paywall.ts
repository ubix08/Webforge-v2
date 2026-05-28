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
    publicKey = importSPKI(process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY!, 'RS256')
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
