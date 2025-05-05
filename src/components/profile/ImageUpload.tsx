"use client";

import { useState, useRef } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Upload, ImagePlus, X } from "lucide-react";
import Image from "next/image";

type ImageUploadProps = {
  type: "user" | "partner";
  onComplete?: () => void;
};

const ImageUpload = ({ type, onComplete }: ImageUploadProps) => {
  const { user, partner, updateUserProfile, updatePartnerProfile } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [gender, setGender] = useState<string>(
    type === "user" ? user?.gender || "" : partner?.gender || ""
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    type === "user" ? user?.avatar || null : partner?.avatar || null
  );
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5MB");
        return;
      }

      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  const clearPreview = () => {
    setPreviewUrl(null);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!gender) {
      toast.error("Please select a gender");
      return;
    }

    try {
      // In a real app, you would upload the file to a server/storage and get a URL back
      // For this demo, we'll use a simulated URL
      let imageUrl = previewUrl || undefined;
      
      if (file) {
        // Simulating an upload for demo purposes
        // In a real app, you'd upload to a server and get the URL back
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        
        // For the purpose of this demo, we'll use the local preview URL
        // In production, you'd replace this with the actual server URL
        imageUrl = previewUrl || undefined;
        
        toast.success("Image uploaded successfully");
      }
      
      if (type === "user") {
        updateUserProfile({
          avatar: imageUrl,
          gender: gender
        });
      } else {
        updatePartnerProfile({
          avatar: imageUrl,
          gender: gender
        });
      }
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      toast.error("Failed to save profile image");
      console.error(error);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {type === "user" ? "Upload Your Profile Picture" : "Upload Partner's Profile Picture"}
        </CardTitle>
        <CardDescription>
          {type === "user" 
            ? "Choose a picture that represents you" 
            : "Choose a picture that represents your partner"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="gender">
            {type === "user" ? "I am a:" : "My partner is a:"}
          </Label>
          <RadioGroup 
            id="gender"
            value={gender} 
            onValueChange={setGender}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id={`${type}-male`} />
              <Label htmlFor={`${type}-male`}>Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id={`${type}-female`} />
              <Label htmlFor={`${type}-female`}>Female</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-center">
            {previewUrl ? (
              <div className="relative w-48 h-48">
                <Image 
                  src={previewUrl}
                  alt="Profile Preview"
                  fill
                  className="object-cover rounded-full"
                />
                <button 
                  onClick={clearPreview}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  type="button"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="w-48 h-48 border-2 border-dashed rounded-full flex flex-col items-center justify-center text-gray-400 cursor-pointer"
                   onClick={() => fileInputRef.current?.click()}>
                <ImagePlus size={40} />
                <p className="mt-2 text-sm">Click to upload image</p>
              </div>
            )}
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            type="button"
          >
            <Upload size={16} />
            {previewUrl ? "Change Image" : "Upload Image"}
          </Button>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleSave}
          disabled={!gender}
          className="w-full"
        >
          {type === "user" ? "Save Profile" : "Save Partner Profile"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImageUpload; 