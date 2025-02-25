// app/page.tsx
import { getCategories } from '@/app/lib/actions/categories/get'
import MapClientWrapper from './components/MapClientWrapper'

export default async function HomePage() {
  const categories = await getCategories()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 h-[calc(100vh-2rem)] bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
            <MapClientWrapper categories={categories} />
          </div>
          
          {/* ส่วนของสรุปข้อมูล */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl shadow-md border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">ข้อมูลประเภทเอกสาร</h2>
              
              <div className="space-y-3">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ 
                          backgroundColor: 
                            category.id === 1 ? '#f97316' : 
                            category.id === 2 ? '#64748b' : 
                            category.id === 3 ? '#4b5563' :
                            category.id === 4 ? '#3b82f6' :
                            category.id === 5 ? '#6366f1' :
                            category.id === 6 ? '#475569' :
                            '#64748b'
                        }}
                      ></div>
                      <span className="text-slate-700">{category.name}</span>
                    </div>
                    <span className="bg-orange-50 text-orange-600 text-xs px-2 py-1 rounded-full">
                      {category._count?.documents || 0} รายการ
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl shadow-md border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">คำแนะนำการใช้งาน</h2>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>สามารถซูมเข้า-ออกเพื่อดูตำแหน่งเอกสารในแต่ละพื้นที่</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>คลิกที่หมุดเพื่อดูรายละเอียดเอกสาร</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>ใช้ตัวกรองด้านบนขวาเพื่อเลือกดูเฉพาะประเภทที่ต้องการ</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>หมุดสีส้มแสดงเอกสารล่าสุดที่เพิ่มเข้ามาในระบบ</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}