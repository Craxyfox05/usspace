"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import PageLayout from "@/components/layout/PageLayout";
import PageHeader from "@/components/layout/PageHeader";
import ProfileSurvey from "@/components/profile/ProfileSurvey";

export default function SurveyPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useStore();
  
  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleSurveyComplete = () => {
    router.push("/dashboard");
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Complete Your Profile" 
        subtitle="Help us understand your preferences for better gift suggestions"
      />
      
      <div className="container max-w-5xl py-8 px-4 mb-12">
        <ProfileSurvey />
      </div>
    </PageLayout>
  );
} 