// app/dashboard/components/documents/Do_Gis_Form.tsx
'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { getCategories } from '@/app/lib/actions/categories/get'
import { CategoryDoc } from '@prisma/client'
import imageCompression from 'browser-image-compression'
import { GistdaAddress } from '@/app/types/gistda'
import GistdaMap from '@/app/gismap/components/GistdaMap'

interface Do_Gis_FormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
  initialData?: {
    id: number;
    title: string;
    description: string;
    categoryId: number;
    filePath: string;
    coverImage?: string;
    province: string;
    district: string;
    subdistrict: string;
    geocode: number;
    latitude: number;
    longitude: number;
    isPublished: boolean;
  };
}

interface LocationData {
  lat: number;
  lon: number;
  address: GistdaAddress;
}

const MAX_FILE_SIZE = 10; // MB
const MAX_IMAGE_SIZE = 5; // MB

export default function Do_Gis_Form({
  onSubmit,
  isSubmitting,
  initialData
}: Do_Gis_FormProps) {
  // Form states
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<CategoryDoc[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.coverImage || null);
  const [isPublished, setIsPublished] = useState<boolean>(initialData?.isPublished ?? true);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    initialData ? {
      lat: initialData.latitude,
      lon: initialData.longitude,
      address: {
        geocode: initialData.geocode,
        province: initialData.province,
        district: initialData.district,
        subdistrict: initialData.subdistrict
      }
    } : null
  );

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        toast.error('ไม่สามารถโหลดข้อมูลหมวดหมู่ได้');
      }
    };
    fetchCategories();
  }, []);

  // File handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE * 1024 * 1024) {
      toast.error(`ขนาดไฟล์ต้องไม่เกิน ${MAX_FILE_SIZE}MB`);
      e.target.value = '';
      return;
    }

    const validTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!validTypes.includes(fileExtension)) {
      toast.error('รองรับเฉพาะไฟล์ PDF และ Word เท่านั้น');
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
    toast.success('อัพโหลดไฟล์เอกสารสำเร็จ');
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE * 1024 * 1024) {
      toast.error(`ขนาดไฟล์ต้องไม่เกิน ${MAX_IMAGE_SIZE}MB`);
      e.target.value = '';
      return;
    }

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true
      };

      const compressedFile = await imageCompression(file, options);
      setSelectedImage(compressedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
      toast.success('อัพโหลดรูปภาพสำเร็จ');
    } catch (error) {
      toast.error('ไม่สามารถบีบอัดรูปภาพได้');
    }
  };

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location);
    setIsMapModalOpen(false);
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
  
    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get('title');
      const description = formData.get('description');
      const categoryId = formData.get('categoryId');
  
      if (!title || !description || !categoryId || !selectedLocation) {
        throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน');
      }

      const submitFormData = new FormData();
      submitFormData.append('title', title as string);
      submitFormData.append('description', description as string);
      submitFormData.append('categoryId', categoryId as string);
      submitFormData.append('isPublished', isPublished.toString());
      
      if (selectedLocation) {
        submitFormData.append('latitude', selectedLocation.lat.toString());
        submitFormData.append('longitude', selectedLocation.lon.toString());
        submitFormData.append('geocode', selectedLocation.address.geocode.toString());
        submitFormData.append('province', selectedLocation.address.province);
        submitFormData.append('district', selectedLocation.address.district);
        submitFormData.append('subdistrict', selectedLocation.address.subdistrict);
      }

      if (selectedFile) {
        submitFormData.append('document', selectedFile);
      }

      if (selectedImage) {
        submitFormData.append('coverImage', selectedImage);
      }

      await onSubmit(submitFormData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* ข้อมูลเอกสาร */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">ข้อมูลเอกสาร</h2>
        
        <div className="space-y-4">
          {/* ชื่อเอกสาร */}
          <div>
            <label className="block mb-2 font-medium">
              ชื่อเอกสาร <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              defaultValue={initialData?.title}
              required
              placeholder="กรอกชื่อเอกสาร"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* หมวดหมู่ */}
          <div>
            <label className="block mb-2 font-medium">
              หมวดหมู่ <span className="text-red-500">*</span>
            </label>
            <select
              name="categoryId"
              defaultValue={initialData?.categoryId?.toString() || ""}
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">เลือกหมวดหมู่</option>
              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id.toString()}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* รายละเอียด */}
          <div>
            <label className="block mb-2 font-medium">
              รายละเอียด <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              defaultValue={initialData?.description}
              required
              placeholder="กรอกรายละเอียดเอกสาร"
              className="w-full p-2 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ที่ตั้ง */}
          <div>
            <label className="block mb-2 font-medium">
              ที่ตั้ง <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setIsMapModalOpen(true)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-left"
            >
              {selectedLocation ? 
                `${selectedLocation.address.subdistrict}, ${selectedLocation.address.district}, ${selectedLocation.address.province}` :
                'เลือกที่ตั้งจากแผนที่'
              }
            </button>
          </div>

          {/* สถานะการเผยแพร่ */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="font-medium">เผยแพร่เอกสาร</span>
            </label>
            <p className="text-sm text-gray-500 mt-1">
              {isPublished 
                ? "เอกสารนี้จะแสดงบนแผนที่และสามารถค้นหาได้" 
                : "เอกสารนี้จะถูกซ่อนจากการแสดงผลและการค้นหา"}
            </p>
          </div>
        </div>
      </div>

      {/* ไฟล์เอกสารและรูปภาพ */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">ไฟล์เอกสารและรูปภาพ</h2>

        <div className="space-y-4">
          {/* แสดงข้อมูลเอกสารเดิม */}
          {initialData?.filePath && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">เอกสารปัจจุบัน</h3>
              <div className="flex items-center text-sm text-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <a href={initialData.filePath} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                  ดูเอกสารเดิม
                </a>
              </div>
            </div>
          )}

          {/* อัพโหลดเอกสารใหม่ */}
          <div>
            <label className="block mb-2 font-medium">
              เอกสาร {!initialData && <span className="text-red-500">*</span>}
            </label>
            <input
              type="file"
              name="document"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              required={!initialData}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              รองรับไฟล์ PDF และ Word ขนาดไม่เกิน {MAX_FILE_SIZE}MB
              {initialData && " (อัพโหลดเฉพาะเมื่อต้องการเปลี่ยนไฟล์)"}
            </p>
          </div>

          {/* แสดงรูปภาพปกเดิมและอัพโหลดใหม่ */}
          <div>
            <label className="block mb-2 font-medium">รูปปก</label>
            {previewImage && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">รูปปกปัจจุบัน:</p>
                <img
                  src={previewImage}
                  alt="Cover preview"
                  className="max-w-xs rounded-lg shadow-sm"
                />
              </div>
            )}
            <input
              type="file"
              name="coverImage"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              รองรับไฟล์รูปภาพขนาดไม่เกิน {MAX_IMAGE_SIZE}MB
              {initialData && " (อัพโหลดเฉพาะเมื่อต้องการเปลี่ยนรูปปก)"}
            </p>
            </div>
        </div>
      </div>

      {/* ปุ่มดำเนินการ */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
          disabled={isSubmitting}
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting 
            ? 'กำลังบันทึก...' 
            : initialData 
              ? 'อัพเดทข้อมูล' 
              : 'บันทึกข้อมูล'
          }
        </button>
      </div>

      {/* Modal แสดงแผนที่ */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMapModalOpen(false)} />
          <div className="relative bg-white rounded-lg w-[90%] h-[90%] p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">เลือกที่ตั้งบนแผนที่</h3>
              <button
                onClick={() => setIsMapModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="h-[calc(100%-4rem)]">
              <GistdaMap 
                onLocationSelect={handleLocationSelect}
                initialLocation={selectedLocation ? {
                  lat: selectedLocation.lat,
                  lon: selectedLocation.lon
                } : undefined}
              />
            </div>

            {selectedLocation && (
              <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg">
                <p className="font-medium">ที่ตั้งที่เลือก:</p>
                <p className="text-gray-600">
                  {selectedLocation.address.subdistrict}, {selectedLocation.address.district}, {selectedLocation.address.province}
                </p>
                <p className="text-sm text-gray-500">
                  พิกัด: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lon.toFixed(6)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
}