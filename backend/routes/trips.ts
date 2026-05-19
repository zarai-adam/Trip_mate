import { Router } from "express";
import prisma from "../prisma.js";

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

router.post("/", async (req, res) => {
  try {
    const { title, description, destination, startDate, endDate, price, maxParticipants, guideId, difficulty, type, itinerary, included, latitude, longitude, isSoloFriendly } = req.body;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) || 1;
    const slug = `${title.toLowerCase().replace(/ /g, "-")}-${Date.now()}`;

    const trip = await prisma.trip.create({
      data: {
        title,
        slug,
        description,
        destination,
        startDate: start,
        endDate: end,
        durationDays,
        pricePerPerson: Number(price),
        groupSizeMin: 1,
        groupSizeMax: Number(maxParticipants),
        guideId,
        difficulty,
        tripType: type,
        itinerary: itinerary || [],
        inclusions: included || [],
        meetingPoint: "TBD",
        status: "PUBLISHED",
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        isSoloFriendly: isSoloFriendly ?? true
      }
    });
    res.status(201).json(trip);
  } catch (error) {
    console.error("Create trip error:", error);
    res.status(400).json({ error: "Failed to create trip" });
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
