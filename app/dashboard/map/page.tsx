// app/dashboard/map/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { CategoryDoc } from '@prisma/client'
import { DocumentWithCategory } from '@/app/types/document'
import { getCategories } from '@/app/lib/actions/categories/get'
import { getDocuments } from '@/app/lib/actions/documents/get'
import dynamic from 'next/dynamic'
import { getCategoryColor } from '@/app/utils/colorGenerator'
import { FiMap, FiFilter, FiInfo } from 'react-icons/fi'
import CircleLoader from './components/CircleLoader'

// นำเข้า DynamicMapView แบบ dynamic import
const DynamicMapView = dynamic(
 () => import('./components/DynamicMapView'),
 { 
   ssr: false,
   loading: () => (
     <div className="h-full w-full flex items-center justify-center bg-slate-50">
       <div className="text-center">
         <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
         <p className="mt-4 text-slate-600 animate-pulse">กำลังโหลดแผนที่...</p>
       </div>
     </div>
   )
 }
);

export default function MapPage() {
 const [categories, setCategories] = useState<CategoryDoc[]>([])
 const [documents, setDocuments] = useState<DocumentWithCategory[]>([])
 const [isLoading, setIsLoading] = useState(true)
 const [selectedCategories, setSelectedCategories] = useState<number[]>([])
 const [isStatsExpanded, setIsStatsExpanded] = useState(false)

 // โหลดข้อมูล
 useEffect(() => {
   const loadData = async () => {
     try {
       setIsLoading(true)
       const [catsData, docsData] = await Promise.all([
         getCategories(),
         getDocuments()
       ]);
       setCategories(catsData);
       setDocuments(docsData);
       setSelectedCategories(catsData.map(c => c.id));
     } catch (error) {
       console.error('Error loading data:', error);
     } finally {
       setIsLoading(false);
     }
   };

   loadData();
 }, []);

 // กรองเอกสารตามหมวดหมู่ที่เลือก
 const filteredDocuments = documents.filter(doc => 
   selectedCategories.length === 0 || selectedCategories.includes(doc.categoryId)
 );

 // เรียงลำดับเอกสารให้ล่าสุดอยู่บนสุด
 const sortedDocuments = [...filteredDocuments].sort((a, b) => 
   new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
 );

 // ฟังก์ชั่นสลับเลือกหมวดหมู่ทั้งหมด
 const toggleAllCategories = useCallback(() => {
   if (selectedCategories.length === categories.length) {
     setSelectedCategories([]);
   } else {
     setSelectedCategories(categories.map(c => c.id));
   }
 }, [selectedCategories, categories]);

 if (isLoading) {
  return <CircleLoader message="กำลังโหลดข้อมูล..." />;
}

 return (
   <div className="flex flex-col h-full">
     {/* ส่วนหัว */}
     <div className="bg-white border-b border-slate-200 px-6 py-4">
       <div className="container mx-auto flex justify-between items-center">
         <div className="flex items-center">
           <FiMap className="text-orange-500 mr-2 text-xl" />
           <h1 className="text-xl font-bold text-slate-800">ระบบแผนที่เอกสารดิจิทัล</h1>
         </div>
         <div className="flex items-center gap-4">
           <div className="text-sm flex items-center gap-1">
             <span className="px-2 py-1 bg-slate-100 rounded-md">{documents.length} เอกสาร</span>
             <span className="px-2 py-1 bg-slate-100 rounded-md">{categories.length} หมวดหมู่</span>
           </div>
           <button 
             onClick={toggleAllCategories}
             className="text-sm px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-md transition-colors flex items-center"
           >
             <FiFilter className="mr-1.5" />
             {selectedCategories.length === categories.length ? 'ยกเลิกการเลือกทั้งหมด' : 'เลือกทั้งหมด'}
           </button>
         </div>
       </div>
     </div>

     {/* ส่วนหลัก */}
     <div className="flex-grow flex flex-col md:flex-row">
       {/* แผนที่ (ฝั่งซ้าย) */}
       <div className="flex-grow h-[60vh] md:h-auto relative">
         <DynamicMapView 
           categories={categories}
           documents={documents}
           selectedCategories={selectedCategories}
           setSelectedCategories={setSelectedCategories}
         />
       </div>

       {/* Panel กรองข้อมูล (ฝั่งขวา) */}
       <div className="w-full md:w-80 lg:w-96 bg-white border-t md:border-t-0 md:border-l border-slate-200 flex flex-col">
         {/* ส่วนตัวกรอง */}
         <div className="p-4 border-b border-slate-200">
           <h2 className="font-medium text-slate-800 flex items-center mb-3">
             <FiFilter className="mr-1.5 text-orange-500" /> 
             หมวดหมู่เอกสาร ({selectedCategories.length}/{categories.length})
           </h2>
           
           <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-2 -m-2">
             {categories.map(cat => {
               const colorScheme = getCategoryColor(cat.id);
               const isSelected = selectedCategories.includes(cat.id);
               const count = documents.filter(d => d.categoryId === cat.id).length;
               
               return (
                 <button
                   key={cat.id}
                   onClick={() => {
                     if (isSelected) {
                       setSelectedCategories(selectedCategories.filter(id => id !== cat.id));
                     } else {
                       setSelectedCategories([...selectedCategories, cat.id]);
                     }
                   }}
                   className={`py-2 px-3 text-sm rounded transition-all duration-200 flex flex-col ${
                     isSelected 
                       ? 'bg-slate-800 text-white' 
                       : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                   }`}
                 >
                   <div className="flex items-center mb-1">
                     <span 
                       className="w-3 h-3 rounded-full mr-1.5 flex-shrink-0"
                       style={{ backgroundColor: colorScheme.primary }}
                     ></span>
                     <span className="truncate">{cat.name}</span>
                   </div>
                   <div className={`text-xs ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                     {count} เอกสาร
                   </div>
                 </button>
               );
             })}
           </div>
         </div>
         
         {/* ส่วนสถิติ */}
         <div className="overflow-y-auto flex-grow">
           <div className="p-4 border-b border-slate-200">
             <h2 className="font-medium text-slate-800 mb-3">สถิติเอกสาร</h2>
             <div className="space-y-3">
               {categories.map(cat => {
                 const count = documents.filter(d => d.categoryId === cat.id).length;
                 const colorScheme = getCategoryColor(cat.id);
                 const percentage = documents.length > 0 
                   ? Math.round((count / documents.length) * 100) 
                   : 0;
                 
                 return (
                   <div key={cat.id}>
                     <div className="flex justify-between items-center mb-1">
                       <div className="flex items-center">
                         <span 
                           className="w-3 h-3 rounded-full mr-1.5" 
                           style={{ backgroundColor: colorScheme.primary }}
                         ></span>
                         <span className="text-sm text-slate-700">{cat.name}</span>
                       </div>
                       <span className="text-sm font-medium text-slate-700">{count}</span>
                     </div>
                     <div className="flex items-center">
                       <div className="w-full bg-slate-100 rounded-full h-1.5 mr-2">
                         <div 
                           className="h-1.5 rounded-full transition-all duration-500"
                           style={{ 
                             width: `${percentage}%`,
                             backgroundColor: colorScheme.primary
                           }}
                         ></div>
                       </div>
                       <span className="text-xs text-slate-500 w-8 text-right">{percentage}%</span>
                     </div>
                   </div>
                 );
               })}
             </div>
           </div>
           
           {/* เอกสารล่าสุด */}
           {sortedDocuments.length > 0 && (
             <div className="p-4 border-b border-slate-200">
               <h2 className="font-medium text-slate-800 mb-3">เอกสารล่าสุด</h2>
               <div className="space-y-2">
                 {sortedDocuments.slice(0, 3).map(doc => {
                   const cat = categories.find(c => c.id === doc.categoryId);
                   const colorScheme = cat ? getCategoryColor(cat.id) : { primary: '#888888' };
                   
                   return (
                     <div key={doc.id} className="p-2 bg-slate-50 rounded">
                       <div className="flex items-center justify-between mb-1">
                         <span 
                           className="px-1.5 py-0.5 text-xs rounded-full text-xs"
                           style={{ 
                             backgroundColor: `${colorScheme.primary}20`, 
                             color: colorScheme.primary
                           }}
                         >
                           {cat?.name || 'ไม่ระบุหมวดหมู่'}
                         </span>
                         <span className="text-xs text-slate-500">
                           {new Date(doc.createdAt).toLocaleDateString('th-TH', {
                             day: 'numeric',
                             month: 'short',
                           })}
                         </span>
                       </div>
                       <h3 className="text-sm font-medium text-slate-800 line-clamp-1">{doc.title}</h3>
                     </div>
                   );
                 })}
               </div>
             </div>
           )}
           
           {/* วิธีใช้งาน */}
           <div className="p-4">
             <h2 className="font-medium text-slate-800 flex items-center mb-3">
               <FiInfo className="mr-1.5 text-orange-500" /> 
               วิธีใช้งานแผนที่
             </h2>
             <div className="space-y-3 text-sm">
               <div className="flex items-start">
                 <div className="bg-orange-50 text-orange-600 w-6 h-6 rounded-full flex items-center justify-center font-medium mr-2 flex-shrink-0">1</div>
                 <div>คลิกที่แผนที่เพื่อเพิ่มเอกสารใหม่</div>
               </div>
               <div className="flex items-start">
                 <div className="bg-orange-50 text-orange-600 w-6 h-6 rounded-full flex items-center justify-center font-medium mr-2 flex-shrink-0">2</div>
                 <div>คลิกที่จุดบนแผนที่เพื่อดูรายละเอียดเอกสาร</div>
               </div>
               <div className="flex items-start">
                 <div className="bg-orange-50 text-orange-600 w-6 h-6 rounded-full flex items-center justify-center font-medium mr-2 flex-shrink-0">3</div>
                 <div>กรองข้อมูลโดยเลือกหมวดหมู่ที่ต้องการ</div>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>

     {/* สำหรับมือถือ: ปุ่มสลับระหว่างแผนที่กับแผงควบคุม */}
     <div className="md:hidden fixed bottom-4 right-4 z-50">
       <button 
         onClick={() => setIsStatsExpanded(!isStatsExpanded)}
         className="bg-white shadow-lg rounded-full p-3 border border-slate-200"
       >
         {isStatsExpanded ? <FiMap size={24} className="text-orange-500" /> : <FiFilter size={24} className="text-orange-500" />}
       </button>
     </div>

     {/* สำหรับมือถือ: แผงควบคุมแบบเต็มจอ */}
     <div className={`md:hidden fixed inset-0 bg-white z-40 transition-transform duration-300 ${isStatsExpanded ? 'translate-y-0' : 'translate-y-full'}`}>
       <div className="p-4 border-b border-slate-200 flex justify-between items-center">
         <h2 className="font-bold text-slate-800">ตัวกรองและสถิติเอกสาร</h2>
         <button 
           onClick={() => setIsStatsExpanded(false)}
           className="p-2 text-slate-500"
         >
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
           </svg>
         </button>
       </div>
       <div className="overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
         {/* เนื้อหาเหมือนกับด้านขวาของเวอร์ชัน desktop */}
         <div className="p-4 border-b border-slate-200">
           <h2 className="font-medium text-slate-800 flex items-center mb-3">
             <FiFilter className="mr-1.5 text-orange-500" /> 
             หมวดหมู่เอกสาร ({selectedCategories.length}/{categories.length})
           </h2>
           
           <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-2 -m-2">
             {categories.map(cat => {
               const colorScheme = getCategoryColor(cat.id);
               const isSelected = selectedCategories.includes(cat.id);
               const count = documents.filter(d => d.categoryId === cat.id).length;
               
               return (
                 <button
                   key={cat.id}
                   onClick={() => {
                     if (isSelected) {
                       setSelectedCategories(selectedCategories.filter(id => id !== cat.id));
                     } else {
                       setSelectedCategories([...selectedCategories, cat.id]);
                     }
                   }}
                   className={`py-2 px-3 text-sm rounded transition-all duration-200 flex flex-col ${
                     isSelected 
                       ? 'bg-slate-800 text-white' 
                       : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                   }`}
                 >
                   <div className="flex items-center mb-1">
                     <span 
                       className="w-3 h-3 rounded-full mr-1.5 flex-shrink-0"
                       style={{ backgroundColor: colorScheme.primary }}
                     ></span>
                     <span className="truncate">{cat.name}</span>
                   </div>
                   <div className={`text-xs ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                     {count} เอกสาร
                   </div>
                 </button>
               );
             })}
           </div>
         </div>
         
         <div className="p-4 border-b border-slate-200">
           <h2 className="font-medium text-slate-800 mb-3">สถิติเอกสาร</h2>
           {/* เนื้อหาสถิติ */}
         </div>
         
         {sortedDocuments.length > 0 && (
           <div className="p-4 border-b border-slate-200">
             <h2 className="font-medium text-slate-800 mb-3">เอกสารล่าสุด</h2>
             {/* เนื้อหาเอกสารล่าสุด */}
           </div>
         )}
         
         <div className="p-4">
           <h2 className="font-medium text-slate-800 flex items-center mb-3">
             <FiInfo className="mr-1.5 text-orange-500" /> 
             วิธีใช้งานแผนที่
           </h2>
           {/* เนื้อหาวิธีใช้งาน */}
         </div>
       </div>
     </div>
   </div>
 );
}