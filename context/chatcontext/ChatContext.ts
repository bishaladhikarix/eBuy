import { createContext } from 'react';
import type { ChatRoom, ChatMessage } from '../../services/chatApi';

export interface ChatContextType {
  rooms: ChatRoom[];
  setRooms: (rooms: ChatRoom[]) => void;
  selectedRoom: ChatRoom | null;
  setSelectedRoom: (room: ChatRoom | null) => void;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  // Methods
  createOrGetRoom: (participantId: number) => Promise<ChatRoom | null>;
  loadUserRooms: () => Promise<void>;
  loadRoomMessages: (roomId: string) => Promise<void>;
  sendMessageToRoom: (roomId: string, content: string) => Promise<void>;
  markAsRead: (roomId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export default ChatContext;
