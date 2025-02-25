// app/dashboard/map/components/DynamicMapView.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { CategoryDoc } from '@prisma/client'
import { DocumentWithCategory } from '@/app/types/document'
import { getDocuments } from '@/app/lib/actions/documents/get'
import { toast } from 'react-hot-toast'
import MapMarker from './MapMarker'
import Legend from './Legend'
import CategoryFilter from './CategoryFilter'
import StatsPanel from './StatsPanel'
import { THAILAND_BOUNDS } from '@/app/utils/colorGenerator' 
import 'leaflet/dist/leaflet.css'

// CSS สำหรับ custom marker
const addCustomStyles = () => {
  if (typeof window === 'undefined') return;
  
  const style = document.createElement('style');
  style.innerHTML = `
    .custom-marker {
      background: none !important;
      border: none !important;
    }
  `;
  document.head.appendChild(style);
  return () => {
    document.head.removeChild(style);
  };
};

// Component หลัก
interface DynamicMapViewProps {
  categories: CategoryDoc[];
  readOnly?: boolean;
}

export default function DynamicMapView({ categories, readOnly = false }: DynamicMapViewProps) {
  const [documents, setDocuments] = useState<DocumentWithCategory[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mapStyle] = useState({
    height: '100%',
    width: '100%'
  });

  // เพิ่ม CSS styles
  useEffect(() => {
    const cleanup = addCustomStyles();
    return cleanup;
  }, []);

  // โหลดข้อมูลเอกสารเมื่อ component โหลด
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const docs = await getDocuments()
        setDocuments(docs)
        // เริ่มต้นแสดงทุกหมวดหมู่
        setSelectedCategories(categories.map(c => c.id))
      } catch (error) {
        console.error('Error loading documents:', error)
        toast.error('ไม่สามารถโหลดข้อมูลเอกสารได้')
      } finally {
        setIsLoading(false)
      }
    }
    loadDocuments()
  }, [categories])

  // กรองเอกสารตามหมวดหมู่ที่เลือก
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => 
      selectedCategories.length === 0 || selectedCategories.includes(doc.categoryId)
    )
  }, [documents, selectedCategories])

  // เรียงลำดับเอกสารให้ล่าสุดอยู่บนสุด
  const sortedDocuments = useMemo(() => {
    return [...filteredDocuments].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [filteredDocuments]);

  // เพิ่ม flag ไปยังเอกสารล่าสุด
  const processedDocuments = useMemo(() => {
    return sortedDocuments.map((doc, index) => ({
      ...doc,
      isLatest: index === 0
    }));
  }, [sortedDocuments]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {typeof window !== 'undefined' && (
        <MapContainer
          center={THAILAND_BOUNDS.center}
          zoom={THAILAND_BOUNDS.zoom}
          style={mapStyle}
          minZoom={THAILAND_BOUNDS.minZoom}
          maxZoom={THAILAND_BOUNDS.maxZoom}
          maxBounds={THAILAND_BOUNDS.bounds}
          maxBoundsViscosity={1.0}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* แสดงข้อมูลบนแผนที่ */}
          {processedDocuments.map((doc) => (
            <MapMarker key={doc.id} document={doc} />
          ))}
          
          <Legend categories={categories} />
        </MapContainer>
      )}

      <CategoryFilter 
        categories={categories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        documents={documents}
      />
      
      <StatsPanel
        documents={documents}
        categories={categories}
        selectedCategories={selectedCategories}
      />
    </div>
  )
}