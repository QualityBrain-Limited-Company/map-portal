// app/dashboard/documents/new/page.tsx 
'use client'

import DocumentForm from '../../map/components/DocumentForm'
import { createDocument } from '@/app/lib/actions/documents/create'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function NewDocumentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await createDocument(formData)
      // แสดงข้อความสำเร็จ
      toast.success('เพิ่มเอกสารสำเร็จ')
      
      // ใช้ router.refresh() เพื่อบังคับให้ Next.js โหลดข้อมูลใหม่
      router.refresh()
      
      // นำผู้ใช้กลับไปยังหน้ารายการเอกสาร
      router.push('/dashboard/documents')
    } catch (error) {
      console.error('Error creating document:', error)
      toast.error('เกิดข้อผิดพลาดในการเพิ่มเอกสาร')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">เพิ่มเอกสารใหม่</h1>
      <DocumentForm 
        categories={[]}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        initialData={null}
      />
    </div>
  )
}