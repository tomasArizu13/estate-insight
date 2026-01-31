/**
 * PROVISORIO: Auth de Replit desactivado. No se usa sesión ni passport.
 * Cuando quieras activar auth, descomenta el código de este archivo y vuelve
 * a llamar setupAuth en server/routes.ts.
 */

import type { Express, RequestHandler } from "express";

// ========== CÓDIGO ORIGINAL COMENTADO (Replit Auth) - Descomentar cuando configures auth ==========
// import * as client from "openid-client";
// import { Strategy, type VerifyFunction } from "openid-client/passport";
// import passport from "passport";
// import session from "express-session";
// import memoize from "memoizee";
// import connectPg from "connect-pg-simple";
// import { authStorage } from "./storage";

// const getOidcConfig = memoize(
//   async () => {
//     return await client.discovery(
//       new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
//       process.env.REPL_ID!
//     );
//   },
//   { maxAge: 3600 * 1000 }
// );

// export function getSession() {
//   const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
//   const pgStore = connectPg(session);
//   const sessionStore = new pgStore({
//     conString: process.env.DATABASE_URL,
//     createTableIfMissing: false,
//     ttl: sessionTtl,
//     tableName: "sessions",
//   });
//   return session({
//     secret: process.env.SESSION_SECRET!,
//     store: sessionStore,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       secure: true,
//       maxAge: sessionTtl,
//     },
//   });
// }

// function updateUserSession(
//   user: any,
//   tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
// ) {
//   user.claims = tokens.claims();
//   user.access_token = tokens.access_token;
//   user.refresh_token = tokens.refresh_token;
//   user.expires_at = user.claims?.exp;
// }

// async function upsertUser(claims: any) {
//   await authStorage.upsertUser({
//     id: claims["sub"],
//     email: claims["email"],
//     firstName: claims["first_name"],
//     lastName: claims["last_name"],
//     profileImageUrl: claims["profile_image_url"],
//   });
// }

/** PROVISORIO: No-op (no configura sesión). Cuando actives Replit Auth, descomenta getSession real y su uso en setupAuth. */
export function getSession(): RequestHandler {
  return (_req, _res, next) => next();
}

/** PROVISORIO: No-op. Cuando actives Replit Auth, descomenta el cuerpo en este archivo. */
export async function setupAuth(_app: Express) {
  // app.set("trust proxy", 1);
  // app.use(getSession());
  // app.use(passport.initialize());
  // app.use(passport.session());
  // const config = await getOidcConfig();
  // const verify: VerifyFunction = async (...)
  // passport.serializeUser(...); passport.deserializeUser(...);
  // app.get("/api/login", ...); app.get("/api/callback", ...); app.get("/api/logout", ...);
}

/** PROVISORIO: Middleware que no exige auth (solo llama next). Cuando actives auth, descomenta la lógica real en este archivo. */
export const isAuthenticated: RequestHandler = async (_req, _res, next) => {
  // const user = req.user as any;
  // if (!req.isAuthenticated() || !user.expires_at) return res.status(401).json({ message: "Unauthorized" });
  // ... refresh token logic ...
  return next();
};
