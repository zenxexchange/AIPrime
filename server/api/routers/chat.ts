import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { auth } from "@clerk/nextjs/server";

import { messageSchema } from '@/types/message';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { chats, messages, users } from '@/server/db/schema';

export const chatRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        title: z.string().trim().min(1).max(255),
        messages: z
          .array(messageSchema)
          .length(1)
          .refine(messages => messages[0].role === 'user', {
            message: 'Messages must contain exactly one user message.'
          }),
        usage: z.object({
          model: z.string().min(1),
          temperature: z.number().optional(),
          frequencyPenalty: z.number().optional(),
          presencePenalty: z.number().optional(),
          maxTokens: z.number().optional()
        })
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");

      console.log("User ID:", userId);

      // Ensure user exists
      let userExists = await ctx.db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      if (!userExists) {
        console.log("User not found in DB. Creating new user...");
        await ctx.db.insert(users).values({
          id: userId,
          name: '',
          email: '',
          emailVerified: null,
          image: null,
        });
      }

      // Check if chat already exists
      const chat = await ctx.db.query.chats.findFirst({
        where: eq(chats.id, input.id)
      });

      if (chat) throw new Error('Chat already exists');

      // Create chat entry
      await ctx.db.insert(chats).values({
        id: input.id,
        title: input.title,
        user_id: userId,
        usage: input.usage
      });

      // Add user message
      await ctx.db.insert(messages).values({
        id: input.messages[0].id,
        content: input.messages[0].content ?? '',
        role: input.messages[0].role,
        chat_id: input.id,
        user_id: userId
      });

      return await ctx.db.query.chats.findFirst({
        where: and(eq(chats.id, input.id), eq(chats.user_id, userId)),
        with: {
          messages: {
            where: eq(messages.chat_id, input.id),
            orderBy: (messages, { asc }) => [asc(messages.createdAt)]
          }
        }
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        regenerateId: z.string().optional(),
        title: z.string().trim().min(1).max(255).optional(),
        shared: z.boolean().optional(),
        messages: z.array(messageSchema).min(1).optional(),
        usage: z.object({
          model: z.string().min(1),
          temperature: z.number().optional(),
          frequencyPenalty: z.number().optional(),
          presencePenalty: z.number().optional(),
          maxTokens: z.number().optional()
        }).optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");

      // Retrieve existing chat
      const existingChat = await ctx.db.query.chats.findFirst({
        where: and(eq(chats.id, input.id), eq(chats.user_id, userId)),
        with: { messages: true }
      });

      if (!existingChat) throw new Error("Chat not found.");

      // Append new messages instead of replacing
      const updatedMessages = [...existingChat.messages, ...(input.messages || [])];

      // Update chat with appended messages
      await ctx.db.update(chats)
        .set({ title: input.title, shared: input.shared, usage: input.usage })
        .where(and(eq(chats.id, input.id), eq(chats.user_id, userId)));

      // Insert new messages
      if (input.messages && input.messages.length > 0) {
        await ctx.db.insert(messages).values(
          input.messages.map(msg => ({
            id: msg.id,
            role: msg.role,
            content: msg.content ?? '',
            chat_id: input.id,
            user_id: userId
          }))
        );
      }

      return await ctx.db.query.chats.findFirst({
        where: and(eq(chats.id, input.id), eq(chats.user_id, userId)),
        with: {
          messages: {
            where: eq(messages.chat_id, input.id),
            orderBy: (messages, { asc }) => [asc(messages.createdAt)]
          }
        }
      });
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    return await ctx.db.query.chats.findMany({
      orderBy: (chats, { desc }) => [desc(chats.createdAt)],
      where: eq(chats.user_id, userId)
    });
  }),

  getShared: protectedProcedure
    .input(z.object({ chatId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");

      // Fetch the chat only if it's shared
      const sharedChat = await ctx.db.query.chats.findFirst({
        where: and(eq(chats.id, input.chatId), eq(chats.shared, true)),
        with: {
          messages: {
            where: eq(messages.chat_id, input.chatId),
            orderBy: (messages, { asc }) => [asc(messages.createdAt)],
          },
        },
      });

      if (!sharedChat) throw new Error("Chat not found or not shared.");
      return sharedChat;
    }),

  detail: protectedProcedure
    .input(z.object({ chatId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");

      return await ctx.db.query.chats.findFirst({
        where: and(eq(chats.id, input.chatId), eq(chats.user_id, userId)),
        with: {
          messages: {
            where: eq(messages.chat_id, input.chatId),
            orderBy: (messages, { asc }) => [asc(messages.createdAt)]
          }
        }
      });
    }),

  delete: protectedProcedure
    .input(z.object({ chatId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");

      await ctx.db.delete(chats).where(
        and(eq(chats.id, input.chatId), eq(chats.user_id, userId))
      );
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await ctx.db.delete(chats).where(eq(chats.user_id, userId));
  }),

  updateMessage: protectedProcedure
    .input(z.object({
      chatId: z.string().min(1),
      messageId: z.string().min(1),
      message: messageSchema.refine(msg => msg.role === 'user', {
        message: 'Only messages with role "user" can be updated.'
      })
    }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");

      return await ctx.db.update(messages).set({ ...input.message }).where(
        and(
          eq(messages.id, input.messageId),
          eq(messages.chat_id, input.chatId),
          eq(messages.user_id, userId)
        )
      );
    }),

  deleteMessage: protectedProcedure
    .input(z.object({
      chatId: z.string().min(1),
      messageId: z.string().min(1)
    }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");

      return await ctx.db.delete(messages).where(
        and(
          eq(messages.id, input.messageId),
          eq(messages.chat_id, input.chatId),
          eq(messages.user_id, userId)
        )
      );
    })
});