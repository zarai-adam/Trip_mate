import { Router, Response } from "express";
import prisma from "../prisma.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();

// Get public profile (any role)
router.get("/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        tripsLed: {
          where: { status: "PUBLISHED" },
          orderBy: { startDate: "desc" },
        },
        reviewsReceived: {
          where: { isVisible: true },
          include: {
            reviewer: {
              select: { 
                id: true,
                firstName: true, 
                lastName: true, 
                avatarUrl: true 
              }
            },
            trip: {
              select: { title: true, destination: true }
            }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Remove sensitive info
    const { passwordHash, email, phoneNumber, ...safeUser } = user;
    
    // Compute some fields if they are missing
    const profile = {
      ...safeUser,
      name: `${user.firstName} ${user.lastName}`.trim(),
      memberSince: user.createdAt,
      // If guide, we can add more specific logic here
    };

    res.json(profile);
  } catch (error) {
    console.error("Fetch profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Get own profile
router.get("/me/private", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id }
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    const { passwordHash, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch own profile" });
  }
});

// Update own profile
router.patch("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { 
      firstName, lastName, bio, country, phoneNumber, avatarUrl, coverUrl, 
      tagline, languages, countriesVisited, specialties, travelPhilosophy 
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName, 
        lastName, 
        bio, 
        country, 
        phoneNumber, 
        avatarUrl, 
        coverUrl,
        tagline, 
        languages, 
        countriesVisited, 
        specialties, 
        travelPhilosophy
      }
    });

    const { passwordHash, ...safeUser } = updatedUser;
    res.json(safeUser);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
