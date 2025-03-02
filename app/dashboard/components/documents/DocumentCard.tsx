// app/dashboard/components/documents/DocumentCard.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DocumentWithCategory } from '../types/document'

interface DocumentCardProps {
  document: DocumentWithCategory
  onDelete: () => void
  isDeleting: boolean
}

export default function DocumentCard({
  document,
  onDelete,
  isDeleting
}: DocumentCardProps) {
  // State สำหรับเก็บ URL ของรูปภาพ
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  
  // Effect สำหรับอัพเดท URL เมื่อ document เปลี่ยนแปลง
  useEffect(() => {
    if (document.coverImage) {
      // ตรวจสอบและแก้ไข path ให้ถูกต้อง
      let path = document.coverImage
      if (!path.startsWith('/')) {
        path = `/${path}`
      }
      
      // เพิ่ม timestamp เพื่อป้องกันการแคช
      setImageUrl(`${path}?t=${Date.now()}`)
    } else {
      setImageUrl(null)
    }
  }, [document.coverImage, document.id]) // เพิ่ม document.id เพื่อให้ effect ทำงานเมื่อเปลี่ยนเอกสาร

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative h-32">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={document.title}
            className="object-cover w-full h-full"
            onError={(e) => {
              console.error(`ไม่สามารถโหลดรูปภาพได้: ${imageUrl}`)
              // เมื่อโหลดรูปไม่สำเร็จ จะแสดงข้อความ "ไม่มีรูปปก" แทน
              e.currentTarget.style.display = 'none'
              e.currentTarget.parentElement?.classList.add('bg-gray-100')
              e.currentTarget.parentElement?.classList.add('flex')
              e.currentTarget.parentElement?.classList.add('items-center')
              e.currentTarget.parentElement?.classList.add('justify-center')
              
              // สร้าง element แสดงข้อความ
              const placeholder = document.createElement('span')
              placeholder.className = 'text-gray-400'
              placeholder.textContent = 'ไม่มีรูปปก'
              e.currentTarget.parentElement?.appendChild(placeholder)
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">ไม่มีรูปปก</span>
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between">
          <div>
            <Link 
              href={`/dashboard/documents/${document.id}`}
              className="text-sm font-medium hover:text-orange-600"
            >
              {document.title}
            </Link>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
              {document.description}
            </p>
          </div>
          <span className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full">
            {document.category.name}
          </span>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          <p>{document.province}</p>
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