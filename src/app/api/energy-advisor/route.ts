import { NextResponse } from "next/server";
import { z } from "zod";
import { meta, META_MODEL } from "@/lib/meta/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  question: z.string().trim().min(1).max(800),
}).strict();

const SYSTEM_PROMPT = `
You are GridMind, an energy-planning assistant for homes and small farms.
This is an illustrative demo, not an electrical design or safety certification.
Only use the sample data provided below. Do not invent measured readings,
equipment specifications, or API results. Clearly distinguish assumptions from
confirmed facts. If information is missing, say so and ask for it.
Never claim an installation or operating combination is safe based only on
estimated energy totals. Mention that motor starting current, inverter surge
rating, battery discharge limits, wiring, protection, and local codes may matter.
Recommend a qualified electrician or solar installer for real installation decisions.
Keep answers concise and practical.
`.trim();

const DEMO_CONTEXT = {
  installation: "Illustrative demo system; not a real inspected installation",
  inverterRatedOutputWatts: 6000,
  solarArrayWatts: 2760,
  batteryNominalKwh: 5.12,
  assumedUsableBatteryFraction: 0.9,
  boreholePumpInputWatts: 1100,
  boreholeRuntimeHoursPerDay: 2,
  derivedBoreholeEnergyKwhPerDay: 2.2,
  derivedUsableBatteryKwh: 4.608,
  limitations: [
    "No live sensor readings",
    "No verified equipment nameplate values",
    "No solar irradiance or hourly load profile",
    "No motor starting current or inverter surge data",
  ],
};

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Provide a question between 1 and 800 characters." },
      { status: 400 },
    );
  }

  try {
    const response = await meta.responses.create({
      model: META_MODEL,
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: JSON.stringify({
            question: parsed.data.question,
            demoContext: DEMO_CONTEXT,
          }),
        },
      ],
    });

    return NextResponse.json({ answer: response.output_text });
  } catch (error) {
    // Avoid returning provider error details, request metadata, or secrets to the browser.
    console.error("GridMind Meta API request failed", {
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json(
      { error: "The energy advisor is temporarily unavailable. Check server configuration and try again." },
      { status: 502 },
    );
  }
}
