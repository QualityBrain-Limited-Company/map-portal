// dashboard/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { 
  HomeIcon, 
  DocumentTextIcon,
  MapIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const menuItems = [
  {
    name: 'หน้าหลัก',
    href: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'แผนที่',
    href: '/dashboard/map',
    icon: MapIcon
  },
  {
    name: 'จัดการเอกสาร',
    href: '/dashboard/documents',
    icon: DocumentTextIcon
  },
  {
    name: 'ประเภทเอกสาร',
    href: '/dashboard/categories',
    icon: TagIcon
  },
  {
    name: 'ข้อมูลส่วนตัว',
    href: '/dashboard/profile',
    icon: UserIcon
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-gray-800 text-white"
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar for Desktop */}
      <div className={`
        fixed inset-y-0 left-0 z-30 transform lg:translate-x-0 transition duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:flex lg:w-64 text-white bg-gray-900 min-h-screen flex flex-col
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <button 
            onClick={toggleMobileMenu}
            className="lg:hidden text-white"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname?.startsWith(item.href));
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-orange-600 text-white' 
                        : 'hover:bg-gray-800'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
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
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-orange-100 hover:text-white"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
}