
import type { Request, Response } from "express";
import fs from "node:fs/promises";
import { prisma } from "../config/database.js";
import {
  saveDocuments,
  getAllDocuments
} from "../services/document.service.js";

export const uploadDocuments = async (
  req: Request,
  res: Response
) => {
  const files = req.files as Express.Multer.File[] | undefined;

  if (!files || files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please upload at least one document."
    });
  }

  try {
    const documents = await saveDocuments(files);

    return res.status(201).json({
      success: true,
      message: "Documents uploaded successfully.",
      data: documents
    });
  } catch (error) {
    await Promise.all(
      files.map((file) =>
        fs.unlink(file.path).catch(() => undefined)
      )
    );

    console.error("Document upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save uploaded documents."
    });
  }
};

export const listDocuments = async (
  _req: Request,
  res: Response
) => {
  try {
    const documents = await getAllDocuments();

    return res.status(200).json({
      success: true,
      data: documents
    });
  } catch (error) {
    console.error("Fetch documents error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve documents."
    });
  }
};

export const getDocumentText = async (
  req: Request,
  res: Response
) => {
  try {
   const id = req.params.id;

if (typeof id !== "string") {
  return res.status(400).json({
    success: false,
    message: "Invalid document ID.",
  });
}

    const document = await prisma.document.findUnique({
      where: { id },
      select: {
        id: true,
        filename: true,
        extractedText: true,
        processingStatus: true,
        errorMessage: true,
      },
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error("Fetch extracted text error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve extracted text.",
    });
  }
};
