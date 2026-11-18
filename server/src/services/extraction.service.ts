
import fs from "fs/promises";
import path from "path";
import { parse } from "csv-parse/sync";
import { PDFParse } from "pdf-parse";

export const extractDocumentText = async (
  filePath: string,
  mimeType: string
): Promise<string> => {
  const extension = path.extname(filePath).toLowerCase();

  // TXT extraction
  if (extension === ".txt") {
    return await fs.readFile(filePath, "utf-8");
  }

  // CSV extraction
  if (extension === ".csv") {
    const content = await fs.readFile(filePath, "utf-8");

    const records = parse(content, {
      skip_empty_lines: true,
      trim: true,
    }) as string[][];

    return records
      .map((row) => row.join(" | "))
      .join("\n");
  }

  // PDF extraction - pdf-parse v2 API
  if (extension === ".pdf" || mimeType === "application/pdf") {
    const buffer = await fs.readFile(filePath);

    const parser = new PDFParse({ data: buffer });

    try {
      const result = await parser.getText();
      return result.text.trim();
    } finally {
      await parser.destroy();
    }
  }

  throw new Error("Unsupported document format");
};
