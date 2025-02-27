// app/api/documents/download/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    // ดึง id จาก URL
    const id = Number(request.nextUrl.pathname.split('/').pop())
    
    // หาข้อมูลเอกสาร
    const document = await prisma.document.findUnique({
      where: { id }
    })

    if (!document) {
      return NextResponse.json(
        { error: 'ไม่พบเอกสาร' },
        { status: 404 }
      )
    }

    // อ่านไฟล์
    const filePath = path.join(process.cwd(), 'public', document.filePath)
    const fileBuffer = fs.readFileSync(filePath)

    // อัพเดทจำนวนดาวน์โหลด
    await prisma.document.update({
      where: { id },
      data: {
        downloadCount: {
          increment: 1
        }
      }
    })

    // ส่งไฟล์กลับ
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf', // หรือประเภทไฟล์ตามที่เก็บ
        'Content-Disposition': `attachment; filename="${document.title}.pdf"`
      }
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดาวน์โหลด' },
      { status: 500 }
    )
  }
}