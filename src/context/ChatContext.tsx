
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Message, MessageType } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

type ChatContextType = {
  messages: Message[];
  sendMessage: (content: string, type: MessageType, receiverId: string) => void;
  getMessagesByUser: (userId: string) => Message[];
  markAsRead: (messageId: string) => void;
  updateStatus: (messageId: string, status: 'pending' | 'resolved') => void;
  getAllUserIds: () => string[];
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();

  // Load messages from localStorage
  useEffect(() => {
    const storedMessages = localStorage.getItem('messages');
    if (storedMessages) {
      const parsedMessages = JSON.parse(storedMessages);
      // Convert ISO strings back to Date objects
      const messagesWithDates = parsedMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(messagesWithDates);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('messages', JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = (content: string, type: MessageType, receiverId: string) => {
    if (!user) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      receiverId,
      content,
      type,
      timestamp: new Date(),
      isRead: false,
      status: 'pending'
    };

    setMessages(prev => [...prev, newMessage]);
    toast.success('Message sent successfully');
  };

  const getMessagesByUser = (userId: string) => {
    if (!user) return [];
    
    // If admin, get all messages from or to this user
    if (user.isAdmin) {
      return messages.filter(msg => 
        msg.senderId === userId || msg.receiverId === userId
      ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }
    
    // If regular user, get conversations between me and this user
    return messages.filter(msg => 
      (msg.senderId === user.id && msg.receiverId === userId) || 
      (msg.senderId === userId && msg.receiverId === user.id)
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  };

  const updateStatus = (messageId: string, status: 'pending' | 'resolved') => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      )
    );
  };

  const getAllUserIds = () => {
    if (!user || !user.isAdmin) return [];
    
    // Get all unique user IDs from messages (excluding admin)
    const userIds = new Set<string>();
    messages.forEach(msg => {
      if (msg.senderId !== 'admin-1') userIds.add(msg.senderId);
      if (msg.receiverId !== 'admin-1') userIds.add(msg.receiverId);
    });
    
    return Array.from(userIds);
  };

  return (
    <ChatContext.Provider value={{ 
      messages, 
      sendMessage, 
      getMessagesByUser, 
      markAsRead, 
      updateStatus,
      getAllUserIds
    }}>
      {children}
    </ChatContext.Provider>
  );
};
