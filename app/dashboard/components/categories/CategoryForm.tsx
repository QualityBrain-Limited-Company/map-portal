// app/dashboard/components/categories/CategoryForm.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { toast } from 'react-hot-toast'
import type { CategoryDoc } from '@prisma/client'

interface CategoryFormProps {
  initialData: CategoryDoc | null
  action: (formData: FormData) => Promise<void>
}

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:bg-gray-400"
    >
      {pending ? 'กำลังบันทึก...' : 'บันทึก'}
    </button>
  )
}

export function CategoryForm({ initialData, action }: CategoryFormProps) {
  const router = useRouter()

  return (
    <form
      action={action}
      className="bg-white p-6 rounded-lg shadow-sm space-y-4"
    >
      {/* Form fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ชื่อประเภท <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          defaultValue={initialData?.name}
          required
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          รายละเอียด
        </label>
        <textarea
          name="description"
          defaultValue={initialData?.description || ''}
          rows={4}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
        >
          ยกเลิก
        </button>
        <SubmitButton />
      </div>
    </form>
  )
}