DROP INDEX IF EXISTS "chat_userId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "messageUserId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "messageChatId_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_user_id_idx" ON "chat" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_user_id_idx" ON "message" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_chat_id_idx" ON "message" USING btree ("chat_id");