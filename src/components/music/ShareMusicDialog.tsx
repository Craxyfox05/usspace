"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { Copy, Music, QrCode } from "lucide-react";
import Image from "next/image";
import CoupledAvatars from "@/components/profile/CoupledAvatars";
import { ThemedButton, ThemedGradientButton } from "@/components/ui/themed-button";

type ShareMusicDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

const ShareMusicDialog = ({ open, onOpenChange, onConfirm }: ShareMusicDialogProps) => {
  const { user, partner } = useStore();
  const [copied, setCopied] = useState(false);
  
  // Generate a unique session ID
  const sessionId = Math.random().toString(36).substring(2, 10);
  const inviteLink = `${window.location.origin}/listen-together?session=${sessionId}`;
  
  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Invite link copied to clipboard!");
    
    // Reset copied state after 3 seconds
    setTimeout(() => setCopied(false), 3000);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-page-primary">Listen Together</DialogTitle>
          <DialogDescription className="text-page-secondary">
            Invite {partner?.name || "your partner"} to listen to music with you in real-time.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4 space-y-4">
          <div className="w-full max-w-xs mx-auto">
            <CoupledAvatars pose="hugging" size="md" className="mx-auto" />
          </div>
          
          <div className="bg-page-primary/5 p-4 rounded-xl w-full border border-page-primary/20">
            <div className="flex items-center mb-2">
              <Music className="w-5 h-5 text-page-primary mr-2" />
              <span className="font-medium text-page-primary">Musical Connection</span>
            </div>
            <p className="text-sm text-page-secondary">
              Share this link with {partner?.name || "your partner"} to enjoy the same music, synchronized in real-time.
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full">
            <Input 
              value={inviteLink} 
              readOnly 
              className="pr-10 border-page-primary/20 focus-visible:ring-page-primary/50" 
            />
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              onClick={copyLink}
              className={copied ? "bg-green-100 text-green-700 border-green-300" : "border-page-primary/30 text-page-primary hover:bg-page-primary/10"}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-page-primary/20">
            <div className="bg-page-primary/5 p-4 rounded-lg flex items-center justify-center">
              <QrCode className="w-24 h-24 text-page-primary" />
            </div>
            <p className="text-center text-sm mt-2 text-page-secondary">
              Or scan this QR code
            </p>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <ThemedButton 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </ThemedButton>
          <ThemedGradientButton 
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Start Listening
          </ThemedGradientButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareMusicDialog; 