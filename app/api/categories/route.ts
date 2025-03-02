// app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCategories } from '@/app/lib/actions/categories/get';

export async function GET(request: NextRequest) {
  try {
    // ใช้ server action ที่มีอยู่แล้ว
    const categories = await getCategories();
    
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่' },
      { status: 500 }
    );
  }
}