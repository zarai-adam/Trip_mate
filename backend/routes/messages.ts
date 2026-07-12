import express from "express";
import prisma from "../prisma.js";
import { authenticate } from "../middleware/auth.js";
import { getIO } from "../socket/index.js";
import { Request } from "express";
import { filterProfanity } from "../services/moderation.js";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: any;
  };
}

const router = express.Router();

// Get all conversations for current user
router.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = (req as any).user.id;

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: { some: { id: userId } }
      },
      include: {
        participants: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            role: true
          }
        },
        trip: {
          select: {
            id: true,
            title: true,
            coverImageUrl: true
          }
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            readBy: {
              select: { id: true }
            }
          }
        }
      },
      orderBy: { lastMessageAt: "desc" }
    });

    // Format for frontend
    const formatted = conversations.map(conv => {
      const lastMessage = conv.messages[0];
      const unreadCount = conv.messages.filter(m => !m.readBy.some(u => u.id === userId)).length; // This only checks the 'take 1', we need a better unread count

      return {
        ...conv,
        lastMessage,
        unreadCount: 0 // Will calculate separately if needed, but let's keep it simple for now or fetch true count
      };
    });

    // True unread count per conversation
    const withUnread = await Promise.all(formatted.map(async conv => {
      const count = await prisma.message.count({
        where: {
          conversationId: conv.id,
          NOT: {
            readBy: { some: { id: userId } }
          }
        }
      });
      return { ...conv, unreadCount: count };
    }));

    res.json(withUnread);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get messages for a conversation
router.get("/:conversationId/messages", authenticate, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = (req as any).user.id;
    const limit = parseInt(req.query.limit as string) || 50;
    const before = req.query.before as string;

    // Verify membership
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: { some: { id: userId } }
      }
    });

    if (!conversation && (req as any).user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied" });
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        ...(before ? { createdAt: { lt: new Date(before) } } : {})
      },
      include: {
        sender: {
          select: { id: true, firstName: true, avatarUrl: true }
        },
        readBy: {
          select: { id: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: limit
    });

    res.json(messages.reverse());
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Send a message
router.post("/:conversationId/messages", authenticate, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { body } = req.body;
    const userId = (req as any).user.id;
    const filteredBody = filterProfanity(body);

    if (!body || body.trim() === "") {
      return res.status(400).json({ error: "Message body is required" });
    }

    // Verify membership
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true }
    });

    if (!conversation || !conversation.participants.some(p => p.id === userId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        body: filteredBody,
        readBy: { connect: { id: userId } }
      },
      include: {
        sender: {
          select: { id: true, firstName: true, avatarUrl: true }
        },
        readBy: {
          select: { id: true }
        }
      }
    });

    // Update conversation lastMessageAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() }
    });

    // Broadcast via socket
    const io = getIO();
    io.to(`conv-${conversationId}`).emit("message:new", message);
    
    // Also notify other participants who might not be in the conversation room
    conversation.participants.forEach(p => {
      if (p.id !== userId) {
        io.to(`user-${p.id}`).emit("notification:message", {
          conversationId,
          message
        });
      }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create or get direct conversation by email/username
router.post("/by-username", authenticate, async (req, res) => {
  try {
    const { username } = req.body;
    const userId = (req as any).user.id;

    if (!username) {
      return res.status(400).json({ error: "Username or Email is required" });
    }

    const trimmed = username.trim();

    // Find user by email, or firstName, or lastName
    const otherUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: trimmed, mode: "insensitive" } },
          { firstName: { equals: trimmed, mode: "insensitive" } },
          { lastName: { equals: trimmed, mode: "insensitive" } }
        ]
      }
    });

    if (!otherUser) {
      return res.status(404).json({ error: `No user or expert found with username/email "${trimmed}"` });
    }

    if (otherUser.id === userId) {
      return res.status(400).json({ error: "You cannot start a chat with yourself" });
    }

    // Check if direct conversation already exists
    let conversation = await prisma.conversation.findFirst({
      where: {
        type: "DIRECT",
        participants: {
          every: { id: { in: [userId, otherUser.id] } }
        },
        AND: {
          participants: { some: { id: userId } }
        }
      },
      include: {
        participants: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            role: true
          }
        }
      }
    });

    // Exact check for exactly 2 participants
    if (conversation && conversation.participants.length !== 2) {
      conversation = null;
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          type: "DIRECT",
          participants: {
            connect: [{ id: userId }, { id: otherUser.id }]
          }
        },
        include: {
          participants: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
              role: true
            }
          }
        }
      });
    }

    res.json(conversation);
  } catch (error) {
    console.error("Error starting conversation by username:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create or get direct conversation
router.post("/direct", authenticate, async (req, res) => {
  try {
    const { otherUserId, tripId } = req.body;
    const userId = (req as any).user.id;

    if (!otherUserId) {
      return res.status(400).json({ error: "Recipient ID is required" });
    }

    // Check if explorer-guide relation exists for this trip
    if (tripId) {
      const booking = await prisma.booking.findFirst({
        where: {
          tripId,
          explorerId: userId,
          // Any status allows DM if they've at least requested
        }
      });

      const trip = await prisma.trip.findUnique({ where: { id: tripId } });
      
      // If user is guide, they can DM participant
      const guideIsMe = trip?.guideId === userId;
      const otherIsGuide = trip?.guideId === otherUserId;

      if (!booking && !guideIsMe && (req as any).user.role !== "ADMIN") {
        return res.status(403).json({ error: "You can only message guides of trips you've booked or requested." });
      }
    }

    // Check if direct conversation already exists
    let conversation = await prisma.conversation.findFirst({
      where: {
        type: "DIRECT",
        participants: {
          every: { id: { in: [userId, otherUserId] } }
        },
        // Must have exactly these two
        AND: {
          participants: { some: { id: userId } }
        },
        // AND part doesn't strictly enforce "only these two" in prisma-some-every combos easily
        // We'll filter the result manually or use a more precise query
      },
      include: {
        participants: {
          select: { id: true, firstName: true, avatarUrl: true }
        }
      }
    });

    // Exact check for 2 participants
    if (conversation && conversation.participants.length !== 2) {
       conversation = null;
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          type: "DIRECT",
          participants: {
            connect: [{ id: userId }, { id: otherUserId }]
          }
        },
        include: {
          participants: {
            select: { id: true, firstName: true, avatarUrl: true }
          }
        }
      });
    }

    res.json(conversation);
  } catch (error) {
    console.error("Error starting conversation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create or get group conversation for a trip
router.get("/trip/:tripId", authenticate, async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = (req as any).user.id;

    // Check if user is participant or guide
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        bookings: {
          where: { status: "CONFIRMED" },
          select: { explorerId: true }
        }
      }
    });

    if (!trip) return res.status(404).json({ error: "Trip not found" });

    const isGuide = trip.guideId === userId;
    const isParticipant = trip.bookings.some(b => b.explorerId === userId);

    if (!isGuide && !isParticipant && (req as any).user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied. Only confirmed participants can join the group chat." });
    }

    let conversation = await prisma.conversation.findFirst({
      where: {
        type: "GROUP",
        tripId
      },
      include: {
        participants: {
          select: { id: true, firstName: true, avatarUrl: true }
        }
      }
    });

    if (!conversation) {
      // Create it and add all confirmed participants + guide
      const participantIds = trip.bookings.map(b => b.explorerId);
      participantIds.push(trip.guideId);

      conversation = await prisma.conversation.create({
        data: {
          type: "GROUP",
          tripId,
          participants: {
            connect: participantIds.map(id => ({ id }))
          }
        },
        include: {
          participants: {
            select: { id: true, firstName: true, avatarUrl: true }
          }
        }
      });
    } else {
      // Potentially update participants list to include any new confirmed bookings
      const participantIds = trip.bookings.map(b => b.explorerId);
      participantIds.push(trip.guideId);
      
      const currentParticipantIds = conversation.participants.map(p => p.id);
      const newIds = participantIds.filter(id => !currentParticipantIds.includes(id));

      if (newIds.length > 0) {
        conversation = await prisma.conversation.update({
          where: { id: conversation.id },
          data: {
            participants: {
              connect: newIds.map(id => ({ id }))
            }
          },
          include: {
            participants: {
              select: { id: true, firstName: true, avatarUrl: true }
            }
          }
        });
      }
    }

    res.json(conversation);
  } catch (error) {
    console.error("Error fetching trip conversation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Mark conversation as read
router.post("/:conversationId/read", authenticate, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = (req as any).user.id;

    // Update all messages in this conversation to be read by this user
    const unreadMessages = await prisma.message.findMany({
      where: {
        conversationId,
        NOT: {
          readBy: { some: { id: userId } }
        }
      },
      select: { id: true }
    });

    if (unreadMessages.length > 0) {
      await Promise.all(unreadMessages.map(msg => 
        prisma.message.update({
          where: { id: msg.id },
          data: {
            readBy: { connect: { id: userId } }
          }
        })
      ));
    }

    res.json({ success: true, count: unreadMessages.length });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get total unread count for navbar
router.get("/unread-total", authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const count = await prisma.message.count({
      where: {
        conversation: {
          participants: { some: { id: userId } }
        },
        NOT: {
          readBy: { some: { id: userId } }
        }
      }
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
