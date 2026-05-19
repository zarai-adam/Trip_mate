import { Router, Response } from "express";
import prisma from "../prisma.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

// Get all notifications for current user
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Get unread count
router.get("/unread-count", async (req: AuthRequest, res: Response) => {
  try {
    const count = await prisma.notification.count({
      where: { userId: req.user!.id, read: false },
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch unread count" });
  }
});

// Mark one as read
router.patch("/:id/read", async (req: AuthRequest, res: Response) => {
  try {
    await prisma.notification.update({
      where: { id: req.params.id, userId: req.user!.id },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark as read" });
  }
});

// Mark all as read
router.patch("/read-all", async (req: AuthRequest, res: Response) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.id, read: false },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark all as read" });
  }
});

// Delete a notification
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    await prisma.notification.delete({
      where: { id: req.params.id, userId: req.user!.id },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

export default router;
