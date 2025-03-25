import { NextResponse, type NextRequest } from 'next/server';
import { auth as clerkAuth } from '@clerk/nextjs/server';
import { api } from '@/trpc/server';
import { Message } from '@/lib/types';

/**
 * ✅ FIX: Avoid TypeScript type conflicts on Vercel
 */
export async function PUT(req: NextRequest, context: any) {
  console.log("🔍 Full context received:", context);

  const chatId = context?.params?.chatId;
  const messageId = context?.params?.messageId;

  if (!chatId || !messageId) {
    console.error("🚨 Missing chatId or messageId in PUT request.");
    return NextResponse.json({ error: 'Missing chatId or messageId' }, { status: 400 });
  }

  const { userId } = await clerkAuth();
  if (!userId) {
    console.error("🚨 Unauthorized request.");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { message: Message };
  try {
    body = await req.json();
  } catch (error) {
    console.error("🚨 Invalid JSON body in PUT request:", error);
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body?.message) {
    return NextResponse.json({ error: 'Invalid message parameters' }, { status: 400 });
  }

  try {
    console.log(`✅ Updating message: chatId=${chatId}, messageId=${messageId}, userId=${userId}`);

    const data = await api.chat.updateMessage.mutate({
      chatId,
      messageId,
      message: body.message,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`🚨 Error in PUT /api/chat/${chatId}/${messageId}:`, error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

/**
 * ✅ FIXED: DELETE /api/chat/[chatId]/messages/[messageId]
 */
export async function DELETE(req: NextRequest, context: any) {
  console.log("🔍 Full context received:", context);

  const chatId = context?.params?.chatId;
  const messageId = context?.params?.messageId;

  if (!chatId || !messageId) {
    console.error("🚨 Missing chatId or messageId in DELETE request.");
    return NextResponse.json({ error: 'Missing chatId or messageId' }, { status: 400 });
  }

  const { userId } = await clerkAuth();
  if (!userId) {
    console.error("🚨 Unauthorized request.");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log(`✅ Deleting message: chatId=${chatId}, messageId=${messageId}, userId=${userId}`);

    await api.chat.deleteMessage.mutate({ chatId, messageId });

    return new Response(null, { status: 204 }); // 204 No Content - Successful DELETE
  } catch (error: any) {
    console.error(`🚨 Error in DELETE /api/chat/${chatId}/${messageId}:`, error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}