import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X } from 'lucide-react';
import { useChat } from '../../context/chatcontext/ChatProvider';
import useAuth from '../hooks/useAuth';
import './ChatUI.css';

interface LocationState {
  selectedRoomId?: string;
  otherUser?: {
    id: number;
    name: string;
    profileImage?: string;
  };
}

const ChatUI: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  
  const { user } = useAuth();
  
  // Add error handling for chat context
  let chatContextValue;
  try {
    chatContextValue = useChat();
  } catch (error) {
    console.error('Error accessing chat context:', error);
    return (
      <div className="chat-container">
        <div className="chat-content">
          <div className="chat-placeholder">
            <p>Chat functionality is temporarily unavailable</p>
            <p>Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  const {
    rooms,
    selectedRoom,
    setSelectedRoom,
    messages,
    loading,
    loadUserRooms,
    loadRoomMessages,
    sendMessageToRoom,
    markAsRead
  } = chatContextValue;

  const [showUserList, setShowUserList] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const handleMessageIconClick = () => {
    setShowUserList(!showUserList);
  };

  const handleUserSelect = useCallback(async (room: any) => {
    setSelectedRoom(room);
    setShowUserList(false);
    
    // Load messages for this room
    await loadRoomMessages(room.id);
    
    // Mark messages as read
    if (room.unread_count > 0) {
      await markAsRead(room.id);
    }
  }, [loadRoomMessages, markAsRead]);

  // Load user rooms on component mount
  useEffect(() => {
    if (user) {
      loadUserRooms();
    }
  }, [user]); // Removed loadUserRooms from dependencies since it's now memoized

  // Handle navigation from user profile
  useEffect(() => {
    if (state?.selectedRoomId && rooms.length > 0) {
      const room = rooms.find(r => r.id === state.selectedRoomId);
      if (room) {
        handleUserSelect(room);
      }
    }
  }, [state?.selectedRoomId, rooms, handleUserSelect]); // Now we can safely include handleUserSelect

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;

    try {
      await sendMessageToRoom(selectedRoom.id, newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  if (!user) {
    return (
      <div className="chat-container">
        <div className="chat-content">
          <div className="chat-placeholder">
            <p>Please log in to access chat functionality</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="user-name-display">
          {selectedRoom ? selectedRoom.other_user_name || 'Chat User' : 'Messages'}
        </div>
        <button 
          className="message-icon-btn"
          onClick={handleMessageIconClick}
          aria-label="Open messages"
        >
          <MessageCircle size={24} />
        </button>
      </div>

      <div className="chat-content">
        {selectedRoom ? (
          <div className="chat-messages">
            <div className="chat-messages-header">
              <h3>{selectedRoom.other_user_name || 'Chat User'}</h3>
              <button 
                className="close-chat-btn"
                onClick={() => setSelectedRoom(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="messages-list">
              {loading ? (
                <div className="loading-messages">Loading messages...</div>
              ) : (
                messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`message ${message.isOwn ? 'own-message' : 'other-message'}`}
                  >
                    <div className="message-content">
                      {message.content}
                    </div>
                    <div className="message-timestamp">
                      {formatTimestamp(message.created_at)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="chat-placeholder">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>

      <div className="chat-input-section">
        <input
          type="text"
          placeholder="Chat"
          className="chat-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!selectedRoom}
        />
        <button 
          className="send-button"
          onClick={handleSendMessage}
          disabled={!selectedRoom || !newMessage.trim()}
        >
          Send
        </button>
      </div>

      {/* User List Modal */}
      {showUserList && (
        <div className="user-list-overlay">
          <div className="user-list-modal">
            <div className="user-list-header">
              <h3>Messages</h3>
              <button 
                className="close-modal-btn"
                onClick={() => setShowUserList(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="user-list">
              {loading ? (
                <div className="loading-rooms">Loading conversations...</div>
              ) : rooms.length === 0 ? (
                <div className="no-conversations">
                  <p>No conversations yet</p>
                  <p>Start a chat from a user's profile</p>
                </div>
              ) : (
                rooms.map((room) => (
                  <div 
                    key={room.id} 
                    className="user-item"
                    onClick={() => handleUserSelect(room)}
                  >
                    <div className="user-avatar">
                      {room.other_user_image ? (
                        <img 
                          src={`http://localhost:5000${room.other_user_image}`} 
                          alt={room.other_user_name || 'User'}
                          className="avatar-image"
                        />
                      ) : (
                        <span>{(room.other_user_name || 'U').charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="user-info">
                      <div className="user-name">
                        {room.other_user_name || 'Chat User'}
                      </div>
                      <div className="user-last-message">
                        {room.last_message || 'No messages yet'}
                      </div>
                    </div>
                    <div className="user-meta">
                      <div className="user-timestamp">
                        {room.last_message_time ? formatLastMessageTime(room.last_message_time) : ''}
                      </div>
                      {room.unread_count > 0 && (
                        <div className="unread-badge">{room.unread_count}</div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatUI;
