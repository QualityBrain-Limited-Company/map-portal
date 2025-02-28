// app/dashboard/components/documents/DocumentList.tsx 
'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { deleteDocument } from '@/app/lib/actions/documents/delete'
import DocumentCard from './DocumentCard'
import { DocumentWithCategory } from '../types/document'

interface DocumentListProps {
  documents: DocumentWithCategory[]
  onDocumentDeleted?: () => void // เพิ่ม callback
}

export default function DocumentList({ documents, onDocumentDeleted }: DocumentListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    if (!confirm('ยืนยันการลบเอกสาร?')) return
    
    setDeletingId(id)
    try {
      // แปลง id จาก number เป็น string
      await deleteDocument(id.toString())
      toast.success('ลบเอกสารสำเร็จ')
      
      // เรียกใช้ callback เมื่อลบสำเร็จ
      if (onDocumentDeleted) {
        onDocumentDeleted()
      }
    } catch (error) {
      toast.error('ไม่สามารถลบเอกสารได้')
    } finally {
      setDeletingId(null) 
    }
  }

  if (documents.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-500">ยังไม่มีเอกสารในระบบ</p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {documents.map((document) => (
        <DocumentCard
          key={`${document.id}-${Date.now()}`} // เพิ่ม timestamp เพื่อบังคับให้ re-render
          document={document}
          onDelete={() => handleDelete(document.id)}
          isDeleting={deletingId === document.id}
        />
      ))}
    </div>
  )
}