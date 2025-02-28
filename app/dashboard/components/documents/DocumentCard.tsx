// app/dashboard/components/documents/DocumentCard.tsx 
import Link from 'next/link'
import { DocumentWithCategory } from '../types/document'

interface DocumentCardProps {
 document: DocumentWithCategory
 onDelete: () => void
 isDeleting: boolean
}

export default function DocumentCard({
 document,
 onDelete,
 isDeleting
}: DocumentCardProps) {
 // เพิ่ม timestamp ให้กับ URL รูปภาพเพื่อป้องกันการแคช
 const imageUrl = document.coverImage ? 
   `${document.coverImage}?t=${new Date().getTime()}` : null;

 return (
   <div className="bg-white rounded-lg shadow-sm overflow-hidden">
     <div className="relative h-32">
       {imageUrl ? (
         <img
           src={imageUrl}
           alt={document.title}
           className="object-cover w-full h-full"
         />
       ) : (
         <div className="w-full h-full bg-gray-100 flex items-center justify-center">
           <span className="text-gray-400">ไม่มีรูปปก</span>
         </div>
       )}
     </div>

     <div className="p-3">
      <div className="flex items-start justify-between">
        <div>
          <Link 
            href={`/dashboard/documents/${document.id}`}
            className="text-sm font-medium hover:text-orange-600"
          >
            {document.title}
          </Link>
          <p className="text-xs text-gray-500 mt-0.5">
            {document.description}
          </p>
        </div>
        <span className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full">
          {document.category.name}
        </span>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        <p>{document.province}</p>
        <p>
          {new Date(document.createdAt).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      <div className="mt-2 flex justify-end space-x-1">
        <Link
          href={`/dashboard/documents/${document.id}/edit`}
          className="px-2 py-0.5 text-xs text-orange-600 hover:bg-orange-50 rounded"
        >
          แก้ไข
        </Link>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="px-2 py-0.5 text-xs text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
        >
          {isDeleting ? 'กำลังลบ...' : 'ลบ'}
        </button>
      </div>
    </div>
   </div>
 )
}