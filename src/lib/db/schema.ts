
import { pgTable, timestamp, uuid, text } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow().$onUpdate(()=> new Date()),
    name: text('name').notNull().unique()
    }
);

