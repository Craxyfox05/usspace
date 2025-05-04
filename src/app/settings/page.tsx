"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/layout/PageLayout";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeSelector from "@/components/ThemeSelector";

export default function SettingsPage() {
  const router = useRouter();
  const { user, partner, isAuthenticated, setUser, logout } = useStore();
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // In a real app, we would update the user in the database
      // For this demo, just update the store
      setUser({
        ...user,
        name: profileData.name,
        email: profileData.email,
        avatar: profileData.avatar,
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    try {
      // In a real app, we would delete the user from the database
      // For this demo, just log the user out
      toast.success("Account deleted successfully.");
      logout();
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please try again.");
    }
  };

  return (
    <PageLayout>
      <div className="container py-8 px-4 max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 cursive">Account Settings</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your profile information
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSaveProfile}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatar">Profile Picture URL</Label>
                      <Input
                        id="avatar"
                        name="avatar"
                        value={profileData.avatar}
                        onChange={handleInputChange}
                        placeholder="https://example.com/your-avatar.jpg"
                      />
                      <p className="text-xs text-gray-500">
                        Enter a URL for your profile picture
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="bg-red-500 hover:bg-red-600"
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Preview</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center pt-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage
                      src={profileData.avatar || user.avatar}
                      alt={profileData.name || user.name}
                    />
                    <AvatarFallback className="text-xl">
                      {profileData.name?.charAt(0) || user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">
                    {profileData.name || user.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {profileData.email || user.email}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Doodle Theme</CardTitle>
                <CardDescription>
                  Customize the app's appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ThemeSelector />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>
                  Manage your account settings and data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Change Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    <Button className="bg-red-500 hover:bg-red-600">
                      Update Password
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">Export Data</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Download all your data including memories, events, and messages
                  </p>
                  <Button variant="outline">
                    Export Data
                  </Button>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                  >
                    {deleteConfirm ? "Click again to confirm" : "Delete Account"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
