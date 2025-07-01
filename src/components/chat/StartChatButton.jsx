import React, { useState } from 'react';
import { Button } from '../ui/button';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { chatAPI } from '../../lib/api';

const StartChatButton = ({ employerId, employerName, jobPostId, variant = "default", size = "default", className = "" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartChat = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is authenticated
      if (!user) {
        navigate('/login');
        return;
      }

      // Prevent chatting with yourself
      if (user._id === employerId || user.id === employerId) {
        alert('Bạn không thể nhắn tin với chính mình');
        return;
      }

      // Create or get existing chat
      const response = await chatAPI.getOrCreateChat(employerId);
      
      // Navigate to chat page with the chat selected
      navigate('/chat', { 
        state: { 
          selectedChatId: response.data.chat._id,
          jobPostId: jobPostId
        } 
      });
      
    } catch (error) {
      console.error('Failed to start chat:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        navigate('/login');
      } else if (error.response?.status === 404) {
        alert('Người dùng không tồn tại');
      } else {
        alert('Không thể bắt đầu cuộc trò chuyện. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleStartChat}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Đang tạo...
        </>
      ) : (
        <>
          <MessageCircle className="h-4 w-4 mr-2" />
          Nhắn tin
        </>
      )}
    </Button>
  );
};

export default StartChatButton; 