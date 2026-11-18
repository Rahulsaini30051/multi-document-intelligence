
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./routes/health.routes.js";
import documentRoutes from "./routes/document.routes.js";
import analysisRoutes from "./routes/analysis.routes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/health", healthRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/analyses", analysisRoutes);

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Multi-Document Intelligence API is running"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import type { Request, Response, NextFunction } from "express";
import multer from "multer";

app.use((
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "File size exceeds the 10 MB limit."
          : "Upload limit exceeded."
    });
  }

  if (error instanceof Error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  return res.status(500).json({
    success: false,
    message: "Unexpected server error."
  });
});