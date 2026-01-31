import type { Express } from "express";
// PROVISORIO: Auth desactivado. Cuando actives Replit Auth, descomenta isAuthenticated y la ruta real.
// import { authStorage } from "./storage";
// import { isAuthenticated } from "./replitAuth";

/** PROVISORIO: Registra /api/auth/user que devuelve un usuario mock. Cambiar cuando configures auth real. */
export function registerAuthRoutes(app: Express): void {
  // Ruta real (descomentar cuando actives auth):
  // app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
  //   try {
  //     const userId = req.user.claims.sub;
  //     const user = await authStorage.getUser(userId);
  //     res.json(user);
  //   } catch (error) {
  //     console.error("Error fetching user:", error);
  //     res.status(500).json({ message: "Failed to fetch user" });
  //   }
  // });

  app.get("/api/auth/user", (_req, res) => {
    res.json({
      id: "provisional-user",
      email: "usuario@demo.local",
      firstName: "Usuario",
      lastName: "Demo",
      profileImageUrl: null,
      role: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

  // PROVISORIO: logout sin Replit; redirige a inicio. Cuando actives auth, quita esto y usa la ruta de replitAuth.
  app.get("/api/logout", (_req, res) => {
    res.redirect("/");
  });
}
