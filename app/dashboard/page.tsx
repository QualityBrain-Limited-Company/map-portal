// app/dashboard/page.tsx
import prisma from '../lib/db';
import { DocumentIcon, MapIcon, UserIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

async function getStats() {
 try {
   // ดึงข้อมูลจำนวนเอกสารทั้งหมด
   const totalDocuments = await prisma.document.count();
   
   // ดึงข้อมูลจำนวนเอกสารแยกตาม type
   const documentsPerType = await prisma.document.groupBy({
     by: ['type'],
     _count: true,
   });
   
   // ดึงข้อมูลหมวดหมู่ (CategoryDoc) ทั้งหมด
   const categories = await prisma.categoryDoc.findMany();
   
   // ดึงข้อมูลจำนวนเอกสารแยกตามหมวดหมู่
   const documentsPerCategory = await prisma.document.groupBy({
     by: ['categoryId'],
     _count: true,
   });
   
   // รวมข้อมูลหมวดหมู่กับจำนวนเอกสาร
   const categoriesWithCount = categories.map(category => {
     const count = documentsPerCategory.find(doc => doc.categoryId === category.id)?._count || 0;
     return {
       ...category,
       count
     };
   });

   return {
     totalDocuments,
     documentsPerType,
     categoriesWithCount
   };
 } catch (error) {
   console.error('Error fetching stats:', error);
   return {
     totalDocuments: 0,
     documentsPerType: [],
     categoriesWithCount: []
   };
 }
}

export default async function DashboardHome() {
 const stats = await getStats();

 // ชื่อประเภทเอกสาร (สำหรับฟิลด์ type)
 const documentTypeLabels = {
   LESSON_LEARNED: 'ถอดบทเรียน',
   MODEL_DISTRICT: 'อำเภอต้นแบบ',
   MODEL_PERSON: 'คนต้นแบบ',
   OTHER: 'อื่นๆ',
 };

 return (
   <div className="space-y-6">
     <h1 className="text-2xl font-bold">แผงควบคุม</h1>

     {/* Quick Stats */}
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       <div className="bg-white rounded-xl shadow p-6">
         <div className="flex items-center space-x-4">
           <DocumentIcon className="w-12 h-12 text-blue-500" />
           <div>
             <p className="text-gray-600">เอกสารทั้งหมด</p>
             <p className="text-2xl font-bold">{stats.totalDocuments}</p>
           </div>
         </div>
       </div>
       
       <div className="bg-white rounded-xl shadow p-6">
         <div className="flex items-center space-x-4">
           <MapIcon className="w-12 h-12 text-green-500" />
           <div>
             <p className="text-gray-600">จังหวัดที่มีข้อมูล</p>
             <p className="text-2xl font-bold">-</p>
           </div>
         </div>
       </div>

       <div className="bg-white rounded-xl shadow p-6">
         <div className="flex items-center space-x-4">
           <UserIcon className="w-12 h-12 text-purple-500" />
           <div>
             <p className="text-gray-600">ผู้ใช้งานทั้งหมด</p>
             <p className="text-2xl font-bold">-</p>
           </div>
         </div>
       </div>
     </div>

     {/* Document Categories Stats */}
     <div className="bg-white rounded-xl shadow p-6">
       <h2 className="text-xl font-bold mb-4">จำนวนเอกสารแยกตามหมวดหมู่</h2>
       <div className="space-y-4">
         {stats.categoriesWithCount.map((category) => (
           <div key={category.id} className="flex items-center justify-between">
             <span className="text-gray-600">{category.name}</span>
             <span className="font-bold">{category.count}</span>
           </div>
         ))}
       </div>
     </div>

     {/* Document Types Stats (if needed) */}
     {stats.documentsPerType.length > 0 && (
       <div className="bg-white rounded-xl shadow p-6">
         <h2 className="text-xl font-bold mb-4">จำนวนเอกสารแยกตามประเภท</h2>
         <div className="space-y-4">
           {stats.documentsPerType.map((type) => (
             <div key={type.type} className="flex items-center justify-between">
               <span className="text-gray-600">
                 {type.type ? (documentTypeLabels[type.type] || type.type) : 'ไม่ระบุประเภท'}
               </span>
               <span className="font-bold">{type._count}</span>
             </div>
           ))}
         </div>
       </div>
     )}

     {/* Quick Actions */}
     <div className="bg-white rounded-xl shadow p-6">
       <h2 className="text-xl font-bold mb-4">การดำเนินการด่วน</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         <Link
           href="/dashboard/documents/new"
           className="flex items-center justify-center p-4 bg-blue-50 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors"
         >
           เพิ่มเอกสารใหม่
         </Link>
         <Link
           href="/dashboard/categories/new"
           className="flex items-center justify-center p-4 bg-green-50 rounded-lg text-green-700 hover:bg-green-100 transition-colors"
         >
           เพิ่มหมวดหมู่ใหม่
         </Link>
         <Link
           href="/dashboard/map"
           className="flex items-center justify-center p-4 bg-purple-50 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors"
         >
           ดูแผนที่
         </Link>
       </div>
     </div>

     {/* Recent Activity */}
     <div className="bg-white rounded-xl shadow p-6">
       <h2 className="text-xl font-bold mb-4">กิจกรรมล่าสุด</h2>
       <div className="text-gray-500 text-center py-8">
         ยังไม่มีกิจกรรมล่าสุด
       </div>
     </div>
   </div>
 );
}