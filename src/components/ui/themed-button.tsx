"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";

interface ThemedButtonProps extends ButtonProps {}

export function ThemedButton({
  className,
  variant = "default",
  ...props
}: ThemedButtonProps) {
  return (
    <Button
      className={cn(
        {
          // Only apply theme when using default variant
          "bg-page-primary hover:bg-page-primary/90 text-white": variant === "default",
          "border-page-primary text-page-primary hover:bg-page-primary/10": variant === "outline",
          "text-page-primary underline-offset-4 hover:underline": variant === "link",
        },
        className
      )}
      variant={variant}
      {...props}
    />
  );
}

export function ThemedGradientButton({
  className,
  ...props
}: ThemedButtonProps) {
  return (
    <Button
      className={cn(
        "bg-page-gradient text-white hover:opacity-90 transition-opacity border-none",
        className
      )}
      {...props}
    />
  );
} 