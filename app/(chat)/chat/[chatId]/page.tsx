import { Metadata } from 'next';
import { api } from '@/trpc/server';
import { ChatNotFound } from '@/components/chat-notfound';
import { ChatUI } from '@/components/chat-ui';
import { type Chat, type Message } from '@/lib/types';

export const dynamic = 'force-dynamic';

/**
 * Page Component for Chat
 */
export default async function Page({ params }: { params: Promise<{ chatId?: string }> }) {
  const resolvedParams = await params;
  const chatId = resolvedParams?.chatId;

  if (!chatId) {
    console.error("❌ Missing chatId.");
    return <ChatNotFound />;
  }

  try {
    const chat = await api.chat.detail.query({ chatId });

    if (!chat) {
      console.error(`❌ Chat not found for ID: ${chatId}`);
      return <ChatNotFound />;
    }

    // Normalize chat data to match `Message` type
    const formattedChat: Chat = {
      ...chat,
      chatId: chat.id,
      userId: chat.user_id,
      messages: chat.messages.map((msg) => {
        const base = {
          id: msg.id,
          userId: msg.user_id,
          chatId: msg.chat_id,
          content: msg.content as string,
          createdAt: msg.createdAt,
          updatedAt: msg.updatedAt
        };

        switch (msg.role) {
          case 'user': return { ...base, role: 'user' as const };
          case 'assistant': return { ...base, role: 'assistant' as const };
          case 'tool': return { ...base, role: 'tool' as const };
          default: throw new Error(`Invalid role: ${msg.role}`);
        }
      }) as Message[]
    };

    return <ChatUI chat={formattedChat} />;
  } catch (error) {
    console.error(`❌ Error fetching chat (ID: ${chatId}):`, error);
    return <ChatNotFound />;
  }
}