'use client';

import type React from 'react';
import Header from './Header';
import Footer from './Footer';
import DoodleBackground from '../doodles/DoodleBackground';
import usePageTheme from '@/hooks/usePageTheme';

interface PageLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
  hideDoodles?: boolean;
}

export default function PageLayout({
  children,
  hideHeader = false,
  hideFooter = false,
  hideDoodles = false
}: PageLayoutProps) {
  // Apply page theme based on current route
  usePageTheme();
  
  return (
    <div className="flex flex-col min-h-screen relative">
      {!hideDoodles && <DoodleBackground />}

      {!hideHeader && <Header />}

      <main className="flex-grow">
        {children}
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}
