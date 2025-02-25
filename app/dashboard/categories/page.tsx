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
   <div className="p-6">
     <div className="flex justify-between items-center mb-6">
       <h1 className="text-2xl font-bold">ประเภทเอกสาร</h1>
       <Link
         href="/dashboard/categories/new"
         className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
       >
         เพิ่มประเภทเอกสาร
       </Link>
     </div>
     <CategoryList categories={categories} />
   </div>
 )
}