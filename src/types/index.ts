
export type User = {
  id: string;
  username: string;
  isAdmin: boolean;
  avatar?: string;
};

export type MessageType = 'text' | 'image' | 'video' | 'audio';

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  isRead: boolean;
  status?: 'pending' | 'resolved';
};
