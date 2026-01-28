import type { Express } from "express";
import type { Server } from "http";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth & Integrations
  await setupAuth(app);
  registerAuthRoutes(app);
  registerChatRoutes(app);

  // === Properties ===
  app.get(api.properties.list.path, async (req, res) => {
    const properties = await storage.getProperties();
    res.json(properties);
  });

  app.get(api.properties.get.path, async (req, res) => {
    const property = await storage.getProperty(Number(req.params.id));
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  });

  app.post(api.properties.create.path, async (req, res) => {
    try {
      const input = api.properties.create.input.parse(req.body);
      const property = await storage.createProperty(input);
      res.status(201).json(property);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.properties.update.path, async (req, res) => {
    try {
      const input = api.properties.update.input.parse(req.body);
      const property = await storage.updateProperty(Number(req.params.id), input);
      if (!property) return res.status(404).json({ message: "Property not found" });
      res.json(property);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.properties.delete.path, async (req, res) => {
    await storage.deleteProperty(Number(req.params.id));
    res.status(204).send();
  });

  // === Users (Admin) ===
  app.get(api.users.list.path, async (req, res) => {
    // In a real app, check if req.user.role === 'admin'
    const users = await storage.getUsers();
    res.json(users);
  });

  app.patch(api.users.updateRole.path, async (req, res) => {
    try {
      const { role } = api.users.updateRole.input.parse(req.body);
      const user = await storage.updateUserRole(req.params.id, role);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // === Stats ===
  app.get(api.stats.get.path, async (req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  return httpServer;
}

// Seed function
async function seed() {
  const existing = await storage.getProperties();
  if (existing.length === 0) {
    await storage.createProperty({
      title: "Luxury Ocean View Condo",
      description: "Beautiful 2BR/2BA condo with sweeping ocean views.",
      price: "1200000",
      address: "123 Ocean Dr, Miami, FL",
      type: "sale",
      status: "available",
      imageUrls: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"],
    });
    await storage.createProperty({
      title: "Modern Downtown Loft",
      description: "Spacious loft in the heart of the city.",
      price: "4500",
      address: "456 Main St, New York, NY",
      type: "rent",
      status: "available",
      imageUrls: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"],
    });
    await storage.createProperty({
      title: "Suburban Family Home",
      description: "4BR/3BA home with a large backyard.",
      price: "850000",
      address: "789 Pine Ln, Austin, TX",
      type: "sale",
      status: "sold",
      imageUrls: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"],
    });
  }
}

// Call seed (in a real app, maybe checking via a separate script, but here lazy-seed on start/request or just expose an endpoint if needed, but for MVP simpler to just run it once. 
// Note: registerRoutes is called on server start. I can call seed() there.)
// However, registerRoutes is async, so I can await seed().
seed().catch(console.error);
