// app/components/Navbar.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from 'next/navigation';
import { HiMenuAlt3 } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";

// Define Types
interface SubNavItem {
  href: string;
  label: string;
}

interface NavItem {
  href: string;
  label: string;
  subItems?: SubNavItem[];
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string;
  role?: 'MEMBER' | 'ADMIN';
}

interface Session {
  user?: User;
  expires: string;
}

const Navbar = () => {
  const { data: session } = useSession() as { data: Session | null };
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Define navigation items with proper typing
  const navItems: NavItem[] = [
    { 
      href: '/', 
      label: 'Home' 
    },
    ...(session?.user?.role === 'ADMIN' ? [{
      href: '/dashboard',
      label: 'Dashboard',
      requireAuth: true,
      requireAdmin: true,
      subItems: [

        { href: '/dashboard/documents', label: 'Documents' },


      ]
    }] : [])
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSubmenu = (href: string) => {
    setOpenSubmenu(openSubmenu === href ? null : href);
  };

  const shouldShowNavItem = (item: NavItem): boolean => {
    if (item.requireAuth && !session) return false;
    if (item.requireAdmin && session?.user?.role !== 'ADMIN') return false;
    return true;
  };

  const renderNavItem = (item: NavItem) => {
    if (!shouldShowNavItem(item)) return null;

    if (item.subItems) {
      return (
        <div key={item.href} className="relative">
          <button
            onClick={() => toggleSubmenu(item.href)}
            className="inline-flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors"
          >
            <span>{item.label}</span>
            <IoIosArrowDown 
              className={`w-4 h-4 transition-transform duration-200 ${
                openSubmenu === item.href ? 'rotate-180' : ''
              }`} 
            />
          </button>

          {openSubmenu === item.href && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100">
              {item.subItems.map((subItem) => (
                <Link
                  key={subItem.href}
                  href={subItem.href}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  onClick={() => setOpenSubmenu(null)}
                >
                  {subItem.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`${
          pathname === item.href ? 'text-orange-600' : 'text-gray-700'
        } hover:text-orange-600 transition-colors`}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-orange-600">
                SDN
              </span>
              <span className="text-2xl font-normal text-gray-700">
                Map Portal
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => renderNavItem(item))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 group"
                >
                  <div className="w-10 h-10 rounded-full ring-2 ring-gray-200 overflow-hidden">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="rounded-full object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {session.user?.lastName?.[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <IoIosArrowDown className="w-4 h-4 text-gray-600 group-hover:text-orange-600 transition-colors" />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      โปรไฟล์
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
              >
                เข้าสู่ระบบ
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <HiMenuAlt3 className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.filter(shouldShowNavItem).map((item) => (
              <div key={item.href}>
                {item.subItems ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.href)}
                      className="w-full flex items-center justify-between px-3 py-2 text-base text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span>{item.label}</span>
                      <IoIosArrowDown className={`
                        w-4 h-4 transition-transform duration-200
                        ${openSubmenu === item.href ? 'rotate-180' : ''}
                      `} />
                    </button>

                    {openSubmenu === item.href && (
                      <div className="bg-gray-50">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block pl-6 pr-4 py-2 text-base text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                            onClick={() => {
                              setOpenSubmenu(null);
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`
                      block px-3 py-2 text-base text-gray-700 hover:bg-gray-50 transition-colors
                      ${pathname === item.href ? 'text-orange-600' : ''}
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;