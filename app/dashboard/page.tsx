// app/dashboard/page.tsx
import prisma from '../lib/db';
import { DocumentIcon, MapIcon, UserIcon, BoltIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

async function getStats() {
 try {
   const [totalDocuments, documentsPerType, categories, documentsPerCategory] = await Promise.all([
     prisma.document.count(),
     prisma.document.groupBy({ by: ['type'], _count: true }),
     prisma.categoryDoc.findMany(),
     prisma.document.groupBy({ by: ['categoryId'], _count: true })
   ]);
   
   const categoriesWithCount = categories.map(category => ({
     ...category,
     count: documentsPerCategory.find(doc => doc.categoryId === category.id)?._count || 0
   }));

   return { totalDocuments, documentsPerType, categoriesWithCount };
 } catch (error) {
   console.error('Error fetching stats:', error);
   return { totalDocuments: 0, documentsPerType: [], categoriesWithCount: [] };
 }
}

export default async function DashboardHome() {
 const stats = await getStats();
 const typeLabels: Record<string, string> = {
   'LESSON_LEARNED': 'ถอดบทเรียน',
   'MODEL_DISTRICT': 'อำเภอต้นแบบ',
   'MODEL_PERSON': 'คนต้นแบบ',
   'OTHER': 'อื่นๆ',
 };

 return (
   <div className="space-y-5">
     <div className="flex justify-between items-center">
       <h1 className="text-xl font-medium text-gray-800">แผงควบคุม</h1>
       <div className="flex gap-2">
         <Link
           href="/dashboard/documents/new"
           className="text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
         >
           + เอกสารใหม่
         </Link>
         <Link
           href="/dashboard/map"
           className="text-sm px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
         >
           ดูแผนที่
         </Link>
       </div>
     </div>
     
     {/* สถิติย่อ */}
     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
       <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
         <div className="flex items-center">
           <div className="p-2 bg-blue-50 rounded-md">
             <DocumentIcon className="w-5 h-5 text-blue-500" />
           </div>
           <div className="ml-3">
             <p className="text-xs text-gray-500">เอกสารทั้งหมด</p>
             <p className="text-lg font-semibold">{stats.totalDocuments}</p>
           </div>
         </div>
       </div>
       
       <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
         <div className="flex items-center">
           <div className="p-2 bg-green-50 rounded-md">
             <MapIcon className="w-5 h-5 text-green-500" />
           </div>
           <div className="ml-3">
             <p className="text-xs text-gray-500">จังหวัดที่มีข้อมูล</p>
             <p className="text-lg font-semibold">12</p>
           </div>
         </div>
       </div>

       <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
         <div className="flex items-center">
           <div className="p-2 bg-purple-50 rounded-md">
             <UserIcon className="w-5 h-5 text-purple-500" />
           </div>
           <div className="ml-3">
             <p className="text-xs text-gray-500">ผู้ใช้งาน</p>
             <p className="text-lg font-semibold">3</p>
           </div>
         </div>
       </div>
     </div>
     
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {/* หมวดหมู่ */}
       <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
         <h2 className="text-sm font-medium text-gray-700 mb-3">หมวดหมู่เอกสาร</h2>
         {stats.categoriesWithCount.length > 0 ? (
           <div className="space-y-2">
             {stats.categoriesWithCount.map((cat) => (
               <div key={cat.id} className="flex justify-between items-center text-sm">
                 <span className="text-gray-600">{cat.name}</span>
                 <div className="flex items-center">
                   <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden mr-2">
                     <div 
                       className="h-full bg-blue-500 rounded-full"
                       style={{ 
                         width: `${Math.min(100, (cat.count / Math.max(...stats.categoriesWithCount.map(c => c.count))) * 100)}%` 
                       }}
                     ></div>
                   </div>
                   <span className="text-gray-700 font-medium">{cat.count}</span>
                 </div>
               </div>
             ))}
           </div>
         ) : (
           <p className="text-sm text-gray-500 text-center py-4">ยังไม่มีข้อมูลหมวดหมู่</p>
         )}
       </div>
       
       {/* ประเภทเอกสาร */}
       <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
         <h2 className="text-sm font-medium text-gray-700 mb-3">ประเภทเอกสาร</h2>
         {stats.documentsPerType.length > 0 ? (
           <div className="space-y-2">
             {stats.documentsPerType.map((type) => (
               <div key={type.type || 'unspecified'} className="flex justify-between items-center text-sm">
                 <span className="text-gray-600">
                   {type.type ? (typeLabels[type.type] || type.type) : 'ไม่ระบุ'}
                 </span>
                 <span className="font-medium px-2 py-0.5 bg-gray-100 rounded-md text-gray-700">
                   {type._count}
                 </span>
               </div>
             ))}
           </div>
         ) : (
           <p className="text-sm text-gray-500 text-center py-4">ยังไม่มีข้อมูลประเภทเอกสาร</p>
         )}
       </div>
     </div>
     
     {/* การดำเนินการด่วน */}
     <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
       <div className="flex items-center mb-3">
         <BoltIcon className="w-4 h-4 text-amber-500 mr-1.5" />
         <h2 className="text-sm font-medium text-gray-700">การดำเนินการด่วน</h2>
       </div>
       <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
         <Link
           href="/dashboard/documents/new"
           className="text-xs px-3 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-center"
         >
           เพิ่มเอกสาร
         </Link>
         <Link
           href="/dashboard/categories/new"
           className="text-xs px-3 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-center"
         >
           เพิ่มหมวดหมู่
         </Link>
         <Link
           href="/dashboard/map"
           className="text-xs px-3 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-center"
         >
           ดูแผนที่
         </Link>
         <Link
           href="/dashboard/settings"
           className="text-xs px-3 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-center"
         >
           ตั้งค่า
         </Link>
       </div>
     </div>
     
     {/* กิจกรรมล่าสุด */}
     <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
       <h2 className="text-sm font-medium text-gray-700 mb-3">กิจกรรมล่าสุด</h2>
       <div className="text-xs text-gray-500 text-center py-4 bg-gray-50 rounded-md">
         ยังไม่มีกิจกรรมล่าสุด
       </div>
     </div>
   </div>
 );
}