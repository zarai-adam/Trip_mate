import prisma from "../prisma.js";
import { getIO } from "../socket/index.js";

export const NotificationType = {
  BOOKING_REQUEST: "BOOKING_REQUEST",
  BOOKING_APPROVED: "BOOKING_APPROVED",
  BOOKING_REJECTED: "BOOKING_REJECTED",
  REVIEW_RECEIVED: "REVIEW_RECEIVED",
  APPLICATION_APPROVED: "APPLICATION_APPROVED",
  APPLICATION_REJECTED: "APPLICATION_REJECTED",
  TRIP_CANCELLED: "TRIP_CANCELLED",
  SYSTEM_ALERT: "SYSTEM_ALERT",
  QA_QUESTION: "QA_QUESTION",
  NEW_APPLICATION: "NEW_APPLICATION",
};

export interface CreateNotificationParams {
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: any;
}

export const createNotification = async (params: CreateNotificationParams) => {
  const { userId, type, title, body, data } = params;

  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        data: data || {},
      },
    });

    const io = getIO();
    io.to(`user-${userId}`).emit("notification:new", notification);

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    // Don't throw error to not break the main flow
    return null;
  }
};

export const notifyAdmins = async (params: Omit<CreateNotificationParams, "userId">) => {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true },
  });

  // Run in parallel for performance
  await Promise.all(
    admins.map(admin => createNotification({ ...params, userId: admin.id }))
  );
};
