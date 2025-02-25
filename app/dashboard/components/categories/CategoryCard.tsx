// app/dashboard/components/categories/CategoryCard.tsx
import Link from 'next/link'
import type { CategoryDoc } from '@prisma/client'

interface CategoryCardProps {
  category: CategoryDoc & {
    _count: { documents: number }
  }
  onDelete: () => void
  isDeleting: boolean
}

export default function CategoryCard({ 
  category, 
  onDelete,
  isDeleting 
}: CategoryCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <Link 
            href={`/dashboard/categories/${category.id}`}
            className="text-lg font-medium hover:text-blue-600"
          >
            {category.name}
          </Link>
          {category.description && (
            <p className="text-gray-600 mt-1">{category.description}</p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            จำนวนเอกสาร: {category._count.documents}
          </p>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/dashboard/categories/${category.id}/edit`}
            className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded"
          >
            แก้ไข
          </Link>
          <button
            onClick={onDelete}
            disabled={isDeleting || category._count.documents > 0}
            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
          >
            {isDeleting ? 'กำลังลบ...' : 'ลบ'}
          </button>
        </div>
      </div>
    </div>
  )
}