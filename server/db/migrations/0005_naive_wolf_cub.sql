DROP INDEX IF EXISTS "messageUserId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "messageChatId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "messageCreatedAt_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_userId_idx" ON "message" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_chatId_idx" ON "message" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_createdAt_idx" ON "message" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "pro_model_usage_this_month";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "elite_model_usage_this_month";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "pro_model_usage_today";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "last_reset_date";