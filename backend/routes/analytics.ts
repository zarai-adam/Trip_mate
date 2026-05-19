import { Router } from "express";
import prisma from "../prisma.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/guide", authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    if (userRole !== "GUIDE") {
      return res.status(403).json({ error: "Only guides can access analytics" });
    }

    // 1. Profile Views (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const profileViews = await prisma.analyticsEvent.findMany({
      where: {
        type: "PROFILE_VIEW",
        targetId: userId,
        createdAt: { gte: thirtyDaysAgo }
      },
      orderBy: { createdAt: "asc" }
    });

    // 2. Trip Views vs Bookings
    const guideTrips = await prisma.trip.findMany({
      where: { guideId: userId },
      select: { id: true, title: true, pricePerPerson: true }
    });

    const tripIds = guideTrips.map(t => t.id);

    const tripViews = await prisma.analyticsEvent.count({
      where: {
        type: "TRIP_VIEW",
        targetId: { in: tripIds }
      }
    });

    const totalBookings = await prisma.booking.count({
      where: { tripId: { in: tripIds } }
    });

    const confirmedBookings = await prisma.booking.findMany({
      where: { 
        tripId: { in: tripIds },
        status: "CONFIRMED"
      },
      include: {
        trip: true,
        explorer: {
            select: { country: true }
        }
      }
    });

    // 3. Revenue
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + Number(b.trip.pricePerPerson), 0);

    // 4. Rating Trend
    const reviews = await prisma.review.findMany({
      where: { revieweeId: userId },
      orderBy: { createdAt: "asc" }
    });

    // 5. Explorer Countries
    const countryStats: Record<string, number> = {};
    confirmedBookings.forEach(b => {
      if (b.explorer.country) {
        countryStats[b.explorer.country] = (countryStats[b.explorer.country] || 0) + 1;
      }
    });

    // 6. Acceptance Rate
    const totalRequests = await prisma.booking.count({
      where: { 
        tripId: { in: tripIds },
        status: { in: ["CONFIRMED", "REJECTED", "CANCELLED", "APPROVED"] } 
      }
    });
    const acceptedRequests = await prisma.booking.count({
      where: { 
        tripId: { in: tripIds },
        status: { in: ["CONFIRMED", "APPROVED"] } 
      }
    });

    // 7. Most Popular Trip
    const bookingsByTrip = await prisma.booking.groupBy({
        by: ['tripId'],
        where: { tripId: { in: tripIds } },
        _count: { id: true },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 1
    });

    const mostPopularTrip = bookingsByTrip.length > 0 
        ? guideTrips.find(t => t.id === bookingsByTrip[0].tripId)
        : null;

    res.json({
      metrics: {
        profileViews: profileViews.length,
        conversionRate: tripViews > 0 ? (totalBookings / tripViews) * 100 : 0,
        revenue: totalRevenue,
        avgRating: reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0,
        acceptanceRate: totalRequests > 0 ? (acceptedRequests / totalRequests) * 100 : 0,
        mostPopularTrip: mostPopularTrip?.title || "N/A"
      },
      charts: {
        viewsOverTime: profileViews, // Frontend will aggregate by day
        bookingsPerTrip: guideTrips.map(t => ({
          name: t.title,
          bookings: confirmedBookings.filter(b => b.tripId === t.id).length
        })),
        ratingTrend: reviews.map(r => ({
          date: r.createdAt,
          rating: r.rating
        })),
        explorerCountries: Object.entries(countryStats).map(([name, value]) => ({ name, value }))
      }
    });

  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// Endpoint to track events (called from frontend)
router.post("/track", async (req, res) => {
    try {
        const { type, targetId, metadata } = req.body;
        await prisma.analyticsEvent.create({
            data: { type, targetId, metadata }
        });
        res.status(204).send();
    } catch (error) {
        // Silent fail for tracking
        res.status(204).send();
    }
});

export default router;
