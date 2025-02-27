// app/dashboard/map/components/Legend.tsx
'use client'

import { CategoryDoc } from '@prisma/client'
import { getCategoryColor } from '@/app/utils/colorGenerator';

interface LegendProps {
 categories: CategoryDoc[];
}

export default function Legend({ categories }: LegendProps) {
 return (
   <div style={{
     position: 'absolute',
     bottom: '20px',
     right: '20px',
     backgroundColor: 'rgba(255, 255, 255, 0.9)',
     backdropFilter: 'blur(4px)',
     padding: '16px',
     borderRadius: '8px',
     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
     zIndex: 400
   }}>
     <h4 style={{
       fontWeight: 500,
       marginBottom: '12px',
       color: '#0f172a'
     }}>
       สัญลักษณ์บนแผนที่
     </h4>
     <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
       {categories.map(cat => {
         const colorScheme = getCategoryColor(cat.id);
         return (
           <div key={cat.id} style={{ display: 'flex', alignItems: 'center' }}>
             <div style={{
               width: '24px',
               height: '24px',
               backgroundColor: colorScheme.primary,
               borderRadius: '50%',
               marginRight: '8px',
               border: '2px solid white',
               boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
             }}></div>
             <span style={{ fontSize: '0.875rem', color: '#475569' }}>{cat.name}</span>
           </div>
         );
       })}
     </div>
   </div>
 );
}
