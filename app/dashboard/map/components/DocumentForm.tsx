// app/dashboard/map/components/DocumentForm.tsx
'use client'

import { useState } from 'react'
import { CategoryDoc } from '@prisma/client'
import { LocationData, DocumentWithCategory } from '@/app/types/document'
import { createDocument } from '@/app/lib/actions/documents/create'
import { toast } from 'react-hot-toast'
import Image from 'next/image'

interface DocumentFormProps {
  categories: CategoryDoc[];
  location?: LocationData;  // ทำให้เป็น optional
  initialData?: DocumentWithCategory;  // เพิ่ม initialData
  onClose?: () => void;
  onSuccess?: () => Promise<void>;
  action?: (formData: FormData) => Promise<void>;  // สำหรับ edit mode
}

export default function DocumentForm({ 
  categories, 
  location,
  initialData,
  onClose,
  onSuccess,
  action
}: DocumentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.coverImage || null)

  // สร้าง locationData จาก initialData หรือ location
  const locationData = initialData ? {
    lat: initialData.latitude,
    lng: initialData.longitude,
    province: initialData.province,
    amphoe: initialData.amphoe,
    district: initialData.district,
    geocode: 0 // หรือค่าที่เหมาะสม
  } : location;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('ขนาดไฟล์ต้องไม่เกิน 5MB')
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      
      // ถ้าเป็นโหมดสร้างใหม่
      if (location && !initialData) {
        formData.append('latitude', location.lat.toString())
        formData.append('longitude', location.lng.toString())
        formData.append('province', location.province)
        formData.append('amphoe', location.amphoe)
        formData.append('district', location.district)

        await createDocument(formData)
        toast.success('บันทึกข้อมูลสำเร็จ')
        if (onSuccess) await onSuccess()
      } 
      // ถ้าเป็นโหมด edit
      else if (action) {
        await action(formData)
      }
      
      if (onClose) onClose()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {initialData ? 'แก้ไขข้อมูลเอกสาร' : 'เพิ่มข้อมูลเอกสาร'}
        </h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ข้อมูลตำแหน่ง */}
        {locationData && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">ข้อมูลตำแหน่ง</h3>
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <label className="text-sm text-gray-600">Latitude</label>
                <div className="text-sm font-medium">{locationData.lat.toFixed(6)}</div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Longitude</label>
                <div className="text-sm font-medium">{locationData.lng.toFixed(6)}</div>
              </div>
            </div>
            <div className="text-sm space-y-1">
              <div><span className="text-gray-600">จังหวัด:</span> {locationData.province}</div>
              <div><span className="text-gray-600">อำเภอ:</span> {locationData.amphoe}</div>
              <div><span className="text-gray-600">ตำบล:</span> {locationData.district}</div>
            </div>
          </div>
        )}

        {/* หมวดหมู่ */}
        <div>
          <label className="block mb-2 font-medium">
            หมวดหมู่ <span className="text-red-500">*</span>
          </label>
          <select
            name="categoryId"
            required
            defaultValue={initialData?.categoryId || ""}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">เลือกหมวดหมู่</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* ชื่อเอกสาร */}
        <div>
          <label className="block mb-2 font-medium">
            ชื่อเอกสาร <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            required
            defaultValue={initialData?.title || ""}
            placeholder="กรอกชื่อเอกสาร"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* รายละเอียด */}
        <div>
          <label className="block mb-2 font-medium">
            รายละเอียด <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            required
            defaultValue={initialData?.description || ""}
            rows={4}
            placeholder="กรอกรายละเอียดเอกสาร"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ไฟล์เอกสาร */}
        <div>
          <label className="block mb-2 font-medium">
            ไฟล์เอกสาร {!initialData && <span className="text-red-500">*</span>}
          </label>
          <input
            type="file"
            name="document"
            required={!initialData}
            accept=".pdf,.doc,.docx"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            รองรับไฟล์ PDF และ Word ขนาดไม่เกิน 10MB
          </p>
          {initialData?.filePath && (
            <div className="mt-2 text-sm">
              <span className="text-gray-600">ไฟล์ปัจจุบัน:</span> 
              <span className="text-blue-500 ml-1">{initialData.filePath.split('/').pop()}</span>
            </div>
          )}
        </div>

        {/* รูปปก */}
        <div>
          <label className="block mb-2 font-medium">รูปปก</label>
          <input
            type="file"
            name="coverImage"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            รองรับไฟล์รูปภาพขนาดไม่เกิน 5MB
          </p>
          {previewImage && (
            <div className="mt-2">
              <Image
                src={previewImage}
                alt="Preview"
                width={200}
                height={200}
                className="rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        {/* การเผยแพร่ */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isPublished"
              defaultChecked={initialData?.isPublished ?? true}
              className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
            />
            <span>เผยแพร่เอกสาร</span>
          </label>
          <p className="text-sm text-gray-500 mt-1">
            เอกสารที่เผยแพร่จะแสดงบนแผนที่และสามารถค้นหาได้
          </p>
        </div>

        {/* ปุ่มดำเนินการ */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose || (() => window.history.back())}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            disabled={isSubmitting}
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </form>
    </div>
  )
}