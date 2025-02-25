// app/api/documents/search/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/app/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    const documents = await prisma.document.findMany({
      where: {
        isPublished: true,
        OR: query ? [
          { title: { contains: query } },
          { description: { contains: query } },
          { district: { contains: query } },
          { amphoe: { contains: query } },
          { province: { contains: query } }
        ] : undefined
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการค้นหาเอกสาร' },
      { status: 500 }
    )
  }
}