import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import './ChatUI.css';

interface User {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar?: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

// Dummy data - Replace with actual API calls
const dummyUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    lastMessage: 'Hey, how are you doing?',
    timestamp: '2 min ago',
    unreadCount: 2
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    lastMessage: 'Thanks for the help!',
    timestamp: '1 hour ago',
    unreadCount: 0
  },
  {
    id: '3',
    name: 'Mike Wilson',
    lastMessage: 'See you tomorrow',
    timestamp: '3 hours ago',
    unreadCount: 1
  },
  {
    id: '4',
    name: 'Emily Davis',
    lastMessage: 'The project looks great',
    timestamp: '1 day ago',
    unreadCount: 0
  },
  {
    id: '5',
    name: 'Alex Brown',
    lastMessage: 'Let me know when you\'re free',
    timestamp: '2 days ago',
    unreadCount: 3
  },
  {
    id: '4',
    name: 'Emily Davis',
    lastMessage: 'The project looks great',
    timestamp: '1 day ago',
    unreadCount: 0
  },
  {
    id: '5',
    name: 'Alex Brown',
    lastMessage: 'Let me know when you\'re free',
    timestamp: '2 days ago',
    unreadCount: 3
  }
];

const dummyMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    content: 'Hello there!',
    timestamp: '10:30 AM',
    isOwn: false
  },
  {
    id: '2',
    senderId: 'current-user',
    content: 'Hi! How can I help you?',
    timestamp: '10:32 AM',
    isOwn: true
  },
  {
    id: '3',
    senderId: '1',
    content: 'I wanted to ask about the project timeline',
    timestamp: '10:35 AM',
    isOwn: false
  }
];

const ChatUI: React.FC = () => {
  const [showUserList, setShowUserList] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState<User[]>(dummyUsers);

  // Backend Integration Comments:
  // 1. Replace dummyUsers with API call: fetchUserConversations()
  // 2. Replace dummyMessages with API call: fetchMessages(userId)
  // 3. Implement real-time messaging with WebSocket or Socket.io
  // 4. Add user authentication and current user context
  // 5. Implement message sending with API: sendMessage(userId, content)
  // 6. Add message status indicators (sent, delivered, read)
  // 7. Implement user search and new conversation creation
  
  // NEW USER CONVERSATION INTEGRATION:
  // To start a conversation with a new user (not in the current user list):
  // 
  // Option 1: Add a search functionality in the user list modal
  // - Add a search input at the top of the user list modal
  // - Implement searchUsers(query) API call to find users by name/email
  // - Display search results and allow clicking to start new conversation
  // - API call: startNewConversation(userId) - creates new conversation thread
  // 
  // Option 2: Add a "New Chat" button
  // - Add a "+" or "New Chat" button in the user list header
  // - Open a separate modal/screen to search and select users
  // - API call: getAllUsers() or searchUsers(query) to find available users
  // - Filter out users already in conversation list
  // 
  // Option 3: Integration with contact list
  // - Import contacts from phone/email
  // - API call: getContacts() to fetch user's contact list
  // - Show contacts not yet in conversation list
  // 
  // Implementation example for search:
  // const handleSearchUsers = async (query: string) => {
  //   const searchResults = await searchUsers(query);
  //   // Display results and allow selection
  // };
  // 
  // const handleStartNewConversation = async (userId: string) => {
  //   const newConversation = await startNewConversation(userId);
  //   setUsers([newConversation, ...users]); // Add to top of list
  //   setSelectedUser(newConversation);
  //   setShowUserList(false);
  // };

  const handleMessageIconClick = () => {
    setShowUserList(!showUserList);
    // Backend call: fetchUserConversations()
    // This should fetch the list of users sorted by last interaction
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setShowUserList(false);
    // Backend call: fetchMessages(user.id)
    // This should load the conversation history with the selected user
    
    // Mark messages as read
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, unreadCount: 0 } : u
    );
    setUsers(updatedUsers);
    // Backend call: markMessagesAsRead(user.id)
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'current-user',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Update user's last message and move to top
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, lastMessage: newMessage, timestamp: 'now' }
        : user
    );
    
    // Sort users by last interaction (most recent first)
    updatedUsers.sort((a, b) => {
      if (a.id === selectedUser.id) return -1;
      if (b.id === selectedUser.id) return 1;
      return 0;
    });
    
    setUsers(updatedUsers);

    // Backend call: sendMessage(selectedUser.id, newMessage)
    // This should send the message to the server and update the database
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="user-name-display">
          {selectedUser ? selectedUser.name : 'Full Name'}
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
        {selectedUser ? (
          <div className="chat-messages">
            <div className="chat-messages-header">
              <h3>{selectedUser.name}</h3>
              <button 
                className="close-chat-btn"
                onClick={() => setSelectedUser(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="messages-list">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`message ${message.isOwn ? 'own-message' : 'other-message'}`}
                >
                  <div className="message-content">
                    {message.content}
                  </div>
                  <div className="message-timestamp">
                    {message.timestamp}
                  </div>
                </div>
              ))}
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
          disabled={!selectedUser}
        />
        <button 
          className="send-button"
          onClick={handleSendMessage}
          disabled={!selectedUser || !newMessage.trim()}
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
              {users.map((user) => (
                <div 
                  key={user.id} 
                  className="user-item"
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-last-message">{user.lastMessage}</div>
                  </div>
                  <div className="user-meta">
                    <div className="user-timestamp">{user.timestamp}</div>
                    {user.unreadCount > 0 && (
                      <div className="unread-badge">{user.unreadCount}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatUI;