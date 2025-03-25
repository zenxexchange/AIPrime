import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Message } from '@/lib/types';
import { formatDate, providerFromModel } from '@/lib/utils';
import { api } from '@/trpc/server';
import { ChatList } from '@/components/chat-list';

// ✅ Fix: Ensure `params` is correctly awaited in Next.js 15
interface PageProps {
  params: Promise<{
    chatId: string;
  }>;
}

/**
 * Generates metadata dynamically for the shared chat page.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params; // ✅ Fix: Await params

  if (!resolvedParams?.chatId) {
    console.warn("⚠️ Missing chatId in metadata generation.");
    return { title: 'Shared Chat' };
  }

  try {
    const chat = await api.chat.getShared.query({ chatId: resolvedParams.chatId });

    return {
      title: chat?.title || 'Shared Chat',
    };
  } catch (error) {
    console.error(`❌ Error fetching metadata for chatId ${resolvedParams.chatId}:`, error);
    return { title: 'Shared Chat' };
  }
}

/**
 * Main page component for viewing shared chat.
 */
export default async function Page({ params }: PageProps) {
  const resolvedParams = await params; // ✅ Fix: Await params before use

  if (!resolvedParams?.chatId) {
    console.warn("⚠️ Missing chatId in shared page.");
    return notFound();
  }

  const chatId = resolvedParams.chatId;

  try {
    const chat = await api.chat.getShared.query({ chatId });

    if (!chat) {
      console.warn(`⚠️ Shared chat not found for ID: ${chatId}`);
      return notFound();
    }

    const messages = chat.messages as Message[];
    const provider = providerFromModel(chat.usage?.model || '');

    return (
      <div className="space-y-6">
        <div className="mx-auto max-w-4xl px-4">
          <div className="space-y-1 border-b py-6">
            <h1 className="text-2xl font-bold">{chat.title || 'Shared Chat'}</h1>
            <div className="text-sm text-muted-foreground">
              {formatDate(chat.createdAt)} · {messages.length} messages
            </div>
          </div>
        </div>
        <ChatList
          id={chat.id}
          messages={messages}
          provider={provider}
          className="pb-5"
          readonly
        />
      </div>
    );
  } catch (error) {
    console.error(`❌ Error fetching shared chat (ID: ${chatId}):`, error);
    return notFound();
  }
}