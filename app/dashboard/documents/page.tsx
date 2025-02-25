// app/dashboard/documents/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/outline'
import { getDocuments } from '@/app/lib/actions/documents/get'
import DocumentList from '../components/documents/DocumentList'

export const metadata: Metadata = {
  title: 'จัดการเอกสาร | SDN MapPortal',
  description: 'ระบบจัดการเอกสารในระบบ'
}

export default async function DocumentsPage() {
  const documents = await getDocuments()

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
        {documents.length > 0 ? (
          <DocumentList documents={documents} />
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