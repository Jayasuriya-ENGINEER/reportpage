
import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageType } from '@/types';
import { toast } from 'sonner';
import { MessageCircle, Image, Video, Mic, Send, LogOut, AlertTriangle } from 'lucide-react';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { sendMessage, getMessagesByUser } = useChat();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('text');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const adminId = 'admin-1';
  const messages = getMessagesByUser(adminId);

  const handleSendMessage = () => {
    if (!message && messageType === 'text') {
      toast.error('Please enter a message');
      return;
    }

    if (filePreview && (messageType === 'image' || messageType === 'video' || messageType === 'audio')) {
      // For this demo, we'll just send the file preview URL
      sendMessage(filePreview, messageType, adminId);
      setMessage('');
      setFilePreview(null);
      setMessageType('text');
    } else if (messageType === 'text') {
      sendMessage(message, 'text', adminId);
      setMessage('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const result = event.target?.result as string;
      setFilePreview(result);
    };
    fileReader.readAsDataURL(file);
  };

  const selectFileType = (type: MessageType) => {
    setMessageType(type);
    if (type !== 'text' && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getAcceptFileTypes = () => {
    switch (messageType) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      case 'audio':
        return 'audio/*';
      default:
        return '';
    }
  };

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

  return (
    <div className="bg-[url('/back.png')] bg-cover bg-center min-h-screen">
      <header className="bg-brand-darkest border-b p-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-brand-blue to-brand-purple text-transparent bg-clip-text">
            Issue Reporter
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white text-left">
              Welcome {user?.username}
            </span>
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

      <main className="flex-1 container mx-auto py-6 px-4 border-{'bg-pink-950'}">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-{'bg-pink-950'}">
          <div className="md:col-span-2">
            <Card className="min-h-[500px] flex flex-col  shadow-md">
              <CardHeader className="bg-gradient-to-r from-brand-blue to-brand-purple text-white py-3">
                <CardTitle className="text-lg">Report an Issue</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                        <AlertTriangle size={48} className="mb-2" />
                        <p>No messages yet. Report an issue to get started.</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.senderId === user?.id
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.senderId === user?.id
                                ? "bg-gradient-to-r from-brand-blue to-brand-purple text-white"
                                : "bg-gray-100"
                            }`}
                          >
                            {renderMessageContent(msg.content, msg.type)}
                            <div
                              className={`text-xs mt-1 ${
                                msg.senderId === user?.id
                                  ? "text-white/70"
                                  : "text-gray-500"
                              }`}
                            >
                              {formatTimestamp(msg.timestamp)}
                              {msg.status && msg.senderId === user?.id && (
                                <span className="ml-2">
                                  •{" "}
                                  {msg.status === "resolved"
                                    ? "Resolved"
                                    : "Pending"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="border-t p-4">
                  {filePreview &&
                    (messageType === "image" ||
                      messageType === "video" ||
                      messageType === "audio") && (
                      <div className="mb-3">
                        {messageType === "image" && (
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="h-20 rounded border"
                          />
                        )}
                        {messageType === "video" && (
                          <video className="h-20 rounded border" controls>
                            <source src={filePreview} />
                          </video>
                        )}
                        {messageType === "audio" && (
                          <audio className="w-full" controls>
                            <source src={filePreview} />
                          </audio>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFilePreview(null);
                            setMessageType("text");
                          }}
                          className="mt-1 text-xs text-red-500"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}

                  <div className="flex gap-2">
                    <div className="flex-1">
                      {messageType === "text" ? (
                        <Textarea
                          placeholder="Type your message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="resize-none"
                        />
                      ) : (
                        <div className="py-2 px-3 border rounded-md bg-gray-50">
                          {messageType} selected
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={`rounded-full ${
                          messageType === "text" ? "bg-blue-100" : ""
                        }`}
                        onClick={() => setMessageType("text")}
                      >
                        <MessageCircle size={20} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={`rounded-full ${
                          messageType === "image" ? "bg-blue-100" : ""
                        }`}
                        onClick={() => selectFileType("image")}
                      >
                        <Image size={20} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={`rounded-full ${
                          messageType === "video" ? "bg-blue-100" : ""
                        }`}
                        onClick={() => selectFileType("video")}
                      >
                        <Video size={20} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={`rounded-full ${
                          messageType === "audio" ? "bg-blue-100" : ""
                        }`}
                        onClick={() => selectFileType("audio")}
                      >
                        <Mic size={20} />
                      </Button>
                    </div>
                    <Button
                      type="button"
                      onClick={handleSendMessage}
                      className="self-end bg-gradient-to-r from-brand-blue to-brand-purple"
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept={getAcceptFileTypes()}
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-gradient-to-r from-brand-blue to-brand-purple text-white py-3">
                <CardTitle className="text-lg">Help & Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">How to Report an Issue</h3>
                    <p className="text-sm text-gray-600">
                      Type your message in the chat box and click send. You can
                      also attach images, videos or audio files.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Response Time</h3>
                    <p className="text-sm text-gray-600">
                      Our admin typically responds within 24 hours. Thank you
                      for your patience.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Issue Status</h3>
                    <p className="text-sm text-gray-600">
                      <span className="text-yellow-500 font-medium">
                        Pending
                      </span>
                      : Issue is being reviewed
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="text-green-500 font-medium">
                        Resolved
                      </span>
                      : Issue has been fixed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
