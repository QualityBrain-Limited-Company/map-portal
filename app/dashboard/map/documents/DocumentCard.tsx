// app/dashboard/map/components/documents/DocumentCard.tsx
'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { th } from 'date-fns/locale'
import Image from 'next/image'
import { Document, CategoryDoc } from '@prisma/client'
import { useMapStore } from '@/app/store/gis_mapStore'

interface DocumentCardProps {
 document: Document & {
   category?: CategoryDoc;
   isLatest?: boolean;
 }
}

export default function DocumentCard({ document }: DocumentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const setSelectedDocument = useMapStore((state) => state.setSelectedDocument)

  const handleViewOnMap = () => {
    setSelectedDocument(document)
    const mapElement = document.querySelector('#map-container')
    mapElement?.scrollIntoView({ behavior: 'smooth' })
  }

 const handleDownload = async () => {
   try {
     const response = await fetch(`/api/documents/download/${document.id}`)
     if (!response.ok) throw new Error('ไม่สามารถดาวน์โหลดเอกสารได้')

     const blob = await response.blob()
     const url = window.URL.createObjectURL(blob)
     const aElement = document.createElement('a')
     aElement.href = url
     aElement.download = `${document.title}.pdf`
     document.body.appendChild(aElement)
     aElement.click()
     window.URL.revokeObjectURL(url)
     document.body.removeChild(aElement)
   } catch (error) {
     console.error('Download error:', error)
   }
 }

 return (
   <div className="group hover:bg-gray-50 rounded-lg transition-all duration-200">
     <div className="p-4 flex gap-4">
       {/* Cover Image */}
       {document.coverImage && (
         <div className="relative w-24 h-24 flex-shrink-0">
           <Image
             src={document.coverImage}
             alt={document.title}
             fill
             className="object-cover rounded-lg"
           />
         </div>
       )}

       <div className="flex-1 min-w-0">
         {/* Header: Category & Date */}
         <div className="flex items-center gap-2 mb-1">
           {document.category && (
             <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
               {document.category.name}
             </span>
           )}
           {document.isLatest && (
             <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-xs rounded-full animate-pulse">
               ล่าสุด!
             </span>
           )}
           <span className="text-xs text-gray-500">
             {formatDistanceToNow(new Date(document.createdAt), {
               addSuffix: true,
               locale: th
             })}
           </span>
         </div>

         {/* Title */}
         <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
           {document.title}
         </h3>

         {/* Description */}
         <p className={`text-sm text-gray-600 mt-1 ${isExpanded ? '' : 'line-clamp-2'}`}>
           {document.description}
         </p>
         
         {document.description.length > 150 && (
           <button
             onClick={() => setIsExpanded(!isExpanded)}
             className="text-sm text-blue-600 hover:text-blue-700 mt-1"
           >
             {isExpanded ? 'แสดงน้อยลง' : 'อ่านเพิ่มเติม'}
           </button>
         )}

         {/* Location */}
         <div className="text-sm text-gray-500 mt-2 flex items-center gap-1">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
               d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
             />
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
               d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
             />
           </svg>
           <span className="truncate">
             {document.subdistrict}, {document.district}, {document.province}
           </span>
         </div>

         {/* Stats & Actions */}
         <div className="flex items-center gap-4 mt-3">
           {/* View Count */}
           <div className="flex items-center text-sm text-gray-500">
             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                 d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
               />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                 d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
               />
             </svg>
             {document.viewCount.toLocaleString()}
           </div>

           {/* Download Count */}
           <div className="flex items-center text-sm text-gray-500">
             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                 d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
               />
             </svg>
             {document.downloadCount.toLocaleString()}
           </div>

           <div className="flex-1" />

           {/* Action Buttons */}
           <button
             onClick={handleViewOnMap}
             className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 
               hover:bg-blue-50 rounded-lg transition-colors"
           >
             <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                 d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
               />
             </svg>
             ดูบนแผนที่
           </button>

           <button
             onClick={handleDownload}
             className="inline-flex items-center px-3 py-1.5 text-sm text-green-600 hover:text-green-700 
               hover:bg-green-50 rounded-lg transition-colors"
           >
             <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                 d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
               />
             </svg>
             ดาวน์โหลด
           </button>
         </div>
       </div>
     </div>
   </div>
 )
}