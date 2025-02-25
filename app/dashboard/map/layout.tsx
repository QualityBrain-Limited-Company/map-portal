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
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#334155',
            border: '1px solid #f1f5f9',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            fontWeight: 500,
          },
          success: {
            style: {
              borderLeft: '4px solid #10b981',
            },
          },
          error: {
            style: {
              borderLeft: '4px solid #ef4444',
            },
          },
        }}
      />
      <Suspense fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-slate-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      }>
        {children}
      </Suspense>
    </div>
  )
}