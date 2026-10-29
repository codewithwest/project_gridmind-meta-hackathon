import "server-only";
import OpenAI from "openai";

const apiKey = process.env.MODEL_API_KEY;

if (!apiKey) {
  throw new Error(
    "MODEL_API_KEY is missing. Copy .env.example to .env.local and add your Meta Model API key.",
  );
}

export const meta = new OpenAI({
  apiKey,
  baseURL: process.env.META_API_BASE_URL ?? "https://api.meta.ai/v1",
  timeout: 30_000,
  maxRetries: 1,
});

export const META_MODEL = process.env.META_MODEL ?? "muse-spark-1.3";
