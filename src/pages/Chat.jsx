import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';
import { Card, CardContent } from '../components/ui/card';
import { MessageCircle } from 'lucide-react';
import { chatAPI } from '../lib/api';

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const location = useLocation();

  // Handle navigation from other pages with selectedChatId
  useEffect(() => {
    const loadChatFromNavigation = async () => {
      if (location.state?.selectedChatId) {
        try {
          // For now, we'll let the ChatList component handle the selection
          // This could be improved by directly loading the chat data
          setShowChatWindow(true);
        } catch (error) {
          console.error('Failed to load chat from navigation:', error);
        }
      }
    };

    loadChatFromNavigation();
  }, [location.state]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowChatWindow(true);
  };

  const handleBackToList = () => {
    setShowChatWindow(false);
    setSelectedChat(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
          {/* Chat List - Hidden on mobile when chat is selected */}
          <div className={`lg:col-span-1 ${showChatWindow ? 'hidden lg:block' : 'block'}`}>
            <ChatList 
              onChatSelect={handleChatSelect}
              selectedChatId={selectedChat?._id}
            />
          </div>

          {/* Chat Window */}
          <div className={`lg:col-span-2 ${showChatWindow ? 'block' : 'hidden lg:block'}`}>
            {selectedChat ? (
              <Card className="h-full">
                <ChatWindow 
                  chat={selectedChat} 
                  onBack={handleBackToList}
                />
              </Card>
            ) : (
              <Card className="h-full">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Chọn một cuộc trò chuyện</h3>
                    <p className="text-sm">
                      Chọn cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 