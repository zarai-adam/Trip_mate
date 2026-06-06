import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer as createViteServer } from "vite";
import prisma from "./prisma.js";

// Routes imports
import authRoutes from "./routes/auth.js";
import tripRoutes from "./routes/trips.js";
import guideRoutes from "./routes/guides.js";
import bookingRoutes from "./routes/bookings.js";
import adminRoutes from "./routes/admin.js";
import supportRoutes from "./routes/support.js";
import notificationRoutes from "./routes/notifications.js";
import reviewRoutes from "./routes/reviews.js";
import questionRoutes from "./routes/questions.js";
import messageRoutes from "./routes/messages.js";
import userRoutes from "./routes/users.js";
import analyticsRoutes from "./routes/analytics.js";
import reportRoutes from "./routes/reports.js";
import { setupSocket } from "./socket/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",").map(url => url.trim())
    : ["http://localhost:3000", "http://localhost:5173"];

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) ||
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^https:\/\/.*\.run\.app$/.test(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  }));

  app.use(express.json());
  app.use(cookieParser());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/api/health-db", async (req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      const userCount = await prisma.user.count();
      res.json({ status: "connected", userCount });
    } catch (error) {
      res.status(500).json({ status: "disconnected", error: String(error) });
    }
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/trips", tripRoutes);
  app.use("/api/guides", guideRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/support", supportRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/questions", questionRoutes);
  app.use("/api/messages", messageRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/reports", reportRoutes);
  app.use("/api/upload", (await import("./routes/upload.js")).default);

  // SEO: robots.txt and sitemap.xml
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send("User-agent: *\nAllow: /\nSitemap: https://tripmate.com/sitemap.xml");
  });

  app.get("/sitemap.xml", async (req, res) => {
    try {
      const trips = await prisma.trip.findMany({
        where: { status: "PUBLISHED" },
        select: { id: true, updatedAt: true }
      });

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tripmate.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://tripmate.com/explore</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://tripmate.com/guides</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  ${trips.map(t => `
  <url>
    <loc>https://tripmate.com/trip/${t.id}</loc>
    <lastmod>${t.updatedAt.toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`;

      res.type("application/xml");
      res.send(sitemap);
    } catch (error) {
      res.status(500).send("Error generating sitemap");
    }
  });

  // Setup Socket.io
  setupSocket(httpServer);

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Note: process.cwd() is used because dist is in the root
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
