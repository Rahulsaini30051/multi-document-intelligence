import { Router } from "express";
import { prisma } from "../config/database.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const documentCount = await prisma.document.count();

    res.json({
      success: true,
      database: "Connected",
      totalDocuments: documentCount
    });
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed"
    });
  }
});

export default router;