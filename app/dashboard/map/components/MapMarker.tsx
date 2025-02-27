// app/dashboard/map/components/MapMarker.tsx
'use client'

import { Marker, Popup, CircleMarker } from 'react-leaflet'
import { DocumentWithCategory } from '@/app/types/document'
import { getCategoryColor } from '@/app/utils/colorGenerator'
import { useEffect, useState } from 'react'

interface MapMarkerProps {
  document: DocumentWithCategory & { isLatest?: boolean };
}

export default function MapMarker({ document }: MapMarkerProps) {
  // สร้างสีตาม ID ของหมวดหมู่
  const colorScheme = getCategoryColor(document.categoryId);
  const [icon, setIcon] = useState<any>(null);
  
  useEffect(() => {
    // นำเข้า Leaflet ในฝั่งไคลเอนต์เท่านั้น
    import('leaflet').then(L => {
      // สร้าง icon ด้วย HTML โดยตรง
      const newIcon = L.default.divIcon({
        html: `
          <div style="position: relative;">
            <div style="
              width: 24px;
              height: 24px;
              background-color: ${colorScheme.primary};
              border-radius: 50%;
              border: 2px solid white;
              position: relative;
              z-index: 10;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            "></div>
            <div style="
              position: absolute;
              bottom: -4px;
              left: 50%;
              transform: translateX(-50%);
              width: 16px;
              height: 4px;
              background-color: rgba(0,0,0,0.2);
              border-radius: 50%;
              filter: blur(2px);
              z-index: 5;
            "></div>
            ${document.isLatest ? `
              <div style="
                position: absolute;
                top: -4px;
                left: -4px;
                right: -4px;
                bottom: -4px;
                border-radius: 50%;
                background-color: ${colorScheme.primary};
                opacity: 0;
                animation: ping 1.5s ease-in-out infinite;
                z-index: 1;
              "></div>
            ` : ''}
          </div>
        `,
        className: 'custom-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      });
      
      setIcon(newIcon);
    });
  }, [document.isLatest, colorScheme.primary]);
  
  // รอให้ icon ถูกสร้างก่อนแสดงผล
  if (!icon) return null;
 
  return (
    <>
      <Marker
        position={[document.latitude, document.longitude]}
        icon={icon}
      >
<Popup>
 <div className="min-w-[250px]">
   <div className="flex items-center gap-2 mb-2">
     <span 
       className="px-2 py-0.5 text-xs rounded-full"
       style={{ 
         backgroundColor: `${colorScheme.primary}20`, 
         color: colorScheme.primary
       }}
     >
       {document.category?.name || 'ไม่ระบุหมวดหมู่'}
     </span>
     {document.isLatest && (
       <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800">
         ล่าสุด!
       </span>
     )}
   </div>

   <h3 className="font-medium text-gray-900 mb-1.5">{document.title}</h3>
   <p className="text-sm text-gray-600 mb-2.5">
     {document.description.substring(0, 150)}
     {document.description.length > 150 ? '...' : ''}
   </p>
   
   <div className="text-xs text-gray-500 mb-2">
     {document.district}, {document.amphoe}, {document.province}
   </div>
   
   <div className="flex justify-between text-xs text-gray-500 border-t border-gray-200 pt-2 mb-3">
     <span>จำนวนการดู: {document.viewCount}</span>
     <span>ดาวน์โหลด: {document.downloadCount}</span>
   </div>
   
   <div className="flex gap-2">
  <a 
    href={document.filePath}
    target="_blank"
    rel="noopener noreferrer"
    className="flex-1 py-1.5 px-3 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm transition-colors flex items-center justify-center shadow-sm"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
    ดูเอกสาร
  </a>
  <a 
    href={`${document.filePath}?download=true`}
    download
    className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm transition-colors flex items-center justify-center shadow-sm"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
    ดาวน์โหลด
  </a>
</div>
 </div>
</Popup>
      </Marker>
      
      {document.isLatest && (
        <CircleMarker
          center={[document.latitude, document.longitude]}
          pathOptions={{
            fillColor: 'transparent',
            color: '#f59e0b',
            weight: 2,
            opacity: 0.6,
            dashArray: '5, 5'
          }}
          radius={20}
        />
      )}
    </>
  );
}