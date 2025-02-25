// app/dashboard/components/categories/CategoryList.tsx
'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { deleteCategory } from '@/app/lib/actions/categories/delete'
import CategoryCard from './CategoryCard'
import type { CategoryDoc } from '@prisma/client'

interface CategoryListProps {
  categories: (CategoryDoc & {
    _count: { documents: number }
  })[]
}

export default function CategoryList({ categories }: CategoryListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    if (!confirm('ยืนยันการลบประเภทเอกสาร?')) return
    
    setDeletingId(id)
    try {
      await deleteCategory(id)
      toast.success('ลบประเภทเอกสารสำเร็จ')
    } catch (error) {
      toast.error('ไม่สามารถลบประเภทเอกสารได้')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="grid gap-4">
      {categories.map((category) => (
        <CategoryCard 
          key={category.id}
          category={category}
          onDelete={() => handleDelete(category.id)}
          isDeleting={deletingId === category.id}
        />
      ))}
    </div>
  )
}