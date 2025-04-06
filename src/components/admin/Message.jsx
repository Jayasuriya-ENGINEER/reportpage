
import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Message = ({ message, currentUserId, formatTimestamp, handleStatusChange, renderMessageContent }) => {
  const isCurrentUserMessage = message.senderId === currentUserId;

  return (
    <div className={`flex ${isCurrentUserMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isCurrentUserMessage
            ? 'bg-gradient-to-r from-brand-dark to-brand-light text-white'
            : 'bg-brand-pink-lightest'
        }`}
      >
        {renderMessageContent(message.content, message.type)}
        <div
          className={`text-xs mt-1 ${
            isCurrentUserMessage ? 'text-white/70' : 'text-gray-500'
          } flex justify-between items-center`}
        >
          <span>{formatTimestamp(message.timestamp)}</span>
          
          {!isCurrentUserMessage && message.status && (
            <div className="flex gap-1 ml-2">
              <Button
                variant="ghost"
                size="icon"
                className={`h-5 w-5 rounded-full ${
                  message.status === 'resolved' ? 'bg-green-100 text-green-600' : ''
                }`}
                onClick={() => handleStatusChange(message.id, 'resolved')}
              >
                <Check size={12} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-5 w-5 rounded-full ${
                  message.status === 'pending' ? 'bg-brand-pink-light text-brand-dark' : ''
                }`}
                onClick={() => handleStatusChange(message.id, 'pending')}
              >
                <X size={12} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
