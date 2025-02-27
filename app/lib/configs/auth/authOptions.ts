import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient, User as PrismaUser } from '@prisma/client';
import bcrypt from "bcrypt";
import { PrismaAdapter } from '@next-auth/prisma-adapter';

const prisma = new PrismaClient();

interface Credentials {
  email: string;
  password: string;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      image?: string;
    };
  }

  interface User {
    id: number;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
    picture?: string;
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'john@doe.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Credentials | undefined) {
        if (!credentials) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error('No user found with this email');
        }

        if (!user.password) {
          throw new Error('Invalid password');
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);

        if (!isValidPassword) {
          throw new Error('Invalid password');
        }

        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  
  // ปรับปรุงการตั้งค่า session
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 วัน
  },
  
  // เพิ่มการตั้งค่า cookies
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      }
    }
  },
  
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = (user as any).id;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
        token.role = (user as any).role;
      }
      return token;
    },
    
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.role = token.role;
        session.user.image = token.picture;
      }
      return session;
    },
    
    // แก้ไข redirect callback เพื่อให้ยืดหยุ่นมากขึ้น
    async redirect({ url, baseUrl }) {
      // ดึง callbackUrl จาก URL ถ้ามี
      const urlObj = new URL(url);
      const callbackUrl = urlObj.searchParams.get('callbackUrl');
      
      // ถ้ามี callbackUrl และเป็น relative URL
      if (callbackUrl && callbackUrl.startsWith('/')) {
        const fullCallbackUrl = `${baseUrl}${callbackUrl.startsWith('/') ? callbackUrl : `/${callbackUrl}`}`;
        return fullCallbackUrl;
      }
      
      // ถ้า URL เริ่มต้นด้วย baseUrl
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      // ถ้าเป็น relative URL
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // ถ้าเป็นการ sign in สำเร็จ ให้ไปที่ dashboard
      if (url.includes('/api/auth/callback') || url.includes('/auth/signin')) {
        return `${baseUrl}/dashboard`;
      }
      
      // ค่าเริ่มต้น กลับไปที่ baseUrl
      return baseUrl;
    },
  },
  
  // เพิ่มการกำหนดหน้า
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  
  // ใช้ secret จาก environment หรือค่าเริ่มต้น
  secret: process.env.NEXTAUTH_SECRET || 'your-fallback-secret-key',
  
  // ใช้ debug mode ในโหมด development
  debug: process.env.NODE_ENV === 'development',
};

export default authOptions;