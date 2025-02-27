// app/components/MapClientWrapper.tsx
'use client'

import dynamic from 'next/dynamic'
import { CategoryDoc } from '@prisma/client'
import { DocumentWithCategory } from '@/app/types/document'

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
  documents?: DocumentWithCategory[];
  selectedCategories?: number[];
  setSelectedCategories?: (ids: number[]) => void;
  simplified?: boolean;
}

export default function MapClientWrapper({ 
  categories, 
  documents, 
  selectedCategories, 
  setSelectedCategories, 
  simplified = false 
}: MapClientWrapperProps) {
  return (
    <DynamicMapClient 
      categories={categories}
      documents={documents}
      selectedCategories={selectedCategories}
      setSelectedCategories={setSelectedCategories}
      simplified={simplified}
    />
  )
}