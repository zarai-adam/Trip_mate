import { PrismaClient, UserRole, UserStatus, GuideApplicationStatus, TripStatus, Difficulty, TripType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Clear existing data to avoid unique constraint issues during development re-seeds
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.tripQuestion.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.guideApplication.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.user.deleteMany({
    where: {
      email: {
        in: [
          "admin@tripmate.app",
          "sarah@tripmate.app",
          "marco@tripmate.app",
          "amara@tripmate.app",
          "alex@tripmate.app",
          "maria@tripmate.app",
          "james@tripmate.app",
          "yuki@tripmate.app"
        ]
      }
    }
  });

  const rounds = 10;
  const adminPass = await bcrypt.hash("Admin123!", rounds);
  const guidePass = await bcrypt.hash("Guide123!", rounds);
  const explorerPass = await bcrypt.hash("Explorer123!", rounds);

  // 1. ADMIN
  const admin = await prisma.user.upsert({
    where: { email: "admin@tripmate.app" },
    update: {},
    create: {
      email: "admin@tripmate.app",
      passwordHash: adminPass,
      firstName: "Admin",
      lastName: "TripMate",
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
  });

  // 2. APPROVED GUIDES
  const sarah = await prisma.user.create({
    data: {
      email: "sarah@tripmate.app",
      passwordHash: guidePass,
      firstName: "Sarah",
      lastName: "Chen",
      country: "Vancouver, Canada",
      bio: "Photographer and hiker. 47 countries explored. I believe that the most beautiful places are the ones that take the most effort to reach. My goal is to capture the raw essence of nature and share it with my fellow travelers.",
      tagline: "Exploring the wild through a lens.",
      languages: ["English", "Mandarin", "French"],
      countriesVisited: ["Canada", "Chile", "Argentina", "Iceland", "Norway", "New Zealand", "Peru"],
      specialties: ["Hiking", "Photography", "Nature", "Backpacking"],
      travelPhilosophy: "Travel is not just about seeing new places, but about seeing the world with new eyes.",
      responseRate: 100,
      responseTime: "within an hour",
      role: UserRole.GUIDE,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      ratingAverage: 4.9,
      totalReviews: 28,
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      coverUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
      guideApplications: {
        create: {
          travelExperience: "10 years of solo mountaineering and professional landscape photography.",
          specialties: ["Hiking", "Photography", "Nature"],
          languagesSpoken: ["English", "Mandarin"],
          countriesVisited: ["Canada", "Chile", "Argentina", "Iceland"],
          whyBecomeGuide: "To share the world's most remote landscapes through a visual and physical journey.",
          status: GuideApplicationStatus.APPROVED,
          reviewedById: admin.id,
          reviewedAt: new Date(),
        }
      }
    },
  });

  const marco = await prisma.user.create({
    data: {
      email: "marco@tripmate.app",
      passwordHash: guidePass,
      firstName: "Marco",
      lastName: "Rossi",
      country: "Rome, Italy",
      bio: "Italian chef and food traveler. Authentic experiences only. I have spent my life in kitchens and on cobblestone streets. My passion is finding the true heart of a city through its flavors and the people who make them.",
      tagline: "Authentically Italian, from the roots up.",
      languages: ["Italian", "English", "Spanish"],
      countriesVisited: ["Italy", "France", "Spain", "Greece", "USA", "Thailand"],
      specialties: ["Cooking", "Wine", "History", "Local Culture"],
      travelPhilosophy: "To eat well is to live well.",
      responseRate: 98,
      responseTime: "within 2 hours",
      role: UserRole.GUIDE,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      ratingAverage: 4.8,
      totalReviews: 22,
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      coverUrl: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=1200",
      guideApplications: {
        create: {
          travelExperience: "Raised in a restaurant family in Trastevere, worked in 3 Michelin stars across Europe.",
          specialties: ["Food", "Culture", "History"],
          languagesSpoken: ["English", "Italian", "French"],
          countriesVisited: ["Italy", "France", "Spain", "Greece"],
          whyBecomeGuide: "Food is the shortest bridge between two cultures.",
          status: GuideApplicationStatus.APPROVED,
          reviewedById: admin.id,
          reviewedAt: new Date(),
        }
      }
    },
  });

  const amara = await prisma.user.create({
    data: {
      email: "amara@tripmate.app",
      passwordHash: guidePass,
      firstName: "Amara",
      lastName: "Diallo",
      country: "Dakar, Senegal",
      bio: "Safari guide and adventure specialist. Wildlife photographer. My life is dedicated to protecting the wild places of Africa and sharing their beauty with those who respect nature.",
      tagline: "Guardian of the wild.",
      languages: ["English", "French", "Wolof", "Swahili"],
      countriesVisited: ["Senegal", "Tanzania", "Kenya", "South Africa", "Namibia", "Botswana"],
      specialties: ["Wildlife", "Safari", "Nature", "Conservation"],
      travelPhilosophy: "Nature is the best teacher.",
      responseRate: 100,
      responseTime: "within 30 minutes",
      role: UserRole.GUIDE,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      ratingAverage: 4.7,
      totalReviews: 15,
      avatarUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200",
      coverUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200",
      guideApplications: {
        create: {
          travelExperience: "Certified wildlife tracker and conservationist with 8 years in the Serengeti system.",
          specialties: ["Wildlife", "Adventure", "Safari"],
          languagesSpoken: ["English", "French", "Wolof"],
          countriesVisited: ["Senegal", "Tanzania", "Kenya", "South Africa"],
          whyBecomeGuide: "Protecting wildlife begins with showing people its majesty up close.",
          status: GuideApplicationStatus.APPROVED,
          reviewedById: admin.id,
          reviewedAt: new Date(),
        }
      }
    },
  });

  // 3. EXPLORERS
  await prisma.user.createMany({
    data: [
      { email: "alex@tripmate.app", passwordHash: explorerPass, firstName: "Alex", lastName: "Kumar", country: "London, UK", role: UserRole.EXPLORER, emailVerified: true },
      { email: "maria@tripmate.app", passwordHash: explorerPass, firstName: "Maria", lastName: "Santos", country: "Lisbon, Portugal", role: UserRole.EXPLORER, emailVerified: true },
      { email: "james@tripmate.app", passwordHash: explorerPass, firstName: "James", lastName: "Wilson", country: "Toronto, Canada", role: UserRole.EXPLORER, emailVerified: true },
    ],
  });

  // 4. PENDING GUIDE
  await prisma.user.create({
    data: {
      email: "yuki@tripmate.app",
      passwordHash: guidePass,
      firstName: "Yuki",
      lastName: "Tanaka",
      country: "Kyoto, Japan",
      role: UserRole.GUIDE,
      status: UserStatus.PENDING,
      guideApplications: {
        create: {
          travelExperience: "Avid solo traveler across East Asia, focused on traditional architectures.",
          specialties: ["Culture", "Temples", "Food"],
          languagesSpoken: ["English", "Japanese", "Korean"],
          whyBecomeGuide: "Born in Kyoto, raised between Tokyo and Seoul. I want to show travelers the Japan tourists never see — hidden temples, secret ramen shops, and the real rhythm of Japanese life.",
          status: GuideApplicationStatus.PENDING,
        }
      }
    },
  });

  // 5. TRIPS
  await prisma.trip.create({
    data: {
      guideId: sarah.id,
      title: "Patagonia: Torres del Paine Circuit",
      slug: "patagonia-torres-del-paine-circuit",
      description: "Join us for an epic 12-day journey through the heart of Chilean Patagonia. This challenging circuit takes you deep into the 'W' and 'O' trails, witnessing the iconic granite towers, moving glaciers, and cerulean lakes. We will camp under the southern stars and wake up to the sound of crumbling ice from Glacier Grey. Perfect for photography enthusiasts and seasoned hikers alike.",
      destination: "Torres del Paine, Chile",
      startDate: new Date("2026-05-15"),
      endDate: new Date("2026-05-26"),
      durationDays: 12,
      difficulty: Difficulty.CHALLENGING,
      tripType: TripType.MOUNTAIN,
      pricePerPerson: 1200,
      groupSizeMin: 4,
      groupSizeMax: 8,
      status: TripStatus.PUBLISHED,
      meetingPoint: "Arrival hall at Puerto Natales Airport (PNT)",
      latitude: -51.0062,
      longitude: -73.0560,
      itinerary: [
        { day: 1, title: "Arrival in Puerto Natales", desc: "Welcome dinner and gear check.", activities: ["Kit inspection", "Safety briefing", "Local seafood dinner"] },
        { day: 2, title: "Base of the Towers", desc: "The steep ascent to the iconic viewpoint.", activities: ["Hike to Base Las Torres", "Photography workshop", "Camp at Central"] },
        { day: 3, title: "Nordenskjöld Lake", desc: "Panoramic views of the Almirante Nieto mountain.", activities: ["Shoreline trekking", "Wildlife spotting", "Camp at Cuernos"] },
        { day: 4, title: "French Valley", desc: "Hike into a natural granite amphitheater.", activities: ["Viewpoint climb", "Glacier listening", "Camp at Italiano"] },
        { day: 5, title: "Glacier Grey", desc: "Boat ride or hike to the ice towers.", activities: ["Glacier ice walk (optional)", "Boat tour", "Camp at Grey"] },
      ],
      inclusions: ["All camping equipment", "Professional photography guidance", "Three meals a day", "Park entrance fees", "Local transport", "Professional guide service", "First Aid support"],
      exclusions: ["International flights", "Personal medical insurance", "Alcoholic beverages", "Ice walking optional tour", "Sleeping bag rental"],
      tags: ["hiking", "photography", "camping"],
      coverImageUrl: "https://via.placeholder.com/800x500",
    },
  });

  await prisma.trip.create({
    data: {
      guideId: marco.id,
      title: "Tuscany: Eat Like a Local",
      slug: "tuscany-eat-like-a-local",
      description: "Leave the tourist traps behind and discover the soul of Tuscany through its kitchens. We will base ourselves in a 16th-century villa near Siena, visiting family-owned vineyards, learning the art of hand-rolled pici pasta, and hunting for truffles in the morning fog. This is an immersive cultural journey where every plate tells a story of the land.",
      destination: "Tuscany, Italy",
      startDate: new Date("2026-06-08"),
      endDate: new Date("2026-06-14"),
      durationDays: 7,
      difficulty: Difficulty.EASY,
      tripType: TripType.CULTURAL,
      pricePerPerson: 890,
      groupSizeMin: 4,
      groupSizeMax: 10,
      status: TripStatus.PUBLISHED,
      meetingPoint: "Siena Train Station Main Entrance",
      latitude: 43.3183,
      longitude: 11.3329,
      itinerary: [
        { day: 1, title: "Benvenuti in Toscana", desc: "Arrival at the villa and Chianti tasting.", activities: ["Villa check-in", "Sunset wine tasting", "Local antipasti board"] },
        { day: 2, title: "The Art of Pasta", desc: "Masterclass with Mamma Lucia.", activities: ["Pasta making class", "Local market visit", "Al fresco lunch"] },
        { day: 3, title: "Siena's Secrets", desc: "Walking tour of the medieval heart.", activities: ["Duomo climb", "Secret bakery visit", "Dinner in Piazza del Campo"] },
        { day: 4, title: "Truffle Hunt", desc: "Morning in the forest with trained dogs.", activities: ["Forest trek with dogs", "Truffle lunch", "Siesta time"] },
        { day: 5, title: "Pienza & Pecorino", desc: "Exploring the ideal Renaissance city.", activities: ["Cheese tasting", "Photography in Val d'Orcia", "Traditional dinner"] },
      ],
      inclusions: ["Accommodation in luxury villa", "All workshops and masterclasses", "Daily breakfast & dinner", "Truffle hunt experience", "Private driver for excursions", "Wine with meals"],
      exclusions: ["Flights to Italy", "Lunch on free days", "Tips for local producers"],
      tags: ["food", "wine", "cooking", "culture"],
      coverImageUrl: "https://via.placeholder.com/800x500",
    },
  });

  await prisma.trip.create({
    data: {
      guideId: amara.id,
      title: "Serengeti Wildlife Safari",
      slug: "serengeti-wildlife-safari",
      description: "Witness the greatest show on earth. Our 10-day expedition tracks the migration through the heart of the Serengeti. We travel in customized open-top safari vehicles for 360-degree views, staying in luxury tented camps that bring you as close to the wildlife as safety allows. Amara's deep knowledge of animal behavior ensures you don't just see the animals, you understand their world.",
      destination: "Serengeti, Tanzania",
      startDate: new Date("2026-07-01"),
      endDate: new Date("2026-07-10"),
      durationDays: 10,
      difficulty: Difficulty.MODERATE,
      tripType: TripType.MIXED,
      pricePerPerson: 2400,
      groupSizeMin: 3,
      groupSizeMax: 6,
      status: TripStatus.PUBLISHED,
      meetingPoint: "Kilimanjaro International Airport (JRO) Arrivals",
      latitude: -2.3333,
      longitude: 34.8333,
      itinerary: [
        { day: 1, title: "Introduction to the Bush", desc: "Flight to the central Serengeti.", activities: ["Bush plane transfer", "Camp check-in", "Sunset game drive"] },
        { day: 2, title: "The Big Five", desc: "Full day tracking lions, leopards, and elephants.", activities: ["Dawn safari", "Bush picnic lunch", "Night sounds briefing"] },
        { day: 3, title: "Rhino Tracking", desc: "Search for the elusive black rhino.", activities: ["High-spec tracking", "Conservation talk", "Evening bonfire"] },
        { day: 4, title: "Mara River Crossing", desc: "Witness the river crossing (wildlife dependent).", activities: ["River observation", "Migration lecture", "Mobile camp move"] },
        { day: 5, title: "Photography Day", desc: "Focus on capturing the perfect light and motion.", activities: ["Masterclass behind the lens", "Editing session", "Gala bush dinner"] },
      ],
      inclusions: ["Luxury tented camp lodging", "All park and conservancy fees", "Professional wildlife tracker", "Organic local meals", "Unlimited bottled water", "4x4 Safari vehicle transfers", "Domestic bush flights"],
      exclusions: ["International airfare", "Tanzania Visa fees", "Yellow Fever vaccination", "Hot air balloon safari (optional)"],
      tags: ["wildlife", "safari", "photography", "adventure"],
      coverImageUrl: "https://via.placeholder.com/800x500",
    },
  });

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
