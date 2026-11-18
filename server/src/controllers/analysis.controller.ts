
import type { Request, Response } from "express";
import { generateAnalysis } from "../services/analysis.service.js";

export const createAnalysis = async (
  req: Request,
  res: Response
) => {
  try {
    const { prompt, documentIds } = req.body;

    if (
      typeof prompt !== "string" ||
      !prompt.trim() ||
      !Array.isArray(documentIds) ||
      documentIds.length === 0 ||
      !documentIds.every((id: unknown) => typeof id === "string")
    ) {
      return res.status(400).json({
        success: false,
        message: "A prompt and valid document IDs are required.",
      });
    }

    const analysis = await generateAnalysis(
      prompt.trim(),
      documentIds
    );

    return res.status(201).json({
      success: true,
      message: "Document analysis completed successfully.",
      data: analysis,
    });
  } catch (error) {
    console.error("Analysis error:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Document analysis failed.",
    });
  }
};
