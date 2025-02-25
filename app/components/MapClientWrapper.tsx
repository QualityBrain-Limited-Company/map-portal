// app/components/MapClientWrapper.tsx
'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { CategoryDoc } from '@prisma/client'

// นำเข้า DynamicMap แบบ dynamic import
const DynamicMapClient = dynamic(
  () => import('../dashboard/map/components/DynamicMapView'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-slate-600">กำลังโหลดแผนที่...</p>
        </div>
      </div>
    )
  }
)

interface MapClientWrapperProps {
  categories: CategoryDoc[];
}

export default function MapClientWrapper({ categories }: MapClientWrapperProps) {
  return (
    <Suspense fallback={
      <div className="w-full h-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-slate-600">กำลังโหลดแผนที่...</p>
        </div>
      </div>
    }>
      <DynamicMapClient categories={categories} readOnly={true} />
    </Suspense>
  )
}