# Chat Functionality Implementation

This document explains the chat functionality that has been implemented in the eBuy project.

## Features Implemented

1. **User-to-User Chat**: Users can start conversations with other users by clicking the "Chat" button on their profile pages.

2. **Real-time Messaging**: Messages are sent and received through the backend API integration.

3. **Chat Rooms**: Conversations are organized into rooms, with each room representing a conversation between two users.

4. **Message History**: All previous messages in a conversation are loaded when opening a chat.

5. **Unread Message Count**: Users can see how many unread messages they have from each conversation.

6. **Read Receipts**: Messages are marked as read when the user opens the conversation.

## How It Works

### Starting a Chat

1. Navigate to any user's profile (`/userprofile/:userId`)
2. Click the "Chat" button
3. If you're logged in, a new chat room will be created (or an existing one will be opened)
4. You'll be redirected to the `/message` route with the conversation active

### Using the Chat Interface

1. **Message List**: Click the message icon in the header to see all your conversations
2. **Send Messages**: Type in the input field and press Enter or click "Send"
3. **View History**: Previous messages are automatically loaded when opening a conversation
4. **Read Status**: Opening a conversation marks all messages as read

## Files Added/Modified

### New Files Created:

1. **`services/chatApi.ts`**: Contains all API functions for chat functionality
   - `createOrGetChatRoom()`: Create or get existing chat room
   - `getUserChatRooms()`: Get all user's chat rooms
   - `getRoomMessages()`: Get messages for a specific room
   - `sendMessage()`: Send a message to a room
   - `markRoomAsRead()`: Mark messages as read
   - `getUnreadCount()`: Get total unread count

2. **`context/chatcontext/ChatContext.ts`**: Chat context type definitions

3. **`context/chatcontext/ChatProvider.tsx`**: Chat context provider with state management

### Modified Files:

1. **`src/main.tsx`**: Added ChatProvider to the component tree

2. **`components/userView/Userprofile.tsx`**: 
   - Added chat functionality to the "Chat" button
   - Integrated with chat context
   - Added loading states and error handling

3. **`components/message/ChatUI.tsx`**: 
   - Completely rewritten to use real backend integration
   - Added support for navigation state from user profiles
   - Integrated with chat context for state management

4. **`components/message/ChatUI.css`**: 
   - Added styling for new UI elements
   - Added loading states and avatar support

## Backend API Integration

The frontend integrates with your backend chat routes:

- `POST /api/chat/rooms` - Create or get chat room
- `GET /api/chat/rooms` - Get user's chat rooms
- `GET /api/chat/rooms/:roomId/messages` - Get room messages
- `POST /api/chat/rooms/:roomId/messages` - Send message
- `PATCH /api/chat/rooms/:roomId/read` - Mark as read
- `GET /api/chat/unread-count` - Get unread count

## Usage Example

```typescript
// To start a chat from anywhere in the app:
import { useChat } from '../context/chatcontext/ChatProvider';

const { createOrGetRoom } = useChat();

const handleStartChat = async (userId: number) => {
  const room = await createOrGetRoom(userId);
  if (room) {
    // Navigate to chat or handle room creation
    navigate('/message', { state: { selectedRoomId: room.id } });
  }
};
```

## Authentication Requirements

- Users must be logged in to access chat functionality
- Authentication token is automatically included in API requests
- Non-authenticated users will see a login prompt

## Error Handling

- Network errors are caught and displayed to users
- Loading states are shown during API operations
- Failed operations show user-friendly error messages

## Future Enhancements

1. **Real-time Updates**: Add WebSocket integration for real-time message updates
2. **Message Status**: Add delivery and read status indicators
3. **File Sharing**: Add support for image/file attachments
4. **Search**: Add search functionality for messages and users
5. **Notifications**: Add browser notifications for new messages
6. **Group Chats**: Extend to support multi-user conversations

## Testing

To test the chat functionality:

1. Make sure your backend is running on `http://localhost:5000`
2. Log in with a user account
3. Navigate to another user's profile
4. Click the "Chat" button
5. Send and receive messages
6. Check the `/message` route for the full chat interface

The implementation is designed to be extensible and follows React best practices with proper state management, error handling, and TypeScript support.
