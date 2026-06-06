import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-12345";

import crypto from "crypto";

router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    
    const user = await prisma.user.create({
      data: { 
        email: normalizedEmail, 
        passwordHash, 
        firstName: firstName || "User", 
        lastName: lastName || "", 
        role: role || "EXPLORER",
        verificationToken
      }
    });

    // Mock sending email
    console.log(`[AUTH] Verification link for ${user.email}: /verify-email?token=${verificationToken}`);

    res.status(201).json({ 
      id: user.id, 
      email: user.email, 
      name: `${user.firstName} ${user.lastName}`.trim(),
      message: "Registration successful. Please verify your email."
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(400).json({ error: "Email already exists or invalid data" });
  }
});

router.post("/verify-email", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Token is required" });

    const user = await prisma.user.findFirst({
      where: { verificationToken: token }
    });

    if (!user) return res.status(400).json({ error: "Invalid or expired token" });

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        emailVerified: true,
        verificationToken: null
      }
    });

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ error: "Verification failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const normalizedEmail = email.trim().toLowerCase();
    console.log(`Login attempt for: ${normalizedEmail}`);
    
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    
    if (!user) {
      console.log(`User not found: ${normalizedEmail}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.log(`Password mismatch for user: ${normalizedEmail}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
    
    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: `${user.firstName} ${user.lastName}`.trim(), 
        role: user.role,
        status: user.status
      } 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
