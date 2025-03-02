// app/dashboard/documents/client-page/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import DocumentList from '../../components/documents/DocumentList'
import { DocumentWithCategory } from '@/app/types/document'
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/outline'

interface SerializedDocument extends Omit<DocumentWithCategory, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

export default function ClientDocumentsPage() {
  const [documents, setDocuments] = useState<SerializedDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    unpublished: 0
  })

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/documents/card')
        if (response.ok) {
          const data = await response.json()
          setDocuments(data)
          
          // คำนวณค่าสถิติ
          setStats({
            total: data.length,
            published: data.filter((doc: SerializedDocument) => doc.isPublished).length,
            unpublished: data.filter((doc: SerializedDocument) => !doc.isPublished).length
          })
        } else {
          toast.error('ไม่สามารถโหลดข้อมูลเอกสารได้')
        }
      } catch (error) {
        console.error('Error fetching documents:', error)
        toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล')
      } finally {
        setLoading(false)
      }
    }
    
    fetchDocuments()
  }, [])

  const handleDeleteDocument = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        toast.success('ลบเอกสารสำเร็จ')
        // อัพเดทข้อมูลเอกสารหลังจากลบสำเร็จ
        setDocuments(prev => prev.filter(doc => doc.id !== parseInt(id)))
        // อัพเดทสถิติ
        setStats(prev => ({
          ...prev,
          total: prev.total - 1
        }))
      } else {
        const error = await response.json()
        throw new Error(error.error || 'ไม่สามารถลบเอกสารได้')
      }
      
      return { success: true }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการลบเอกสาร')
      return { success: false, error: 'ไม่สามารถลบเอกสารได้' }
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold">เอกสารทั้งหมด (Client)</h1>
            <p className="text-gray-600 mt-1">
              จัดการเอกสารและข้อมูลในระบบ
            </p>
          </div>
          <Link
            href="/dashboard/documents/new"
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors w-full sm:w-auto justify-center sm:justify-start"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            เพิ่มเอกสารใหม่
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-gray-500">เอกสารทั้งหมด</div>
            <div className="text-2xl font-semibold">{stats.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-gray-500">เอกสารที่เผยแพร่</div>
            <div className="text-2xl font-semibold">{stats.published}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-gray-500">เอกสารที่ไม่เผยแพร่</div>
            <div className="text-2xl font-semibold">{stats.unpublished}</div>
          </div>
        </div>
      </div>

      {/* Document List Section */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">กำลังโหลดข้อมูล...</p>
          </div>
        ) : documents.length > 0 ? (
          <DocumentList 
            documents={documents} 
            deleteAction={handleDeleteDocument}
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