// app/dashboard/components/documents/DocumentList.tsx
'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { deleteDocument } from '@/app/lib/actions/documents/delete'
import DocumentCard from './DocumentCard'
import { DocumentWithCategory } from '../types/document'

interface DocumentListProps {
  documents: DocumentWithCategory[]
}

export default function DocumentList({ documents }: DocumentListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    if (!confirm('ยืนยันการลบเอกสาร?')) return
    
    setDeletingId(id)
    try {
      await deleteDocument(id.toString())
      toast.success('ลบเอกสารสำเร็จ')
    } catch (error) {
      toast.error('ไม่สามารถลบเอกสารได้')
    } finally {
      setDeletingId(null) 
    }
  }

  return (
    <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {documents.map((document) => (
        <DocumentCard
          key={`${document.id}-${Date.now()}-${Math.random()}`} // ใช้ key ที่ไม่ซ้ำกันทุกครั้งที่ render
          document={document}
          onDelete={() => handleDelete(document.id)}
          isDeleting={deletingId === document.id}
        />
      ))}
    </div>
  )
}