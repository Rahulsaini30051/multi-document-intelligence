
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";

const uploadDirectory = path.resolve(process.cwd(), "uploads");

fs.mkdirSync(uploadDirectory, { recursive: true });

const allowedTypes: Record<string, string[]> = {
  ".pdf": ["application/pdf"],
  ".txt": ["text/plain"],
  ".csv": ["text/csv", "application/vnd.ms-excel"]
};

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    callback(null, `${randomUUID()}${extension}`);
  }
});

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  callback
) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const validMimeTypes = allowedTypes[extension];

  if (!validMimeTypes || !validMimeTypes.includes(file.mimetype)) {
    return callback(
      new Error("Unsupported file format. Upload PDF, TXT or CSV.")
    );
  }

  callback(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10
  }
});
