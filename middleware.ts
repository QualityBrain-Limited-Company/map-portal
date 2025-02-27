import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // เพิ่ม logging เพื่อตรวจสอบปัญหา
  console.log('Middleware called for path:', request.nextUrl.pathname);
  
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production', // ใช้ secure cookie ในโหมด production
    });
    
    console.log('Token retrieved:', !!token, token?.role);
    
    const { pathname } = request.nextUrl;
    
    if (pathname.startsWith('/dashboard')) {
      // ถ้าไม่มี token หรือไม่ใช่ ADMIN ให้ redirect ไปที่ signin
      if (!token || token.role !== 'ADMIN') {
        console.log('Redirecting to signin: no token or not admin');
        return NextResponse.redirect(new URL('/auth/signin?callbackUrl=' + encodeURIComponent(pathname), request.url));
      }
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // ในกรณีที่เกิดข้อผิดพลาดในการตรวจสอบ token ให้ allow access ไปก่อน
    // และจะมีการตรวจสอบอีกครั้งที่ dashboard layout
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};