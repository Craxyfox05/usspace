import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import RelationshipSummary from '@/components/chat/RelationshipSummary';
import RelationshipStreaks from '@/components/relationship/RelationshipStreaks';
import Avatar from '@/components/profile/Avatar';

export default function Header() {
  const { user, partner, isAuthenticated, logout } = useStore();

  return (
    <header className="w-full border-b bg-white/95 backdrop-blur-sm z-10">
      <div className="container flex items-center justify-between py-3 px-4">
        {/* Logo */}
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
          <span className="text-2xl font-bold cursive">UsSpace</span>
          <span className="text-red-500">💕</span>
        </Link>

        {/* Navigation */}
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link href="/couples">
                <Button variant="ghost">LoveSpace</Button>
              </Link>
              <Link href="/memories">
                <Button variant="ghost">Memories</Button>
              </Link>
              <Link href="/listen-together">
                <Button variant="ghost">Listen Together</Button>
              </Link>
              <Link href="/chat">
                <Button variant="ghost">Chat</Button>
              </Link>
              <Link href="/events">
                <Button variant="ghost">Events</Button>
              </Link>
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-2">
                  Menu
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="px-2 py-1.5 border-b">
                  <div className="font-medium">{user?.name || 'User'}</div>
                  <div className="text-xs text-gray-500">{user?.email || 'user@example.com'}</div>
                </div>
                
                {/* Relationship streaks and Summary */}
                <div className="border-b">
                  {partner && (
                    <div className="p-2 flex justify-center">
                      <RelationshipStreaks size="md" />
                    </div>
                  )}
                  <RelationshipSummary />
                </div>
                
                <DropdownMenuItem>
                  <Link href="/settings" className="w-full">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/chat" className="w-full">Chat Analysis</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button variant="default">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
