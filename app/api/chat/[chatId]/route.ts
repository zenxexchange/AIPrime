import { NextResponse, type NextRequest } from 'next/server';
import { auth as clerkAuth } from '@clerk/nextjs/server';
import { api } from '@/trpc/server';

/**
 * ✅ FIXED: GET /api/chat/[chatId]
 */
export async function GET(req: NextRequest, context: any) {
  console.log("🔍 Full context received:", context);

  const chatId = context?.params?.chatId;
  if (!chatId) {
    console.error("🚨 Missing chatId in GET request.");
    return NextResponse.json({ error: 'Missing chatId' }, { status: 400 });
  }

  const session = await clerkAuth();
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log(`✅ Fetching chat: chatId=${chatId}, userId=${session.userId}`);
    const data = await api.chat.detail.query({ chatId });

    if (!data) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`🚨 Error in GET /api/chat/${chatId}:`, error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

/**
 * ✅ FIXED: PUT /api/chat/[chatId]
 */
export async function PUT(req: NextRequest, context: any) {
  console.log("🔍 Full context received:", context);

  const chatId = context?.params?.chatId;
  if (!chatId) {
    console.error("🚨 Missing chatId in PUT request.");
    return NextResponse.json({ error: 'Missing chatId' }, { status: 400 });
  }

  const session = await clerkAuth();
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error("🚨 Invalid JSON body in PUT request:", error);
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    console.log(`✅ Updating chat: chatId=${chatId}, userId=${session.userId}`);
    const data = await api.chat.update.mutate({ id: chatId, ...body });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`🚨 Error in PUT /api/chat/${chatId}:`, error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}

/**
 * ✅ FIXED: DELETE /api/chat/[chatId]
 */
export async function DELETE(req: NextRequest, context: any) {
  console.log("🔍 Full context received:", context);

  const chatId = context?.params?.chatId;
  if (!chatId) {
    console.error("🚨 Missing chatId in DELETE request.");
    return NextResponse.json({ error: 'Missing chatId' }, { status: 400 });
  }

  const session = await clerkAuth();
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log(`✅ Deleting chat: chatId=${chatId}, userId=${session.userId}`);
    await api.chat.delete.mutate({ chatId });

    return new Response(null, { status: 204 }); // 204 No Content - Successful DELETE
  } catch (error: any) {
    console.error(`🚨 Error in DELETE /api/chat/${chatId}:`, error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}