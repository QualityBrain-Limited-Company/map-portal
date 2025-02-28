// app/dashboard/documents/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/outline'
import { getDocuments } from '@/app/lib/actions/documents/get'
import DocumentList from '../components/documents/DocumentList'
import { DocumentWithCategory } from '../components/types/document'

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentWithCategory[]>([])
  const [loading, setLoading] = useState(true)

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const docs = await getDocuments()
      setDocuments(docs)
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  // เพิ่มฟังก์ชันนี้เพื่อให้ DocumentList เรียกใช้เมื่อลบเอกสาร
  const handleDocumentDeleted = () => {
    loadDocuments() // โหลดข้อมูลใหม่หลังลบ
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">เอกสารทั้งหมด</h1>
            <p className="text-gray-600 mt-1">
              จัดการเอกสารและข้อมูลในระบบ
            </p>
          </div>
          <Link
            href="/dashboard/documents/new"
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            เพิ่มเอกสารใหม่
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-gray-500">เอกสารทั้งหมด</div>
            <div className="text-2xl font-semibold">{documents.length}</div>
          </div>
          {/* Add more stats cards if needed */}
        </div>
      </div>

      {/* Document List Section */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
          </div>
        ) : documents.length > 0 ? (
          <DocumentList 
            documents={documents} 
            onDocumentDeleted={handleDocumentDeleted}
          />
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">ยังไม่มีเอกสารในระบบ</p>
            <Link
              href="/dashboard/documents/new"
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              เพิ่มเอกสารใหม่
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}