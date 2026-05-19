import { Router } from "express";
import prisma from "../prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const guides = await prisma.user.findMany({
      where: { role: "GUIDE" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        bio: true,
        status: true,
        _count: {
          select: { tripsLed: true }
        }
      }
    });
    const normalizedGuides = guides.map(g => ({
      id: g.id,
      name: `${g.firstName} ${g.lastName}`.trim(),
      avatar: g.avatarUrl,
      bio: g.bio,
      verificationStatus: g.status === "ACTIVE" ? "VERIFIED" : "PENDING",
      _count: {
        trips: g._count.tripsLed
      }
    }));
    res.json(normalizedGuides);
  } catch (error) {
    console.error("Get guides error:", error);
    res.status(500).json({ error: "Failed to fetch guides" });
  }
});

export default router;
