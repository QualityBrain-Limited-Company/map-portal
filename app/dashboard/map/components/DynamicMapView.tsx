// app/dashboard/map/components/DynamicMapView.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
import { CategoryDoc } from '@prisma/client'
import { DocumentWithCategory, LocationData } from '@/app/types/document'
import { getDocuments } from '@/app/lib/actions/documents/get'
import { toast } from 'react-hot-toast'
import DocumentForm from './DocumentForm'
import MapMarker from './MapMarker'
import Legend from './Legend'
import CategoryFilter from './CategoryFilter'
import StatsPanel from './StatsPanel'
import LocationMarker from './LocationMarker'
import { THAILAND_BOUNDS } from '@/app/utils/colorGenerator'
import 'leaflet/dist/leaflet.css'
import CircleLoader from './CircleLoader'

// CSS สำหรับ custom marker
const addCustomStyles = () => {
 if (typeof window === 'undefined') return;
 
 const style = document.createElement('style');
 style.innerHTML = `
   .custom-marker {
     background: none !important;
     border: none !important;
   }
   
   @keyframes ping {
     0% {
       transform: scale(0.8);
       opacity: 0.8;
     }
     70%, 100% {
       transform: scale(1.7);
       opacity: 0;
     }
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
 documents?: DocumentWithCategory[];
 selectedCategories?: number[];
 setSelectedCategories?: (ids: number[]) => void;
 simplified?: boolean;
}

export default function DynamicMapView({
 categories,
 documents: externalDocuments,
 selectedCategories: externalSelectedCategories,
 setSelectedCategories: externalSetSelectedCategories,
 simplified = false
}: DynamicMapViewProps) {
 const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
 const [internalDocuments, setInternalDocuments] = useState<DocumentWithCategory[]>([])
 const [internalSelectedCategories, setInternalSelectedCategories] = useState<number[]>([])
 const [isLoading, setIsLoading] = useState(!externalDocuments)
 const [mapStyle] = useState({
   height: '100%',
   width: '100%'
 });

 // ใช้ documents จากภายนอกถ้ามี หรือใช้ภายในถ้าไม่มี
 const documents = externalDocuments || internalDocuments
 
 // ใช้ selectedCategories จากภายนอกถ้ามี หรือใช้ภายในถ้าไม่มี
 const selectedCategories = externalSelectedCategories || internalSelectedCategories
 
 // ใช้ setSelectedCategories จากภายนอกถ้ามี หรือใช้ภายในถ้าไม่มี
 const setSelectedCategories = externalSetSelectedCategories || setInternalSelectedCategories

 // ใช้ custom hook เพื่อจัดการข้อมูล
 const { filteredDocuments, sortedDocuments, processedDocuments } = useProcessedDocuments(
   documents,
   selectedCategories
 );

 // เพิ่ม CSS styles
 useEffect(() => {
   const cleanup = addCustomStyles();
   return cleanup;
 }, []);

 // โหลดข้อมูลเอกสารเมื่อไม่มี external documents
 useEffect(() => {
   if (externalDocuments) {
     setIsLoading(false);
     return;
   }
   
   const loadDocuments = async () => {
     try {
       const docs = await getDocuments()
       setInternalDocuments(docs)
       // เริ่มต้นแสดงทุกหมวดหมู่
       setInternalSelectedCategories(categories.map(c => c.id))
     } catch (error) {
       console.error('Error loading documents:', error)
       toast.error('ไม่สามารถโหลดข้อมูลเอกสารได้')
     } finally {
       setIsLoading(false)
     }
   }
   
   loadDocuments()
 }, [categories, externalDocuments]);

 if (isLoading) {
  return <CircleLoader message="กำลังโหลดข้อมูล..." />;
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
         zoomControl={false} // ปิดปุ่มซูมเริ่มต้น
       >
         <ZoomControl position="bottomright" /> {/* กำหนดตำแหน่งปุ่มซูมใหม่ */}
         
         <TileLayer
           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
         />
         
         {/* แสดงข้อมูลบนแผนที่ */}
         {processedDocuments.map((doc) => (
           <MapMarker key={doc.id} document={doc} />
         ))}
         
         {/* แสดง LocationMarker เฉพาะเมื่อไม่ใช่โหมด simplified */}
         {!simplified && (
           <LocationMarker onSelectLocation={setSelectedLocation} />
         )}
         
         {/* แสดง Legend เสมอ */}
         <Legend categories={categories} />
       </MapContainer>
     )}

     {/* แสดง CategoryFilter เฉพาะเมื่อไม่ใช่โหมด simplified */}
     {/* {!simplified && (
       <CategoryFilter 
         categories={categories}
         selectedCategories={selectedCategories}
         setSelectedCategories={setSelectedCategories}
         documents={documents}
       />
     )} */}
     


     {/* แสดง DocumentForm เฉพาะเมื่อมีการเลือกตำแหน่งและไม่ใช่โหมด simplified */}
     {!simplified && selectedLocation && (
       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
         <DocumentForm
           categories={categories}
           location={selectedLocation}
           onClose={() => setSelectedLocation(null)}
           onSuccess={async () => {
             try {
               const newDocs = await getDocuments()
               if (externalSetSelectedCategories && externalDocuments) {
                 // ถ้ามีการจัดการจากภายนอก ให้แจ้งเตือนสำเร็จและปิด
                 setSelectedLocation(null)
                 toast.success('บันทึกข้อมูลสำเร็จ')
               } else {
                 // ถ้าจัดการภายใน ให้อัปเดตข้อมูล
                 setInternalDocuments(newDocs)
                 setSelectedLocation(null)
                 toast.success('บันทึกข้อมูลสำเร็จ')
               }
             } catch (error) {
               console.error('Error reloading documents:', error)
               toast.error('ไม่สามารถโหลดข้อมูลเอกสารได้')
             }
           }}
         />
       </div>
     )}
   </div>
 )
}

// Custom hook สำหรับจัดการข้อมูลเอกสาร
function useProcessedDocuments(documents: DocumentWithCategory[], selectedCategories: number[]) {
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

 return {
   filteredDocuments,
   sortedDocuments,
   processedDocuments
 };
}