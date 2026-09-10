import { apiClient } from './client';

export interface Conversation {
  id: string;
  isGroup: boolean;
  title?: string;
  updatedAt: string;
  participants: any[];
  messages?: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: any;
}

export const messagesApi = {
  async getConversations(): Promise<Conversation[]> {
    return apiClient.get('/conversations');
  },

  async createConversation(recipientId: string): Promise<Conversation> {
    return apiClient.post('/conversations', { recipientId });
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    return apiClient.get(`/conversations/${conversationId}/messages`);
  },

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    return apiClient.post(`/conversations/${conversationId}/messages`, { content });
  },
};
