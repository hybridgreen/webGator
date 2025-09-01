
import { pgTable, timestamp, uuid, text } from "drizzle-orm/pg-core";
export type Feed = typeof feeds.$inferSelect; // feeds is the table object in schema.ts
export type User = typeof users.$inferSelect; // feeds is the table object in schema.ts

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow().$onUpdate(()=> new Date()),
    name: text('name').notNull().unique()
    }
);

export const feeds = pgTable('feeds',{
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    name: text('name').notNull(),
    url: text('url').notNull().unique(),
    user_id: uuid('user_id').notNull().references(() => users.id , {onDelete: 'cascade'}),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow().$onUpdate(()=> new Date()),
}
)
