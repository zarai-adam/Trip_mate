import { Router, Response } from "express";
import prisma from "../prisma.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { 
      search, 
      type, 
      difficulty, 
      minPrice, 
      maxPrice, 
      destination, 
      startDate, 
      endDate, 
      minGroupSize, 
      maxGroupSize, 
      minDuration, 
      maxDuration, 
      language, 
      isSoloFriendly, 
      verifiedOnly,
      sort
    } = req.query;

    const where: any = { status: "PUBLISHED" };

    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: "insensitive" } },
        { destination: { contains: String(search), mode: "insensitive" } },
        { description: { contains: String(search), mode: "insensitive" } },
      ];
    }

    if (type && type !== "All") {
      where.tripType = type;
    }

    if (difficulty && difficulty !== "All") {
      where.difficulty = difficulty;
    }

    if (minPrice || maxPrice) {
      where.pricePerPerson = {};
      if (minPrice) where.pricePerPerson.gte = Number(minPrice);
      if (maxPrice) where.pricePerPerson.lte = Number(maxPrice);
    }

    if (destination) {
      where.destination = { contains: String(destination), mode: "insensitive" };
    }

    if (startDate && !isNaN(new Date(String(startDate)).getTime())) {
      where.startDate = { gte: new Date(String(startDate)) };
    }
    if (endDate && !isNaN(new Date(String(endDate)).getTime())) {
      where.endDate = { lte: new Date(String(endDate)) };
    }

    if (minGroupSize || maxGroupSize) {
      where.groupSizeMax = {};
      if (minGroupSize) where.groupSizeMax.gte = Number(minGroupSize);
      if (maxGroupSize) where.groupSizeMax.lte = Number(maxGroupSize);
    }

    if (minDuration || maxDuration) {
      where.durationDays = {};
      if (minDuration) where.durationDays.gte = Number(minDuration);
      if (maxDuration) where.durationDays.lte = Number(maxDuration);
    }

    if (language) {
      where.tripLanguage = { contains: String(language), mode: "insensitive" };
    }

    if (isSoloFriendly === "true") {
      where.isSoloFriendly = true;
    }

    if (verifiedOnly === "true") {
      where.guide = {
        role: "GUIDE"
      };
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort) {
      switch (sort) {
        case "newest":
          orderBy = { createdAt: "desc" };
          break;
        case "price-low":
          orderBy = { pricePerPerson: "asc" };
          break;
        case "price-high":
          orderBy = { pricePerPerson: "desc" };
          break;
        case "rating":
          orderBy = { guide: { ratingAverage: "desc" } };
          break;
        case "start-date":
          orderBy = { startDate: "asc" };
          break;
      }
    }

    const trips = await prisma.trip.findMany({
      where,
      include: { 
        guide: { 
          select: { 
            id: true,
            firstName: true, 
            lastName: true, 
            avatarUrl: true,
            ratingAverage: true
          } 
        } 
      },
      orderBy
    });

    const normalizedTrips = trips.map(t => ({
      ...t,
      price: Number(t.pricePerPerson),
      image: t.coverImageUrl,
      guide: {
        id: t.guide.id,
        name: `${t.guide.firstName} ${t.guide.lastName}`.trim(),
        avatar: t.guide.avatarUrl,
        rating: t.guide.ratingAverage
      }
    }));
    res.json(normalizedTrips);
  } catch (error: any) {
    console.error("Get trips error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    res.status(500).json({ error: "Failed to fetch trips" });
  }
});

// Create a trip (supports DRAFT and UNDER_REVIEW status)
router.post("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const { 
      title, 
      description, 
      destination, 
      startDate, 
      endDate, 
      price, 
      maxParticipants, 
      difficulty, 
      type, 
      itinerary, 
      included, 
      latitude, 
      longitude, 
      isSoloFriendly,
      coverImageUrl,
      status 
    } = req.body;
    
    const guideId = req.user!.id;
    
    // Resolve start / end dates gracefully for Drafts
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(Date.now() + 7 * 24 * 3600 * 1000); // Default to a week
    const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) || 1;
    const slug = `${(title || "untitled-trip").toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}`;

    const trip = await prisma.trip.create({
      data: {
        title: title || "Draft Adventure",
        slug,
        description: description || "",
        destination: destination || "TBD",
        startDate: start,
        endDate: end,
        durationDays,
        pricePerPerson: price ? Number(price) : 0,
        groupSizeMin: 1,
        groupSizeMax: maxParticipants ? Number(maxParticipants) : 8,
        guideId,
        difficulty: (difficulty?.toUpperCase() as any) || "MODERATE",
        tripType: (type?.toUpperCase() as any) || "MIXED",
        itinerary: itinerary || [],
        inclusions: included || [],
        meetingPoint: "TBD",
        status: status || "DRAFT",
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        isSoloFriendly: isSoloFriendly ?? true,
        coverImageUrl: coverImageUrl || null
      }
    });
    res.status(201).json(trip);
  } catch (error) {
    console.error("Create trip error:", error);
    res.status(400).json({ error: "Failed to create trip" });
  }
});

// Get guide's own trips
router.get("/guide/my-trips", authenticate, async (req: AuthRequest, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { guideId: req.user!.id },
      orderBy: { createdAt: "desc" }
    });
    const normalizedTrips = trips.map(t => ({
      ...t,
      price: Number(t.pricePerPerson),
      image: t.coverImageUrl
    }));
    res.json(normalizedTrips);
  } catch (error) {
    console.error("Failed to fetch guide trips:", error);
    res.status(500).json({ error: "Failed to fetch guide trips" });
  }
});

// Update a trip (allows resubmitting and updating drafts)
router.put("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      destination, 
      startDate, 
      endDate, 
      price, 
      maxParticipants, 
      difficulty, 
      type, 
      itinerary, 
      included, 
      coverImageUrl,
      latitude, 
      longitude, 
      isSoloFriendly,
      status 
    } = req.body;

    // Check ownership
    const existing = await prisma.trip.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Trip not found" });
    if (existing.guideId !== req.user!.id && req.user!.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden: Not your trip" });
    }

    const start = startDate ? new Date(startDate) : existing.startDate;
    const end = endDate ? new Date(endDate) : existing.endDate;
    const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) || existing.durationDays;

    const updated = await prisma.trip.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        description: description !== undefined ? description : existing.description,
        destination: destination !== undefined ? destination : existing.destination,
        startDate: start,
        endDate: end,
        durationDays,
        pricePerPerson: price !== undefined ? Number(price) : existing.pricePerPerson,
        groupSizeMax: maxParticipants !== undefined ? Number(maxParticipants) : existing.groupSizeMax,
        difficulty: difficulty ? (difficulty.toUpperCase() as any) : existing.difficulty,
        tripType: type ? (type.toUpperCase() as any) : existing.tripType,
        itinerary: itinerary !== undefined ? itinerary : existing.itinerary,
        inclusions: included !== undefined ? included : existing.inclusions,
        coverImageUrl: coverImageUrl !== undefined ? coverImageUrl : existing.coverImageUrl,
        status: status !== undefined ? status : existing.status,
        latitude: latitude !== undefined ? (latitude ? Number(latitude) : null) : existing.latitude,
        longitude: longitude !== undefined ? (longitude ? Number(longitude) : null) : existing.longitude,
        isSoloFriendly: isSoloFriendly !== undefined ? isSoloFriendly : existing.isSoloFriendly
      }
    });

    res.json(updated);
  } catch (error) {
    console.error("Failed to update trip:", error);
    res.status(400).json({ error: "Failed to update trip" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: req.params.id },
      include: { 
        guide: { 
          select: { 
            id: true,
            firstName: true, 
            lastName: true, 
            avatarUrl: true, 
            bio: true 
          } 
        } 
      }
    });
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    
    const normalizedTrip = {
      ...trip,
      price: Number(trip.pricePerPerson),
      guide: {
        id: trip.guide.id,
        name: `${trip.guide.firstName} ${trip.guide.lastName}`.trim(),
        avatar: trip.guide.avatarUrl,
        bio: trip.guide.bio
      }
    };
    res.json(normalizedTrip);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
