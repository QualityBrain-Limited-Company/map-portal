// app/dashboard/documents/new/page.tsx
'use client'

import DocumentForm from '../../map/components/DocumentForm'
import { createDocument } from '@/app/lib/actions/documents/create'
import { useState } from 'react'

export default function NewDocumentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await createDocument(formData)
    } catch (error) {
      console.error('Error creating document:', error)
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