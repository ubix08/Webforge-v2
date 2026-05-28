import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<div className="p-8">Loading...</div>}>
        <Outlet />
      </Suspense>
    </div>
  )
}
