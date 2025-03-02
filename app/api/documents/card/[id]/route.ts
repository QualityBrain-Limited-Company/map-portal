// app/api/documents/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { deleteFile } from '@/app/lib/upload';
import { revalidatePath } from 'next/cache';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    // ดึงข้อมูลเอกสารที่จะลบเพื่อเก็บข้อมูล path ไฟล์
    const document = await prisma.document.findUnique({
      where: { id },
      select: { filePath: true, coverImage: true }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'ไม่พบเอกสารที่ต้องการลบ' },
        { status: 404 }
      );
    }

    // ลบเอกสารจากฐานข้อมูล
    await prisma.document.delete({
      where: { id },
    });

    // ลบไฟล์เอกสารและรูปภาพที่เกี่ยวข้อง
    try {
      if (document.filePath) {
        await deleteFile(document.filePath);
      }
      if (document.coverImage) {
        await deleteFile(document.coverImage);
      }
    } catch (fileError) {
      console.error('Error deleting files:', fileError);
      // ไม่ throw error ในกรณีนี้ เพราะข้อมูลในฐานข้อมูลถูกลบไปแล้ว
    }

    // revalidate เพื่อให้หน้าเว็บแสดงข้อมูลล่าสุด
    revalidatePath('/dashboard/documents');
    revalidatePath('/api/documents/card');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบเอกสาร' },
      { status: 500 }
    );
  }
}