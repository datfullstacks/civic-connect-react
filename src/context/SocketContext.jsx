import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { user, token } = useAuth();
    const reconnectTimeoutRef = useRef(null);

    // Initialize socket connection
    useEffect(() => {
        if (user && token) {
            const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
                auth: {
                    token: token
                },
                withCredentials: true,
                forceNew: true
            });

            // Connection event handlers
            newSocket.on('connect', () => {
                console.log('Connected to server:', newSocket.id);
                setIsConnected(true);
                
                // Get online users when connected
                newSocket.emit('get_online_users');
            });

            newSocket.on('disconnect', (reason) => {
                console.log('Disconnected from server:', reason);
                setIsConnected(false);
                
                // Auto-reconnect on unexpected disconnection
                if (reason === 'io server disconnect') {
                    // Server initiated disconnect, don't reconnect
                    return;
                }
                
                // Client-side reconnection logic
                reconnectTimeoutRef.current = setTimeout(() => {
                    if (!newSocket.connected) {
                        newSocket.connect();
                    }
                }, 5000);
            });

            newSocket.on('connect_error', (error) => {
                console.error('Connection error:', error);
                setIsConnected(false);
            });

            // Online/offline status handlers
            newSocket.on('online_users', (users) => {
                setOnlineUsers(users);
            });

            newSocket.on('user_online', (userData) => {
                setOnlineUsers(prev => {
                    const filtered = prev.filter(u => u.userId !== userData.userId);
                    return [...filtered, userData];
                });
            });

            newSocket.on('user_offline', (userData) => {
                setOnlineUsers(prev => 
                    prev.filter(u => u.userId !== userData.userId)
                );
            });

            setSocket(newSocket);

            return () => {
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                }
                newSocket.close();
            };
        } else {
            // User logged out, disconnect socket
            if (socket) {
                socket.close();
                setSocket(null);
                setIsConnected(false);
                setOnlineUsers([]);
            }
        }
    }, [user, token]);

    // Socket utility functions
    const joinChat = (chatId) => {
        if (socket && isConnected) {
            socket.emit('join_chat', chatId);
        }
    };

    const leaveChat = (chatId) => {
        if (socket && isConnected) {
            socket.emit('leave_chat', chatId);
        }
    };

    const sendMessage = (chatId, content, messageType = 'text') => {
        if (socket && isConnected) {
            socket.emit('send_message', {
                chatId,
                content,
                messageType
            });
        }
    };

    const startTyping = (chatId) => {
        if (socket && isConnected) {
            socket.emit('typing_start', { chatId });
        }
    };

    const stopTyping = (chatId) => {
        if (socket && isConnected) {
            socket.emit('typing_stop', { chatId });
        }
    };

    const markMessagesRead = (chatId) => {
        if (socket && isConnected) {
            socket.emit('mark_messages_read', { chatId });
        }
    };

    const value = {
        socket,
        isConnected,
        onlineUsers,
        joinChat,
        leaveChat,
        sendMessage,
        startTyping,
        stopTyping,
        markMessagesRead
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}; 