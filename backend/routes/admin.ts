import { Router, Response } from "express";
import prisma from "../prisma.js";
import { authenticate, requireRole, AuthRequest } from "../middleware/auth.js";
import { UserRole, UserStatus, GuideApplicationStatus, BookingStatus, TripStatus } from "@prisma/client";
import { createNotification, notifyAdmins, NotificationType } from "../services/notificationService.js";

const router = Router();

// This route is for users to APPLY to be a guide - should be accessible to all authenticated users
router.post("/applications", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { 
      travelExperience, 
      countriesVisited, 
      languagesSpoken, 
      specialties, 
      whyBecomeGuide, 
      portfolioUrls 
    } = req.body;

    const application = await prisma.guideApplication.create({
      data: {
        userId: req.user!.id,
        travelExperience,
        countriesVisited,
        languagesSpoken,
        specialties,
        whyBecomeGuide,
        portfolioUrls
      },
      include: { user: true }
    });

    // Notify admins
    await notifyAdmins({
      type: NotificationType.NEW_APPLICATION,
      title: "New Guide Application",
      body: `📝 New guide application from ${application.user.firstName} ${application.user.lastName}`,
      data: { applicationId: application.id }
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("Create application error:", error);
    res.status(400).json({ error: "Failed to submit application" });
  }
});

// Apply admin protection to all routes below
router.use(authenticate);
router.use(requireRole([UserRole.ADMIN]));

/**
 * DASHBOARD OVERVIEW
 */
router.get("/stats", async (req: AuthRequest, res: Response) => {
  try {
    const [userCount, guideCount, tripCount, bookingCount, pendingApps] = await Promise.all([
      prisma.user.count({ where: { role: UserRole.EXPLORER } }),
      prisma.user.count({ where: { role: UserRole.GUIDE, status: UserStatus.ACTIVE } }),
      prisma.trip.count({ where: { status: TripStatus.PUBLISHED } }),
      prisma.booking.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      prisma.guideApplication.count({ where: { status: GuideApplicationStatus.PENDING } })
    ]);

    // Simple weekly growth (last 7 days vs previous 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const usersThisWeek = await prisma.user.count({
      where: { createdAt: { gte: sevenDaysAgo } }
    });

    res.json({ 
      userCount, 
      guideCount, 
      tripCount, 
      bookingCount, 
      pendingApps,
      usersThisWeek 
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.get("/charts/user-growth", async (req: AuthRequest, res: Response) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const users = await prisma.user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true, role: true }
    });

    // Group by day
    const chartData: Record<string, { date: string, explorers: number, guides: number }> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      chartData[dateStr] = { date: dateStr, explorers: 0, guides: 0 };
    }

    users.forEach(u => {
      const dateStr = u.createdAt.toISOString().split("T")[0];
      if (chartData[dateStr]) {
        if (u.role === UserRole.EXPLORER) chartData[dateStr].explorers++;
        if (u.role === UserRole.GUIDE) chartData[dateStr].guides++;
      }
    });

    res.json(Object.values(chartData).sort((a, b) => a.date.localeCompare(b.date)));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch growth data" });
  }
});

router.get("/charts/bookings", async (req: AuthRequest, res: Response) => {
  try {
    const eightWeeksAgo = new Date();
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

    const bookings = await prisma.booking.findMany({
      where: { createdAt: { gte: eightWeeksAgo } },
      select: { createdAt: true, status: true }
    });

    // Group by week
    const weeks: any[] = [];
    for (let i = 0; i < 8; i++) {
        const start = new Date();
        start.setDate(start.getDate() - (i + 1) * 7);
        weeks.push({ 
            week: `Week ${8-i}`, 
            total: 0, 
            confirmed: 0,
            date: start
        });
    }

    bookings.forEach(b => {
        const bDate = new Date(b.createdAt);
        const weekIdx = weeks.findIndex(w => bDate >= w.date);
        if (weekIdx !== -1) {
            weeks[weekIdx].total++;
            if (b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.COMPLETED) {
                weeks[weekIdx].confirmed++;
            }
        }
    });

    res.json(weeks.reverse());
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch booking chart data" });
  }
});

/**
 * GUIDE APPLICATIONS
 */
router.get("/guide-applications", async (req: AuthRequest, res: Response) => {
  try {
    const { status, search } = req.query;
    const applications = await prisma.guideApplication.findMany({
      where: {
        ...(status ? { status: status as GuideApplicationStatus } : {}),
        ...(search ? {
          user: {
            OR: [
              { firstName: { contains: search as string, mode: "insensitive" } },
              { lastName: { contains: search as string, mode: "insensitive" } },
              { email: { contains: search as string, mode: "insensitive" } },
            ]
          }
        } : {})
      },
      include: {
        user: true
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

router.patch("/guide-applications/:id/approve", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const app = await prisma.guideApplication.update({
      where: { id },
      data: { 
        status: GuideApplicationStatus.APPROVED,
        reviewedById: req.user!.id,
        reviewedAt: new Date()
      }
    });

    await prisma.user.update({
      where: { id: app.userId },
      data: { role: UserRole.GUIDE, status: UserStatus.ACTIVE }
    });

    await createNotification({
      userId: app.userId,
      type: NotificationType.APPLICATION_APPROVED,
      title: "Application Approved!",
      body: "✅ Your guide application was approved! You can now create and publish trips.",
      data: { applicationId: id }
    });

    await prisma.activityLog.create({
      data: {
        actorId: req.user!.id,
        action: "GUIDE_APPROVED",
        targetType: "GuideApplication",
        targetId: id
      }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to approve application" });
  }
});

router.patch("/guide-applications/:id/reject", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const app = await prisma.guideApplication.update({
      where: { id },
      data: { 
        status: GuideApplicationStatus.REJECTED,
        reviewNotes: reason,
        reviewedById: req.user!.id,
        reviewedAt: new Date()
      }
    });

    await createNotification({
      userId: app.userId,
      type: NotificationType.APPLICATION_REJECTED,
      title: "Application Rejected",
      body: `❌ Your guide application was declined. Reason: ${reason}`,
      data: { applicationId: id }
    });

    await prisma.activityLog.create({
      data: {
        actorId: req.user!.id,
        action: "GUIDE_REJECTED",
        targetType: "GuideApplication",
        targetId: id,
        details: { reason }
      }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to reject application" });
  }
});

/**
 * USERS
 */
router.get("/users", async (req: AuthRequest, res: Response) => {
  try {
    const { role, status, search } = req.query;
    const users = await prisma.user.findMany({
      where: {
        ...(role ? { role: role as UserRole } : {}),
        ...(status ? { status: status as UserStatus } : {}),
        ...(search ? {
          OR: [
            { firstName: { contains: search as string, mode: "insensitive" } },
            { lastName: { contains: search as string, mode: "insensitive" } },
            { email: { contains: search as string, mode: "insensitive" } },
          ]
        } : {})
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.patch("/users/:id/status", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    
    await prisma.user.update({
      where: { id },
      data: { status: status as UserStatus }
    });

    await prisma.activityLog.create({
      data: {
        actorId: req.user!.id,
        action: `USER_${status}`,
        targetType: "User",
        targetId: id,
        details: { status, reason }
      }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user status" });
  }
});

/**
 * TRIPS
 */
router.get("/trips", async (req: AuthRequest, res: Response) => {
    try {
        const { status, search } = req.query;
        const trips = await prisma.trip.findMany({
            where: {
                ...(status ? { status: status as TripStatus } : {}),
                ...(search ? {
                    OR: [
                        { title: { contains: search as string, mode: "insensitive" } },
                        { destination: { contains: search as string, mode: "insensitive" } },
                    ]
                } : {})
            },
            include: {
                guide: {
                    select: { firstName: true, lastName: true, avatarUrl: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch trips" });
    }
});

router.patch("/trips/:id/status", async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const trip = await prisma.trip.update({
            where: { id },
            data: { status: status as TripStatus },
            include: { bookings: { include: { explorer: true } } }
        });

        if (status === "CANCELLED") {
            for (const booking of trip.bookings) {
                if (booking.status !== "CANCELLED") {
                    await createNotification({
                        userId: booking.explorerId,
                        type: NotificationType.TRIP_CANCELLED,
                        title: "Trip Cancelled",
                        body: `⚠️ ${trip.title} trip was cancelled`,
                        data: { tripId: id }
                    });
                }
            }
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to update trip" });
    }
});

/**
 * BOOKINGS
 */
router.get("/bookings", async (req: AuthRequest, res: Response) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                explorer: { select: { firstName: true, lastName: true, avatarUrl: true, email: true } },
                trip: { select: { title: true, destination: true } }
            },
            orderBy: { createdAt: "desc" }
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
});

/**
 * REVIEWS
 */
router.get("/reviews", async (req: AuthRequest, res: Response) => {
    try {
        const reviews = await prisma.review.findMany({
            include: {
                reviewer: { select: { firstName: true, lastName: true, avatarUrl: true } },
                reviewee: { select: { firstName: true, lastName: true, avatarUrl: true } },
                trip: { select: { title: true } }
            },
            orderBy: { createdAt: "desc" }
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
});

/**
 * ACTIVITY LOG
 */
router.get("/activity-log", async (req: AuthRequest, res: Response) => {
    try {
        const logs = await prisma.activityLog.findMany({
            include: {
                actor: { select: { firstName: true, lastName: true, avatarUrl: true } }
            },
            orderBy: { createdAt: "desc" },
            take: 100
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch logs" });
    }
});

export default router;
