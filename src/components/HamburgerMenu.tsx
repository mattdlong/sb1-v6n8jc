import React from 'react';
import { Button } from './ui/button';
import { Briefcase, Trash2, Ban, Users, LogOut } from 'lucide-react';
import { mockApi } from '../mockApi';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose, onLogout }) => {
  const topMenuItems = [
    { icon: <Briefcase className="h-5 w-5" />, label: 'Opportunities', permission: 'all' },
    { icon: <Trash2 className="h-5 w-5" />, label: 'Deleted Opportunities', permission: 'deleted' },
    { icon: <Ban className="h-5 w-5" />, label: 'Unqualified Opportunities', permission: 'unqualified' },
  ];

  const bottomMenuItems = [
    { icon: <Users className="h-5 w-5" />, label: 'User Management', permission: 'admin' },
    { icon: <LogOut className="h-5 w-5" />, label: 'Logout', permission: 'all', onClick: handleLogout },
  ];

  async function handleLogout() {
    try {
      await mockApi.logout();
      onLogout();
    } catch (error) {
      console.error('Logout failed', error);
    }
  }

  const renderMenuItem = (item: any, index: number) => (
    <Button
      key={index}
      variant="ghost"
      className={`justify-start mb-2 w-full ${isOpen ? 'px-4' : 'px-2'} transition-all duration-300`}
      onClick={item.onClick || onClose}
    >
      {item.icon}
      <span className={`ml-2 transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'} overflow-hidden whitespace-nowrap`}>
        {item.label}
      </span>
    </Button>
  );

  return (
    <div 
      className={`fixed top-[60px] left-0 h-[calc(100vh-60px)] bg-background shadow-lg transition-all duration-300 ease-in-out flex flex-col ${
        isOpen ? 'w-[250px]' : 'w-[60px]'
      }`}
    >
      <nav className="flex flex-col p-2 flex-grow">
        {topMenuItems.map(renderMenuItem)}
      </nav>
      <div className="mt-auto p-2">
        {bottomMenuItems.map(renderMenuItem)}
      </div>
    </div>
  );
};

export default HamburgerMenu;