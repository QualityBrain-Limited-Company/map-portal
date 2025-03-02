// app/dashboard/components/documents/DocumentList.tsx
'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { deleteDocument } from '@/app/lib/actions/documents/delete'
import DocumentCard from './DocumentCard'
import { DocumentWithCategory } from '../types/document'

interface DocumentListProps {
  documents: DocumentWithCategory[]
  onDocumentDeleted?: () => void
}

export default function DocumentList({ documents, onDocumentDeleted }: DocumentListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  // เพิ่ม state เพื่อเก็บ documents ที่มีการเพิ่ม timestamp
  const [processedDocs, setProcessedDocs] = useState<DocumentWithCategory[]>([])
  
  // อัพเดต processedDocs เมื่อ documents เปลี่ยนแปลง
  useEffect(() => {
    setProcessedDocs(documents)
  }, [documents])

  const handleDelete = async (id: number) => {
    if (!confirm('ยืนยันการลบเอกสาร?')) return
    
    setDeletingId(id)
    try {
      await deleteDocument(id.toString())
      toast.success('ลบเอกสารสำเร็จ')
      
      if (onDocumentDeleted) {
        onDocumentDeleted()
      }
    } catch (error) {
      toast.error('ไม่สามารถลบเอกสารได้')
    } finally {
      setDeletingId(null) 
    }
  }

  if (processedDocs.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-500">ยังไม่มีเอกสารในระบบ</p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {processedDocs.map((document) => (
        <DocumentCard
          key={`doc-${document.id}`}
          document={{
            ...document,
            // เพิ่ม timestamp ใน key เพื่อบังคับให้ React สร้าง component ใหม่
            id: document.id
          }}
          onDelete={() => handleDelete(document.id)}
          isDeleting={deletingId === document.id}
        />
      ))}
    </div>
  )
}