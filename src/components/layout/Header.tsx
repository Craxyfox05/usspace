import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useStore } from '@/lib/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const { user, isAuthenticated, logout } = useStore();

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
                <Button variant="ghost">Couples</Button>
              </Link>
              <Link href="/memories">
                <Button variant="ghost">Memories</Button>
              </Link>
              <Link href="/mood">
                <Button variant="ghost">Mood</Button>
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
                <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/settings" className="w-full">Settings</Link>
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
              <Button variant="default" className="bg-red-500 hover:bg-red-600">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
