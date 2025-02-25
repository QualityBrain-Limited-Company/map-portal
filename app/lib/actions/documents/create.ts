// app/lib/actions/documents/create.ts
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import prisma from '../../db'
import { uploadFile } from '../../upload'

export async function createDocument(formData: FormData) {
  try {
    // 1. ดึงข้อมูลจาก FormData
    const title = formData.get('title')?.toString()
    const description = formData.get('description')?.toString()
    const categoryId = formData.get('categoryId')?.toString()
    const district = formData.get('district')?.toString()
    const amphoe = formData.get('amphoe')?.toString()
    const province = formData.get('province')?.toString()
    const latitude = formData.get('latitude')?.toString()
    const longitude = formData.get('longitude')?.toString()

    // 2. ตรวจสอบข้อมูลที่จำเป็น
    if (!title || !description || !categoryId || !district || !amphoe || !province) {
      throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน')
    }

    // 3. ตรวจสอบไฟล์
    const documentFile = formData.get('document') as File | Blob | null
    const coverImage = formData.get('coverImage') as File | Blob | null

    if (!documentFile) {
      throw new Error('กรุณาเลือกไฟล์เอกสาร')
    }

    // 4. อัพโหลดไฟล์
    let filePath: string
    let coverImagePath: string | null = null

    try {
      filePath = await uploadFile(documentFile, 'documents')
      if (coverImage) {
        coverImagePath = await uploadFile(coverImage, 'covers')
      }
    } catch (error) {
      console.error('File upload error:', error)
      throw new Error('เกิดข้อผิดพลาดในการอัพโหลดไฟล์')
    }

    // 5. บันทึกข้อมูล
    await prisma.document.create({
      data: {
        title,
        description,
        categoryId: parseInt(categoryId),
        district,
        amphoe,
        province,
        latitude: latitude ? parseFloat(latitude) : 0,
        longitude: longitude ? parseFloat(longitude) : 0,
        filePath,
        coverImage: coverImagePath
      }
    })

    // 6. Revalidate และ redirect
    revalidatePath('/dashboard/documents')
    redirect('/dashboard/documents')

  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('เกิดข้อผิดพลาดในการบันทึกเอกสาร')
  }
}