
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export default function Header({ onMenuToggle, isMenuOpen }: HeaderProps) {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (!isMobile && isMenuOpen) {
      onMenuToggle();
    }
  }, [isMobile, isMenuOpen, onMenuToggle]);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-gradient-to-r from-purple-500/10 to-teal-500/10 px-4 md:px-6 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="md:hidden text-primary hover:text-primary/80"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        )}
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <div className="h-8 w-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">NH</span>
              </div>
            </div>
            <span className="font-semibold text-lg md:text-xl bg-gradient-to-r from-primary via-secondary to-teal-500 bg-clip-text text-transparent">Natembea Health Centre</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-primary hover:text-primary/80"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
        </Button>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full border-2 border-primary/20 hover:border-primary/40 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-primary text-white">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-rose-500 hover:text-rose-700 dark:text-rose-400 hover:dark:text-rose-300">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
