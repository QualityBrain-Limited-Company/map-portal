//dashboard/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  HomeIcon, 
  DocumentTextIcon,
  MapIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';

const menuItems = [
  {
    name: 'หน้าหลัก',
    href: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'จัดการเอกสาร',
    href: '/dashboard/documents',
    icon: DocumentTextIcon
  },
  {
    name: 'แผนที่',
    href: '/dashboard/map',
    icon: MapIcon
  },
  {
    name: 'ข้อมูลส่วนตัว',
    href: '/dashboard/profile',
    icon: UserIcon
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </div>
  );
}