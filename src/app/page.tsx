"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { Share2, Copy, Check } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useStore();
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);

  const generateInviteLink = () => {
    if (!user) {
      toast.error("Please log in to generate an invite link");
      return;
    }
    
    // Generate invite link using the user's ID
    const link = `${window.location.origin}/invite/${user.id}`;
    setInviteLink(link);
    toast.success("Invite link generated successfully!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Invite link copied to clipboard!");
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-white">
      {/* Decorative Doodles - subtle and minimalistic */}
      <Image
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80"
        alt="heart doodle"
        width={80}
        height={80}
        className="absolute top-0 left-0 w-16 opacity-5 -z-10 rounded-full"
      />
      <Image
        src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80"
        alt="flower doodle"
        width={60}
        height={60}
        className="absolute top-10 right-0 w-14 opacity-5 -z-10 rounded-full"
      />
      <Image
        src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80"
        alt="teddy bear doodle"
        width={70}
        height={70}
        className="absolute bottom-0 left-10 w-16 opacity-5 -z-10 rounded-full"
      />
      <Image
        src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=200&q=80"
        alt="chocolate doodle"
        width={60}
        height={60}
        className="absolute bottom-5 right-5 w-14 opacity-5 -z-10 rounded-full"
      />

      {/* Main Content */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-3">
          A Special Place For Just the Two of You <span className="inline-block">💕</span>
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-8 max-w-md">
          Celebrate your journey, share moods, relive memories — no matter the distance.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-1">
          <Link
            href="/signup"
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full text-base font-medium transition inline-block"
          >
            Start Creating 🌸
          </Link>
          <Link
            href="/login?demo=true"
            className="bg-white border border-red-500 text-red-500 hover:bg-red-50 px-6 py-3 rounded-full text-base font-medium transition inline-block"
          >
            Try Demo
          </Link>
        </div>
        
        {/* Partner Connection Section */}
        <div className="mt-12 max-w-lg w-full">
          <h2 className="text-xl font-bold mb-4">Connect with Your Partner</h2>
          
          {/* Invite Partner Box */}
          <div className="bg-gray-50 p-5 rounded-lg mb-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-center mb-3">
              <Share2 className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="text-base font-semibold">Invite Your Partner</h3>
            </div>
            <p className="mb-3 text-sm text-gray-600">Generate and share a special link for your partner to join your shared space.</p>
            
            {isAuthenticated ? (
              <>
                <Button 
                  onClick={generateInviteLink}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-1.5 mb-3 rounded-full text-sm font-medium transition w-full"
                >
                  Generate Invite Link
                </Button>
                
                {inviteLink && (
                  <div className="mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white p-1.5 mb-1.5">
                      <input 
                        type="text" 
                        value={inviteLink} 
                        readOnly 
                        className="flex-1 p-1.5 text-xs bg-transparent outline-none"
                      />
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={copyToClipboard}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Share this link with your partner to connect immediately.</p>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/login"
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-1.5 rounded-full text-sm font-medium transition inline-block w-full"
              >
                Log in to Generate Link
              </Link>
            )}
          </div>
          
          {/* Accept Invitation Box */}
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 shadow-sm">
            <p className="mb-3 text-sm text-gray-600">Did your partner invite you to join? Accept their invitation to connect and start sharing memories.</p>
            <Link
              href="/login?invited=true"
              className="bg-red-100 text-red-700 hover:bg-red-200 px-5 py-2 rounded-full text-sm font-medium transition inline-block"
            >
              I have an invitation
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="absolute bottom-3 w-full text-center text-xs text-gray-400">
        © 2025 UsSpace – Made with ❤️
      </footer>
    </div>
  );
}
