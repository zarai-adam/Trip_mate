import { Router, Response } from "express";
import prisma from "../prisma.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import { createNotification, NotificationType, notifyAdmins } from "../services/notificationService.js";
import { filterProfanity } from "../services/moderation.js";

const router = Router();

router.use(authenticate);

// Get reviews given or received by the user
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const reviews = await prisma.review.findMany({
      where: {
        OR: [
          { reviewerId: userId },
          { revieweeId: userId }
        ]
      },
      include: {
        reviewer: true,
        reviewee: true,
        trip: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const formattedReviews = reviews.map(r => ({
      id: r.id,
      tripTitle: r.trip.title,
      authorName: `${r.reviewer.firstName} ${r.reviewer.lastName}`,
      authorAvatar: r.reviewer.avatarUrl,
      rating: r.rating,
      comment: r.comment,
      date: new Date(r.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
      })
    }));

    res.json(formattedReviews);
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ error: "Failed to load reviews" });
  }
});

// Create a review
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const { tripId, bookingId, revieweeId, rating, comment, reviewerType } = req.body;
    const reviewerId = req.user!.id;
    const filteredComment = filterProfanity(comment);

    const review = await prisma.review.create({
      data: {
        tripId,
        bookingId,
        reviewerId,
        revieweeId,
        rating,
        comment: filteredComment,
        reviewerType,
        isVisible: true
      },
      include: {
        reviewer: true,
        reviewee: true,
        trip: true
      }
    });

    // Notify Reviewee
    await createNotification({
      userId: revieweeId,
      type: NotificationType.REVIEW_RECEIVED,
      title: "New Review Received",
      body: `⭐ ${review.reviewer.firstName} left you a ${rating}-star review on ${review.trip.title}`,
      data: { reviewId: review.id, tripId: review.tripId }
    });

    // Auto-suspend logic if rating is low (just for demonstration as per requirement)
    // "Admin receives: User auto-suspended: 3 negative reviews"
    if (rating <= 2) {
      const negativeReviews = await prisma.review.count({
        where: { revieweeId, rating: { lte: 2 } }
      });

      if (negativeReviews >= 3) {
        await prisma.user.update({
          where: { id: revieweeId },
          data: { status: "SUSPENDED" }
        });

        // Notify Admins
        const user = review.reviewee;
        const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
        for (const admin of admins) {
          await createNotification({
            userId: admin.id,
            type: NotificationType.SYSTEM_ALERT,
            title: "User Auto-Suspended",
            body: `🚫 User suspended: 3 negative reviews (${user.firstName} ${user.lastName})`,
            data: { userId: revieweeId }
          });
        }
      }
    }

    res.status(201).json(review);
  } catch (error) {
    console.error("Create review error:", error);
    res.status(400).json({ error: "Failed to create review" });
  }
});

// Flag a review
router.post("/:id/flag", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const reporterName = req.user?.id ? (await prisma.user.findUnique({ where: { id: req.user.id } }))?.firstName : "A user";

    const review = await prisma.review.findUnique({
      where: { id },
      include: { reviewer: true, trip: true }
    });

    if (!review) return res.status(404).json({ error: "Review not found" });

    // Notify Admins
    await notifyAdmins({
      type: NotificationType.SYSTEM_ALERT,
      title: "Review Flagged",
      body: `🚩 Review reported by ${reporterName}: "${review.comment.substring(0, 30)}..."`,
      data: { reviewId: id }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to flag review" });
  }
});

export default router;
