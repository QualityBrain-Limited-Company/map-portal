// app/dashboard/components/documents/DocumentCard.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DocumentWithCategory } from '@/app/types/document'

interface SerializedDocument extends Omit<DocumentWithCategory, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

interface DocumentCardProps {
  document: SerializedDocument;
  onDelete: () => void;
  isDeleting: boolean;
  showImagePreview?: boolean;
}

export default function DocumentCard({
  document,
  onDelete,
  isDeleting,
  showImagePreview = true
}: DocumentCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  if (!document) {
    return null;
  }

  // จัดการกับ path ของรูปภาพ
  let imageUrl = null
  if (document?.coverImage) {
    let path = document.coverImage
    if (!path.startsWith('/')) {
      path = `/${path}`
    }
    imageUrl = path
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative h-32">
        {!imageUrl ? (
          // แสดงข้อความเมื่อไม่มีรูปภาพ
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">ไม่มีรูปปก</span>
          </div>
        ) : imageError ? (
          // แสดงข้อความเมื่อโหลดรูปภาพไม่สำเร็จ
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">ไม่สามารถโหลดรูปภาพได้</span>
          </div>
        ) : (
          // แสดงรูปภาพพร้อม loading indicator
          <div className="w-full h-full relative">
            {!isImageLoaded && showImagePreview && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                <div className="animate-pulse flex space-x-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            )}
            <img
              src={imageUrl}
              alt={document.title || "เอกสาร"}
              className="object-cover w-full h-full"
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setImageError(true)}
              style={{ visibility: showImagePreview && !isImageLoaded ? "hidden" : "visible" }}
            />
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Link 
              href={`/dashboard/documents/${document.id}`}
              className="text-sm font-medium hover:text-orange-600 truncate block"
            >
              {document.title || "ไม่มีชื่อ"}
            </Link>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
              {document.description || "ไม่มีคำอธิบาย"}
            </p>
          </div>
          {document.category && (
            <span className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full ml-1 flex-shrink-0">
              {document.category.name}
            </span>
          )}
        </div>

        <div className="mt-2 text-xs text-gray-500">
          <p>{document.province || "-"}</p>
          <p>
            {new Date(document.createdAt).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className="mt-2 flex justify-end space-x-1">
          <Link
            href={`/dashboard/documents/${document.id}/edit`}
            className="px-2 py-0.5 text-xs text-orange-600 hover:bg-orange-50 rounded"
          >
            แก้ไข
          </Link>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="px-2 py-0.5 text-xs text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
          >
            {isDeleting ? 'กำลังลบ...' : 'ลบ'}
          </button>
        </div>
      </div>
    </div>
  )
}