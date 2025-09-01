CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"Title" text NOT NULL,
	"URL" text NOT NULL,
	"Description" text,
	"Published" text,
	"Feed_id" text NOT NULL
);
