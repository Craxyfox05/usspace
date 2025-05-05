"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

type InvitePartnerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function InvitePartnerDialog({ open, onOpenChange }: InvitePartnerDialogProps) {
  const [partnerEmail, setPartnerEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useStore();

  // Function to handle the invite
  const handleInvite = async () => {
    if (!partnerEmail) {
      toast.error("Please enter your partner's email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would send an actual invitation through your backend
      // For demo purposes, we'll simulate success after a short delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Invitation sent to ${partnerEmail}`, {
        description: "They'll receive an email with instructions to join your couple space",
      });
      
      setPartnerEmail("");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to send invitation. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to copy invite link
  const copyInviteLink = () => {
    // Generate a unique invite link (in a real app, this would be a unique token)
    const inviteLink = `${window.location.origin}/invite/${user?.id}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Invite Your Partner</DialogTitle>
          <DialogDescription>
            Send an invitation to your partner to connect your accounts.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="partner-email">Partner's Email</Label>
            <Input
              id="partner-email"
              placeholder="partner@example.com"
              value={partnerEmail}
              onChange={(e) => setPartnerEmail(e.target.value)}
            />
          </div>
          
          <div className="pt-2">
            <Label className="mb-2 block">Or share an invite link</Label>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={copyInviteLink}
            >
              Copy Invite Link
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInvite} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 