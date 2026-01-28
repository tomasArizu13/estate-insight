export * from "./models/auth";
export * from "./models/chat";

import { pgTable, serial, text, numeric, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: numeric("price").notNull(),
  address: text("address").notNull(),
  type: text("type").notNull(), // 'sale', 'rent'
  status: text("status").notNull().default('available'), // 'available', 'sold', 'rented'
  agentId: varchar("agent_id").references(() => users.id),
  imageUrls: text("image_urls").array(),
  isSold: boolean("is_sold").default(false).notNull(),
  soldAt: timestamp("sold_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPropertySchema = createInsertSchema(properties).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;

// Relations
export const propertiesRelations = relations(properties, ({ one }) => ({
  agent: one(users, {
    fields: [properties.agentId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
}));
