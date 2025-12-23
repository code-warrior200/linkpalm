import { create } from 'zustand';
import { Message, Conversation } from '../types';

interface MessagesState {
  conversations: Conversation[];
  messages: Message[];
  isLoading: boolean;
  addMessage: (message: Message) => void;
  getConversation: (userId1: string, userId2: string) => Conversation | undefined;
  getMessages: (conversationId: string) => Message[];
  markAsRead: (conversationId: string, userId: string) => void;
  getUnreadCount: (userId: string) => number;
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  conversations: [],
  messages: [],
  isLoading: false,

  addMessage: (message: Message) => {
    set((state) => {
      const conversationId = [message.senderId, message.receiverId].sort().join('-');
      
      // Add message
      const newMessages = [...state.messages, message];
      
      // Update or create conversation
      const existingConvIndex = state.conversations.findIndex((conv) => conv.id === conversationId);
      let newConversations = [...state.conversations];
      
      if (existingConvIndex >= 0) {
        newConversations[existingConvIndex] = {
          ...newConversations[existingConvIndex],
          lastMessage: message.text,
          lastMessageTime: message.timestamp,
          unreadCount: newConversations[existingConvIndex].unreadCount + 1,
        };
      } else {
        newConversations.push({
          id: conversationId,
          participants: [message.senderId, message.receiverId],
          participantNames: {
            [message.senderId]: message.senderName,
            [message.receiverId]: message.receiverName,
          },
          lastMessage: message.text,
          lastMessageTime: message.timestamp,
          unreadCount: 1,
          listingId: message.listingId,
        });
      }
      
      return { messages: newMessages, conversations: newConversations };
    });
  },

  getConversation: (userId1: string, userId2: string) => {
    const conversationId = [userId1, userId2].sort().join('-');
    return get().conversations.find((conv) => conv.id === conversationId);
  },

  getMessages: (conversationId: string) => {
    return get().messages.filter((msg) => {
      const msgConvId = [msg.senderId, msg.receiverId].sort().join('-');
      return msgConvId === conversationId;
    });
  },

  markAsRead: (conversationId: string, userId: string) => {
    set((state) => {
      const newConversations = state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      );
      
      const newMessages = state.messages.map((msg) => {
        const msgConvId = [msg.senderId, msg.receiverId].sort().join('-');
        if (msgConvId === conversationId && msg.receiverId === userId) {
          return { ...msg, read: true };
        }
        return msg;
      });
      
      return { conversations: newConversations, messages: newMessages };
    });
  },

  getUnreadCount: (userId: string) => {
    return get().conversations
      .filter((conv) => conv.participants.includes(userId))
      .reduce((sum, conv) => sum + conv.unreadCount, 0);
  },
}));

