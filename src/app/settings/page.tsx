"use client";

import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/profile/ImageUpload";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import RelationshipStreaks from "@/components/relationship/RelationshipStreaks";

const SettingsPage = () => {
  const { logout, partner, user } = useStore();

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out");
  };

  return (
    <PageLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut size={16} />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full mb-8">
            <TabsTrigger value="profile" className="flex-1">Your Profile</TabsTrigger>
            <TabsTrigger value="account" className="flex-1">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Relationship Status Card */}
            {partner && (
              <Card>
                <CardHeader>
                  <CardTitle>Relationship Status</CardTitle>
                  <CardDescription>
                    Your current relationship status with {partner.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-6 bg-rose-50 rounded-lg border border-rose-100">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-rose-700">
                        <RelationshipStreaks showLabel showDetails size="lg" />
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-500">Connected with</div>
                          <div className="font-semibold">{partner.name}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Your Profile Picture</CardTitle>
                <CardDescription>
                  Update your profile picture to make your account more personal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload type="user" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="delete-account">Delete Account</Label>
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete your account and all your data
                  </p>
                  <Button variant="destructive" className="w-fit mt-2">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default SettingsPage;
