import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Bell, 
  User, 
  Menu, 
  X, 
  Home, 
  Users, 
  Briefcase, 
  Calendar,
  MessageCircle,
  Settings,
  LogOut
} from 'lucide-react';
import { employerAPI, chatAPI } from '../lib/api';
import ChatPopup from './chat/ChatPopup';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    // { name: 'Chat', href: '/chat', icon: MessageCircle }, // Temporarily disabled
    { name: 'Events', href: '/events', icon: Calendar },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CivicConnect
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search communities, jobs, events..."
                className="pl-10 pr-4 w-full bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          </div>

          {/* Right side - Notifications & Profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>

            {/* Chat Dropdown */}
            <ChatDropdown />

            {/* Profile Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {user?.name || 'User'}
                </span>
              </Button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User className="mr-3 h-4 w-4" />
                      Profile
                    </Link>
                    <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings className="mr-3 h-4 w-4" />
                      Settings
                    </Link>
                    <hr className="my-1" />
                    <button 
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 w-full bg-gray-50 border-gray-200"
                  />
                </div>
              </div>
              
              {/* Mobile Navigation Links */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center gap-3 text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function ChatDropdown() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [popupChat, setPopupChat] = useState(null);
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (open) {
      if (user?.role === 'employer') {
        // Employer: Load accepted applicants
        employerAPI.getAcceptedApplicants().then(res => {
          setUsers(res.data.users);
        });
      } else if (user?.role === 'user') {
        // User: Load existing chats (which means they can chat with these employers)
        chatAPI.getUserChats().then(res => {
          setChats(res.data.chats);
        });
      }
    }
  }, [user, open]);

  // Load unread count on component mount and periodically
  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const response = await chatAPI.getUnreadCount();
        setUnreadCount(response.data.unreadCount);
      } catch (error) {
        console.error('Failed to load unread count:', error);
      }
    };

    loadUnreadCount();
    // Poll for unread count every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleOpenChat = async (targetUser, existingChatId = null) => {
    try {
      if (existingChatId) {
        // Use existing chat
        setPopupChat({ user: targetUser, chatId: existingChatId });
      } else {
        // Create or get chat
        const res = await chatAPI.getOrCreateChat(targetUser._id);
        setPopupChat({ user: targetUser, chatId: res.data.chat._id });
      }
      setOpen(false); // Close dropdown
      
      // Reduce unread count when opening chat
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Chat error:', error);
      alert('Không thể mở chat với user này!');
    }
  };

  const getOtherParticipant = (chat) => {
    return chat.participants.find(p => p.user._id !== user._id);
  };

  const handleClosePopup = () => {
    setPopupChat(null);
    // Reload unread count when closing popup
    chatAPI.getUnreadCount().then(response => {
      setUnreadCount(response.data.unreadCount);
    }).catch(error => {
      console.error('Failed to reload unread count:', error);
    });
  };

  return (
    <div className="relative">
      <button className="relative" onClick={() => setOpen(v => !v)}>
        <MessageCircle className="h-6 w-6 text-blue-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded z-50 border">
          <div className="p-2 font-bold border-b">
            {user?.role === 'employer' ? 'Ứng viên có thể chat' : 'Cuộc trò chuyện'}
            {unreadCount > 0 && (
              <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                {unreadCount} chưa đọc
              </span>
            )}
          </div>
          
          {user?.role === 'employer' ? (
            // Employer view: Show accepted applicants
            users.length === 0 ? (
              <div className="p-2 text-gray-500">Chưa có ứng viên nào được accept</div>
            ) : (
              users.map(u => (
                <div
                  key={u._id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleOpenChat(u)}
                >
                  <img src={u.avatar || '/default-avatar.png'} className="w-8 h-8 rounded-full" alt="" />
                  <div>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </div>
                </div>
              ))
            )
          ) : (
            // User view: Show existing chats with employers
            chats.length === 0 ? (
              <div className="p-2 text-gray-500">Chưa có cuộc trò chuyện nào</div>
            ) : (
              chats.map(chat => {
                const otherParticipant = getOtherParticipant(chat);
                const hasUnread = chat.lastMessage && 
                  chat.lastMessage.sender._id !== user._id && 
                  !chat.lastMessage.readBy?.some(r => r.user === user._id);
                
                return (
                  <div
                    key={chat._id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer relative"
                    onClick={() => handleOpenChat(otherParticipant.user, chat._id)}
                  >
                    <img 
                      src={otherParticipant.user.avatar || '/default-avatar.png'} 
                      className="w-8 h-8 rounded-full" 
                      alt="" 
                    />
                    <div className="flex-1">
                      <div className="font-medium">{otherParticipant.user.name}</div>
                      <div className={`text-xs ${hasUnread ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                        {chat.lastMessage ? (
                          <>
                            {chat.lastMessage.sender._id === user._id && 'Bạn: '}
                            {chat.lastMessage.content}
                          </>
                        ) : (
                          'Chưa có tin nhắn'
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {otherParticipant.role === 'employer' && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                          NTD
                        </span>
                      )}
                      {hasUnread && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
      )}
      {popupChat && (
        <ChatPopup user={popupChat.user} chatId={popupChat.chatId} onClose={handleClosePopup} />
      )}
    </div>
  );
} 