import { Router } from "express";
import prisma from "../prisma.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import { createNotification, NotificationType } from "../services/notificationService.js";

const router = Router();

router.post("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const { tripId, userId, introMessage } = req.body;
    
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (user && !user.emailVerified) {
      return res.status(403).json({ 
        error: "UNVERIFIED_EMAIL",
        message: "Please verify your email address before booking trips." 
      });
    }

    const booking = await prisma.booking.create({
      data: {
        tripId,
        explorerId: userId,
        status: "REQUESTED",
        introMessage
      },
      include: {
        trip: {
          include: { guide: true }
        },
        explorer: true
      }
    });

    // Notify Guide
    await createNotification({
      userId: booking.trip.guideId,
      type: NotificationType.BOOKING_REQUEST,
      title: "New Booking Request",
      body: `🎒 ${booking.explorer.firstName} wants to join your ${booking.trip.title} trip`,
      data: { bookingId: booking.id, tripId: booking.tripId }
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(400).json({ error: "Failed to create booking" });
  }
});

router.get("/", async (req, res) => {
  const userId = req.query.userId as string;
  const guideId = req.query.guideId as string;
  
  if (!userId && !guideId) return res.status(400).json({ error: "UserId or GuideId required" });

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        ...(userId ? { explorerId: userId } : { trip: { guideId } })
      },
      include: { 
        trip: { 
          include: { 
            guide: { 
              select: { firstName: true, lastName: true, avatarUrl: true } 
            } 
          } 
        },
        explorer: {
          select: { firstName: true, lastName: true, avatarUrl: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    
    const normalizedBookings = bookings.map(b => ({
      ...b,
      trip: {
        ...b.trip,
        guide: {
          name: `${b.trip.guide.firstName} ${b.trip.guide.lastName}`.trim(),
          avatar: b.trip.guide.avatarUrl
        }
      },
      explorer: {
        name: `${b.explorer.firstName} ${b.explorer.lastName}`.trim(),
        avatar: b.explorer.avatarUrl
      }
    }));
    res.json(normalizedBookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.patch("/:id/status", authenticate, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { status, message } = req.body;

  try {
    const currentBooking = await prisma.booking.findUnique({
      where: { id },
      include: { trip: true, explorer: true }
    });

    if (!currentBooking) return res.status(404).json({ error: "Booking not found" });

    const booking = await prisma.booking.update({
      where: { id },
      data: { 
        status,
        guideResponse: message
      },
      include: { trip: { include: { guide: true } } }
    });

    // Notify Explorer
    if (status === "APPROVED") {
      await createNotification({
        userId: booking.explorerId,
        type: NotificationType.BOOKING_APPROVED,
        title: "Booking Approved!",
        body: `✅ ${booking.trip.guide.firstName} approved your ${booking.trip.title} request!`,
        data: { bookingId: booking.id, tripId: booking.tripId }
      });
    } else if (status === "REJECTED") {
      await createNotification({
        userId: booking.explorerId,
        type: NotificationType.BOOKING_REJECTED,
        title: "Booking Declined",
        body: `❌ Your request for ${booking.trip.title} trip was declined`,
        data: { bookingId: booking.id, tripId: booking.tripId }
      });
    }

    res.json(booking);
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(400).json({ error: "Failed to update booking status" });
  }
});

router.patch("/:id/cancel", async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" }
    });
    res.json(booking);
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(400).json({ error: "Failed to cancel booking" });
  }
});

export default router;
