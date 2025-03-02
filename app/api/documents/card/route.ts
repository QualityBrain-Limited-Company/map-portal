// app/api/documents/card/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { revalidatePath } from 'next/cache';
import { uploadFile } from '@/app/lib/upload';

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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // 1. ดึงข้อมูลจาก FormData
    const title = formData.get('title')?.toString();
    const description = formData.get('description')?.toString();
    const categoryId = formData.get('categoryId')?.toString();
    const district = formData.get('district')?.toString();
    const amphoe = formData.get('amphoe')?.toString();
    const province = formData.get('province')?.toString();
    const latitude = formData.get('latitude')?.toString();
    const longitude = formData.get('longitude')?.toString();
    const isPublished = formData.get('isPublished') === 'on' || formData.get('isPublished') === 'true';
    
    // 2. ตรวจสอบข้อมูลที่จำเป็น
    if (!title || !description || !categoryId || !district || !amphoe || !province) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }
    
    // 3. ตรวจสอบไฟล์
    const documentFile = formData.get('document') as File | null;
    const coverImage = formData.get('coverImage') as File | null;
    
    if (!documentFile) {
      return NextResponse.json(
        { error: 'กรุณาเลือกไฟล์เอกสาร' },
        { status: 400 }
      );
    }
    
    // 4. อัพโหลดไฟล์
    let filePath: string;
    let coverImagePath: string | null = null;
    
    try {
      filePath = await uploadFile(documentFile, 'documents');
      if (coverImage && coverImage.size > 0) {
        coverImagePath = await uploadFile(coverImage, 'covers');
      }
    } catch (error) {
      console.error('File upload error:', error);
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์' },
        { status: 500 }
      );
    }
    
    // 5. บันทึกข้อมูล
    const document = await prisma.document.create({
      data: {
        title,
        description,
        categoryId: parseInt(categoryId),
        district: district || '',
        amphoe: amphoe || '',
        province: province || '',
        latitude: latitude ? parseFloat(latitude) : 0,
        longitude: longitude ? parseFloat(longitude) : 0,
        filePath,
        coverImage: coverImagePath,
        isPublished
      }
    });
    
    // 6. Revalidate
    revalidatePath('/dashboard/documents/client-page');
    revalidatePath('/api/documents/card');
    
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการบันทึกเอกสาร' },
      { status: 500 }
    );
  }
}