import { Router } from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import { authenticate } from "../middleware/auth.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure uploads directory exists
await fs.mkdir(UPLOADS_DIR, { recursive: true });

router.post("/", authenticate, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalPath = path.join(UPLOADS_DIR, `${filename}.jpg`);
    const webpPath = path.join(UPLOADS_DIR, `${filename}.webp`);

    // Process and save as optimized JPG
    await sharp(req.file.buffer)
      .resize(1200, null, { withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(originalPath);

    // Process and save as WebP
    await sharp(req.file.buffer)
      .resize(1200, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(webpPath);

    const baseUrl = `/uploads/${filename}`;
    
    res.json({
      url: `${baseUrl}.jpg`,
      webp: `${baseUrl}.webp`,
      srcset: `${baseUrl}.webp 1200w, ${baseUrl}.jpg 1200w`
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to process image" });
  }
});

export default router;
