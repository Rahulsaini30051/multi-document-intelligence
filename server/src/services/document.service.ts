

import { prisma } from "../config/database.js";
import { extractDocumentText } from "./extraction.service.js";

// Save documents and extract their text
export const saveDocuments = async (files: Express.Multer.File[]) => {
  const savedDocuments = [];

  for (const file of files) {
    try {
      const document = await prisma.document.create({
        data: {
          filename: file.originalname,
          storedFilename: file.filename,
          mimeType: file.mimetype,
          fileSize: file.size,
          filePath: file.path,
          processingStatus: "PROCESSING",
        },
      });

      try {
        const extractedText = await extractDocumentText(
          file.path,
          file.mimetype
        );

        const updatedDocument = await prisma.document.update({
          where: { id: document.id },
          data: {
            extractedText,
            processingStatus: extractedText
              ? "COMPLETED"
              : "FAILED",
            errorMessage: extractedText
              ? null
              : "No readable text found in document",
          },
        });

        savedDocuments.push(updatedDocument);
      } catch (error) {
        console.error(
          `Extraction failed for ${file.originalname}:`,
          error
        );

        const failedDocument = await prisma.document.update({
          where: { id: document.id },
          data: {
            processingStatus: "FAILED",
            errorMessage:
              error instanceof Error
                ? error.message
                : "Text extraction failed",
          },
        });

        savedDocuments.push(failedDocument);
      }
    } catch (error) {
      console.error("Document saving failed:", error);
      throw error;
    }
  }

  return savedDocuments;
};

export const getAllDocuments = async () => {
  return prisma.document.findMany({
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      filename: true,
      mimeType: true,
      fileSize: true,
      processingStatus: true,
      createdAt: true
    }
  });
};
