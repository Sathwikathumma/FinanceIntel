import { pgTable, serial, text, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const financialData = pgTable("financial_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  income: integer("income").notNull().default(0),
  expenses: integer("expenses").notNull().default(0),
  assets: integer("assets").notNull().default(0),
  liabilities: integer("liabilities").notNull().default(0),
  creditScore: integer("credit_score").notNull().default(0),
  epfDetails: text("epf_details"),
  investments: json("investments").$type<Array<{ name: string, amount: number, returnRate: number }>>().default([]),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertFinancialDataSchema = createInsertSchema(financialData).omit({ id: true, userId: true, lastUpdated: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, userId: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type FinancialData = typeof financialData.$inferSelect;
export type InsertFinancialData = z.infer<typeof insertFinancialDataSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
