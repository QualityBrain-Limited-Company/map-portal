// app/map/components/ClientMap.tsx
'use client'

import dynamic from 'next/dynamic'

const DynamicMapWithNoSSR = dynamic(
  () => import('./DynamicMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }
)

export default function ClientMap({ categories }) {
  return <DynamicMapWithNoSSR categories={categories} />
}