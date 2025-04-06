
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Check, X, User } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { MessageType } from '@/types';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { getAllUserIds, getMessagesByUser, sendMessage, updateStatus } = useChat();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [users, setUsers] = useState<{ id: string; username: string }[]>([]);
  
  // Load users from localStorage
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const allUserIds = getAllUserIds();
    
    // Match user IDs with usernames
    const usersWithDetails = allUserIds.map(id => {
      const userInfo = storedUsers.find((u: any) => u.id === id);
      return {
        id,
        username: userInfo?.username || `User ${id.split('-')[1]}`
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

  const handleStatusChange = (messageId: string, status: 'pending' | 'resolved') => {
    updateStatus(messageId, status);
  };

  const messages = selectedUserId ? getMessagesByUser(selectedUserId) : [];

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageContent = (content: string, type: MessageType) => {
    switch (type) {
      case 'image':
        return <img src={content} alt="Image" className="max-w-full rounded-md" />;
      case 'video':
        return (
          <video controls className="max-w-full rounded-md">
            <source src={content} />
            Your browser does not support the video tag.
          </video>
        );
      case 'audio':
        return (
          <audio controls className="w-full">
            <source src={content} />
            Your browser does not support the audio tag.
          </audio>
        );
      default:
        return <p>{content}</p>;
    }
  };

  const getUnreadCount = (userId: string) => {
    if (!userId) return 0;
    return getMessagesByUser(userId).filter(msg => !msg.isRead && msg.senderId === userId).length;
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-light">
      <header className="bg-white border-b p-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-brand-blue to-brand-purple text-transparent bg-clip-text">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Admin: {user?.username}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="flex items-center gap-1 text-xs"
            >
              <LogOut size={14} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-gradient-to-r from-brand-blue to-brand-purple text-white py-3">
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
                          onClick={() => setSelectedUserId(user.id)}
                          className={`w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                            selectedUserId === user.id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              <User size={16} className="text-gray-500" />
                            </div>
                            <div>
                              <p className="font-medium">{user.username}</p>
                              <p className="text-xs text-gray-500">{user.id}</p>
                            </div>
                          </div>
                          {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
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
          </div>

          <div className="md:col-span-3">
            <Card className="min-h-[600px] flex flex-col border-0 shadow-md">
              <CardHeader className="bg-gradient-to-r from-brand-blue to-brand-purple text-white py-3">
                <CardTitle className="text-lg">
                  {selectedUserId 
                    ? `Chat with ${users.find(u => u.id === selectedUserId)?.username || 'User'}`
                    : 'Select a user to chat'
                  }
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
                {selectedUserId ? (
                  <>
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-4">
                        {messages.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                            <p>No messages yet. Send a message to start the conversation.</p>
                          </div>
                        ) : (
                          messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${
                                msg.senderId === user?.id ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg p-3 ${
                                  msg.senderId === user?.id
                                    ? 'bg-gradient-to-r from-brand-blue to-brand-purple text-white'
                                    : 'bg-gray-100'
                                }`}
                              >
                                {renderMessageContent(msg.content, msg.type)}
                                <div
                                  className={`text-xs mt-1 ${
                                    msg.senderId === user?.id ? 'text-white/70' : 'text-gray-500'
                                  } flex justify-between items-center`}
                                >
                                  <span>{formatTimestamp(msg.timestamp)}</span>
                                  
                                  {msg.senderId !== user?.id && msg.status && (
                                    <div className="flex gap-1 ml-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`h-5 w-5 rounded-full ${
                                          msg.status === 'resolved' ? 'bg-green-100 text-green-600' : ''
                                        }`}
                                        onClick={() => handleStatusChange(msg.id, 'resolved')}
                                      >
                                        <Check size={12} />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`h-5 w-5 rounded-full ${
                                          msg.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : ''
                                        }`}
                                        onClick={() => handleStatusChange(msg.id, 'pending')}
                                      >
                                        <X size={12} />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="border-t p-4">
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Type your reply..."
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          className="resize-none flex-1"
                        />
                        <Button
                          onClick={handleSendReply}
                          className="self-end bg-gradient-to-r from-brand-blue to-brand-purple"
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-4 text-gray-400">
                    <p>Select a user from the list to view their messages</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
