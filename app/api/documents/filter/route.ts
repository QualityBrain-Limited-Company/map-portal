// app/api/documents/filter/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/app/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')

    if (!categoryId) {
      return NextResponse.json(
        { error: 'ต้องระบุหมวดหมู่' },
        { status: 400 }
      )
    }

    const documents = await prisma.document.findMany({
      where: {
        categoryId: parseInt(categoryId),
        isPublished: true
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Filter error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการกรองเอกสาร' },
      { status: 500 }
    )
  }
}