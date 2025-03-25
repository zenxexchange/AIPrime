DROP INDEX IF EXISTS "message_userId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "message_chatId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "message_createdAt_idx";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "pro_model_usage_this_month" integer DEFAULT 150;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "elite_model_usage_this_month" integer DEFAULT 50;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "pro_model_usage_today" integer DEFAULT 0;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messageUserId_idx" ON "message" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messageChatId_idx" ON "message" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messageCreatedAt_idx" ON "message" USING btree ("created_at");