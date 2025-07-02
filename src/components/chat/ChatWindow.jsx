import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip,
  Smile,
  ArrowLeft,
  Circle
} from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { chatAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const ChatWindow = ({ chat, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { user } = useAuth();
  const { 
    socket, 
    isConnected, 
    joinChat, 
    leaveChat, 
    sendMessage, 
    startTyping, 
    stopTyping, 
    markMessagesRead,
    onlineUsers
  } = useSocket();

  // Get other participant info
  const otherParticipant = chat?.participants?.find(p => p.user._id !== user._id);
  const isOtherUserOnline = onlineUsers.some(u => u.userId === otherParticipant?.user._id);

  // Load messages when chat changes
  useEffect(() => {
    if (chat?._id) {
      loadMessages();
      joinChat(chat._id);
      markMessagesRead(chat._id);
    }

    return () => {
      if (chat?._id) {
        leaveChat(chat._id);
      }
    };
  }, [chat?._id]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data) => {
      if (data.message.chat === chat?._id) {
        setMessages(prev => [...prev, data.message]);
        scrollToBottom();
        // Mark as read if chat is open
        markMessagesRead(chat._id);
      }
    };

    const handleUserTyping = (data) => {
      if (data.userId !== user._id) {
        setTypingUsers(prev => {
          if (data.isTyping) {
            return prev.find(u => u.userId === data.userId) 
              ? prev 
              : [...prev, data];
          } else {
            return prev.filter(u => u.userId !== data.userId);
          }
        });
      }
    };

    const handleMessagesRead = (data) => {
      if (data.chatId === chat?._id) {
        // Update read receipts in UI
        setMessages(prev => prev.map(msg => {
          if (msg.sender._id !== user._id) {
            return {
              ...msg,
              readBy: [...(msg.readBy || []), {
                user: data.userId,
                readAt: data.readAt
              }]
            };
          }
          return msg;
        }));
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('messages_read', handleMessagesRead);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('messages_read', handleMessagesRead);
    };
  }, [socket, chat?._id, user._id]);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await chatAPI.getChatMessages(chat._id, page);
      setMessages(response.data.messages);
      setHasMore(response.data.pagination.page < response.data.pagination.pages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !isConnected) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    
    // Send via socket for real-time
    sendMessage(chat._id, messageContent);
    
    // Also send via API as backup
    try {
      await chatAPI.sendMessage(chat._id, messageContent);
    } catch (error) {
      console.error('Failed to send message via API:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // Handle typing indicators
    if (!isTyping) {
      setIsTyping(true);
      startTyping(chat._id);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping(chat._id);
    }, 1000);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <CardHeader className="border-b bg-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="md:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="relative">
              <Avatar>
                <AvatarImage src={otherParticipant?.user.avatar} />
                <AvatarFallback>
                  {otherParticipant?.user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isOtherUserOnline && (
                <Circle className="absolute bottom-0 right-0 h-3 w-3 text-green-500 fill-current" />
              )}
            </div>
            
            <div>
              <h3 className="font-semibold">{otherParticipant?.user.name}</h3>
              <p className="text-sm text-gray-500">
                {isOtherUserOnline ? 'Đang hoạt động' : 'Không hoạt động'}
                {otherParticipant?.role === 'employer' && (
                  <Badge variant="secondary" className="ml-2">Nhà tuyển dụng</Badge>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-0 bg-gray-50">
        <div className="p-4 space-y-4">
          {messages.map((message, index) => {
            const isOwnMessage = message.sender._id === user._id;
            const showDate = index === 0 || 
              formatDate(messages[index - 1].createdAt) !== formatDate(message.createdAt);
            
            return (
              <div key={message._id}>
                {showDate && (
                  <div className="text-center my-4">
                    <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                )}
                
                <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                    isOwnMessage 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-900'
                  } rounded-lg px-4 py-2 shadow`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Typing indicator */}
          {typingUsers.length > 0 && (
            <div className="flex justify-start">
              <div className="bg-gray-200 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      {/* Message Input */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Button type="button" variant="ghost" size="icon">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Nhập tin nhắn..."
              disabled={!isConnected}
              className="border-0 bg-gray-100 focus:bg-white"
            />
          </div>
          
          <Button type="button" variant="ghost" size="icon">
            <Smile className="h-4 w-4" />
          </Button>
          
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || !isConnected}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow; 