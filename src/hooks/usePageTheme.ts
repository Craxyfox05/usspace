'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';

const usePageTheme = () => {
  const pathname = usePathname();
  const { pageThemes, getPageTheme } = useStore();

  useEffect(() => {
    // Try to find an exact match first
    let theme = getPageTheme(pathname);
    
    // If no exact match, try to find a partial match
    if (!theme && pathname) {
      // Check for the most specific match (longest matching path)
      const matchingRoutes = pageThemes
        .filter(theme => pathname.startsWith(theme.route))
        .sort((a, b) => b.route.length - a.route.length);
      
      if (matchingRoutes.length > 0) {
        theme = matchingRoutes[0];
      }
    }
    
    // If no theme is found, remove any existing theme
    if (!theme) {
      document.documentElement.style.removeProperty('--page-primary-color');
      document.documentElement.style.removeProperty('--page-secondary-color');
      document.documentElement.style.removeProperty('--page-gradient');
      return;
    }
    
    // Apply the theme colors as CSS variables
    document.documentElement.style.setProperty(
      '--page-primary-color', 
      theme.primaryColor
    );
    
    if (theme.secondaryColor) {
      document.documentElement.style.setProperty(
        '--page-secondary-color',
        theme.secondaryColor
      );
    } else {
      document.documentElement.style.removeProperty('--page-secondary-color');
    }
    
    // Apply gradient if specified
    if (theme.isGradient && theme.secondaryColor) {
      document.documentElement.style.setProperty(
        '--page-gradient',
        `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor})`
      );
    } else {
      document.documentElement.style.removeProperty('--page-gradient');
    }
    
    console.log(`Applied theme "${theme.themeName}" to ${pathname}`);
  }, [pathname, getPageTheme, pageThemes]);
  
  return null;
};

export default usePageTheme; 