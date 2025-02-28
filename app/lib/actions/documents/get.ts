// lib/actions/documents/get.ts
'use server'

import prisma from "../../db"
import { unstable_cache } from 'next/cache'

// Cache function for getting all documents
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
    revalidate: 60, // revalidate every 60 seconds
    tags: ['documents']
  }
)

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
    revalidate: 60,
    tags: ['documents']
  }
)