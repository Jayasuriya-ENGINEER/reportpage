
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import AdminHeader from '@/components/admin/AdminHeader';
import UserList from '@/components/admin/UserList';
import Chat from '@/components/admin/Chat';
import { formatTimestamp, renderMessageContent } from '@/utils/messageUtils';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { getAllUserIds, getMessagesByUser, sendMessage, updateStatus } = useChat();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [users, setUsers] = useState([]);
  
  // Load users from localStorage
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const allUserIds = getAllUserIds();
    
    // Match user IDs with usernames and phone numbers
    const usersWithDetails = allUserIds.map(id => {
      const userInfo = storedUsers.find((u) => u.id === id);
      return {
        id,
        username: userInfo?.username || `User ${id.split('-')[1]}`,
        phoneNumber: userInfo?.phoneNumber || 'Not provided'
      };
    });
    
    setUsers(usersWithDetails);
    
    // If we have users and none selected, select the first one
    if (usersWithDetails.length > 0 && !selectedUserId) {
      setSelectedUserId(usersWithDetails[0].id);
    }
  }, [getAllUserIds, selectedUserId]);

  const handleSendReply = () => {
    if (selectedUserId && replyMessage.trim()) {
      sendMessage(replyMessage, 'text', selectedUserId);
      setReplyMessage('');
    }
  };

  const handleStatusChange = (messageId, status) => {
    updateStatus(messageId, status);
  };

  const messages = selectedUserId ? getMessagesByUser(selectedUserId) : [];

  const getUnreadCount = (userId) => {
    if (!userId) return 0;
    return getMessagesByUser(userId).filter(msg => !msg.isRead && msg.senderId === userId).length;
  };

  const selectedUser = users.find(u => u.id === selectedUserId);

  return (
    <div className="bg-[url('/back.png')] bg-cover bg-center min-h-screen">
      <AdminHeader username={user?.username} onLogout={logout} />

      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <UserList 
              users={users} 
              selectedUserId={selectedUserId} 
              onUserSelect={setSelectedUserId} 
              getUnreadCount={getUnreadCount} 
            />
          </div>

          <div className="md:col-span-3">
            <Chat 
              selectedUserId={selectedUserId}
              selectedUser={selectedUser}
              messages={messages}
              replyMessage={replyMessage}
              setReplyMessage={setReplyMessage}
              handleSendReply={handleSendReply}
              formatTimestamp={formatTimestamp}
              handleStatusChange={handleStatusChange}
              renderMessageContent={renderMessageContent}
              currentUserId={user?.id}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
