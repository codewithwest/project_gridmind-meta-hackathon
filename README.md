# GridMind — Meta Hackathon

GridMind is an interactive energy-planning prototype for homes and small farms. Configure an illustrative solar/battery system, add appliance loads, adjust solar assumptions, and inspect a transparent daily energy balance. Upload equipment photos to keep them alongside a local project.

> **Demo disclaimer:** This app uses user-entered assumptions and simple estimates. It is not connected to live equipment, and it is not electrical design advice or safety certification.

## Run locally

Requirements: Node.js 20.9+ and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000. The dashboard and simulator work without an API key. No database or account is required.

Optional environment setup for the later Meta Model API integration:

```bash
cp .env.example .env.local
``

Keep all API credentials server-side. Never commit secrets or expose API keys with a `NEXT_PUBLIC_` prefix.

## What works now

- **Editable system assumptions:** solar array capacity, peak sun hours, PV system efficiency, battery capacity, usable battery fraction, and inverter rating.
- **Appliance load builder:** add/remove loads and edit power, operating hours, quantity, and names.
- **Deterministic calculations:** estimated daily solar generation, daily energy demand, surplus/deficit, usable battery capacity, and a simple combined nameplate load comparison against the inverter rating.
- **Scenario control:** adjust solar output from 0–130% to explore changed production assumptions.
- **Equipment inventory:** upload up to six image files (5 MB each); preview and remove them.
- **Local save:** save project inputs and photos in the current browser's local storage, reset to the sample project, and continue without a server account.

The sample values are illustrative. Solar generation is estimated as:

`array kW × peak sun hours × assumed PV efficiency × solar adjustment`

Each appliance's estimated daily energy is:

`watts × hours/day × quantity ÷ 1,000`

These formulas do not model weather forecasts, shading, inverter conversion details, battery charge/discharge limits, motor startup surge, time-of-use load overlap, wiring, or site-specific conditions. The battery-only equivalent is a rough energy ratio, not a guaranteed runtime prediction.

## Model integration roadmap

Meta model integrations are intentionally not required for the core app to function. Planned follow-up work:

1. Muse Spark explanations grounded in the simulator's structured inputs and outputs (the model should explain, not replace, calculations).
2. SAM 3.1 equipment-region segmentation and image overlays.
3. Optional voice transcription and image generation, if useful to the demo.

Official references:
- https://dev.meta.ai/docs/overview
- https://dev.meta.ai/docs/quickstart
- https://dev.meta.ai/docs/authentication
- https://dev.meta.ai/docs/api-reference

## Safety and security

- Photos and saved project state stay in browser local storage; this prototype does not upload them to an application server.
- Browser storage is device/browser-specific and can be cleared by the user. Saving large photos can exceed browser storage limits.
- Confirm equipment ratings from manufacturer labels/manuals; photos are not automatically interpreted.
- Never use these estimates as electrical safety certification, installation instructions, or live equipment control.
- Add authentication, server-side storage, rate limits, quotas, and privacy controls before public production use.

## Development checks

```bash
npm run typecheck
npm run lint
npm run build
```
