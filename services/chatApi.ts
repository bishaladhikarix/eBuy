import { getToken } from '../utils/auth';

export interface ChatRoom {
  id: string;
  user1_id: number;
  user2_id: number;
  created_at: string;
  updated_at: string;
  other_user_name: string;
  other_user_id: number;
  other_user_image?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: number;
  content: string;
  message_type: string;
  created_at: string;
  is_read: boolean;
  sender_name: string;
  sender_image?: string;
  isOwn?: boolean; // This will be added by frontend
}

export interface CreateRoomRequest {
  participantId: number;
}

export interface SendMessageRequest {
  content: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get headers with auth token
const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Create or get existing chat room with a user
export const createOrGetChatRoom = async (participantId: number): Promise<ChatRoom> => {
  const response = await fetch(`${API_BASE_URL}/chat/rooms`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ otherUserId: participantId }), // Changed from participantId to otherUserId
  });

  if (!response.ok) {
    throw new Error('Failed to create or get chat room');
  }

  const result = await response.json();
  return result.data.room; // Changed from result.data to result.data.room
};

// Get all user's chat rooms
export const getUserChatRooms = async (): Promise<ChatRoom[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/rooms`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      // If it's a 404 or similar, return empty array instead of throwing
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Failed to fetch chat rooms: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    // Ensure we return an array even if the API response is unexpected
    if (result.success === false) {
      console.warn('API returned error:', result.message);
      return [];
    }
    
    // Backend returns { success: true, data: { rooms } }
    const rooms = Array.isArray(result.data?.rooms) ? result.data.rooms : [];
    return rooms;
  } catch (error) {
    console.error('Error in getUserChatRooms:', error);
    // Return empty array instead of throwing to prevent app crashes
    return [];
  }
};

// Get messages for a specific room
export const getRoomMessages = async (roomId: string): Promise<ChatMessage[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/rooms/${roomId}/messages`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.success === false) {
      console.warn('API returned error:', result.message);
      return [];
    }
    
    // Backend returns { success: true, data: { messages } }
    return Array.isArray(result.data?.messages) ? result.data.messages : [];
  } catch (error) {
    console.error('Error in getRoomMessages:', error);
    return [];
  }
};

// Send a message to a room
export const sendMessage = async (roomId: string, content: string): Promise<ChatMessage> => {
  const response = await fetch(`${API_BASE_URL}/chat/rooms/${roomId}/messages`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  const result = await response.json();
  return result.data.message; // Changed from result.data to result.data.message
};

// Mark messages as read in a room
export const markRoomAsRead = async (roomId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/chat/rooms/${roomId}/read`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to mark room as read');
  }
};

// Get total unread count
export const getUnreadCount = async (): Promise<number> => {
  const response = await fetch(`${API_BASE_URL}/chat/unread-count`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to get unread count');
  }

  const result = await response.json();
  return result.data.unreadCount || 0; // Changed from result.data.count to result.data.unreadCount
};

// Delete a message
export const deleteMessage = async (messageId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/chat/messages/${messageId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete message');
  }
};
