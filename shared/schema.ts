import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const prayerIntentions = pgTable("prayer_intentions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  intention: text("intention").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPrayerIntentionSchema = createInsertSchema(prayerIntentions).omit({
  id: true,
  createdAt: true,
});

export type InsertPrayerIntention = z.infer<typeof insertPrayerIntentionSchema>;
export type PrayerIntention = typeof prayerIntentions.$inferSelect;

export const chatMessageSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
