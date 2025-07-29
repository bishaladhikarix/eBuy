import React, { useState, useContext, useCallback, useMemo } from 'react';
import ChatContext from './ChatContext';
import type { ChatContextType } from './ChatContext';
import type { 
  ChatRoom, 
  ChatMessage
} from '../../services/chatApi';
import { 
  createOrGetChatRoom,
  getUserChatRooms,
  getRoomMessages,
  sendMessage,
  markRoomAsRead,
  getUnreadCount
} from '../../services/chatApi';
import { getUserData } from '../../utils/auth';

interface ChatProviderProps {
  children: React.ReactNode;
}

const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Memoize currentUser to prevent unnecessary re-renders
  const currentUser = useMemo(() => getUserData(), []);

  const createOrGetRoom = useCallback(async (participantId: number): Promise<ChatRoom | null> => {
    try {
      setLoading(true);
      const room = await createOrGetChatRoom(participantId);
      
      // Add room to rooms list if not already present
      setRooms(prevRooms => {
        const existingRoom = prevRooms.find(r => r.id === room.id);
        if (existingRoom) {
          return prevRooms;
        }
        return [room, ...prevRooms];
      });
      
      return room;
    } catch (error) {
      console.error('Error creating/getting room:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUserRooms = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const userRooms = await getUserChatRooms();
      
      // Ensure userRooms is an array
      const roomsArray = Array.isArray(userRooms) ? userRooms : [];
      setRooms(roomsArray);
      
      // Update unread count
      const totalUnread = roomsArray.reduce((total, room) => total + room.unread_count, 0);
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error('Error loading user rooms:', error);
      // Set empty array on error
      setRooms([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRoomMessages = useCallback(async (roomId: string): Promise<void> => {
    try {
      setLoading(true);
      const roomMessages = await getRoomMessages(roomId);
      
      // Transform messages to include isOwn property
      const transformedMessages = roomMessages.map(message => ({
        ...message,
        isOwn: currentUser ? message.sender_id === currentUser.id : false
      }));
      
      setMessages(transformedMessages);
    } catch (error) {
      console.error('Error loading room messages:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const sendMessageToRoom = useCallback(async (roomId: string, content: string): Promise<void> => {
    try {
      const newMessage = await sendMessage(roomId, content);
      
      // Add message to current messages
      const transformedMessage = {
        ...newMessage,
        isOwn: currentUser ? newMessage.sender_id === currentUser.id : false
      };
      
      setMessages(prevMessages => [...prevMessages, transformedMessage]);
      
      // Update room's last message
      setRooms(prevRooms => {
        return prevRooms.map(room => {
          if (room.id === roomId) {
            return {
              ...room,
              last_message: newMessage.content,
              last_message_time: newMessage.created_at,
              updated_at: newMessage.created_at
            };
          }
          return room;
        }).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [currentUser]);

  const markAsRead = useCallback(async (roomId: string): Promise<void> => {
    try {
      await markRoomAsRead(roomId);
      
      // Update room's unread count
      setRooms(prevRooms => {
        return prevRooms.map(room => {
          if (room.id === roomId) {
            return { ...room, unread_count: 0 };
          }
          return room;
        });
      });
      
      // Update total unread count
      const newUnreadCount = await getUnreadCount();
      setUnreadCount(newUnreadCount);
      
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }, []);

  const contextValue: ChatContextType = {
    rooms,
    setRooms,
    selectedRoom,
    setSelectedRoom,
    messages,
    setMessages,
    loading,
    setLoading,
    unreadCount,
    setUnreadCount,
    createOrGetRoom,
    loadUserRooms,
    loadRoomMessages,
    sendMessageToRoom,
    markAsRead,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use chat context
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatProvider;
