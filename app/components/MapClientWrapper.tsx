// app/components/MapClientWrapper.tsx
'use client'

import dynamic from 'next/dynamic'
import { CategoryDoc } from '@prisma/client'

// นำเข้า component แบบ dynamic
const DynamicMapClient = dynamic(
  () => import('../dashboard/map/components/DynamicMapView'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดแผนที่...</p>
        </div>
      </div>
    )
  }
)

interface MapClientWrapperProps {
  categories: CategoryDoc[];
  simplified?: boolean; // เพิ่มตัวเลือกสำหรับหน้าแรก
}

export default function MapClientWrapper({ categories, simplified = false }: MapClientWrapperProps) {
  return <DynamicMapClient categories={categories} simplified={simplified} />
}