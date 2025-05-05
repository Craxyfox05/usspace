'use client';

import { cn } from "@/lib/utils";
import { ThemedButton, ThemedGradientButton } from "./themed-button";

interface ThemedContainerProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export function ThemedContainer({ 
  title, 
  children,
  className 
}: ThemedContainerProps) {
  return (
    <div className={cn(
      "p-6 rounded-xl mb-6 border border-page-primary/20",
      className
    )}>
      {title && (
        <h2 className="text-xl font-bold mb-4 text-page-primary">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

export function ThemedBanner({
  title,
  description,
  className
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn(
      "p-6 rounded-xl mb-6 bg-page-gradient text-white",
      className
    )}>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      {description && (
        <p className="opacity-90">{description}</p>
      )}
    </div>
  );
}

export function ThemedDemoSection() {
  return (
    <div className="space-y-6">
      <ThemedContainer title="Themed UI Elements">
        <p className="mb-4 text-page-primary">
          This section shows UI elements using the current page theme
        </p>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <ThemedButton>Themed Button</ThemedButton>
          <ThemedButton variant="outline">Outline Button</ThemedButton>
          <ThemedGradientButton>Gradient Button</ThemedGradientButton>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-page-primary/20 rounded-lg">
            <h3 className="font-medium text-page-primary mb-2">Primary Color</h3>
            <div className="h-12 bg-page-primary rounded-md"></div>
          </div>
          
          <div className="p-4 border border-page-primary/20 rounded-lg">
            <h3 className="font-medium text-page-secondary mb-2">Secondary Color</h3>
            <div className="h-12 bg-page-secondary rounded-md"></div>
          </div>
        </div>
      </ThemedContainer>
      
      <ThemedBanner 
        title="Themed Banner"
        description="This banner uses the current page gradient theme"
      />
    </div>
  );
} 