// app/dashboard/categories/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { getCategories } from '@/app/lib/actions/categories/get'
import CategoryList from '../components/categories/CategoryList'

export const metadata: Metadata = {
  title: 'ประเภทเอกสาร | SDN MapPortal',
  description: 'จัดการประเภทเอกสารในระบบ'
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">ประเภทเอกสาร</h1>
          <p className="text-sm text-gray-500 mt-1">จัดการประเภทของเอกสารในระบบ</p>
        </div>
        <Link
          href="/dashboard/categories/new"
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm whitespace-nowrap"
        >
          เพิ่มประเภทเอกสาร
        </Link>
      </div>
      
      <CategoryList categories={categories} />
      
      {categories.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">ยังไม่มีประเภทเอกสารในระบบ</p>
          <Link
            href="/dashboard/categories/new"
            className="mt-4 inline-block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            เพิ่มประเภทเอกสาร
          </Link>
        </div>
      )}
    </div>
  )
}