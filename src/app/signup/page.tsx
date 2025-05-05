"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { toast } from "sonner";
import ImageUpload from "@/components/profile/ImageUpload";

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 11);

const SignupPage = () => {
  const router = useRouter();
  const { setUser, setAuthenticated } = useStore();
  const [step, setStep] = useState<"basic" | "avatar" | "survey">("basic");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleBasicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error("Please fill out all fields");
      return;
    }
    
    // Create basic user account
    const user = {
      id: generateId(),
      name: formData.name,
      email: formData.email,
    };
    
    setUser(user);
    setStep("avatar");
  };

  const handleCompleteSignup = () => {
    setAuthenticated(true);
    router.push("/dashboard");
    toast.success("Welcome to UsSpace!");
  };

  return (
    <PageLayout>
      <div className="container max-w-5xl py-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold">Create Your Account</h1>
            <p className="text-muted-foreground mt-1">
              {step === "basic" && "Enter your basic information to get started"}
              {step === "avatar" && "Choose your profile picture"}
              {step === "survey" && "Tell us more about yourself for personalized recommendations"}
            </p>
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${step === "basic" ? "bg-red-500" : "bg-gray-200"}`} />
            <div className={`w-3 h-3 rounded-full ${step === "avatar" ? "bg-red-500" : "bg-gray-200"}`} />
            <div className={`w-3 h-3 rounded-full ${step === "survey" ? "bg-red-500" : "bg-gray-200"}`} />
          </div>
        </div>
        
        {step === "basic" && (
          <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter your name and email to get started</CardDescription>
            </CardHeader>
            <form onSubmit={handleBasicSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter your email"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Button type="submit" className="w-full">Continue</Button>
                <div className="text-center text-sm">
                  Already have an account? <Link href="/login" className="text-red-500 hover:underline">Login instead</Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        )}
        
        {step === "avatar" && (
          <ImageUpload 
            type="user"
            onComplete={() => setStep("survey")}
          />
        )}

        {step === "survey" && (
          <div className="w-full max-w-4xl mx-auto">
            <Card className="p-8">
              <CardHeader>
                <CardTitle>Profile Complete!</CardTitle>
                <CardDescription>
                  You've successfully set up your profile. You can now explore UsSpace!
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Button onClick={handleCompleteSignup} className="w-full">
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default SignupPage;
