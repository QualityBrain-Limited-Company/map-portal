// app/dashboard/documents/client-page/new/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DocumentForm from '../../../map/components/DocumentForm'
import { CategoryDoc } from '@prisma/client'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function NewClientDocumentPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<CategoryDoc[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // ดึงข้อมูลหมวดหมู่
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const res = await fetch('/api/categories')
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
        } else {
          toast.error('ไม่สามารถโหลดข้อมูลหมวดหมู่ได้')
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchCategories()
  }, [])

  const handleSuccess = async () => {
    router.push('/dashboard/documents/client-page')
    router.refresh()
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6 flex items-center">
        <Link href="/dashboard/documents/client-page" className="text-orange-600 hover:text-orange-700 mr-4">
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">เพิ่มเอกสารใหม่ (Client API)</h1>
      </div>
      
      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent mb-4"></div>
          <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
        </div>
      ) : (
        <DocumentForm 
          categories={categories}
          onSuccess={handleSuccess}
          location={{
            lat: 0,
            lng: 0,
            province: "",
            amphoe: "",
            district: "",
            geocode: 0
          }}
          onClose={() => router.push('/dashboard/documents/client-page')}
          // กำหนดให้ใช้ API endpoint แทน server action
          useApiEndpoint={true}
          apiUrl="/api/documents/card"
        />
      )}
    </div>
  )
}