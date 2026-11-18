import "dotenv/config";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is missing from environment variables");
}

export const openai = new OpenAI({ apiKey });