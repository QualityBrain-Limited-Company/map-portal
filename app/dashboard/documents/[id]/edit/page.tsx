import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDocument } from '@/app/lib/actions/documents/get'
import { updateDocument } from '@/app/lib/actions/documents/update'
import { getCategories } from '@/app/lib/actions/categories/get'
import DocumentForm from '@/app/dashboard/map/components/DocumentForm'
import { DocumentWithCategory, LocationData } from '@/app/types/document'

interface PageProps {
  params: Promise<{ id: string }> | { id: string }
}

export default async function EditDocumentPage({ params }: PageProps) {
  // รอให้ params พร้อมก่อนใช้งาน
  const resolvedParams = await Promise.resolve(params)
  const { id } = resolvedParams
  
  const documentData = await getDocument(id)
  const categories = await getCategories()
  
  if (!documentData) {
    notFound()
  }

  // สร้าง location data จาก document
  const locationData: LocationData = {
    lat: documentData.latitude,
    lng: documentData.longitude,
    province: documentData.province,
    amphoe: documentData.amphoe,
    district: documentData.district,
    geocode: 0  // กำหนดค่าเริ่มต้น หรือดึงจากข้อมูลถ้ามี
  }

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/dashboard" className="hover:text-blue-600">
          แดชบอร์ด
        </Link>
        <span className="mx-2">/</span>
        <Link href="/dashboard/documents" className="hover:text-blue-600">
          เอกสาร
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">แก้ไข</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">แก้ไขเอกสาร</h1>
        <Link 
          href="/dashboard/documents"
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700"
        >
          กลับไปรายการเอกสาร
        </Link>
      </div>
      
      <DocumentForm 
        initialData={documentData as unknown as DocumentWithCategory}
        location={locationData}
        categories={categories}
        action={async (formData: FormData) => {
          'use server'
          
          // Add necessary location data to formData
          formData.append('district', documentData.district)
          formData.append('amphoe', documentData.amphoe)
          formData.append('province', documentData.province)
          formData.append('latitude', documentData.latitude.toString())
          formData.append('longitude', documentData.longitude.toString())
          
          await updateDocument(id, formData)
        }}
      />
    </div>
  )
}