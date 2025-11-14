import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";
import { 
  type User, 
  type InsertUser, 
  type PrayerIntention, 
  type InsertPrayerIntention,
  users,
  prayerIntentions
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getPrayerIntentions(): Promise<PrayerIntention[]>;
  createPrayerIntention(intention: InsertPrayerIntention): Promise<PrayerIntention>;
}

class DatabaseStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    neonConfig.webSocketConstructor = ws;
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool);
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getPrayerIntentions(): Promise<PrayerIntention[]> {
    return await this.db.select().from(prayerIntentions).orderBy(desc(prayerIntentions.createdAt));
  }

  async createPrayerIntention(intention: InsertPrayerIntention): Promise<PrayerIntention> {
    const result = await this.db.insert(prayerIntentions).values(intention).returning();
    return result[0];
  }
}

class MemStorage implements IStorage {
  private users: Map<string, User>;
  private prayerIntentions: Map<string, PrayerIntention>;

  constructor() {
    this.users = new Map();
    this.prayerIntentions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPrayerIntentions(): Promise<PrayerIntention[]> {
    return Array.from(this.prayerIntentions.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createPrayerIntention(intention: InsertPrayerIntention): Promise<PrayerIntention> {
    const id = randomUUID();
    const now = new Date();
    const prayerIntention: PrayerIntention = {
      ...intention,
      id,
      createdAt: now,
    };
    this.prayerIntentions.set(id, prayerIntention);
    
    // Return with normalized ISO string for createdAt to match database output
    return {
      ...prayerIntention,
      createdAt: now as any, // Database returns Date type per schema
    };
  }
}

// Use database storage if DATABASE_URL is available, otherwise use in-memory storage
export const storage: IStorage = process.env.DATABASE_URL 
  ? new DatabaseStorage() 
  : new MemStorage();
