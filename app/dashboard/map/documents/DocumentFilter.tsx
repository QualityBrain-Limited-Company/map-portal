// app/map/components/documents/DocumentFilter.tsx
'use client'

import { useState } from 'react'
import { CategoryDoc } from '@prisma/client'
import { getCategoryColor } from '@/app/utils/colorUtils'

interface DocumentFilterProps {
  categories: CategoryDoc[];
  onFilterChange: (categoryId: number | null) => void;
}

export default function DocumentFilter({ categories, onFilterChange }: DocumentFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId)
    onFilterChange(categoryId)
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg">
      <h3 className="text-sm font-semibold mb-3">หมวดหมู่เอกสาร</h3>
      <div className="space-y-2">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
            selectedCategory === null ? 'bg-gray-100' : 'hover:bg-gray-50'
          }`}
        >
          ทั้งหมด
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center ${
              selectedCategory === cat.id ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: getCategoryColor(cat.id).primary }}
            />
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}