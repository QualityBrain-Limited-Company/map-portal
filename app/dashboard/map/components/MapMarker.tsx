// app/dashboard/map/components/MapMarker.tsx
'use client'

import { Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import { DocumentWithCategory } from '@/app/types/document'
import { generateColorById } from '@/app/utils/colorGenerator'
import { formatDistanceToNow } from 'date-fns'
import { th } from 'date-fns/locale'

interface MapMarkerProps {
  document: DocumentWithCategory & { isLatest?: boolean };
}

export default function MapMarker({ document }: MapMarkerProps) {
  // สร้างสีตาม ID ของหมวดหมู่
  const colorScheme = generateColorById(document.categoryId);
  
  // สร้าง icon ด้วย HTML โดยตรง
  const icon = L.divIcon({
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
  
  return (
    <>
      <Marker
        position={[document.latitude, document.longitude]}
        icon={icon}
      >
        <Popup>
          <div style={{ padding: '10px', minWidth: '250px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ 
                backgroundColor: `${colorScheme.primary}20`, 
                color: colorScheme.primary,
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '0.75rem'
              }}>
                {document.category?.name || 'ไม่ระบุหมวดหมู่'}
              </span>
              {document.isLatest && (
                <span style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  color: 'rgb(180, 83, 9)',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                }}>
                  ล่าสุด!
                </span>
              )}
            </div>

            <h3 style={{ fontWeight: 500, color: '#0f172a', margin: '0 0 6px 0' }}>{document.title}</h3>
            <p style={{ fontSize: '0.875rem', color: '#475569', margin: '0 0 10px 0' }}>
              {document.description.substring(0, 150)}
              {document.description.length > 150 ? '...' : ''}
            </p>
            
            <div style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 8px 0' }}>
              {document.district}, {document.amphoe}, {document.province}
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: '#64748b',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '8px',
              marginTop: '8px'
            }}>
              <span>จำนวนการดู: {document.viewCount}</span>
              <span>ดาวน์โหลด: {document.downloadCount}</span>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button 
                onClick={() => window.open(document.filePath, '_blank')}
                style={{
                  flex: 1,
                  padding: '6px 12px',
                  fontSize: '0.875rem',
                  color: 'white',
                  backgroundColor: '#f97316',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                ดูเอกสาร
              </button>
              <button 
                style={{
                  padding: '6px 12px',
                  fontSize: '0.875rem',
                  color: '#ea580c',
                  backgroundColor: 'rgba(249, 115, 22, 0.1)',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                ดาวน์โหลด
              </button>
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