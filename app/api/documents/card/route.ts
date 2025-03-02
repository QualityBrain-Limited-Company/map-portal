// app/api/documents/card/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET(request: NextRequest) {
  try {
    // ดึงข้อมูลโดยตรงจาก prisma แทนที่จะใช้ server action
    const documents = await prisma.document.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // แปลงข้อมูลวันที่ให้เป็น string
    const serializedDocuments = documents.map((doc) => ({
      ...doc,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    }));
    
    return NextResponse.json(serializedDocuments, { status: 200 });
  } catch (error) {
    console.error('Error fetching document cards:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลเอกสาร' },
      { status: 500 }
    );
  }
}