import { Router } from "express";
import prisma from "../prisma.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticate, async (req, res) => {
  try {
    const { targetType, targetId, reason, description } = req.body;
    const userId = (req as any).user.id;

    const report = await prisma.report.create({
      data: {
        reporterId: userId,
        targetType,
        targetId,
        reason,
        description
      }
    });

    res.status(201).json(report);
  } catch (error) {
    console.error("Report error:", error);
    res.status(500).json({ error: "Failed to submit report" });
  }
});

export default router;
