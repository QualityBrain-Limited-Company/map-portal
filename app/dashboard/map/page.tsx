// app/map/page.tsx
import { getCategories } from '@/app/lib/actions/categories/get'
import ClientMap from './components/ClientMap'

export default async function GismapPage() {
  // ดึงข้อมูลหมวดหมู่เอกสารทั้งหมด
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold text-slate-800 mb-4">แผนที่เอกสาร</h1>
        <div className="h-[calc(100vh-8rem)] bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
          <ClientMap categories={categories} />
        </div>
      </div>
    </div>
  )
}