
import React from 'react';
import { User, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UserList = ({ users, selectedUserId, onUserSelect, getUnreadCount }) => {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="bg-gradient-to-r from-brand-darkest to-brand-light text-white py-3">
        <CardTitle className="text-lg">Users</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {users.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No users found
            </div>
          ) : (
            users.map((user) => {
              const unreadCount = getUnreadCount(user.id);
              return (
                <button
                  key={user.id}
                  onClick={() => onUserSelect(user.id)}
                  className={`w-full text-left p-4 flex items-center justify-between hover:bg-brand-pink-lightest transition-colors ${
                    selectedUserId === user.id ? 'bg-brand-pink-lighter' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-brand-pink-light flex items-center justify-center mr-3">
                      <User size={16} className="text-brand-dark" />
                    </div>
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Phone size={12} className="mr-1" />
                        <span>{user.phoneNumber}</span>
                      </div>
                    </div>
                  </div>
                  {unreadCount > 0 && (
                    <span className="bg-brand-light text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserList;
