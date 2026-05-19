import { Router, Response } from "express";
import prisma from "../prisma.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import { createNotification, NotificationType } from "../services/notificationService.js";

const router = Router();

router.get("/trip/:tripId", async (req, res) => {
  try {
    const questions = await prisma.tripQuestion.findMany({
      where: { tripId: req.params.tripId },
      include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } },
      orderBy: { createdAt: "desc" }
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { tripId, question } = req.body;
    const userId = req.user!.id;

    const tripQuestion = await prisma.tripQuestion.create({
      data: {
        tripId,
        userId,
        question
      },
      include: {
        trip: { include: { guide: true } },
        user: true
      }
    });

    // Notify Guide
    await createNotification({
      userId: tripQuestion.trip.guideId,
      type: NotificationType.QA_QUESTION,
      title: "New Q&A Question",
      body: `❓ ${tripQuestion.user.firstName} asked a question about your ${tripQuestion.trip.title} trip`,
      data: { questionId: tripQuestion.id, tripId: tripQuestion.tripId }
    });

    res.status(201).json(tripQuestion);
  } catch (error) {
    console.error("Create question error:", error);
    res.status(400).json({ error: "Failed to post question" });
  }
});

router.patch("/:id/answer", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { answer } = req.body;
    const { id } = req.params;

    const tripQuestion = await prisma.tripQuestion.update({
      where: { id },
      data: { answer },
      include: { user: true, trip: true }
    });

    // Optionally notify the user who asked
    await createNotification({
      userId: tripQuestion.userId,
      type: NotificationType.SYSTEM_ALERT,
      title: "Question Answered",
      body: `💡 Your question about ${tripQuestion.trip.title} has been answered by the guide!`,
      data: { questionId: id, tripId: tripQuestion.tripId }
    });

    res.json(tripQuestion);
  } catch (error) {
    res.status(400).json({ error: "Failed to post answer" });
  }
});

export default router;
