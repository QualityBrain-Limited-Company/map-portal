// app/dashboard/components/documents/DocumentCard.tsx 
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { DocumentWithCategory } from '@/app/types/document'

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
  // ใช้ useState เก็บ path ของรูปภาพ
  const [imagePath, setImagePath] = useState<string | null>(null)
  
  // ใช้ useEffect ตรวจสอบและอัพเดท path เมื่อข้อมูล document เปลี่ยนแปลง
  useEffect(() => {
    if (document.coverImage) {
      let path = document.coverImage
      // ตรวจสอบและปรับปรุง path
      if (!path.startsWith('/')) {
        path = `/${path}`
      }
      // เพิ่ม timestamp เพื่อป้องกันการ cache เมื่อมีการอัพเดทรูปภาพ
      // (ใช้เฉพาะกับรูปที่เพิ่งอัพเดทเท่านั้น)
      setImagePath(`${path}?v=${Date.now()}`)
    } else {
      setImagePath(null)
    }
  }, [document.coverImage])

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative h-32">
        {imagePath ? (
          <Image
            src={imagePath}
            alt={document.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            unoptimized={true}
            // เพิ่มการจัดการเมื่อรูปโหลดไม่สำเร็จ
            onError={() => {
              console.error(`ไม่สามารถโหลดรูปภาพได้: ${imagePath}`)
              // อาจเปลี่ยนเป็นรูปภาพสำรองหรือแสดงข้อความว่าโหลดไม่สำเร็จ
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
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
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
            aria-busy={isDeleting}
          >
            {isDeleting ? 'กำลังลบ...' : 'ลบ'}
          </button>
        </div>
      </div>
    </div>
  )
}