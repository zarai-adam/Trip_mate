import { Router } from "express";
import prisma from "../prisma.js";

const router = Router();

router.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newMessage = await prisma.contactMessage.create({
      data: { name, email, subject: subject || "No Subject", message }
    });

    res.status(201).json({ message: "Message received successfully", id: newMessage.id });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
