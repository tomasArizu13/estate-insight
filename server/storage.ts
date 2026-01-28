import { users, properties, type User, type Property, type InsertProperty } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Properties
  getProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property>;
  deleteProperty(id: number): Promise<void>;

  // Users (Admin features)
  getUsers(): Promise<User[]>;
  updateUserRole(id: string, role: string): Promise<User>;

  // Stats
  getStats(): Promise<{ totalProperties: number; activeAdvisors: number; totalValue: number }>;
}

export class DatabaseStorage implements IStorage {
  async getProperties(): Promise<Property[]> {
    return await db.select().from(properties).orderBy(desc(properties.createdAt));
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const [property] = await db.insert(properties).values(insertProperty).returning();
    return property;
  }

  async updateProperty(id: number, updates: Partial<InsertProperty>): Promise<Property> {
    const [property] = await db
      .update(properties)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return property;
  }

  async deleteProperty(id: number): Promise<void> {
    await db.delete(properties).where(eq(properties.id, id));
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUserRole(id: string, role: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getStats(): Promise<{ totalProperties: number; activeAdvisors: number; totalValue: number }> {
    const [propStats] = await db
      .select({
        count: sql<number>`count(*)`,
        totalValue: sql<number>`sum(${properties.price})`
      })
      .from(properties);

    const [advisorStats] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, 'advisor'));

    return {
      totalProperties: Number(propStats?.count || 0),
      totalValue: Number(propStats?.totalValue || 0),
      activeAdvisors: Number(advisorStats?.count || 0),
    };
  }
}

export const storage = new DatabaseStorage();
