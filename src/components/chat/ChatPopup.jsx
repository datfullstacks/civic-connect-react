import React, { useEffect, useRef, useState } from 'react';
import { X, Check, CheckCheck } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { chatAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { createPortal } from 'react-dom';

export default function ChatPopup({ user, chatId, onClose }) {
  const { user: currentUser } = useAuth();
  const { socket, sendMessage, joinChat, leaveChat, markMessagesRead } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatId) {
      joinChat(chatId);
      loadMessages();
      // Mark messages as read when opening chat
      markMessagesRead(chatId);
    }
    return () => {
      if (chatId) leaveChat(chatId);
    };
    // eslint-disable-next-line
  }, [chatId]);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (data) => {
      if (data.message.chat === chatId) {
        setMessages((prev) => [...prev, data.message]);
        scrollToBottom();
        // Mark as read if chat is open
        markMessagesRead(chatId);
      }
    };

    const handleMessagesRead = (data) => {
      if (data.chatId === chatId) {
        // Update messages to show as read
        setMessages(prev => prev.map(msg => {
          if (msg.sender._id === currentUser._id && !msg.readBy?.some(r => r.user === data.userId)) {
            return {
              ...msg,
              readBy: [...(msg.readBy || []), { user: data.userId, readAt: data.readAt }]
            };
          }
          return msg;
        }));
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('messages_read', handleMessagesRead);
    
    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('messages_read', handleMessagesRead);
    };
  }, [socket, chatId, currentUser._id, markMessagesRead]);

  const loadMessages = async () => {
    try {
      const res = await chatAPI.getChatMessages(chatId);
      setMessages(res.data.messages);
      scrollToBottom();
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessage(chatId, newMessage.trim());
    setNewMessage('');
  };

  const getMessageStatus = (msg) => {
    const isRead = msg.readBy?.some(r => r.user !== currentUser._id);
    const isDelivered = msg._id; // If message has ID, it's delivered
    
    if (isRead) {
      return <CheckCheck size={12} className="text-blue-200" />;
    } else if (isDelivered) {
      return <Check size={12} className="text-blue-200" />;
    } else {
      return <div className="w-2 h-2 bg-blue-200 rounded-full animate-pulse" />;
    }
  };

  return createPortal(
    <div className={`fixed bottom-0 right-4 w-80 max-w-[calc(100vw-32px)] ${
      isMinimized ? 'h-14' : 'h-[500px]'
    } max-h-[calc(100vh-32px)] bg-white shadow-2xl rounded-tl-lg flex flex-col z-[9999] border border-gray-200 transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-blue-600 to-blue-700 rounded-tl-lg shrink-0">
        <div 
          className="flex items-center gap-2 min-w-0 cursor-pointer"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <img 
            src={user.avatar || '/default-avatar.png'} 
            alt="avatar" 
            className="w-8 h-8 rounded-full border-2 border-white/20 shrink-0" 
          />
          <div className="min-w-0">
            <div className="text-white font-semibold text-sm truncate">{user.name}</div>
            {!isMinimized && (
              <div className="text-white/80 text-xs">
                {user.role === 'employer' ? 'Nhà tuyển dụng' : 'Ứng viên'}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-white/10 transition-colors shrink-0"
            title={isMinimized ? "Mở rộng" : "Thu nhỏ"}
          >
            {isMinimized ? "▲" : "▼"}
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-white/10 transition-colors shrink-0"
            title="Đóng"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50 min-h-0">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <div className="text-sm">Bắt đầu cuộc trò chuyện với {user.name}</div>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg._id} className={`flex mb-2 ${msg.sender._id === currentUser._id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] px-3 py-2 rounded-xl ${
                    msg.sender._id === currentUser._id 
                      ? 'bg-blue-600 text-white rounded-br-md' 
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                  }`}>
                    <div className="text-sm leading-relaxed break-words">{msg.content}</div>
                    <div className={`text-xs mt-1 flex items-center justify-between ${
                      msg.sender._id === currentUser._id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      {msg.sender._id === currentUser._id && (
                        <div className="flex items-center gap-1 ml-2">
                          {getMessageStatus(msg)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Input */}
          <form onSubmit={handleSend} className="p-3 border-t bg-white shrink-0">
            <div className="flex gap-2">
              <input
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0"
                placeholder="Nhập tin nhắn..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                autoComplete="off"
              />
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 shrink-0"
                disabled={!newMessage.trim()}
              >
                Gửi
              </button>
            </div>
          </form>
        </>
      )}
    </div>,
    document.body
  );
} 