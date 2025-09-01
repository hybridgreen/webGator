ALTER TABLE "feeds_follow" ALTER COLUMN "feed_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "feeds" ADD COLUMN "last_fetched_at" timestamp;