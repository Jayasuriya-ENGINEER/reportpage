
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminHeader = ({ username, onLogout }) => {
  return (
    <header className="bg-brand-darkest border-b p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-brand-dark to-brand-lightest text-transparent bg-clip-text">
          Admin Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-white">Admin: {username}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="flex items-center gap-1 text-xs text-brand-medium border-brand-light hover:bg-brand-pink-lighter hover:text-brand-medium"
          >
            <LogOut size={14} />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
