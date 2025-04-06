
import React from 'react';
import { Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Message from './Message';

const Chat = ({ 
  selectedUserId, 
  selectedUser, 
  messages, 
  replyMessage, 
  setReplyMessage, 
  handleSendReply, 
  formatTimestamp, 
  handleStatusChange, 
  renderMessageContent,
  currentUserId 
}) => {
  return (
    <Card className="min-h-[600px] flex flex-col border-0 shadow-md">
      <CardHeader className="bg-gradient-to-r from-brand-darkest to-brand-light text-white py-3">
        <CardTitle className="text-lg">
          {selectedUserId 
            ? `Chat with ${selectedUser?.username || 'User'}`
            : 'Select a user to chat'
          }
        </CardTitle>
        {selectedUserId && (
          <div className="text-xs text-white/80 flex items-center mt-1">
            <Phone size={12} className="mr-1" />
            <span>{selectedUser?.phoneNumber || 'Not provided'}</span>
          </div>
        )}
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
                    <Message
                      key={msg.id}
                      message={msg}
                      currentUserId={currentUserId}
                      formatTimestamp={formatTimestamp}
                      handleStatusChange={handleStatusChange}
                      renderMessageContent={renderMessageContent}
                    />
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
                  className="resize-none flex-1 focus-visible:ring-brand-medium"
                />
                <Button
                  onClick={handleSendReply}
                  className="self-end bg-gradient-to-r from-brand-dark to-brand-light hover:from-brand-darkest hover:to-brand-medium"
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
  );
};

export default Chat;
