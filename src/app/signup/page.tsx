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

export default function SignupPage() {
  const router = useRouter();
  const { setUser, setAuthenticated } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
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
      // For demo purposes, we'll simulate the sign-up process
      // In production, you would use Supabase Auth
      /*
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        // Store user profile in Supabase
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { id: data.user.id, name: formData.name, email: formData.email }
          ]);

        if (profileError) throw profileError;
      }
      */

      // Demo: Create a fake user
      const fakeUser = {
        id: Math.random().toString(36).substring(2, 11),
        name: formData.name,
        email: formData.email,
      };

      // Save to store
      setUser(fakeUser);
      setAuthenticated(true);

      // Success notification
      toast.success("Account created successfully!");

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="container max-w-md py-10 px-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold cursive text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Enter your details to create your UsSpace account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
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
                <Label htmlFor="password">Password</Label>
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
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-red-500 hover:underline">
                  Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PageLayout>
  );
}
