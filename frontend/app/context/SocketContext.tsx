'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import io from 'socket.io-client';
type ClientSocket = ReturnType<typeof io>;
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'hired' | 'rejected' | 'new_bid' | 'message';
  message: string;
  gigId?: string;
  bidId?: string;
  timestamp: Date;
  read: boolean;
  freelancerName?: string;
  bidAmount?: number;
}

interface SocketContextType {
  socket: ClientSocket | null;
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  clearAllNotifications: () => void;
  connectToUserRoom: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<ClientSocket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!socket) {
      const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001';

      const newSocket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity,
      } as any);
      
      setSocket(newSocket);

      // Handle connection events
      newSocket.on('connect', () => {
        console.log('✅ Socket connected:', newSocket.id);
        // Rejoin user room if authenticated
        if (user && isAuthenticated) {
          newSocket.emit('join-user-room', user._id);
        }
      });

      newSocket.on('disconnect', (reason) => {
        console.log('⚠️ Socket disconnected:', reason);
      });

      newSocket.on('reconnect', (attemptNumber) => {
        console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
        // Rejoin user room after reconnection
        if (user && isAuthenticated) {
          newSocket.emit('join-user-room', user._id);
        }
      });

      newSocket.on('connect_error', (error: unknown) => {
        console.error('❌ Socket connection error:', error);
      });

      return () => {
        console.log('🔌 Disconnecting socket');
        newSocket.disconnect();
      };
    }
  }, []);

  // Join user room when authenticated
  useEffect(() => {
    if (socket && user && isAuthenticated) {
      socket.emit('join-user-room', user._id);
      console.log('Joined user room:', user._id);
    }
  }, [socket, user, isAuthenticated]);

  // Listen for notifications
  useEffect(() => {
    if (socket) {
      const handleNotification = (data: any) => {
        // Generate unique ID using timestamp and random number to avoid duplicates
        const notificationId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const newNotification: Notification = {
          id: notificationId,
          type: data.type || 'info',
          message: data.message,
          gigId: data.gigId,
          bidId: data.bidId,
          timestamp: new Date(data.timestamp || Date.now()),
          read: false,
          freelancerName: data.freelancerName,
          bidAmount: data.bidAmount,
        };

        console.log('🔔 Received notification:', newNotification);

        // Add notification to state (prevent duplicates by checking message + timestamp)
        setNotifications(prev => {
          // Check if notification already exists (prevent duplicates)
          const exists = prev.some(n => 
            n.message === newNotification.message && 
            Math.abs(n.timestamp.getTime() - newNotification.timestamp.getTime()) < 1000
          );
          if (exists) {
            console.log('⚠️ Duplicate notification ignored');
            return prev;
          }
          return [newNotification, ...prev];
        });

        // Show toast based on notification type
        switch (data.type) {
          case 'hired':
            toast.success(data.message, {
              duration: 6000,
              icon: '🎉',
              style: {
                background: '#10b981',
                color: '#fff',
                fontWeight: 'bold',
              },
            });
            break;
          case 'rejected':
            toast.error(data.message, {
              duration: 5000,
              icon: '❌',
            });
            break;
          case 'new_bid':
            toast.success(data.message, {
              duration: 5000,
              icon: '💰',
              style: {
                background: '#3b82f6',
                color: '#fff',
                fontWeight: 'bold',
              },
            });
            break;
          default:
            toast(data.message, {
              icon: '🔔',
              duration: 4000,
            });
        }
      };

      socket.on('notification', handleNotification);

      return () => {
        socket.off('notification', handleNotification);
      };
    }
  }, [socket]);

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const connectToUserRoom = () => {
    if (socket && user) {
      socket.emit('join-user-room', user._id);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    socket,
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    clearAllNotifications,
    connectToUserRoom,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};