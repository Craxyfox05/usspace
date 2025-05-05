"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PhoneCall, Heart } from 'lucide-react';
import { useVideoCall } from '@/contexts/VideoCallContext';

type CallButtonProps = {
  partnerId?: string;
  partnerName?: string;
  variant?: 'primary' | 'outline' | 'icon';
  className?: string;
};

const CallButton = ({ 
  partnerId,
  partnerName,
  variant = 'primary',
  className = ''
}: CallButtonProps) => {
  const { callPartner, callActive, setName, name } = useVideoCall();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [partnerIdInput, setPartnerIdInput] = useState(partnerId || '');
  const [partnerNameInput, setPartnerNameInput] = useState(partnerName || '');
  const [myNameInput, setMyNameInput] = useState(name || '');

  // Initiate call with provided details
  const handleCall = () => {
    if (!partnerIdInput.trim()) return;
    
    setName(myNameInput);
    callPartner(partnerIdInput, partnerNameInput);
    setIsDialogOpen(false);
  };

  // Don't show the call button if already in a call
  if (callActive) return null;

  // Choose button style based on variant
  let buttonStyle = '';
  
  switch (variant) {
    case 'primary':
      buttonStyle = 'bg-gradient-to-r from-rose-400 to-amber-400 text-white hover:from-rose-500 hover:to-amber-500';
      break;
    case 'outline':
      buttonStyle = 'bg-white border-rose-200 text-rose-500 hover:bg-rose-50';
      break;
    case 'icon':
      buttonStyle = 'rounded-full h-12 w-12 p-0 bg-gradient-to-r from-rose-400 to-amber-400 text-white hover:from-rose-500 hover:to-amber-500';
      break;
  }

  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)}
        variant={variant === 'outline' ? 'outline' : 'default'}
        className={`${buttonStyle} ${className}`}
      >
        {variant === 'icon' ? (
          <PhoneCall className="h-5 w-5" />
        ) : (
          <>
            <PhoneCall className="h-4 w-4 mr-2" />
            Video Call
          </>
        )}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-white to-rose-50 border-rose-100">
          <DialogHeader>
            <DialogTitle className="text-rose-700 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-rose-500" />
              Start a Video Call
            </DialogTitle>
            <DialogDescription className="text-amber-700">
              Connect with your partner through a video call
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-rose-600">Your Name</label>
              <Input 
                value={myNameInput} 
                onChange={(e) => setMyNameInput(e.target.value)}
                placeholder="Enter your name"
                className="border-amber-200 focus:border-amber-300"
              />
            </div>
            
            {!partnerId && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-rose-600">Partner's ID</label>
                <Input 
                  value={partnerIdInput} 
                  onChange={(e) => setPartnerIdInput(e.target.value)}
                  placeholder="Enter your partner's ID"
                  className="border-amber-200 focus:border-amber-300"
                />
              </div>
            )}
            
            {!partnerName && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-rose-600">Partner's Name</label>
                <Input 
                  value={partnerNameInput} 
                  onChange={(e) => setPartnerNameInput(e.target.value)}
                  placeholder="Enter your partner's name"
                  className="border-amber-200 focus:border-amber-300"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="border-rose-200 text-rose-600"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCall}
              disabled={!partnerIdInput.trim() || !myNameInput.trim()}
              className="bg-gradient-to-r from-rose-400 to-amber-400 text-white"
            >
              <PhoneCall className="h-4 w-4 mr-2" />
              Start Call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CallButton; 