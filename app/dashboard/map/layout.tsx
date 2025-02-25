// app/map/layout.tsx
import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'

export default function GismapLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Suspense fallback={<div>Loading...</div>}>
        {children}
      </Suspense>
    </div>
  )
}