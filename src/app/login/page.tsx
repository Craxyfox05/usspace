"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PageLayout from "@/components/layout/PageLayout";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setPartner, setAuthenticated } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For demo purposes, we'll simulate the login process
      // In production, you would use Supabase Auth
      /*
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        // Get user profile from Supabase
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        // Set user in store
        setUser({
          id: profileData.id,
          name: profileData.name,
          email: profileData.email,
          avatar: profileData.avatar_url,
          mood: profileData.mood,
          moodNote: profileData.mood_note,
          moodLastUpdated: profileData.mood_updated_at ? new Date(profileData.mood_updated_at) : undefined,
        });

        // Get partner data
        if (profileData.partner_id) {
          const { data: partnerData, error: partnerError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', profileData.partner_id)
            .single();

          if (!partnerError && partnerData) {
            setPartner({
              id: partnerData.id,
              name: partnerData.name,
              avatar: partnerData.avatar_url,
              mood: partnerData.mood,
              moodNote: partnerData.mood_note,
              moodLastUpdated: partnerData.mood_updated_at ? new Date(partnerData.mood_updated_at) : undefined,
            });
          }
        }
      }
      */

      // Demo: Create fake user and partner
      const fakeUser = {
        id: "user-123",
        name: "Jordan",
        email: formData.email,
        avatar: "https://i.pravatar.cc/150?u=user123",
        mood: "happy" as const,
        moodNote: "Feeling good today!",
        moodLastUpdated: new Date(),
      };

      const fakePartner = {
        id: "partner-456",
        name: "Alex",
        avatar: "https://i.pravatar.cc/150?u=partner456",
        mood: "neutral" as const,
        moodNote: "Just another day",
        moodLastUpdated: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      };

      // Save to store
      setUser(fakeUser);
      setPartner(fakePartner);
      setAuthenticated(true);

      // Success notification
      toast.success("Logged in successfully!");

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="container max-w-md py-10 px-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold cursive text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your UsSpace
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-red-500 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600"
                disabled={isLoading}
              >
                {isLoading ? "Logging In..." : "Login"}
              </Button>
              <div className="text-center text-sm">
                Don't have an account yet?{" "}
                <Link href="/signup" className="text-red-500 hover:underline">
                  Sign Up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PageLayout>
  );
}
