import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
  Search, 
  Plus, 
  MessageCircle,
  Circle,
  MoreVertical
} from 'lucide-react';
import { chatAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import ChatPopup from './ChatPopup';

const ChatList = ({ onChatSelect, selectedChatId }) => {
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [popupChat, setPopupChat] = useState(null); // {user, chatId}
  
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    loadChats();
    loadUnreadCount();
  }, []);

  // Socket listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data) => {
      // Update last message in chat list
      setChats(prev => prev.map(chat => {
        if (chat._id === data.message.chat) {
          return {
            ...chat,
            lastMessage: data.message,
            lastActivity: data.message.createdAt
          };
        }
        return chat;
      }));
      
      // Update unread count if not current chat
      if (data.message.chat !== selectedChatId && data.message.sender._id !== user._id) {
        setUnreadCount(prev => prev + 1);
      }
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, selectedChatId, user._id]);

  const loadChats = async () => {
    try {
      setIsLoading(true);
      const response = await chatAPI.getUserChats();
      setChats(response.data.chats);
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await chatAPI.getUnreadCount();
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const handleChatSelect = (chat) => {
    // Mở popup chat nhỏ thay vì chỉ chọn chat lớn
    const otherParticipant = getOtherParticipant(chat);
    setPopupChat({ user: otherParticipant.user, chatId: chat._id });
    if (onChatSelect) onChatSelect(chat);
    if (chat._id !== selectedChatId) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const closePopup = () => setPopupChat(null);

  const formatLastMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Vừa xong';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString('vi-VN', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getOtherParticipant = (chat) => {
    return chat.participants.find(p => p.user._id !== user._id);
  };

  const isUserOnline = (userId) => {
    return onlineUsers.some(u => u.userId === userId);
  };

  const filteredChats = chats.filter(chat => {
    const otherParticipant = getOtherParticipant(chat);
    return otherParticipant?.user.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Tin nhắn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Tin nhắn
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <Button size="icon" variant="ghost">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm cuộc trò chuyện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có cuộc trò chuyện nào</p>
              </div>
            ) : (
              filteredChats.map((chat) => {
                const otherParticipant = getOtherParticipant(chat);
                const isOnline = isUserOnline(otherParticipant?.user._id);
                const isSelected = chat._id === selectedChatId;
                
                return (
                  <div
                    key={chat._id}
                    onClick={() => handleChatSelect(chat)}
                    className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${
                      isSelected ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="relative mr-3">
                      <Avatar>
                        <AvatarImage src={otherParticipant?.user.avatar} />
                        <AvatarFallback>
                          {otherParticipant?.user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isOnline && (
                        <Circle className="absolute bottom-0 right-0 h-3 w-3 text-green-500 fill-current" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 truncate">
                          {otherParticipant?.user.name}
                        </h4>
                        <span className="text-xs text-gray-500 ml-2">
                          {chat.lastMessage && formatLastMessageTime(chat.lastMessage.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-600 truncate">
                          {chat.lastMessage ? (
                            <>
                              {chat.lastMessage.sender._id === user._id && 'Bạn: '}
                              {chat.lastMessage.content}
                            </>
                          ) : (
                            'Chưa có tin nhắn'
                          )}
                        </p>
                        
                        <div className="flex items-center gap-1 ml-2">
                          {otherParticipant?.role === 'employer' && (
                            <Badge variant="secondary" className="text-xs">
                              NTD
                            </Badge>
                          )}
                          
                          {/* Unread indicator */}
                          {chat.lastMessage && 
                           chat.lastMessage.sender._id !== user._id && 
                           !chat.lastMessage.readBy?.some(r => r.user === user._id) && (
                            <Circle className="h-2 w-2 text-blue-600 fill-current" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
      {popupChat && (
        <ChatPopup user={popupChat.user} chatId={popupChat.chatId} onClose={closePopup} />
      )}
    </>
  );
};

export default ChatList; 