import { users, financialData, chatMessages, type User, type InsertUser, type FinancialData, type InsertFinancialData, type ChatMessage, type InsertChatMessage } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getFinancialData(userId: number): Promise<FinancialData | undefined>;
  upsertFinancialData(userId: number, data: InsertFinancialData): Promise<FinancialData>;

  getChatMessages(userId: number): Promise<ChatMessage[]>;
  createChatMessage(userId: number, message: InsertChatMessage): Promise<ChatMessage>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getFinancialData(userId: number): Promise<FinancialData | undefined> {
    const [data] = await db.select().from(financialData).where(eq(financialData.userId, userId));
    return data;
  }

  async upsertFinancialData(userId: number, data: InsertFinancialData): Promise<FinancialData> {
    const [existing] = await db.select().from(financialData).where(eq(financialData.userId, userId));
    if (existing) {
      const [updated] = await db.update(financialData)
        .set({ ...data, lastUpdated: new Date() })
        .where(eq(financialData.userId, userId))
        .returning();
      return updated;
    } else {
      const [inserted] = await db.insert(financialData)
        .values({ ...data, userId })
        .returning();
      return inserted;
    }
  }

  async getChatMessages(userId: number): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages).where(eq(chatMessages.userId, userId));
  }

  async createChatMessage(userId: number, message: InsertChatMessage): Promise<ChatMessage> {
    const [msg] = await db.insert(chatMessages).values({ ...message, userId }).returning();
    return msg;
  }
}

export const storage = new DatabaseStorage();
