import "server-only";
import OpenAI from "openai";

export const META_MODEL = process.env.META_MODEL ?? "muse-spark-1.3";

/**
 * Create the provider client on demand, not at module import time.
 * This lets builds and the local simulator work without model credentials.
 */
export function getMetaClient() {
  const apiKey = process.env.MODEL_API_KEY;
  if (!apiKey) {
    throw new Error("MODEL_API_KEY is not configured.");
  }

  return new OpenAI({
    apiKey,
    baseURL: process.env.META_API_BASE_URL ?? "https://api.meta.ai/v1",
    timeout: 30_000,
    maxRetries: 1,
  });
}
