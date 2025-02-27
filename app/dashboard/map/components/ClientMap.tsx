// app/dashboard/map/components/ClientMap.tsx
'use client'

import dynamic from 'next/dynamic'
import { CategoryDoc } from '@prisma/client'

const DynamicMapWithNoSSR = dynamic(
 () => import('./DynamicMapView'),
 { 
   ssr: false,
   loading: () => (
     <div className="flex items-center justify-center h-full">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
     </div>
   )
 }
)

interface ClientMapProps {
 categories: CategoryDoc[];
 simplified?: boolean;
}

export default function ClientMap({ categories, simplified = false }: ClientMapProps) {
 return <DynamicMapWithNoSSR categories={categories} simplified={simplified} />
}