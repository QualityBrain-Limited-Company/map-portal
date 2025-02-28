// app/lib/actions/documents/get.ts (แก้ไข)
'use server'

import prisma from "../../db"
import { unstable_cache } from 'next/cache'

// ปรับฟังก์ชัน getDocuments ให้มี revalidate ที่ถี่ขึ้น
export const getDocuments = unstable_cache(
  async () => {
    try {
      const documents = await prisma.document.findMany({
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      return documents
    } catch (error) {
      console.error('Error fetching documents:', error)
      throw new Error('ไม่สามารถดึงข้อมูลเอกสารได้')
    }
  },
  ['documents-list'],
  {
    revalidate: 1, // revalidate ทุก 1 วินาที
    tags: ['documents']
  }
)

// ฟังก์ชันสำหรับดึงข้อมูลเอกสารโดยไม่ใช้แคช (ใช้สำหรับการโหลดข้อมูลทันที)
export async function getDocumentsNoCache() {
  try {
    const documents = await prisma.document.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return documents
  } catch (error) {
    console.error('Error fetching documents:', error)
    throw new Error('ไม่สามารถดึงข้อมูลเอกสารได้')
  }
}

// Cache function for getting single document
export const getDocument = unstable_cache(
  async (id: string) => {
    try {
      const document = await prisma.document.findUnique({
        where: { 
          id: parseInt(id) 
        },
        include: {
          category: true,
        }
      })

      if (!document) {
        return null
      }

      return {
        ...document,
        createdAt: document.createdAt.toISOString(),
        updatedAt: document.updatedAt.toISOString(),
      }
    } catch (error) {
      console.error('Error fetching document:', error)
      throw new Error('ไม่สามารถดึงข้อมูลเอกสารได้')
    }
  },
  ['document-detail'],
  {
    revalidate: 1,
    tags: ['documents']
  }
)