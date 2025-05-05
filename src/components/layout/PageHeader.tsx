"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { usePathname } from "next/navigation";
import CoupledAvatars from "@/components/profile/CoupledAvatars";
import Avatar from "@/components/profile/Avatar";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

// Map routes to poses for the coupled avatars
const routePoseMap: Record<string, any> = {
  "/couples": "hugging",
  "/chat": "kissing",
  "/dashboard": "cuddle",
  "/games": "hugging",
  "/memories": "kissing",
  // Default pose will be used for other routes
};

const PageHeader = ({ title, subtitle, children }: PageHeaderProps) => {
  const { partner } = useStore();
  const pathname = usePathname();
  const [pose, setPose] = useState<"default" | "hugging" | "kissing" | "cuddle">("default");
  
  useEffect(() => {
    // Set pose based on the current route
    const baseRoute = `/${pathname.split('/')[1]}`;
    if (routePoseMap[baseRoute]) {
      setPose(routePoseMap[baseRoute]);
    } else {
      setPose("default");
    }
  }, [pathname]);
  
  return (
    <div className="pb-6 pt-10 border-b border-gray-200 mb-8">
      <div className="container">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
          </div>
          
          <div className="flex flex-col items-center">
            {partner ? (
              <CoupledAvatars pose={pose} size="md" className="mb-1" />
            ) : (
              <Avatar type="user" size="md" className="mb-1" />
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default PageHeader; 