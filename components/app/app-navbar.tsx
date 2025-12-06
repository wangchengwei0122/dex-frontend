'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Trade', href: '/trade' },
  { label: 'Explore', href: '/explore' },
  { label: 'Pool', href: '/pool' },
];

export interface AppNavbarProps extends React.HTMLAttributes<HTMLElement> {}

const AppNavbar = React.forwardRef<HTMLElement, AppNavbarProps>(
  ({ className, ...props }, ref) => {
    const pathname = usePathname();

    return (
      <nav
        ref={ref}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 h-16',
          'bg-[#0A0A0C] border-b border-[rgba(201,162,39,0.20)]',
          'backdrop-blur-sm',
          className
        )}
        {...props}
      >
        <div className="max-w-screen-xl mx-auto px-4 h-full flex items-center gap-8">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-[#C9A227] tracking-tight hover:text-[#D4A017] transition-colors duration-200"
          >
            DEX
          </Link>

          {/* Navigation Menu - 靠左布局 */}
          <div className="flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              
              // 基础样式
              const baseClass =
                'relative inline-flex items-center transition-all duration-200 px-3 py-2';
              
              // 未激活样式
              const inactiveClass =
                'text-zinc-200 text-[15px] font-semibold hover:text-[#C9A227] hover:after:content-[""] hover:after:absolute hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:-bottom-[8px] hover:after:h-[2px] hover:after:w-6 hover:after:bg-[#C9A227] hover:after:rounded-full';
              
              // 激活样式
              const activeClass =
                'text-[#C9A227] text-[16px] font-bold after:content-[""] after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-[8px] after:h-[2px] after:w-8 after:bg-[#C9A227] after:rounded-full after:shadow-[0_0_12px_rgba(201,162,39,0.65)]';
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(baseClass, isActive ? activeClass : inactiveClass)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Spacer - 将 Connect Button 推到右侧 */}
          <div className="flex-1" />

          {/* Connect Wallet Button - 紧凑样式 */}
          <div className="flex items-center shrink-0">
            <ConnectButton />
          </div>
        </div>
      </nav>
    );
  }
);
AppNavbar.displayName = 'AppNavbar';

export { AppNavbar };

