import React from 'react';
import { useTheme } from './theme-provider';
import { Button } from './ui/button';
import { Moon, Sun, User, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockApi } from '../mockApi';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    try {
      await mockApi.logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full h-[60px] bg-background shadow-md flex items-center justify-between z-10">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onMenuToggle}
        className="hover:bg-accent hover:text-white ml-[11px]"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      <div className="flex items-center space-x-4 mr-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="hover:bg-accent hover:text-white"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-accent hover:text-white"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end"
            className="bg-popover border border-border"
          >
            <DropdownMenuItem 
              onClick={handleLogout}
              className="cursor-pointer hover:bg-accent hover:text-white"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;