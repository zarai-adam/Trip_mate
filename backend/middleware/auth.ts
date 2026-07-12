import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-12345";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

  console.log(`[AUTH] Authenticating request: ${req.method} ${req.originalUrl || req.url}`);

  if (!token) {
    console.warn(`[AUTH] Authentication failed: No token found in headers or cookies.`);
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: UserRole };
    req.user = decoded;
    console.log(`[AUTH] Successfully authenticated user: ${decoded.id} with role: ${decoded.role}`);
    next();
  } catch (error: any) {
    console.error(`[AUTH] Token verification failed: ${error.message}`);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const requireRole = (roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    console.log(`[AUTH-ROLE] Checking role for user ${req.user?.id}. Required: ${roles}. Has: ${userRole}`);
    
    if (!req.user || !userRole) {
      console.warn(`[AUTH-ROLE] Access denied: req.user or req.user.role is null`);
      return res.status(403).json({ error: "Access denied: insufficient permissions" });
    }

    // Support case-insensitive role match to be extra robust
    const hasMatch = roles.some(role => 
      role.toUpperCase() === userRole.toUpperCase()
    );

    if (!hasMatch) {
      console.warn(`[AUTH-ROLE] Access denied: User role ${userRole} is not in allowed roles ${roles}`);
      return res.status(403).json({ error: "Access denied: insufficient permissions" });
    }

    next();
  };
};
