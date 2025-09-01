
import { pgTable, timestamp, uuid, text, unique } from "drizzle-orm/pg-core";
export type Feed = typeof feeds.$inferSelect; // feeds is the table object in schema.ts
export type User = typeof users.$inferSelect; // feeds is the table object in schema.ts

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow().$onUpdate(()=> new Date()),
    name: text('name').notNull().unique()
});

export const feeds = pgTable('feeds',{
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    name: text('name').notNull(),
    url: text('url').notNull().unique(),
    user_id: uuid('user_id').notNull().references(() => users.id , {onDelete: 'cascade'}),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow().$onUpdate(()=> new Date()),
});

export const feeds_follow = pgTable('feeds_follow',{
    id: uuid('id').primaryKey().defaultRandom(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow().$onUpdate(()=> new Date()),
    user_id: uuid('user_id').notNull().references(()=> users.id, {onDelete: 'cascade'}),
    feed_id: uuid('feed_id').references(()=> feeds.id, {onDelete: 'cascade'}).notNull(),
    },
    (t) => [unique('follow').on(t.user_id, t.feed_id)
]);
